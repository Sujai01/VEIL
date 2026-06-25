import React, { useCallback } from 'react';
import { Compass, CheckCircle2, Share2, MoreHorizontal, Vote } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';

export default function FeedCard({ item }: { item: any }) {
  const queryClient = useQueryClient();

  const voteMutation = useMutation({
    mutationFn: (optionId: string) => api.votePoll(item.id, optionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    }
  });

  const interestMutation = useMutation({
    mutationFn: () => api.toggleInterest(item.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    }
  });

  const handleVote = useCallback((optionId: string) => {
    if (item.userVotedOptionId) return;
    voteMutation.mutate(optionId);
  }, [item.userVotedOptionId, voteMutation]);

  const handleInterestedToggle = useCallback(() => {
    interestMutation.mutate();
  }, [interestMutation]);

  const handleReportBlock = async () => {
    const action = window.prompt('Type "report" to report this post, or "block" to block this user');
    if (action === 'report') {
      try {
        await api.reportUser(item.authorId || 'user', 'Inappropriate post');
        alert('Report submitted');
      } catch (e) {}
    } else if (action === 'block') {
      try {
        await api.blockUser(item.authorId || 'user');
        alert('User blocked');
      } catch (e) {}
    }
  };

  if (item.type === 'poll') {
    const totalPollVotes = item.pollOptions.reduce((sum: number, opt: any) => sum + opt.votes, 0);

    return (
      <div className="bg-white p-5 rounded-2xl card-shadow border border-outline-variant/15 space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex gap-3 items-center">
            <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
              <Vote className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-display text-xs font-extrabold text-on-surface">
                {item.authorName}
              </p>
              <span className="bg-primary/10 text-primary uppercase text-[8px] font-mono font-black px-2 pb-0.5 pt-1 rounded tracking-widest leading-none">
                Active Poll • {item.authorLabel}
              </span>
            </div>
          </div>
          <button onClick={handleReportBlock} className="text-on-surface-variant hover:text-on-surface">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        <p className="font-display text-sm font-extrabold leading-tight text-on-surface">
          {item.content}
        </p>

        <div className="space-y-2.5">
          {item.pollOptions.map((opt: any) => {
            const percentage = totalPollVotes > 0 ? Math.round((opt.votes / totalPollVotes) * 100) : 0;
            const isVoted = item.userVotedOptionId === opt.id;
            const hasVotedAny = !!item.userVotedOptionId;

            return (
              <button 
                key={opt.id}
                onClick={() => handleVote(opt.id)}
                className={`w-full p-4 rounded-xl border flex justify-between items-center relative overflow-hidden transition-all text-left ${
                  isVoted
                    ? 'border-primary ring-2 ring-primary/15'
                    : 'border-outline-variant/40 hover:border-primary-fixed bg-white/50'
                }`}
                disabled={hasVotedAny}
              >
                {hasVotedAny && (
                  <div 
                    className="absolute left-0 top-0 bottom-0 bg-primary/10 transition-all duration-700 ease-out z-0"
                    style={{ width: `${percentage}%` }}
                  />
                )}
                
                <span className="font-display text-xs font-bold text-on-surface relative z-10">{opt.text}</span>
                <div className="flex items-center gap-2 relative z-10 shrink-0 select-none">
                  {isVoted && <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />}
                  <span className="text-[10px] uppercase font-mono font-bold text-on-surface-variant">
                    {hasVotedAny ? `${percentage}%` : `${opt.votes} votes`}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
        <p className="text-[10px] font-mono text-on-surface-variant/70 text-center">
          {totalPollVotes.toLocaleString()} total verified students voted
        </p>
      </div>
    );
  }

  // Default post
  return (
    <div className="bg-white p-5 rounded-2xl card-shadow border border-outline-variant/15 space-y-4">
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-fixed/40 flex items-center justify-center shrink-0 border border-outline-variant/20">
            <Compass className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-display text-xs font-extrabold text-on-surface leading-none">
              {item.authorName}
            </p>
            <p className="text-[10px] text-on-surface-variant font-mono mt-1">
              {item.timeAgoText} • {item.locationText}
            </p>
          </div>
        </div>
        <button onClick={handleReportBlock} className="text-on-surface-variant hover:text-on-surface">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <p className="text-xs text-on-surface-variant leading-relaxed">
        {item.content}
      </p>

      <div className="flex gap-3 pt-1">
        <button 
          onClick={handleInterestedToggle}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold font-display flex items-center justify-center gap-2 transition-all duration-150 active:scale-95 ${
            item.isInterestedByMe 
              ? 'bg-primary text-white shadow-md shadow-primary/10' 
              : 'bg-primary-container/10 hover:bg-primary-container/15 text-primary border border-primary/5'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{item.isInterestedByMe ? 'Interested ✓' : 'Mark Interested'} ({item.interestedCount})</span>
        </button>
        <button className="px-3.5 py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors text-on-surface-variant active:scale-95 duration-105">
          <Share2 className="w-4.5 h-4.5" />
        </button>
      </div>
    </div>
  );
}
