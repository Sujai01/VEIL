import React, { useState } from 'react';
import { Search, Compass, Verified, CheckCircle2, UserCheck, MessageSquare, ShieldCheck, Mail } from 'lucide-react';

interface Classmate {
  id: string;
  name: string;
  college: string;
  degree: string;
  avatarUrl?: string;
  avatarText: string;
  compatibility: number;
  tags: string[];
}

export default function ClassmateSearch() {
  const [query, setQuery] = useState('');
  
  const classmates: Classmate[] = [
    {
      id: 'c1',
      name: 'Rohan Verma',
      college: 'IIT Delhi',
      degree: 'B.Tech Electrical, Class of 2024',
      avatarText: 'RV',
      compatibility: 91,
      tags: ['Competitive Programming', 'Physics', 'Techno']
    },
    {
      id: 'c2',
      name: 'Priyah Patel',
      college: 'IIT Delhi',
      degree: 'B.Des Fashion, Class of 2025',
      avatarText: 'PP',
      compatibility: 87,
      tags: ['Graphic Design', 'Jazz', 'Billiards']
    },
    {
      id: 'c3',
      name: 'Aryan Sharma',
      college: 'IIT Delhi',
      degree: 'B.Tech Computers, Class of 2025',
      avatarText: 'AS',
      compatibility: 100,
      tags: ['Deep Tech', 'Chess', 'Indie Rock']
    },
    {
      id: 'c4',
      name: 'Sneha Rao',
      college: 'IIT Delhi',
      degree: 'M.Sc Biochemistry, Class of 2024',
      avatarText: 'SR',
      compatibility: 76,
      tags: ['Literature', 'Coffee', 'Trekking']
    }
  ];

  const filtered = classmates.filter(c => 
    c.name.toLowerCase().includes(query.toLowerCase()) || 
    c.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
    c.degree.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in text-left pb-32 max-w-sm mx-auto">
      
      {/* Directory Title */}
      <section className="space-y-1 text-left">
        <h2 className="font-display font-bold text-2xl tracking-tight text-on-surface">
          Student Directory
        </h2>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Search verified peers, batchmates and research partners inside IIT Delhi.
        </p>
      </section>

      {/* Lookup search bar */}
      <div className="glass-card card-shadow rounded-xl p-3 flex gap-2.5 items-center border border-outline-variant/30">
        <Search className="w-5 h-5 text-outline shrink-0" />
        <input 
          type="text" 
          placeholder="Lookup names or tag (e.g. Chess)..." 
          className="bg-transparent border-none focus:ring-0 w-full text-xs font-semibold placeholder:text-outline outline-none text-on-surface"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Directory peer lists */}
      <section className="space-y-4">
        {filtered.map(student => (
          <div 
            key={student.id}
            className="bg-white p-4 rounded-2xl card-shadow border border-outline-variant/15 space-y-4 hover:border-primary-fixed/60 duration-200 transition-all text-left"
          >
            {/* Header profile block */}
            <div className="flex justify-between items-start gap-4">
              <div className="flex gap-3">
                {/* Profile Placeholder/Gravatar */}
                <div className="w-10 h-10 rounded-full crimson-gradient flex items-center justify-center text-white font-display font-extrabold text-sm shrink-0 shadow-sm border border-white/10 uppercase">
                  {student.avatarText}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 align-middle">
                    <p className="font-display text-sm font-extrabold text-on-surface leading-none">
                      {student.name}
                    </p>
                    <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                  </div>
                  <p className="text-[10px] text-on-surface-variant font-mono mt-1 pr-6 leading-tight">
                    {student.degree}
                  </p>
                </div>
              </div>

              {/* Compatibility percentage circle badge */}
              <div className="bg-primary-fixed text-on-primary-fixed-variant px-2.5 py-1 rounded-full text-[10px] font-mono font-black shrink-0 tracking-wide">
                {student.compatibility}% Match
              </div>
            </div>

            {/* Interest tag groups */}
            <div className="flex flex-wrap gap-1.5">
              {student.tags.map((tag, i) => (
                <span 
                  key={i} 
                  className="bg-surface-container text-on-surface-variant font-mono text-[9px] px-2.5 py-1 rounded-full font-bold"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Send connection instant request action button */}
            <div className="pt-2 border-t border-surface-container/40 flex justify-between items-center">
              <div className="text-[10px] text-on-surface-variant font-mono flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>Verified @iitd.ac.in</span>
              </div>
              <button className="text-primary hover:underline text-xs font-bold flex items-center gap-1">
                <span>Request details</span>
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="text-center text-xs text-on-surface-variant/70 py-12">
            No verified students match your current filter. Please try a different query prefix!
          </p>
        )}
      </section>

    </div>
  );
}
