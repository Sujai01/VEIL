import express, { Response } from 'express';
import cors from 'cors';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { db, initDatabase, run, get, query } from './db';
import { generateToken, authenticateToken, AuthenticatedRequest } from './auth';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());

// Apply basic rate limiting to all requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use(cors({
  origin: '*', // Allow all origins for local development simplicity, can restrict later
  credentials: true
}));
app.use(express.json({ limit: '100kb' })); // Limit body payload to 100kb to prevent bloat

// Add basic caching headers for production optimization
app.use((req, res, next) => {
  if (req.method === 'GET') {
    // Client-side caching for 30 seconds for all GET requests to reduce load
    res.set('Cache-Control', 'public, max-age=30');
  } else {
    res.set('Cache-Control', 'no-store');
  }
  next();
});
// Initialize SQLite database
initDatabase().then(() => {
  console.log('Database system initialized.');
}).catch(err => {
  console.error('Failed to initialize database:', err);
});

// Authentication Routes
app.post('/api/auth/register', async (req: express.Request, res: Response) => {
  const { email, password, name, degree, verifyMethod } = req.body;
  if (!email || !password || !name) {
    res.status(400).json({ error: 'Email, password, and name are required' });
    return;
  }

  try {
    const existing = await get('SELECT * FROM users WHERE email = ?', [email]);
    if (existing) {
      res.status(400).json({ error: 'User with this email already exists' });
      return;
    }

    const id = crypto.randomUUID();
    const hash = await bcrypt.hash(password, 10);
    const degreeVal = degree || 'B.Tech student';
    const verifyMethodVal = verifyMethod || 'SHEERID';

    await run(
      `INSERT INTO users (id, email, password_hash, name, college, degree, verify_method, is_verified)
       VALUES (?, ?, ?, ?, 'IIT Delhi', ?, ?, 1)`,
      [id, email, hash, name, degreeVal, verifyMethodVal]
    );

    const token = generateToken(id);
    res.json({ token, user: { id, email, name, college: 'IIT Delhi', degree: degreeVal, verifyMethod: verifyMethodVal, isVerified: true } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req: express.Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  try {
    const user = await get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      res.status(400).json({ error: 'Invalid email or password' });
      return;
    }

    const matches = await bcrypt.compare(password, user.password_hash);
    if (!matches) {
      res.status(400).json({ error: 'Invalid email or password' });
      return;
    }

    const token = generateToken(user.id);
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        college: user.college,
        degree: user.degree,
        verifyMethod: user.verify_method,
        isVerified: !!user.is_verified
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/auth/me', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await get('SELECT id, email, name, college, degree, verify_method, is_verified FROM users WHERE id = ?', [req.userId]);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const profile = await get('SELECT * FROM compatibility_profiles WHERE user_id = ?', [req.userId]);
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        college: user.college,
        degree: user.degree,
        verifyMethod: user.verify_method,
        isVerified: !!user.is_verified,
        profile: profile ? {
          socialResonance: profile.social_resonance,
          intellectualDepth: profile.intellectual_depth,
          spontaneity: profile.spontaneity,
          vibes: JSON.parse(profile.vibes || '[]'),
          fridayOption: profile.friday_option
        } : null
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Save Personality / Compatibility Profile
app.post('/api/profile/compatibility', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { socialResonance, intellectualDepth, spontaneity, vibes, fridayOption } = req.body;
  
  try {
    const user = await get('SELECT id FROM users WHERE id = ?', [req.userId]);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const vibesString = JSON.stringify(vibes || []);
    await run(
      `INSERT INTO compatibility_profiles (user_id, social_resonance, intellectual_depth, spontaneity, vibes, friday_option)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(user_id) DO UPDATE SET
         social_resonance = excluded.social_resonance,
         intellectual_depth = excluded.intellectual_depth,
         spontaneity = excluded.spontaneity,
         vibes = excluded.vibes,
         friday_option = excluded.friday_option`,
      [req.userId, socialResonance, intellectualDepth, spontaneity, vibesString, fridayOption]
    );

    res.json({ success: true, message: 'Compatibility profile updated' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Matchmaking logic based on compatibility metrics
app.get('/api/profile/matches', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const myProfile = await get('SELECT * FROM compatibility_profiles WHERE user_id = ?', [req.userId]);
    if (!myProfile) {
      res.json([]);
      return;
    }

    const myVibes: string[] = JSON.parse(myProfile.vibes || '[]');
    const allProfiles = await query(
      `SELECT cp.*, u.name, u.degree, u.college 
       FROM compatibility_profiles cp
       JOIN users u ON cp.user_id = u.id
       WHERE cp.user_id != ?`,
      [req.userId]
    );

    const matches = allProfiles.map((other: any) => {
      const otherVibes: string[] = JSON.parse(other.vibes || '[]');
      const sharedInterests = myVibes.filter(v => otherVibes.includes(v));

      // Calculate simple Euclidean compatibility score
      const diffSocial = Math.abs(myProfile.social_resonance - other.social_resonance);
      const diffIntel = Math.abs(myProfile.intellectual_depth - other.intellectual_depth);
      const diffSpon = Math.abs(myProfile.spontaneity - other.spontaneity);
      
      const distance = Math.sqrt(diffSocial * diffSocial + diffIntel * diffIntel + diffSpon * diffSpon);
      const maxDistance = Math.sqrt(100 * 100 + 100 * 100 + 100 * 100);
      const score = Math.round(100 - (distance / maxDistance) * 100);

      let vibeText = 'Friendly Vibe';
      if (score > 90) vibeText = 'Spiritual Resonance';
      else if (score > 80) vibeText = 'Intellectual Connection';
      else if (score > 70) vibeText = 'Easy Going Vibe';

      return {
        id: other.user_id,
        age: 21, // default age match mockup
        batchAndDegree: other.degree || 'B.Tech, Class of 2025',
        compatibilityScore: score,
        tags: otherVibes,
        sharedInterests: sharedInterests.length > 0 ? sharedInterests.join(', ') : 'Campus Life',
        locationMatch: 'IIT Delhi Library Area',
        socialResonance: other.social_resonance,
        intellectualDepth: other.intellectual_depth,
        spontaneity: other.spontaneity,
        vibeText,
        mutualInterestsCount: sharedInterests.length
      };
    }).sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    res.json({ success: true, data: matches });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Trending events route
app.get('/api/events/trending', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const events = await query('SELECT * FROM events ORDER BY interested_count DESC LIMIT 10');
    
    const formattedEvents = events.map((e: any) => ({
      id: e.id,
      title: e.title,
      category: e.category,
      image: e.image,
      startDate: e.start_date,
      endDate: e.end_date,
      location: e.location,
      interestedCount: e.interested_count,
      universityId: e.university_id
    }));

    res.json({ success: true, data: formattedEvents });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Dynamic Spotlight route
app.get('/api/home/spotlight', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const events = await query('SELECT * FROM events ORDER BY interested_count DESC LIMIT 1');
    if (events.length > 0) {
      res.json({ success: true, type: 'EVENT', data: {
        id: events[0].id, title: events[0].title, category: events[0].category, image: events[0].image,
        startDate: events[0].start_date, endDate: events[0].end_date, location: events[0].location, interestedCount: events[0].interested_count
      } });
      return;
    }

    const memes = await query('SELECT * FROM posts WHERE type = "MEME" ORDER BY created_at DESC LIMIT 1');
    if (memes.length > 0) {
      res.json({ success: true, type: 'MEME', data: memes[0] });
      return;
    }

    const polls = await query('SELECT * FROM posts WHERE type = "POLL" ORDER BY created_at DESC LIMIT 1');
    if (polls.length > 0) {
      res.json({ success: true, type: 'POLL', data: polls[0] });
      return;
    }

    res.json({ success: true, type: 'PULSE', data: null });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Classmates search route
app.get('/api/classmates', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const q = (req.query.q as string || '').toLowerCase();
  
  try {
    const students = await query(`
      SELECT u.id, u.name, u.college, u.degree, cp.vibes, cp.social_resonance, cp.intellectual_depth, cp.spontaneity
      FROM users u
      LEFT JOIN compatibility_profiles cp ON u.id = cp.user_id
    `);

    const myProfile = await get('SELECT * FROM compatibility_profiles WHERE user_id = ?', [req.userId]);

    const result = students.map((other: any) => {
      const otherVibes: string[] = JSON.parse(other.vibes || '[]');
      
      // Calculate compatibility score
      let score = 85; // default base
      if (myProfile && other.social_resonance) {
        const diffSocial = Math.abs(myProfile.social_resonance - other.social_resonance);
        const diffIntel = Math.abs(myProfile.intellectual_depth - other.intellectual_depth);
        const diffSpon = Math.abs(myProfile.spontaneity - other.spontaneity);
        const distance = Math.sqrt(diffSocial * diffSocial + diffIntel * diffIntel + diffSpon * diffSpon);
        const maxDistance = Math.sqrt(100 * 100 + 100 * 100 + 100 * 100);
        score = Math.round(100 - (distance / maxDistance) * 100);
      }

      const avatarParts = other.name.split(' ');
      const avatarText = avatarParts.map((p: string) => p[0]).join('').substring(0, 2).toUpperCase();

      return {
        id: other.id,
        name: other.name,
        college: other.college,
        degree: other.degree,
        avatarText,
        compatibility: score,
        tags: otherVibes.length > 0 ? otherVibes : ['Campus Life', 'Tech', 'Music']
      };
    }).filter((s: any) => {
      return s.name.toLowerCase().includes(q) || 
             s.degree.toLowerCase().includes(q) || 
             s.tags.some((t: string) => t.toLowerCase().includes(q));
    });

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Feed Updates & Polls
app.get('/api/feed', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const posts = await query(`
      SELECT p.*, 
        (SELECT COUNT(*) FROM post_reactions WHERE post_id = p.id) as reactionsCount,
        (SELECT type FROM post_reactions WHERE post_id = p.id AND user_id = ?) as myReaction
      FROM posts p
      ORDER BY p.created_at DESC
      LIMIT 50
    `, [req.userId]);

    const pollPostIds = posts.filter(p => p.type === 'POLL' || p.type === 'poll').map(p => p.id);
    let allOptions: any[] = [];
    
    if (pollPostIds.length > 0) {
      const placeholders = pollPostIds.map(() => '?').join(',');
      allOptions = await query(`
        SELECT o.id, o.post_id, o.text, 
          (SELECT COUNT(*) FROM poll_votes v WHERE v.option_id = o.id) as voteCount,
          (SELECT option_id FROM poll_votes v WHERE v.option_id = o.id AND v.user_id = ?) as userVotedOption
        FROM poll_options o
        WHERE o.post_id IN (${placeholders})
      `, [req.userId, ...pollPostIds]);
    }

    const optionsByPostId = allOptions.reduce((acc: any, opt: any) => {
      if (!acc[opt.post_id]) acc[opt.post_id] = { options: [], userVotedOptionId: null };
      acc[opt.post_id].options.push({ id: opt.id, text: opt.text, votes: opt.voteCount });
      if (opt.userVotedOption) acc[opt.post_id].userVotedOptionId = opt.id;
      return acc;
    }, {});

    const feedItems = posts.map(p => {
      if (p.type === 'POLL' || p.type === 'poll') {
        const pollData = optionsByPostId[p.id] || { options: [], userVotedOptionId: null };
        return {
          id: p.id,
          type: p.type,
          authorName: p.author_name,
          authorLabel: p.author_label,
          iconName: 'Vote',
          timeAgoText: 'Recently',
          locationText: p.location_text || '',
          content: p.content,
          image: p.image,
          tags: p.tags ? JSON.parse(p.tags) : [],
          pollOptions: pollData.options,
          userVotedOptionId: pollData.userVotedOptionId
        };
      } else {
        return {
          id: p.id,
          type: p.type,
          authorName: p.author_name,
          authorLabel: p.author_label,
          iconName: 'Compass',
          timeAgoText: 'Recently',
          locationText: p.location_text || '',
          content: p.content,
          image: p.image,
          tags: p.tags ? JSON.parse(p.tags) : [],
          reactionsCount: p.reactionsCount,
          myReaction: p.myReaction
        };
      }
    });

    res.json(feedItems);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/feed/post', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { content, locationText, authorLabel, type, image, tags, options } = req.body;
  if (!content || typeof content !== 'string' || content.length > 1000) {
    res.status(400).json({ error: 'Content is required and must be under 1000 characters' });
    return;
  }

  const postType = type || 'TEXT';

  try {
    const user = await get('SELECT name FROM users WHERE id = ?', [req.userId]);
    const id = crypto.randomUUID();
    const tagsString = tags ? JSON.stringify(tags) : null;
    await run(
      `INSERT INTO posts (id, author_id, author_name, author_label, type, content, location_text, image, tags)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, req.userId, user.name, authorLabel || 'Student', postType, content, locationText || 'Campus', image || null, tagsString]
    );

    if (postType === 'POLL' && options && Array.isArray(options)) {
      for (const optText of options) {
        const optId = crypto.randomUUID();
        await run('INSERT INTO poll_options (id, post_id, text) VALUES (?, ?, ?)', [optId, id, optText]);
      }
    }

    res.json({ success: true, post_id: id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/feed/poll', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { content, options, locationText, authorLabel } = req.body;
  if (!content || typeof content !== 'string' || content.length > 500 || !options || options.length < 2 || options.length > 5) {
    res.status(400).json({ error: 'Content and between 2 to 5 poll options are required' });
    return;
  }

  try {
    const user = await get('SELECT name FROM users WHERE id = ?', [req.userId]);
    const postId = crypto.randomUUID();

    await run(
      `INSERT INTO posts (id, author_id, author_name, author_label, type, content, location_text)
       VALUES (?, ?, ?, ?, 'poll', ?, ?)`,
      [postId, req.userId, user.name, authorLabel || 'Student', content, locationText || 'Campus']
    );

    for (const optText of options) {
      const optId = crypto.randomUUID();
      await run('INSERT INTO poll_options (id, post_id, text) VALUES (?, ?, ?)', [optId, postId, optText]);
    }

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/feed/:id/vote', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const postId = req.params.id;
  const { optionId } = req.body;

  if (!optionId) {
    res.status(400).json({ error: 'optionId is required' });
    return;
  }

  try {
    await run(
      `INSERT INTO poll_votes (user_id, post_id, option_id)
       VALUES (?, ?, ?)
       ON CONFLICT(user_id, post_id) DO UPDATE SET option_id = excluded.option_id`,
      [req.userId, postId, optionId]
    );
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/feed/:id/react', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const postId = req.params.id;
  const { reactionType } = req.body; // e.g. 'like', 'laugh', 'fire'

  try {
    const existing = await get('SELECT * FROM post_reactions WHERE user_id = ? AND post_id = ?', [req.userId, postId]);
    if (existing && existing.type === reactionType) {
      // Toggle off
      await run('DELETE FROM post_reactions WHERE user_id = ? AND post_id = ?', [req.userId, postId]);
      res.json({ reacted: false });
    } else {
      // Upsert
      await run(`
        INSERT INTO post_reactions (user_id, post_id, type) VALUES (?, ?, ?)
        ON CONFLICT(user_id, post_id, type) DO UPDATE SET type = excluded.type
      `, [req.userId, postId, reactionType || 'like']);
      res.json({ reacted: true, type: reactionType || 'like' });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Anonymous Confessions
app.get('/api/confessions', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const confessions = await query(`
      SELECT c.*,
        (SELECT COUNT(*) FROM confession_upvotes WHERE confession_id = c.id) as upvotes,
        (SELECT COUNT(*) FROM confession_upvotes WHERE confession_id = c.id AND user_id = ?) as hasUpvoted,
        (SELECT COUNT(*) FROM confession_comments WHERE confession_id = c.id) as commentsCount
      FROM confessions c
      ORDER BY c.created_at DESC
      LIMIT 50
    `, [req.userId]);

    res.json(confessions.map((c: any) => ({
      id: c.id,
      content: c.content,
      timestamp: 'Recently',
      upvotes: c.upvotes,
      hasUpvoted: !!c.hasUpvoted,
      commentsCount: c.commentsCount
    })));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/confessions', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { content } = req.body;
  if (!content || typeof content !== 'string' || content.length > 2000) {
    res.status(400).json({ error: 'Confession text is required and must be under 2000 characters' });
    return;
  }

  try {
    const id = crypto.randomUUID();
    await run('INSERT INTO confessions (id, content) VALUES (?, ?)', [id, content]);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/confessions/:id/upvote', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const confessionId = req.params.id;

  try {
    const existing = await get('SELECT * FROM confession_upvotes WHERE user_id = ? AND confession_id = ?', [req.userId, confessionId]);
    if (existing) {
      await run('DELETE FROM confession_upvotes WHERE user_id = ? AND confession_id = ?', [req.userId, confessionId]);
      res.json({ upvoted: false });
    } else {
      await run('INSERT INTO confession_upvotes (user_id, confession_id) VALUES (?, ?)', [req.userId, confessionId]);
      res.json({ upvoted: true });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/confessions/:id/comments', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const confessionId = req.params.id;
  try {
    const comments = await query(
      'SELECT * FROM confession_comments WHERE confession_id = ? ORDER BY created_at ASC',
      [confessionId]
    );
    res.json(comments.map((comm: any) => ({
      id: comm.id,
      content: comm.content,
      timestamp: 'Recently'
    })));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/confessions/:id/comments', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const confessionId = req.params.id;
  const { content } = req.body;

  if (!content) {
    res.status(400).json({ error: 'Comment body is required' });
    return;
  }

  try {
    const id = crypto.randomUUID();
    await run('INSERT INTO confession_comments (id, confession_id, content) VALUES (?, ?, ?)', [id, confessionId, content]);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Ride Sharing
app.get('/api/rides', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const rides = await query(`
      SELECT r.*,
        (SELECT status FROM ride_bookings WHERE ride_id = r.id AND passenger_id = ?) as bookingStatus
      FROM rides r
      ORDER BY r.created_at DESC
    `, [req.userId]);

    res.json(rides.map((r: any) => ({
      id: r.id,
      from: r.origin,
      to: r.destination,
      pricePerPerson: r.price_per_person,
      timeText: r.time_text,
      provider: r.provider,
      seatsAvailable: r.seats_available,
      seatsTotal: r.seats_total,
      status: r.status,
      timeAgoText: 'Just now',
      isAccepted: r.bookingStatus === 'accepted',
      isRejected: r.bookingStatus === 'rejected',
      bookingStatus: r.bookingStatus // 'pending', 'accepted', 'rejected' or null
    })));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/rides', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { origin, destination, pricePerPerson, timeText, provider, seatsTotal } = req.body;

  if (!origin || !destination || !pricePerPerson || !timeText || !provider || !seatsTotal) {
    res.status(400).json({ error: 'All ride details are required' });
    return;
  }

  try {
    const user = await get('SELECT name FROM users WHERE id = ?', [req.userId]);
    const id = crypto.randomUUID();

    await run(
      `INSERT INTO rides (id, driver_id, driver_name, origin, destination, price_per_person, time_text, provider, seats_available, seats_total, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Available')`,
      [id, req.userId, user.name, origin, destination, pricePerPerson, timeText, provider, seatsTotal, seatsTotal]
    );

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/rides/:id/book', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const rideId = req.params.id;

  try {
    const ride = await get('SELECT * FROM rides WHERE id = ?', [rideId]);
    if (!ride) {
      res.status(404).json({ error: 'Ride not found' });
      return;
    }

    if (ride.seats_available <= 0) {
      res.status(400).json({ error: 'No seats available' });
      return;
    }

    const bookingId = crypto.randomUUID();
    await run(
      `INSERT INTO ride_bookings (id, ride_id, passenger_id, status)
       VALUES (?, ?, ?, 'pending')
       ON CONFLICT(ride_id, passenger_id) DO UPDATE SET status = 'pending'`,
      [bookingId, rideId, req.userId]
    );

    res.json({ success: true, bookingStatus: 'pending' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Study Groups
app.get('/api/study-groups', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const groups = await query(`
      SELECT sg.*,
        (SELECT COUNT(*) FROM study_group_members WHERE group_id = sg.id) as membersCount,
        (SELECT COUNT(*) FROM study_group_members WHERE group_id = sg.id AND user_id = ?) as isJoined
      FROM study_groups sg
      ORDER BY sg.created_at DESC
    `, [req.userId]);

    res.json(groups.map((g: any) => ({
      id: g.id,
      subject: g.subject,
      topic: g.topic,
      membersCount: g.membersCount,
      maxMembers: g.max_members,
      timeText: g.time_text,
      location: g.location,
      isJoined: !!g.isJoined
    })));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/study-groups', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { subject, topic, maxMembers, timeText, location } = req.body;

  if (!subject || !topic || !maxMembers || !timeText || !location) {
    res.status(400).json({ error: 'All study group fields are required' });
    return;
  }

  try {
    const id = crypto.randomUUID();
    await run(
      `INSERT INTO study_groups (id, subject, topic, max_members, time_text, location)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, subject, topic, maxMembers, timeText, location]
    );

    // Auto-join the creator
    await run('INSERT INTO study_group_members (group_id, user_id) VALUES (?, ?)', [id, req.userId]);

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/study-groups/:id/join', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const groupId = req.params.id;

  try {
    const group = await get('SELECT * FROM study_groups WHERE id = ?', [groupId]);
    if (!group) {
      res.status(404).json({ error: 'Group not found' });
      return;
    }

    const membersCount = await get('SELECT COUNT(*) as count FROM study_group_members WHERE group_id = ?', [groupId]);
    if (membersCount.count >= group.max_members) {
      res.status(400).json({ error: 'Study group is already full' });
      return;
    }

    const existing = await get('SELECT * FROM study_group_members WHERE group_id = ? AND user_id = ?', [groupId, req.userId]);
    if (existing) {
      // Leave group
      await run('DELETE FROM study_group_members WHERE group_id = ? AND user_id = ?', [groupId, req.userId]);
      res.json({ joined: false });
    } else {
      // Join group
      await run('INSERT INTO study_group_members (group_id, user_id) VALUES (?, ?)', [groupId, req.userId]);
      res.json({ joined: true });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Tournaments
app.get('/api/tournaments', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const tourneys = await query(`
      SELECT t.*,
        (SELECT COUNT(*) FROM tournament_registrations WHERE tournament_id = t.id) as teamsRegistered,
        (SELECT COUNT(*) FROM tournament_registrations WHERE tournament_id = t.id AND user_id = ?) as isRegistered
      FROM tournaments t
      ORDER BY t.created_at DESC
    `, [req.userId]);

    res.json(tourneys.map((t: any) => ({
      id: t.id,
      gameTitle: t.game_title,
      prizePool: t.prize_pool,
      teamsRegistered: t.teamsRegistered,
      maxTeams: t.max_teams,
      dateText: t.date_text,
      isRegistered: !!t.isRegistered
    })));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/tournaments/:id/register', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const tourneyId = req.params.id;

  try {
    const tourney = await get('SELECT * FROM tournaments WHERE id = ?', [tourneyId]);
    if (!tourney) {
      res.status(404).json({ error: 'Tournament not found' });
      return;
    }

    const existing = await get('SELECT * FROM tournament_registrations WHERE tournament_id = ? AND user_id = ?', [tourneyId, req.userId]);
    if (existing) {
      // Unregister
      await run('DELETE FROM tournament_registrations WHERE tournament_id = ? AND user_id = ?', [tourneyId, req.userId]);
      res.json({ registered: false });
    } else {
      // Check limit
      const count = await get('SELECT COUNT(*) as count FROM tournament_registrations WHERE tournament_id = ?', [tourneyId]);
      if (count.count >= tourney.max_teams) {
        res.status(400).json({ error: 'Tournament registration is full' });
        return;
      }
      // Register
      await run('INSERT INTO tournament_registrations (tournament_id, user_id) VALUES (?, ?)', [tourneyId, req.userId]);
      res.json({ registered: true });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// App Store Compliance: UGC Moderation & Account Deletion
app.post('/api/users/:id/report', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const reportedId = req.params.id;
  const { reason } = req.body;
  try {
    const id = crypto.randomUUID();
    await run('INSERT INTO user_reports (id, reporter_id, reported_id, reason) VALUES (?, ?, ?, ?)', [id, req.userId, reportedId, reason || 'Inappropriate Content']);
    res.json({ success: true, message: 'User reported successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users/:id/block', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const blockedId = req.params.id;
  try {
    await run('INSERT OR IGNORE INTO user_blocks (blocker_id, blocked_id) VALUES (?, ?)', [req.userId, blockedId]);
    res.json({ success: true, message: 'User blocked successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/users/me', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Delete user and cascade delete everything related
    await run('DELETE FROM users WHERE id = ?', [req.userId]);
    // Optionally delete from other tables, though cascade is better if foreign keys are enabled.
    await run('DELETE FROM compatibility_profiles WHERE user_id = ?', [req.userId]);
    await run('DELETE FROM posts WHERE author_id = ?', [req.userId]);
    res.json({ success: true, message: 'Account permanently deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
