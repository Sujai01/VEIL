import React, { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Users, Trophy, MessageSquare, Bell, Compass, Calendar, MapPin, 
  CheckCircle2, Share2, MoreHorizontal, Lightbulb, Play, Vote, ChevronRight 
} from 'lucide-react';
import Confessions from './Confessions';
import StudyGroups from './StudyGroups';
import Tournaments from './Tournaments';
import FeedCard from './FeedCard';
import { CampusEvent } from '../types';
import { api } from '../api';

const CampusHub = () => {
  // Modal states
  const [activeModal, setActiveModal] = useState<'CONFESSIONS' | 'STUDY_GROUPS' | 'TOURNAMENTS' | null>(null);

  const handleToggleModal = useCallback((modal: 'CONFESSIONS' | 'STUDY_GROUPS' | 'TOURNAMENTS') => {
    setActiveModal(activeModal === modal ? null : modal);
  }, [activeModal]);

  const { data: feedItems = [], isLoading } = useQuery({
    queryKey: ['feed'],
    queryFn: api.getFeed
  });

  const { 
    data: eventsResponse, 
    isLoading: eventsLoading, 
    isError: eventsError, 
    refetch: eventsRefetch 
  } = useQuery({
    queryKey: ['trendingEvents'],
    queryFn: api.getTrendingEvents
  });

  const events = eventsResponse?.data || [];

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
          {eventsLoading ? (
            // Skeleton loader for events
            Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="min-w-[260px] h-[340px] rounded-[28px] bg-surface-container-high animate-pulse snap-start shrink-0"></div>
            ))
          ) : eventsError ? (
            <div className="min-w-[260px] h-[340px] rounded-[28px] border border-outline-variant/15 flex flex-col items-center justify-center p-6 text-center text-on-surface-variant bg-surface-container-low shrink-0 snap-start">
              <p className="text-sm font-medium mb-2">Failed to load events</p>
              <button onClick={() => eventsRefetch()} className="text-xs text-primary font-bold hover:underline">Retry</button>
            </div>
          ) : events.length === 0 ? (
            <div className="min-w-[260px] h-[340px] rounded-[28px] border border-outline-variant/15 flex items-center justify-center p-6 text-center text-on-surface-variant bg-surface-container-low shrink-0 snap-start">
              <p className="text-sm font-medium">No events available</p>
            </div>
          ) : (
            events.map((evt: CampusEvent) => (
              <div key={evt.id} className="min-w-[260px] h-[340px] rounded-[28px] overflow-hidden relative snap-start card-shadow group shrink-0 border border-outline-variant/15">
                <img 
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  src={evt.image} 
                  alt={evt.title}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>
                <div className="absolute bottom-0 p-5 w-full space-y-2">
                  <span className={`px-3 py-1 rounded-full text-white text-[9px] font-mono font-bold tracking-wider uppercase leading-none ${evt.category === 'WORKSHOP' ? 'bg-secondary' : 'bg-primary'}`}>
                    {evt.category}
                  </span>
                  <h3 className="font-display text-lg font-extrabold text-white leading-tight">
                    {evt.title}
                  </h3>
                  <div className="flex items-center gap-1 text-white/80 font-mono text-[10px]">
                    {evt.location ? (
                      <><MapPin className="w-3.5 h-3.5 text-primary-fixed shrink-0" /> {evt.location}</>
                    ) : (
                      <><Calendar className="w-3.5 h-3.5 text-primary-fixed shrink-0" /> {evt.startDate} - {evt.endDate}</>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Campus feed lists */}
      <section className="space-y-4">
        <h2 className="font-display font-extrabold text-[15px] uppercase tracking-tight text-on-surface">
          Campus Feed Updates
        </h2>

        {isLoading ? (
          <p className="text-center text-xs text-on-surface-variant/70 py-12">Loading feed...</p>
        ) : (
          feedItems.map((item: any) => (
            <FeedCard key={item.id} item={item} />
          ))
        )}
      </section>

      {/* RENDER MODAL TABS OVERLAY DRAWER SHIELDS */}
      <Confessions isOpen={activeModal === 'CONFESSIONS'} onClose={() => setActiveModal(null)} />
      <StudyGroups isOpen={activeModal === 'STUDY_GROUPS'} onClose={() => setActiveModal(null)} />
      <Tournaments isOpen={activeModal === 'TOURNAMENTS'} onClose={() => setActiveModal(null)} />

    </div>
  );
};

export default React.memo(CampusHub);
