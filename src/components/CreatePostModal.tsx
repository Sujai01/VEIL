import React, { useState } from 'react';
import { X, Image as ImageIcon, CheckCircle2, ChevronRight, PenTool } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';

export default function CreatePostModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'TEXT' | 'MEME' | 'POLL'>('TEXT');
  const [content, setContent] = useState('');
  const [memeImage, setMemeImage] = useState('');
  const [memeCategory, setMemeCategory] = useState('Campus');
  const [pollOptions, setPollOptions] = useState(['', '']);
  
  const queryClient = useQueryClient();
  
  const createMutation = useMutation({
    mutationFn: (data: any) => api.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      onClose();
      setContent('');
      setMemeImage('');
      setPollOptions(['', '']);
    }
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (activeTab === 'TEXT') {
      createMutation.mutate({ type: 'TEXT', content });
    } else if (activeTab === 'MEME') {
      createMutation.mutate({ 
        type: 'MEME', 
        content, 
        image: memeImage || 'https://images.unsplash.com/photo-1544214532-61da6cb49377?auto=format&fit=crop&q=80',
        tags: [memeCategory]
      });
    } else if (activeTab === 'POLL') {
      const validOptions = pollOptions.filter(o => o.trim() !== '');
      if (validOptions.length < 2) return alert('Need at least 2 options');
      createMutation.mutate({ type: 'POLL', content, options: validOptions });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center">
      <div className="bg-surface w-full max-w-md h-[85vh] sm:h-[600px] sm:rounded-[32px] rounded-t-[32px] overflow-hidden flex flex-col shadow-2xl relative animate-slide-up border border-outline-variant/20">
        
        {/* Header */}
        <div className="px-6 py-4 flex justify-between items-center border-b border-outline-variant/15 shrink-0 bg-white">
          <div className="flex gap-4 items-center">
            <h2 className="font-display font-extrabold text-lg text-on-surface">Create</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex p-3 bg-white border-b border-outline-variant/10 shrink-0 gap-2">
          {['TEXT', 'MEME', 'POLL'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold font-display uppercase tracking-wider transition-all ${
                activeTab === tab ? 'bg-primary text-white shadow-md' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white space-y-6">
          
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-primary-fixed/40 flex items-center justify-center shrink-0 border border-outline-variant/20">
              <PenTool className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <textarea 
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder={
                  activeTab === 'TEXT' ? "What's happening on campus?" : 
                  activeTab === 'MEME' ? "Caption this meme..." : 
                  "Ask a question..."
                }
                className="w-full bg-transparent border-none outline-none resize-none font-sans text-sm text-on-surface placeholder:text-on-surface-variant/50 min-h-[100px]"
                autoFocus
              />
            </div>
          </div>

          {activeTab === 'MEME' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 block">Category</label>
                <div className="flex flex-wrap gap-2">
                  {['Academic', 'Hostel', 'Placement', 'Professors', 'Exam', 'Relationship', 'Campus'].map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setMemeCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-bold font-mono transition-colors ${
                        memeCategory === cat ? 'bg-primary text-white' : 'bg-surface-container text-on-surface'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 block">Image URL</label>
                <input 
                  type="text" 
                  value={memeImage}
                  onChange={e => setMemeImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-surface-container p-3 rounded-xl text-xs outline-none focus:ring-1 focus:ring-primary border border-outline-variant/20"
                />
              </div>
              {memeImage && (
                <img src={memeImage} alt="Meme preview" className="w-full h-48 object-cover rounded-xl border border-outline-variant/20" />
              )}
            </div>
          )}

          {activeTab === 'POLL' && (
            <div className="space-y-3 animate-fade-in">
              {pollOptions.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-6 h-6 flex items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold">{i + 1}</span>
                  <input 
                    type="text"
                    value={opt}
                    onChange={e => {
                      const newOpts = [...pollOptions];
                      newOpts[i] = e.target.value;
                      setPollOptions(newOpts);
                    }}
                    placeholder={`Option ${i + 1}`}
                    className="flex-1 bg-surface-container p-3 rounded-xl text-xs outline-none focus:ring-1 focus:ring-primary border border-outline-variant/20"
                  />
                </div>
              ))}
              {pollOptions.length < 5 && (
                <button 
                  onClick={() => setPollOptions([...pollOptions, ''])}
                  className="text-xs font-bold text-primary px-2"
                >
                  + Add Option
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-outline-variant/15 bg-white flex justify-end shrink-0">
          <button 
            onClick={handleSubmit}
            disabled={!content.trim() || createMutation.isPending}
            className="bg-primary text-white px-6 py-3 rounded-full font-display font-bold text-sm shadow-lg shadow-primary/25 hover:brightness-105 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {createMutation.isPending ? 'Posting...' : 'Post to Campus'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
