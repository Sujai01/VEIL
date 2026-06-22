import React, { useState } from 'react';
import { 
  Users, Trophy, MessageSquare, Bell, Compass, Calendar, MapPin, 
  CheckCircle2, Share2, MoreHorizontal, Lightbulb, Play, Vote, ChevronRight 
} from 'lucide-react';
import { FeedItem } from '../types';
import Confessions from './Confessions';
import StudyGroups from './StudyGroups';
import Tournaments from './Tournaments';

export default function CampusHub() {
  // Modal states
  const [activeModal, setActiveModal] = useState<'CONFESSIONS' | 'STUDY_GROUPS' | 'TOURNAMENTS' | null>(null);

  // Poll state
  const [pollVoted, setPollVoted] = useState<'OAT' | 'SAC' | null>(null);
  const [pollVotes, setPollVotes] = useState({ oat: 521, sac: 719 });

  // Dramatics society interested state
  const [isInterested, setIsInterested] = useState(false);
  const [interestedCount, setInterestedCount] = useState(145);

  const handleVote = (option: 'OAT' | 'SAC') => {
    if (pollVoted) return; // Prevent multiple voting
    setPollVoted(option);
    setPollVotes(prev => ({
      ...prev,
      oat: option === 'OAT' ? prev.oat + 1 : prev.oat,
      sac: option === 'SAC' ? prev.sac + 1 : prev.sac
    }));
  };

  const handleInterestedToggle = () => {
    if (isInterested) {
      setIsInterested(false);
      setInterestedCount(p => p - 1);
    } else {
      setIsInterested(true);
      setInterestedCount(p => p + 1);
    }
  };

  const totalPollVotes = pollVotes.oat + pollVotes.sac;
  const oatPercentage = Math.round((pollVotes.oat / totalPollVotes) * 100);
  const sacPercentage = Math.round((pollVotes.sac / totalPollVotes) * 100);

  return (
    <div className="space-y-6 animate-fade-in text-left pb-32">
      
      {/* Quick Actions Grid layout */}
      <section className="pt-2">
        <div className="grid grid-cols-3 gap-3.5">
          {/* Action 1: Study Group */}
          <button 
            onClick={() => setActiveModal('STUDY_GROUPS')}
            className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white card-shadow border border-outline-variant/15 active:scale-95 duration-150 group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary/10 transition-all">
              <Users className="w-7 h-7" />
            </div>
            <span className="font-display text-[10px] font-bold text-center uppercase tracking-wider text-on-surface-variant/90 leading-none">
              Study Group
            </span>
          </button>

          {/* Action 2: Tournaments */}
          <button 
            onClick={() => setActiveModal('TOURNAMENTS')}
            className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white card-shadow border border-outline-variant/15 active:scale-95 duration-150 group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary/10 transition-all">
              <Trophy className="w-7 h-7" />
            </div>
            <span className="font-display text-[10px] font-bold text-center uppercase tracking-wider text-on-surface-variant/90 leading-none">
              Tournaments
            </span>
          </button>

          {/* Action 3: Confessions */}
          <button 
            onClick={() => setActiveModal('CONFESSIONS')}
            className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white card-shadow border border-outline-variant/15 active:scale-95 duration-150 group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary/10 transition-all">
              <MessageSquare className="w-7 h-7" />
            </div>
            <span className="font-display text-[10px] font-bold text-center uppercase tracking-wider text-on-surface-variant/90 leading-none">
              Confessions
            </span>
          </button>
        </div>
      </section>

      {/* Trending Events horizontal scrollable region */}
      <section className="space-y-3.5">
        <div className="flex justify-between items-end">
          <h2 className="font-display font-extrabold text-[15px] text-on-surface uppercase tracking-tight">
            Trending Campus Events
          </h2>
          <span className="text-[10px] font-mono tracking-wider text-primary font-bold uppercase cursor-pointer hover:underline">
            See All
          </span>
        </div>

        {/* Gallery reel */}
        <div className="flex gap-4 overflow-x-auto pb-3 snap-x scrollbar-hide -mx-5 px-5">
          {/* Card 1: Rendezvous '24 */}
          <div className="min-w-[260px] h-[340px] rounded-[28px] overflow-hidden relative snap-start card-shadow group shrink-0 border border-outline-variant/15">
            <img 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDav8Uh44qrzVkHoCoDPsY1CflluKJM-5pJ3kOkWJErIT2KKS6mBGek_nwa3157natX1b0II__kbO8IXmQefPEt5IMpRAxPJ4ns9_oysq719vrzkjPcLZ682r9QTbZzxggLQMdrxL6jW6Vr-s3fybsrxPGJOuC5_GMydwLLV90iDf6E1THIsn3m9LF747x24H5jpuWcE5W8UrSnQAj-CG9NwpwgWhHYzQHvp6-Rx3BcEXjroEdMK9sII0QkynjW72-CGuAoYx6Ficeu" 
              alt="Cultural Fest Rendezvous"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>
            <div className="absolute bottom-0 p-5 w-full space-y-2">
              <span className="px-3 py-1 rounded-full bg-primary text-white text-[9px] font-mono font-bold tracking-wider uppercase leading-none">
                CULTURAL FEST
              </span>
              <h3 className="font-display text-lg font-extrabold text-white leading-tight">
                Rendezvous '24
              </h3>
              <div className="flex items-center gap-1 text-white/80 font-mono text-[10px]">
                <Calendar className="w-3.5 h-3.5 text-primary-fixed shrink-0" />
                Oct 12 - 15
              </div>
            </div>
          </div>

          {/* Card 2: UI Design Sprint */}
          <div className="min-w-[260px] h-[340px] rounded-[28px] overflow-hidden relative snap-start card-shadow group shrink-0 border border-outline-variant/15">
            <img 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3ZsPkYilQ69JIF9-IxtCN40vOG0LkCim8mxDOjY8R3qBw8Ho8CW34XqZQ6YSbEtJtqCSOhPoTfDopgsCf7B3A9Fhy4Lqe05Yt5A7wF4McSPzSqhYQBqCJBbA16KmCtiO7UweZ5Y7ejFKMvzXWO5T5iRi7qhNV_DVtmUxn9s-a7fNNo8jNIUcBjiZcuvKeFOZ9GsPs1VfuFkhxBv39QHjiFru-_ZgAWYGH6I8W1H1ehgnkGhtq8Hkjfc4-NLdxunUyA1nMunPBPzOj" 
              alt="UI Design Sprint Workshop"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>
            <div className="absolute bottom-0 p-5 w-full space-y-2">
              <span className="px-3 py-1 rounded-full bg-secondary text-white text-[9px] font-mono font-bold tracking-wider uppercase leading-none">
                WORKSHOP
              </span>
              <h3 className="font-display text-lg font-extrabold text-white leading-tight">
                UI Design Sprint
              </h3>
              <div className="flex items-center gap-1 text-white/80 font-mono text-[10px]">
                <MapPin className="w-3.5 h-3.5 text-primary-fixed shrink-0" />
                Seminar Hall 2
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campus feed lists */}
      <section className="space-y-4">
        <h2 className="font-display font-extrabold text-[15px] uppercase tracking-tight text-on-surface">
          Campus Feed Updates
        </h2>

        {/* FEED CARD 1: Event Dramatics society auditions */}
        <div className="bg-white p-5 rounded-2xl card-shadow border border-outline-variant/15 space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-fixed/40 flex items-center justify-center shrink-0 border border-outline-variant/20">
                <Compass className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-display text-xs font-extrabold text-on-surface leading-none">
                  Dramatics Society
                </p>
                <p className="text-[10px] text-on-surface-variant font-mono mt-1">
                  2h ago • Main Auditorium
                </p>
              </div>
            </div>
            <button className="text-on-surface-variant hover:text-on-surface">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-on-surface-variant leading-relaxed">
            Auditions for our upcoming flagship production <span className="font-bold text-primary">"Veil of Shadows"</span> are now officially open. All batches, backgrounds and disciplines are welcome! 🎭
          </p>

          <div className="flex gap-3 pt-1">
            <button 
              onClick={handleInterestedToggle}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold font-display flex items-center justify-center gap-2 transition-all duration-150 active:scale-95 ${
                isInterested 
                  ? 'bg-primary text-white shadow-md shadow-primary/10' 
                  : 'bg-primary-container/10 hover:bg-primary-container/15 text-primary border border-primary/5'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isInterested ? 'Interested ✓' : 'Mark Interested'} ({interestedCount})</span>
            </button>
            <button className="px-3.5 py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors text-on-surface-variant active:scale-95 duration-105">
              <Share2 className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* FEED CARD 2: Interactive Council Poll */}
        <div className="bg-white p-5 rounded-2xl card-shadow border border-outline-variant/15 space-y-4">
          <div className="flex gap-3 items-center">
            <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
              <Vote className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-display text-xs font-extrabold text-on-surface">
                Campus Council
              </p>
              <span className="bg-primary/10 text-primary uppercase text-[8px] font-mono font-black px-2 pb-0.5 pt-1 rounded tracking-widest leading-none">
                Active Council Poll
              </span>
            </div>
          </div>

          <p className="font-display text-sm font-extrabold leading-tight text-on-surface">
            Which venue is better suited for hosting the upcoming Winter Food Fest?
          </p>

          {/* Voting Option Buttons */}
          <div className="space-y-2.5">
            {/* OAT groundsOption */}
            <button 
              onClick={() => handleVote('OAT')}
              className={`w-full p-4 rounded-xl border flex justify-between items-center relative overflow-hidden transition-all text-left ${
                pollVoted === 'OAT'
                  ? 'border-primary ring-2 ring-primary/15'
                  : 'border-outline-variant/40 hover:border-primary-fixed bg-white/50'
              }`}
              disabled={!!pollVoted}
            >
              {/* Voted background progress indicator */}
              {pollVoted && (
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-primary/10 transition-all duration-700 ease-out z-0"
                  style={{ width: `${oatPercentage}%` }}
                />
              )}
              
              <span className="font-display text-xs font-bold text-on-surface relative z-10">OAT Grounds</span>
              <div className="flex items-center gap-2 relative z-10 shrink-0 select-none">
                {pollVoted === 'OAT' && <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />}
                <span className="text-[10px] uppercase font-mono font-bold text-on-surface-variant">
                  {pollVoted ? `${oatPercentage}%` : `${pollVotes.oat} student votes`}
                </span>
              </div>
            </button>

            {/* SAC Lawn option */}
            <button 
              onClick={() => handleVote('SAC')}
              className={`w-full p-4 rounded-xl border flex justify-between items-center relative overflow-hidden transition-all text-left ${
                pollVoted === 'SAC'
                  ? 'border-primary ring-2 ring-primary/15'
                  : 'border-outline-variant/40 hover:border-primary-fixed bg-white/50'
              }`}
              disabled={!!pollVoted}
            >
              {/* Voted background progress indicator */}
              {pollVoted && (
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-primary/10 transition-all duration-700 ease-out z-0"
                  style={{ width: `${sacPercentage}%` }}
                />
              )}
              
              <span className="font-display text-xs font-bold text-on-surface relative z-10">SAC Lawn</span>
              <div className="flex items-center gap-2 relative z-10 shrink-0 select-none">
                {pollVoted === 'SAC' && <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />}
                <span className="text-[10px] uppercase font-mono font-bold text-on-surface-variant">
                  {pollVoted ? `${sacPercentage}%` : `${pollVotes.sac} student votes`}
                </span>
              </div>
            </button>
          </div>

          <p className="text-[10px] font-mono text-on-surface-variant/70 text-center">
            {totalPollVotes.toLocaleString()} total verified students voted
          </p>
        </div>
      </section>

      {/* RENDER MODAL TABS OVERLAY DRAWER SHIELDS */}
      <Confessions isOpen={activeModal === 'CONFESSIONS'} onClose={() => setActiveModal(null)} />
      <StudyGroups isOpen={activeModal === 'STUDY_GROUPS'} onClose={() => setActiveModal(null)} />
      <Tournaments isOpen={activeModal === 'TOURNAMENTS'} onClose={() => setActiveModal(null)} />

    </div>
  );
}
