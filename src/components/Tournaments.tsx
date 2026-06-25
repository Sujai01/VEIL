import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trophy, Calendar, Users, X, CheckSquare, Gamepad2, Sparkles } from 'lucide-react';
import { Tournament } from '../types';
import { api } from '../api';

interface TournamentsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Tournaments({ isOpen, onClose }: TournamentsProps) {
  const queryClient = useQueryClient();

  const { data: tournaments = [], isLoading } = useQuery<Tournament[]>({
    queryKey: ['tournaments'],
    queryFn: api.getTournaments
  });

  const registerMutation = useMutation({
    mutationFn: (id: string) => api.registerTournament(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
    }
  });

  const handleRegister = (id: string) => {
    registerMutation.mutate(id);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-slide-up bg-background">
        
        {/* Header */}
        <header className="p-4 border-b border-surface-container flex justify-between items-center bg-primary text-white">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary-fixed" />
            <div>
              <h3 className="font-display font-bold text-base leading-none">Tournaments</h3>
              <span className="text-[10px] text-white/70">Compete, participate, win rewards</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-white/15 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Info banners */}
        <div className="p-3 bg-primary/5 border-b border-outline-variant/15 flex items-center gap-2 px-4">
          <Sparkles className="w-4 h-4 text-primary shrink-0" />
          <p className="text-[10.5px] text-on-surface-variant font-medium leading-normal">
            Verify student status on onboarding to participate in elite inter-hostel tournaments.
          </p>
        </div>

        {/* Scrollable list */}
        <div className="flex-grow overflow-y-auto p-4 space-y-4">
          {tournaments.map((t) => (
            <div 
              key={t.id} 
              className="bg-white rounded-2xl card-shadow border border-outline-variant/15 p-4 flex flex-col gap-4 text-left"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold bg-primary-fixed text-on-primary-fixed-variant px-2 py-0.5 rounded-full uppercase leading-none">
                    {t.teamsRegistered === t.maxTeams ? 'FULL' : 'OPEN'}
                  </span>
                  <h4 className="font-display font-bold text-sm text-on-surface">
                    {t.gameTitle}
                  </h4>
                  <p className="text-xs text-primary font-semibold font-display">
                    🏆 Prize: {t.prizePool}
                  </p>
                </div>
                <div className="shrink-0 p-2.5 bg-primary/5 text-primary rounded-xl">
                  <Gamepad2 className="w-6 h-6" />
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-on-surface-variant/80 bg-surface-container/30 px-3 py-2 rounded-xl">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>{t.dateText}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-2 font-semibold">
                  <Users className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>{t.teamsRegistered}/{t.maxTeams} Teams</span>
                </div>
              </div>

              <button
                onClick={() => handleRegister(t.id)}
                className={`w-full py-2.5 rounded-xl font-display font-semibold text-xs active:scale-95 transition-all ${
                  t.isRegistered 
                    ? 'bg-primary-fixed text-primary border border-primary/20' 
                    : t.teamsRegistered >= t.maxTeams 
                      ? 'bg-surface-container text-on-surface-variant cursor-not-allowed'
                      : 'bg-primary hover:bg-primary-container text-white shadow-md shadow-primary/10'
                }`}
                disabled={!t.isRegistered && t.teamsRegistered >= t.maxTeams}
              >
                {t.isRegistered ? '✓ Registered to compete' : t.teamsRegistered >= t.maxTeams ? 'Slots Full' : 'Register Team'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
