import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';

const DB_PATH = path.resolve(process.cwd(), 'veil.db');

// Connect to SQLite Database
export const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Helper for queries
export const query = (sql: string, params: any[] = []): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const run = (sql: string, params: any[] = []): Promise<sqlite3.RunResult> => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

export const get = (sql: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export async function initDatabase() {
  console.log('Initializing database tables...');

  // Create Users Table
  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      college TEXT NOT NULL DEFAULT 'IIT Delhi',
      degree TEXT,
      verify_method TEXT,
      is_verified INTEGER DEFAULT 0,
      avatar_url TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create Compatibility Profiles
  await run(`
    CREATE TABLE IF NOT EXISTS compatibility_profiles (
      user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      social_resonance INTEGER,
      intellectual_depth INTEGER,
      spontaneity INTEGER,
      vibes TEXT,
      friday_option TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create Posts Table
  await run(`
    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      author_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      author_name TEXT NOT NULL,
      author_label TEXT,
      type TEXT CHECK(type IN ('post', 'poll')) NOT NULL,
      content TEXT NOT NULL,
      location_text TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create Poll Options Table
  await run(`
    CREATE TABLE IF NOT EXISTS poll_options (
      id TEXT PRIMARY KEY,
      post_id TEXT REFERENCES posts(id) ON DELETE CASCADE,
      text TEXT NOT NULL
    )
  `);

  // Create Poll Votes Table
  await run(`
    CREATE TABLE IF NOT EXISTS poll_votes (
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      post_id TEXT REFERENCES posts(id) ON DELETE CASCADE,
      option_id TEXT REFERENCES poll_options(id) ON DELETE CASCADE,
      PRIMARY KEY (user_id, post_id)
    )
  `);

  // Create Post Interests Table
  await run(`
    CREATE TABLE IF NOT EXISTS post_interests (
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      post_id TEXT REFERENCES posts(id) ON DELETE CASCADE,
      PRIMARY KEY (user_id, post_id)
    )
  `);

  // Create Confessions Table
  await run(`
    CREATE TABLE IF NOT EXISTS confessions (
      id TEXT PRIMARY KEY,
      content TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create Confession Upvotes Table
  await run(`
    CREATE TABLE IF NOT EXISTS confession_upvotes (
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      confession_id TEXT REFERENCES confessions(id) ON DELETE CASCADE,
      PRIMARY KEY (user_id, confession_id)
    )
  `);

  // Create Confession Comments Table
  await run(`
    CREATE TABLE IF NOT EXISTS confession_comments (
      id TEXT PRIMARY KEY,
      confession_id TEXT REFERENCES confessions(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create Rides Table
  await run(`
    CREATE TABLE IF NOT EXISTS rides (
      id TEXT PRIMARY KEY,
      driver_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      driver_name TEXT NOT NULL,
      origin TEXT NOT NULL,
      destination TEXT NOT NULL,
      price_per_person REAL NOT NULL,
      time_text TEXT NOT NULL,
      provider TEXT NOT NULL,
      seats_available INTEGER NOT NULL,
      seats_total INTEGER NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create Ride Bookings Table
  await run(`
    CREATE TABLE IF NOT EXISTS ride_bookings (
      id TEXT PRIMARY KEY,
      ride_id TEXT REFERENCES rides(id) ON DELETE CASCADE,
      passenger_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      status TEXT CHECK(status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
      UNIQUE (ride_id, passenger_id)
    )
  `);

  // Create Study Groups Table
  await run(`
    CREATE TABLE IF NOT EXISTS study_groups (
      id TEXT PRIMARY KEY,
      subject TEXT NOT NULL,
      topic TEXT NOT NULL,
      max_members INTEGER NOT NULL,
      time_text TEXT NOT NULL,
      location TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create Study Group Members Table
  await run(`
    CREATE TABLE IF NOT EXISTS study_group_members (
      group_id TEXT REFERENCES study_groups(id) ON DELETE CASCADE,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      PRIMARY KEY (group_id, user_id)
    )
  `);

  // Create Tournaments Table
  await run(`
    CREATE TABLE IF NOT EXISTS tournaments (
      id TEXT PRIMARY KEY,
      game_title TEXT NOT NULL,
      prize_pool TEXT NOT NULL,
      max_teams INTEGER NOT NULL,
      date_text TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create Tournament Registrations Table
  await run(`
    CREATE TABLE IF NOT EXISTS tournament_registrations (
      tournament_id TEXT REFERENCES tournaments(id) ON DELETE CASCADE,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      PRIMARY KEY (tournament_id, user_id)
    )
  `);

  console.log('Tables initialized successfully.');

  // Seed default data if users table is empty
  const userCount = await get('SELECT COUNT(*) as cnt FROM users');
  if (userCount.cnt === 0) {
    console.log('Seeding initial data...');
    const hashedPw = await bcrypt.hash('password123', 10);

    // Add classmates
    const users = [
      { id: 'u1', email: 'aryan@iitd.ac.in', name: 'Aryan Sharma', degree: 'B.Tech Computers, Class of 2025', verify: 'SHEERID' },
      { id: 'u2', email: 'rohan@iitd.ac.in', name: 'Rohan Verma', degree: 'B.Tech Electrical, Class of 2024', verify: 'SHEERID' },
      { id: 'u3', email: 'priya@iitd.ac.in', name: 'Priya Patel', degree: 'B.Des Fashion, Class of 2025', verify: 'COLLEGE_ID' },
      { id: 'u4', email: 'sneha@iitd.ac.in', name: 'Sneha Rao', degree: 'M.Sc Biochemistry, Class of 2024', verify: 'SHEERID' }
    ];

    for (const u of users) {
      await run(
        `INSERT INTO users (id, email, password_hash, name, college, degree, verify_method, is_verified)
         VALUES (?, ?, ?, ?, 'IIT Delhi', ?, ?, 1)`,
        [u.id, u.email, hashedPw, u.name, u.degree, u.verify]
      );
    }

    // Add compatibility profiles
    await run(`
      INSERT INTO compatibility_profiles (user_id, social_resonance, intellectual_depth, spontaneity, vibes, friday_option)
      VALUES 
        ('u1', 82, 94, 65, '["Creative", "Deep Tech", "Chess Master"]', 'Late-night drive and deep talks'),
        ('u2', 65, 80, 50, '["Academic", "Chess Master"]', 'Quiet dinner with close campus friends'),
        ('u3', 95, 55, 85, '["Creative", "Audiophile"]', 'High-energy hostel or house party'),
        ('u4', 75, 90, 70, '["Dreamer", "Caffeinated", "Active"]', 'Late-night drive and deep talks')
    `);

    // Add posts / polls
    await run(`
      INSERT INTO posts (id, author_id, author_name, author_label, type, content, location_text)
      VALUES 
        ('p1', 'u2', 'Dramatics Society', 'Organizer', 'post', 'Auditions for our upcoming flagship production "Veil of Shadows" are now officially open. All batches, backgrounds and disciplines are welcome! 🎭', 'Main Auditorium'),
        ('p2', 'u3', 'Campus Council', 'Council', 'poll', 'Which venue is better suited for hosting the upcoming Winter Food Fest?', 'SAC Lawn')
    `);

    // Add poll options
    await run(`INSERT INTO poll_options (id, post_id, text) VALUES ('opt1', 'p2', 'OAT Grounds')`);
    await run(`INSERT INTO poll_options (id, post_id, text) VALUES ('opt2', 'p2', 'SAC Lawn')`);

    // Add mock votes and interests
    await run(`INSERT INTO poll_votes (user_id, post_id, option_id) VALUES ('u2', 'p2', 'opt1')`);
    await run(`INSERT INTO poll_votes (user_id, post_id, option_id) VALUES ('u3', 'p2', 'opt2')`);
    await run(`INSERT INTO post_interests (user_id, post_id) VALUES ('u3', 'p1')`);

    // Add confessions
    await run(`
      INSERT INTO confessions (id, content)
      VALUES 
        ('c1', 'Unpopular opinion: The library basement is a hundred times better than the main reading hall. Quiet, cool, and actually has power sockets that work.'),
        ('c2', 'Still thinking about the person who shared their umbrella with me near the chemistry block last Tuesday. Hope you see this, you have my gratitude! ☕️')
    `);

    // Add upvotes
    await run(`INSERT INTO confession_upvotes (user_id, confession_id) VALUES ('u1', 'c1')`);
    await run(`INSERT INTO confession_upvotes (user_id, confession_id) VALUES ('u2', 'c1')`);
    await run(`INSERT INTO confession_upvotes (user_id, confession_id) VALUES ('u3', 'c2')`);

    // Add confession comments
    await run(`
      INSERT INTO confession_comments (id, confession_id, content)
      VALUES 
        ('comm1', 'c1', 'Hard agree. Plus there is less crowd!'),
        ('comm2', 'c1', 'Shhh... do not tell everyone! The crowd will move there now.')
    `);

    // Add rides
    await run(`
      INSERT INTO rides (id, driver_id, driver_name, origin, destination, price_per_person, time_text, provider, seats_available, seats_total, status)
      VALUES 
        ('r1', 'u2', 'Rohan', 'IIT Delhi Gate 1', 'Aerocity Metro', 120, 'Leaving at 17:30', 'Uber XL', 3, 4, 'Available'),
        ('r2', 'u3', 'Priya', 'SDA Market', 'Hauz Khas Social', 60, 'Leaving at 19:15', 'Ola Prime', 1, 4, 'Filling Fast')
    `);

    // Add study groups
    await run(`
      INSERT INTO study_groups (id, subject, topic, max_members, time_text, location)
      VALUES 
        ('sg1', 'Machine Learning', 'Linear Regression & SVMs', 5, 'Tomorrow, 16:00', 'LHC Room 102'),
        ('sg2', 'Algorithms', 'Dynamic Programming Grids', 6, 'Thursday, 18:30', 'Library Lounge B')
    `);

    // Add study group members
    await run(`INSERT INTO study_group_members (group_id, user_id) VALUES ('sg1', 'u2')`);
    await run(`INSERT INTO study_group_members (group_id, user_id) VALUES ('sg1', 'u3')`);

    // Add tournaments
    await run(`
      INSERT INTO tournaments (id, game_title, prize_pool, max_teams, date_text)
      VALUES 
        ('t1', 'Valorant Campus Cup', '₹50,000', 16, 'June 25th, 10:00'),
        ('t2', 'Chess Showdown', '₹15,000', 32, 'June 28th, 14:00')
    `);

    // Add tournament registrations
    await run(`INSERT INTO tournament_registrations (tournament_id, user_id) VALUES ('t1', 'u2')`);

    console.log('Seed data successfully inserted.');
  }
}
