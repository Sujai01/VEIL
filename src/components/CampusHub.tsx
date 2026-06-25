import React, { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Users, Trophy, MessageSquare, Bell, Compass, Calendar, MapPin, 
  CheckCircle2, Share2, MoreHorizontal, Lightbulb, Play, Vote, ChevronRight, Plus
} from 'lucide-react';
import Confessions from './Confessions';
import StudyGroups from './StudyGroups';
import Tournaments from './Tournaments';
import FeedCard from './FeedCard';
import CreatePostModal from './CreatePostModal';
import { CampusEvent, SpotlightResponse } from '../types';
import { api } from '../api';

const CampusHub = () => {
  // Modal states
  const [activeModal, setActiveModal] = useState<'CONFESSIONS' | 'STUDY_GROUPS' | 'TOURNAMENTS' | null>(null);

  const handleToggleModal = useCallback((modal: 'CONFESSIONS' | 'STUDY_GROUPS' | 'TOURNAMENTS') => {
    setActiveModal(activeModal === modal ? null : modal);
  }, [activeModal]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: feedItems = [], isLoading, isError: isFeedError, refetch: feedRefetch } = useQuery({
    queryKey: ['feed'],
    queryFn: api.getFeed
  });

  const { 
    data: spotlightResponse, 
    isLoading: spotlightLoading,
  } = useQuery<SpotlightResponse>({
    queryKey: ['spotlight'],
    queryFn: api.getSpotlight
  });

  const spotlight = spotlightResponse?.data;
  const spotlightType = spotlightResponse?.type;

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

      {/* Dynamic Spotlight Section */}
      {spotlightLoading ? (
        <section className="space-y-3.5">
          <div className="w-full h-48 rounded-[28px] bg-surface-container-high animate-pulse"></div>
        </section>
      ) : spotlight && spotlightType !== 'PULSE' ? (
        <section className="space-y-3.5">
          <div className="flex justify-between items-end">
            <h2 className="font-display font-extrabold text-[15px] text-on-surface uppercase tracking-tight flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              Spotlight
            </h2>
          </div>

          <div className="w-full rounded-[28px] overflow-hidden relative card-shadow border border-outline-variant/15 bg-white">
            {spotlightType === 'EVENT' && (
              <>
                <img 
                  loading="lazy"
                  className="w-full h-48 object-cover" 
                  src={spotlight.image} 
                  alt={spotlight.title}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none"></div>
                <div className="absolute bottom-0 p-5 w-full space-y-2 pointer-events-none">
                  <span className="px-3 py-1 rounded-full text-white text-[9px] font-mono font-bold tracking-wider uppercase leading-none bg-primary">
                    Event Spotlight
                  </span>
                  <h3 className="font-display text-lg font-extrabold text-white leading-tight">
                    {spotlight.title}
                  </h3>
                  <div className="flex items-center gap-1 text-white/80 font-mono text-[10px]">
                    <MapPin className="w-3.5 h-3.5 text-primary-fixed shrink-0" /> {spotlight.location || 'Campus'}
                  </div>
                </div>
              </>
            )}
            {spotlightType === 'MEME' && (
              <div className="p-4 space-y-3">
                <span className="px-3 py-1 rounded-full text-white text-[9px] font-mono font-bold tracking-wider uppercase leading-none bg-secondary inline-block">
                  Trending Meme
                </span>
                <p className="font-display text-sm font-extrabold">{spotlight.content}</p>
                {spotlight.image && (
                  <img src={spotlight.image} className="w-full h-40 object-cover rounded-xl" referrerPolicy="no-referrer" />
                )}
              </div>
            )}
            {spotlightType === 'POLL' && (
              <div className="p-5 space-y-3">
                <span className="px-3 py-1 rounded-full text-white text-[9px] font-mono font-bold tracking-wider uppercase leading-none bg-primary inline-block">
                  Hot Poll
                </span>
                <p className="font-display text-sm font-extrabold">{spotlight.content}</p>
                <div className="text-xs font-mono text-primary font-bold">Jump to Feed to vote!</div>
              </div>
            )}
          </div>
        </section>
      ) : null}

      {/* Campus feed lists */}
      <section className="space-y-4">
        <h2 className="font-display font-extrabold text-[15px] uppercase tracking-tight text-on-surface">
          Campus Feed Updates
        </h2>

        {isLoading ? (
          <div className="space-y-4">
            <div className="h-40 rounded-2xl bg-surface-container-high animate-pulse"></div>
            <div className="h-40 rounded-2xl bg-surface-container-high animate-pulse"></div>
          </div>
        ) : isFeedError ? (
          <div className="bg-surface-container-low p-8 rounded-2xl text-center border border-outline-variant/15">
            <p className="text-on-surface-variant text-sm mb-3">Unable to connect to campus network.</p>
            <button onClick={() => feedRefetch()} className="text-primary font-bold text-xs hover:underline">Retry Connection</button>
          </div>
        ) : feedItems.length === 0 ? (
          <div className="bg-surface-container-low p-8 rounded-2xl text-center border border-outline-variant/15">
            <p className="text-on-surface-variant text-sm mb-2 font-medium">Nothing happening right now.</p>
            <p className="text-on-surface-variant/70 text-xs">Start a poll or share something with the campus.</p>
          </div>
        ) : (
          feedItems.map((item: any, index: number) => (
            <React.Fragment key={item.id}>
              <FeedCard item={item} />
              {/* Inject a micro widget every 3 posts */}
              {index > 0 && index % 3 === 0 && (
                <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">⚡</span>
                    <div>
                      <p className="text-xs font-bold text-primary font-display">Campus Pulse</p>
                      <p className="text-[10px] text-on-surface-variant font-mono">Students are looking for study partners.</p>
                    </div>
                  </div>
                  <button className="text-[10px] uppercase font-bold text-primary hover:underline font-mono">Join In</button>
                </div>
              )}
            </React.Fragment>
          ))
        )}
      </section>

      {/* Floating Action Button */}
      <div className="fixed bottom-24 right-5 z-40">
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] shadow-primary/40 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* RENDER MODAL TABS OVERLAY DRAWER SHIELDS */}
      <Confessions isOpen={activeModal === 'CONFESSIONS'} onClose={() => setActiveModal(null)} />
      <StudyGroups isOpen={activeModal === 'STUDY_GROUPS'} onClose={() => setActiveModal(null)} />
      <Tournaments isOpen={activeModal === 'TOURNAMENTS'} onClose={() => setActiveModal(null)} />
      <CreatePostModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />

    </div>
  );
};

export default React.memo(CampusHub);
