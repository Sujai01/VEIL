import React, { useState, useMemo } from 'react';
import { 
  Heart, X, Sparkles, Verified, Lock, MapPin, BrainCircuit, MessageSquare, 
  Send, Compass, HelpCircle, CheckCircle2, UserRoundCheck, ShieldCheck,
  ChevronDown, SlidersHorizontal
} from 'lucide-react';
import { DateProfile } from '../types';

export default function BlindDatePicker() {
  const [profileIndex, setProfileIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  
  // Sorting match parameters
  const [sortBy, setSortBy] = useState<'compatibility' | 'recently_added' | 'mutual_interests'>('compatibility');

  // Chat Simulator State
  const [isChatting, setIsChatting] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ sender: 'me' | 'them'; text: string; time: string }[]>([]);
  const [typeText, setTypeText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const getDynamicCompatibility = (p: DateProfile) => {
    const mySocial = Number(localStorage.getItem('veil_social_resonance')) || 82;
    const myIntel = Number(localStorage.getItem('veil_intellectual_depth')) || 94;
    const mySpon = Number(localStorage.getItem('veil_spontaneity')) || 65;

    const diff = (Math.abs(mySocial - p.socialResonance) + Math.abs(myIntel - p.intellectualDepth) + Math.abs(mySpon - p.spontaneity)) / 3;
    const score = Math.round(100 - diff);
    // bound between 55 and 99 for a nice college-life match score presentation
    return Math.max(55, Math.min(99, score));
  };

  const [profiles, setProfiles] = useState<DateProfile[]>([
    {
      id: 'p1',
      age: 21,
      batchAndDegree: 'B.Tech CSE, Batch 2025',
      compatibilityScore: 88,
      tags: ['Deep Tech', 'Chess', 'Indie Rock'],
      sharedInterests: 'Both of you follow "Entrepreneurship Cell" & "Trekking Club".',
      locationMatch: 'Frequently seen at the "Academic Block B".',
      socialResonance: 82,
      intellectualDepth: 94,
      spontaneity: 65,
      vibeText: 'Quiet and philosophical, loves long night talks about future tech.',
      createdAt: '2026-06-15T18:30:00Z',
      mutualInterestsCount: 2
    },
    {
      id: 'p2',
      age: 20,
      batchAndDegree: 'Eco Hons, Batch 2026',
      compatibilityScore: 92,
      tags: ['Economics', 'Debate', 'Techno'],
      sharedInterests: 'Both of you follow "Model United Nations" & "Anime Society".',
      locationMatch: 'Frequently seen at the "Central Library Reading Lounge".',
      socialResonance: 90,
      intellectualDepth: 88,
      spontaneity: 81,
      vibeText: 'Fast-paced learner, energetic coffee addict, loves debating policy.',
      createdAt: '2026-06-16T19:45:00Z',
      mutualInterestsCount: 3
    },
    {
      id: 'p3',
      age: 22,
      batchAndDegree: 'M.Tech AI, Batch 2024',
      compatibilityScore: 79,
      tags: ['Neural Nets', 'Billiards', 'Jazz'],
      sharedInterests: 'Both of you follow "Robotics Club" & "Music Society" & "Trekking Club".',
      locationMatch: 'Frequently seen at the "SAC Billiards Arena".',
      socialResonance: 60,
      intellectualDepth: 96,
      spontaneity: 45,
      vibeText: 'Deeply technical, jazz vinyl collector, excels at strategy puzzles.',
      createdAt: '2026-06-14T10:00:00Z',
      mutualInterestsCount: 4
    },
    {
      id: 'p4',
      age: 19,
      batchAndDegree: 'B.Des Fashion, Batch 2027',
      compatibilityScore: 84,
      tags: ['Modern Art', 'Photography', 'House Music'],
      sharedInterests: 'Both of you follow "Fine Arts Society" & "Photography Club".',
      locationMatch: 'Frequently seen near the "Design Block Amphitheatre".',
      socialResonance: 75,
      intellectualDepth: 80,
      spontaneity: 92,
      vibeText: 'Avant-garde thinker, film photographer, loves retro synthwave beats.',
      createdAt: '2026-06-16T20:10:00Z',
      mutualInterestsCount: 5
    },
    {
      id: 'p5',
      age: 20,
      batchAndDegree: 'B.Sc Physics, Batch 2026',
      compatibilityScore: 75,
      tags: ['Quantum Mech', 'Astrophotography', 'Chess'],
      sharedInterests: 'Both of you follow "Astronomy Club".',
      locationMatch: 'Frequently seen at the "Campus Astronomy Observatory".',
      socialResonance: 50,
      intellectualDepth: 98,
      spontaneity: 58,
      vibeText: 'Constantly looking at stars, loves sci-fi literature and espresso bars.',
      createdAt: '2026-06-12T08:00:00Z',
      mutualInterestsCount: 1
    }
  ]);

  const sortedProfiles = useMemo(() => {
    return [...profiles].sort((a, b) => {
      if (sortBy === 'compatibility') {
        return getDynamicCompatibility(b) - getDynamicCompatibility(a);
      } else if (sortBy === 'recently_added') {
        const timeA = new Date(a.createdAt || '').getTime();
        const timeB = new Date(b.createdAt || '').getTime();
        return timeB - timeA;
      } else if (sortBy === 'mutual_interests') {
        return (b.mutualInterestsCount || 0) - (a.mutualInterestsCount || 0);
      }
      return 0;
    });
  }, [profiles, sortBy]);

  const currentProfile = sortedProfiles[profileIndex % sortedProfiles.length];

  const handleSortChange = (newSort: 'compatibility' | 'recently_added' | 'mutual_interests') => {
    setSortBy(newSort);
    setProfileIndex(0);
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    if (isAnimating) return;
    setSwipeDirection(direction);
    setIsAnimating(true);

    setTimeout(() => {
      setProfileIndex(prev => prev + 1);
      setSwipeDirection(null);
      setIsAnimating(false);
    }, 450);
  };

  const startChatConversation = () => {
    setIsChatting(true);
    setChatMessages([
      { sender: 'them', text: "Hey! Compatibility index says 88% - I guess we both follow the Trekking Club! Have you been on the recent trek to Triund?", time: "Just now" }
    ]);
  };

  const sendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typeText.trim()) return;

    const myMessageText = typeText;
    setChatMessages(prev => [...prev, { sender: 'me', text: myMessageText, time: "Just now" }]);
    setTypeText('');

    // Trigger simulated peer response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      let reply = "Wow, that sounds fantastic! We should definitely coordinate another trek with the club! Next semester maybe?";
      if (myMessageText.toLowerCase().includes('trek')) {
        reply = "I actually went last winter! The snow was incredible. Glad you like trekking too!";
      } else if (myMessageText.toLowerCase().includes('hi') || myMessageText.toLowerCase().includes('hey')) {
        reply = "Hey! What are you studying right now on campus? Maybe we sat in the same lecture hall.";
      }
      setChatMessages(prev => [...prev, { sender: 'them', text: reply, time: "Just now" }]);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      
      {/* Date Intro Label Block */}
      <section className="text-center space-y-1">
        <h2 className="font-display font-extrabold text-2xl tracking-tight text-on-surface">
          Blind Matching
        </h2>
        <p className="text-xs text-on-surface-variant max-w-xs mx-auto leading-normal">
          Personality over looks. Connect with anonymous peers based on matching vibes, not photos.
        </p>
      </section>

      {/* Matches based on Personality DNA Indicator */}
      <div className="flex justify-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 rounded-full border border-primary/10 text-[9px] font-mono tracking-wider text-primary font-extrabold uppercase leading-none">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Matches Computed via Personality DNA</span>
        </span>
      </div>

      {/* Dynamic Sorting Selection Control */}
      {!isChatting && (
        <div className="max-w-sm mx-auto bg-white/70 backdrop-blur-md rounded-2xl p-4 border border-outline-variant/30 card-shadow space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono font-black tracking-wider text-on-surface-variant flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-primary" />
              Tune Matchmaking Stream
            </span>
            <span className="text-[9px] font-mono font-bold text-primary bg-primary-fixed px-2.5 py-0.5 rounded-full uppercase">
              {sortedProfiles.length} Candidates
            </span>
          </div>

          <div className="relative">
            <select
              id="matchmaking-sort-select"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value as any)}
              className="w-full bg-surface-container border border-outline-variant/20 rounded-xl py-3 pl-3 pr-10 text-xs font-bold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer hover:border-primary-fixed-dim transition-all"
            >
              <option value="compatibility">🧩 Filter: Personality Compatibility</option>
              <option value="recently_added">⚡ Filter: Recently Joined Campus</option>
              <option value="mutual_interests">🤝 Filter: Mutual Groups & Clubs</option>
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-on-surface-variant/70">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}

      {/* Main matching card */}
      {!isChatting ? (
        <div className="relative max-w-sm mx-auto h-[480px] w-full">
          
          {/* Active Card Stack */}
          <div 
            className={`absolute inset-0 crimson-gradient rounded-[28px] p-6 text-white flex flex-col justify-between shadow-xl transition-all duration-300 transform select-none ${
              swipeDirection === 'left' ? 'translate-x-[-150%] rotate-[-15deg] opacity-0' :
              swipeDirection === 'right' ? 'translate-x-[150%] rotate-[15deg] opacity-0' :
              'translate-x-0 rotate-0 scale-100 opacity-100 z-20'
            }`}
          >
            {/* Upper profile header */}
            <div className="flex justify-between items-start">
              <div className="space-y-3">
                <div className="bg-white/10 backdrop-blur-md rounded-full px-3 py-1 inline-flex items-center gap-1.5 border border-white/10">
                  <ShieldCheck className="w-4.5 h-4.5 text-white/90" />
                  <span className="font-display text-[10px] font-bold uppercase tracking-wider">
                    Verified Student
                  </span>
                </div>
                
                <div className="space-y-0.5">
                  <p className="font-display text-xl font-bold font-display tracking-tight">
                    {currentProfile.age} YRS
                  </p>
                  <p className="text-xs text-white/80 font-medium">
                    {currentProfile.batchAndDegree}
                  </p>
                </div>
              </div>

              {/* Compatibility circular dial */}
              <div className="relative w-16 h-16 flex items-center justify-center bg-white/10 rounded-full border border-white/20">
                <svg className="w-full h-full -rotate-90">
                  <circle className="opacity-20" cx="32" cy="32" fill="transparent" r="26" stroke="currentColor" strokeWidth="3" />
                  <circle 
                    className="text-white" 
                    cx="32" 
                    cy="32" 
                    fill="transparent" 
                    r="26" 
                    stroke="currentColor" 
                    strokeDasharray="163.3" 
                    strokeDashoffset={163.3 - (163.3 * getDynamicCompatibility(currentProfile)) / 100} 
                    strokeLinecap="round" 
                    strokeWidth="3" 
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display text-xs font-black tracking-tighter">
                    {getDynamicCompatibility(currentProfile)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Mystery Abstract Core Visual */}
            <div className="flex-1 flex items-center justify-center py-4 relative">
              <div className="absolute w-24 h-24 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
              <Compass 
                className="w-24 h-24 text-white/20 relative z-10 animate-spin" 
                style={{ animationDuration: '60s' }}
              />
            </div>

            {/* Bottom Traits Tag Pillar and CTA Buttons */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-1.5">
                {currentProfile.tags.map((tag, idx) => (
                  <span 
                    key={idx} 
                    className="bg-white/10 px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider text-white"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <button 
                  onClick={() => handleSwipe('left')}
                  className="bg-white/10 backdrop-blur-sm text-white font-display text-xs font-bold py-3.5 rounded-xl border border-white/15 outline-none hover:bg-white/15 active:scale-95 transition-all text-center"
                >
                  Pass
                </button>
                <button 
                  onClick={startChatConversation}
                  className="bg-white text-primary font-display text-xs font-bold py-3.5 rounded-xl shadow-lg border border-transparent outline-none hover:bg-white/90 active:scale-95 transition-all text-center flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-4 h-4" />
                  Start Chat
                </button>
              </div>
            </div>
          </div>

          {/* Underneath stacked card (Subtle visual hint) */}
          <div className="absolute inset-0 crimson-gradient rounded-[28px] opacity-40 translate-y-3.5 scale-[0.96] z-10 blur-[0.5px]"></div>
        </div>
      ) : (
        /* LIVE Anonymous Chat Interface Block */
        <div className="bg-white rounded-3xl overflow-hidden card-shadow border border-outline-variant/30 flex flex-col h-[480px] max-w-sm mx-auto w-full animate-fade-in">
          {/* Chat Header */}
          <div className="p-4 bg-primary text-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center font-display font-black text-white px-2">
                ?
              </div>
              <div>
                <h4 className="font-display text-xs font-bold leading-none uppercase">Anonymous Match</h4>
                <p className="text-[10px] text-white/70 mt-0.5 font-mono">{currentProfile.batchAndDegree}</p>
              </div>
            </div>
            
            <button 
              onClick={() => setIsChatting(false)}
              className="text-[10px] uppercase font-bold text-white/80 bg-white/15 px-3 py-1 rounded-full hover:bg-white/20 transition-all font-display"
            >
              Exit
            </button>
          </div>

          {/* Messages board */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-primary/5">
            {chatMessages.map((msg, i) => {
              const isMe = msg.sender === 'me';
              return (
                <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                    isMe 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'bg-white text-on-surface rounded-tl-none card-shadow border border-outline-variant/15'
                  }`}>
                    <p>{msg.text}</p>
                    <span className={`text-[8px] block mt-1 text-right ${isMe ? 'text-white/70' : 'text-on-surface-variant/70'}`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              );
            })}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/80 p-3 rounded-2xl rounded-tl-none border border-outline-variant/15 text-[10px] text-on-surface-variant flex items-center gap-1.5 uppercase font-semibold font-mono tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0s' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                  Typing...
                </div>
              </div>
            )}
          </div>

          {/* Chat text box input */}
          <form onSubmit={sendChatMessage} className="p-3 border-t border-surface-container bg-white flex gap-2 shrink-0 items-center">
            <input 
              type="text" 
              placeholder="Type message anonymously..." 
              className="flex-1 bg-surface-container rounded-xl p-2 px-3 text-xs font-semibold outline-none focus:ring-1 focus:ring-primary text-on-surface"
              value={typeText}
              onChange={(e) => setTypeText(e.target.value)}
            />
            <button 
              type="submit" 
              className="p-2.5 bg-primary hover:bg-primary-container text-white rounded-xl transition-all duration-150 disabled:opacity-50"
              disabled={!typeText.trim()}
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Compatibility insights block */}
      <section className="space-y-3 pt-2 max-w-sm mx-auto">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-sm text-on-surface uppercase tracking-tight">
            Matching Perks & Insights
          </h3>
          <BrainCircuit className="w-4 h-4 text-primary" />
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div className="glass-card card-shadow rounded-2xl p-4 border border-outline-variant/20 flex items-center gap-3.5">
            <div className="w-10 h-10 bg-primary-fixed rounded-xl flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-display text-xs font-bold text-on-surface">Shared Clubs</h4>
              <p className="text-[11px] text-on-surface-variant leading-tight mt-0.5">
                {currentProfile.sharedInterests}
              </p>
            </div>
          </div>

          <div className="glass-card card-shadow rounded-2xl p-4 border border-outline-variant/20 flex items-center gap-3.5">
            <div className="w-10 h-10 bg-primary-fixed rounded-xl flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-display text-xs font-bold text-on-surface">Location Match</h4>
              <p className="text-[11px] text-on-surface-variant leading-tight mt-0.5">
                {currentProfile.locationMatch}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
