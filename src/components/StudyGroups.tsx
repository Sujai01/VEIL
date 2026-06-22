import React, { useState } from 'react';
import { Users, Landmark, MapPin, Clock, X, Plus, BookOpen, Search } from 'lucide-react';
import { StudyGroup } from '../types';

interface StudyGroupsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StudyGroups({ isOpen, onClose }: StudyGroupsProps) {
  const [filterQuery, setFilterQuery] = useState('');
  const [groups, setGroups] = useState<StudyGroup[]>([
    {
      id: '1',
      subject: 'Algorithms (COL106)',
      topic: 'Dynamic Programming & Graph Theory Prep',
      membersCount: 4,
      maxMembers: 6,
      timeText: 'Today, 05:00 PM',
      location: 'Library Basement Room C',
      isJoined: false
    },
    {
      id: '2',
      subject: 'Microeconomics (MCL201)',
      topic: 'Game Theory & Nash Equilibrium practice',
      membersCount: 3,
      maxMembers: 5,
      timeText: 'Tomorrow, 02:30 PM',
      location: 'Academic Block B Lounge',
      isJoined: true
    },
    {
      id: '3',
      subject: 'Machine Learning (ELL409)',
      topic: 'Neural Network Weights & Backpropagation review',
      membersCount: 2,
      maxMembers: 4,
      timeText: 'June 18, 11:00 AM',
      location: 'Main Cafe Sitting Alcove',
      isJoined: false
    }
  ]);

  const [newSubject, setNewSubject] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleJoin = (id: string) => {
    setGroups(groups.map(g => {
      if (g.id === id) {
        if (g.isJoined) {
          return { ...g, isJoined: false, membersCount: g.membersCount - 1 };
        } else {
          return { ...g, isJoined: true, membersCount: Math.min(g.maxMembers, g.membersCount + 1) };
        }
      }
      return g;
    }));
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newTopic.trim()) return;

    const group: StudyGroup = {
      id: Date.now().toString(),
      subject: newSubject,
      topic: newTopic,
      membersCount: 1,
      maxMembers: 5,
      timeText: 'Today, Just created',
      location: newLocation.trim() || 'SAC Study Lounge',
      isJoined: true
    };

    setGroups([group, ...groups]);
    setNewSubject('');
    setNewTopic('');
    setNewLocation('');
    setIsAdding(false);
  };

  const filteredGroups = groups.filter(g => 
    g.subject.toLowerCase().includes(filterQuery.toLowerCase()) || 
    g.topic.toLowerCase().includes(filterQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-slide-up">
        
        {/* Header */}
        <header className="p-4 border-b border-surface-container flex justify-between items-center bg-primary text-white">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary-fixed" />
            <div>
              <h3 className="font-display font-bold text-base leading-none">Study Groups</h3>
              <span className="text-[10px] text-white/70">Find partners & meet on campus</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-white/15 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Filter / Search Bar */}
        <div className="p-3 bg-surface-container/30 border-b border-surface-container">
          <div className="relative">
            <Search className="w-4 h-4 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Filter by subject or keyword..." 
              className="w-full bg-white border border-outline-variant/30 rounded-xl py-2 pl-9 pr-4 text-xs font-medium outline-none focus:border-primary text-on-surface"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Action button to add */}
        <div className="px-4 py-2 flex justify-between items-center bg-primary/5">
          <span className="text-[10px] text-on-surface-variant/80 font-mono">
            {filteredGroups.length} active sessions listed
          </span>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="text-xs text-primary font-bold flex items-center gap-1 hover:underline"
          >
            <Plus className="w-4 h-4" />
            <span>Create Session</span>
          </button>
        </div>

        {/* Create form */}
        {isAdding && (
          <form onSubmit={handleCreate} className="p-4 bg-primary/5 border-b border-outline-variant/30 space-y-3 animate-fade-in text-left">
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                Course Subject / Code
              </label>
              <input 
                type="text" 
                placeholder="e.g. Data Structures (CS 101)" 
                required
                className="w-full p-2.5 rounded-xl border border-outline-variant/40 bg-white text-xs outline-none focus:border-primary text-on-surface font-medium"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                Study Topic / Agenda
              </label>
              <input 
                type="text" 
                placeholder="e.g. Preparing for major midterm exam" 
                required
                className="w-full p-2.5 rounded-xl border border-outline-variant/40 bg-white text-xs outline-none focus:border-primary text-on-surface font-medium"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                Meeting Venue
              </label>
              <input 
                type="text" 
                placeholder="e.g. Student Center lawn" 
                className="w-full p-2.5 rounded-xl border border-outline-variant/40 bg-white text-xs outline-none focus:border-primary text-on-surface font-medium"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
              />
            </div>
            <div className="flex gap-2 justify-end pt-1">
              <button 
                type="button" 
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 bg-surface-container-high rounded-lg text-xs font-semibold text-on-surface-variant"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-1.5 bg-primary text-white rounded-lg text-xs font-semibold transition-transform active:scale-95"
              >
                Launch Session
              </button>
            </div>
          </form>
        )}

        {/* Scrollable feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
          {filteredGroups.length === 0 ? (
            <p className="text-center text-xs text-on-surface-variant/70 py-12">
              No matching study groups found. Create one!
            </p>
          ) : (
            filteredGroups.map((g) => (
              <div 
                key={g.id} 
                className="bg-white p-4 rounded-2xl card-shadow border border-outline-variant/15 flex flex-col justify-between gap-4 text-left"
              >
                <div className="space-y-1">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] font-mono font-bold text-primary px-2 py-0.5 bg-primary-fixed rounded-full uppercase leading-none">
                      {g.subject}
                    </span>
                    <span className="text-[10px] font-mono text-on-surface-variant/70">
                      {g.membersCount}/{g.maxMembers} Joined
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-sm text-on-surface leading-snug">
                    {g.topic}
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-on-surface-variant/80 border-t border-b border-surface-container/40 py-2.5 my-0.5">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary/60 shrink-0" />
                    <span className="truncate leading-none">{g.timeText}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary/60 shrink-0" />
                    <span className="truncate leading-none">{g.location}</span>
                  </div>
                </div>

                <button 
                  onClick={() => handleJoin(g.id)}
                  className={`w-full py-2.5 rounded-xl font-display font-semibold text-xs transition-all duration-150 active:scale-95 ${
                    g.isJoined 
                      ? 'bg-primary-fixed text-primary border border-primary/20' 
                      : 'bg-primary text-white shadow-sm shadow-primary/15'
                  }`}
                >
                  {g.isJoined ? '✓ Joined study group' : 'Request to join group'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
