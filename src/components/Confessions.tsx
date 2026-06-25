import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Sparkles, MessageSquare, Heart, ThumbsUp, PlusCircle, Send, X } from 'lucide-react';
import { AnonymousConfession } from '../types';
import { api } from '../api';

interface ConfessionsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Confessions({ isOpen, onClose }: ConfessionsProps) {
  const queryClient = useQueryClient();
  const [newPost, setNewPost] = useState('');

  const { data: confessions = [], isLoading } = useQuery<AnonymousConfession[]>({
    queryKey: ['confessions'],
    queryFn: api.getConfessions
  });

  const createMutation = useMutation({
    mutationFn: (content: string) => api.createConfession(content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['confessions'] });
      setNewPost('');
    }
  });

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    createMutation.mutate(newPost.trim());
  };

  const upvoteMutation = useMutation({
    mutationFn: (id: string) => api.upvoteConfession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['confessions'] });
    }
  });

  const handleUpvote = (id: string) => {
    upvoteMutation.mutate(id);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-slide-up">
        {/* Header */}
        <header className="p-4 border-b border-surface-container flex justify-between items-center bg-primary text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary-fixed" />
            <div>
              <h3 className="font-display font-bold text-base leading-none">Confessions</h3>
              <span className="text-[10px] text-white/70">100% Anonymous student feed</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-white/15 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Post Form */}
        <form onSubmit={handlePost} className="p-4 bg-primary/5 border-b border-outline-variant/10">
          <div className="relative">
            <textarea
              className="w-full p-4 pr-12 rounded-2xl border border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary text-sm bg-white placeholder:text-outline-variant/70 min-h-[90px] resize-none outline-none text-on-surface"
              placeholder="What's your secret confession? Be respectful..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              maxLength={280}
            />
            <button 
              type="submit"
              className="absolute right-3.5 bottom-3.5 p-2 bg-primary hover:bg-primary-container text-white rounded-full transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              disabled={!newPost.trim()}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="flex justify-between items-center mt-2 px-1">
            <span className="text-[10px] text-on-surface-variant font-mono">
              Characters Left: {280 - newPost.length}
            </span>
            <span className="text-[10px] text-primary font-semibold uppercase tracking-wider">
              No login required
            </span>
          </div>
        </form>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
          {confessions.length === 0 ? (
            <p className="text-center text-xs text-on-surface-variant/70 py-12">
              No confessions posted yet. Be the first!
            </p>
          ) : (
            confessions.map((c) => (
              <div 
                key={c.id} 
                className="bg-white p-4 rounded-2xl card-shadow border border-outline-variant/15 flex flex-col justify-between gap-3 group transition-all duration-300 hover:border-outline-variant/40"
              >
                <div className="flex justify-between items-start gap-2">
                  <p className="text-sm font-normal text-on-surface leading-relaxed">
                    "{c.content}"
                  </p>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-surface-container/40">
                  <span className="text-[10px] text-on-surface-variant/70 font-display">
                    {c.timestamp}
                  </span>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleUpvote(c.id)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition-colors ${
                        c.hasUpvoted 
                          ? 'bg-primary text-white font-semibold' 
                          : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5 shrink-0" />
                      <span>{c.upvotes}</span>
                    </button>

                    <div className="flex items-center gap-1.5 px-2 py-1 text-on-surface-variant/70 text-xs">
                      <MessageSquare className="w-3.5 h-3.5 text-on-surface-variant/50" />
                      <span>{c.commentsCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
