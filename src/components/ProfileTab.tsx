import React, { useState } from 'react';
import { 
  ShieldCheck, LogOut, Calendar, Award, Star, Heart, Car, 
  Settings, HelpCircle, Activity, UserRound, GraduationCap, BellRing, Smartphone,
  Moon, Sun
} from 'lucide-react';

interface ProfileTabProps {
  methodUsed: string;
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function ProfileTab({ methodUsed, onLogout, isDarkMode, onToggleDarkMode }: ProfileTabProps) {
  // Load matched stats from localStorage (calculated dynamically during onboarding!)
  const socialRes = Number(localStorage.getItem('veil_social_resonance')) || 82;
  const intelDepth = Number(localStorage.getItem('veil_intellectual_depth')) || 94;
  const spontaneity = Number(localStorage.getItem('veil_spontaneity')) || 65;

  const [highMatchAlerts, setHighMatchAlerts] = useState<boolean>(() => {
    const saved = localStorage.getItem('veil_high_match_alerts');
    return saved !== 'false'; // default to true
  });

  const [hapticFeedback, setHapticFeedback] = useState<boolean>(() => {
    const saved = localStorage.getItem('veil_haptic_disabled');
    return saved !== 'true'; // default to true
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleToggleAlerts = () => {
    const newVal = !highMatchAlerts;
    setHighMatchAlerts(newVal);
    localStorage.setItem('veil_high_match_alerts', String(newVal));
    setToastMessage(newVal ? '🔔 Push notifications activated for 90%+ compatibility peers!' : '🔕 High compatibility match alerts disabled.');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleToggleHaptic = () => {
    const newVal = !hapticFeedback;
    setHapticFeedback(newVal);
    localStorage.setItem('veil_haptic_disabled', String(!newVal));
    setToastMessage(newVal ? '⚡ Haptic feedback activated!' : '📳 Haptic feedback muted.');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    
    // Trigger a brief test sensation if enabling
    if (newVal && window.navigator?.vibrate) {
      window.navigator.vibrate(10);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-left pb-32 max-w-sm mx-auto">
      
      {/* Student Badge Card */}
      <section className="bg-gradient-to-br from-primary to-primary-container text-white rounded-[28px] p-6 shadow-xl relative overflow-hidden">
        {/* Abstract decorative layout dots */}
        <div className="absolute right-[-20px] top-[-20px] w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute left-[-20px] bottom-[-20px] w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>

        <div className="flex justify-between items-start relative z-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-mono tracking-wider uppercase font-bold border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{methodUsed === 'SHEERID' ? 'Verified student' : 'College Verified ID'}</span>
            </div>
            
            <div>
              <h3 className="font-display text-xl font-extrabold tracking-tight">Aryan Sharma</h3>
              <p className="text-[10px] uppercase font-mono tracking-widest text-white/70 mt-1">
                Verified: Delhi University / IIT Delhi
              </p>
            </div>
          </div>

          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 shadow-md">
            <img 
              alt="User profile avatar of Aryan Sharma" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDN6tE-Nq-4JM6ymFe0W807zmzJF8hryvwLS68F0TRD6ykdzPmAGvfTg5y44RrYVOVgnkkizr92qndlS49ghrStkLmOtOV-poW80tQEx-2_PQiUoRFkpOOnO5cNbjXoqfpYAF1eJNKzZHrWXdI6KwzkmIHpm3a2aav7YaKzhCoKL45kzmWdQTbAMkMc2aMl06FMnsZ0BFnAgLjuNDS0ud7FlAv8-0Lev8mCaRCKUk6Nawn7cvlRjOfotX7ASrjQhY5P7jKw8wIXhTfN"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Credentials and degree */}
        <div className="pt-6 mt-6 border-t border-white/10 flex justify-between items-center relative z-10">
          <div>
            <span className="text-[9px] uppercase font-mono tracking-widest text-white/60">DEPARTMENT</span>
            <p className="text-xs font-bold font-display mt-0.5">B.Tech Computers</p>
          </div>
          <div className="text-right">
            <span className="text-[9px] uppercase font-mono tracking-widest text-white/60">BATCH YEAR</span>
            <p className="text-xs font-bold font-display mt-0.5">Class of 2025</p>
          </div>
        </div>
      </section>

      {/* Campus Performance Tally */}
      <section className="space-y-3">
        <h3 className="font-display font-bold text-xs uppercase tracking-wider text-on-surface-variant">
          Campus Activity Track
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {/* Tally Card 1: Matches */}
          <div className="glass-card card-shadow rounded-2xl p-4 border border-outline-variant/20 flex flex-col justify-between h-24">
            <div className="w-8 h-8 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
              <Heart className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="text-[9px] uppercase font-mono font-bold tracking-wider text-on-surface-variant/75">
                Anonymous Matches
              </span>
              <p className="text-lg font-extrabold font-display leading-tight text-primary mt-0.5">
                4 Active
              </p>
            </div>
          </div>

          {/* Tally Card 2: Rides */}
          <div className="glass-card card-shadow rounded-2xl p-4 border border-outline-variant/20 flex flex-col justify-between h-24">
            <div className="w-8 h-8 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
              <Car className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="text-[9px] uppercase font-mono font-bold tracking-wider text-on-surface-variant/75">
                Rides Splits
              </span>
              <p className="text-lg font-extrabold font-display leading-tight text-primary mt-0.5">
                3 Confirmed
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Personality Blueprint Category */}
      <section className="space-y-3">
        <h3 className="font-display font-bold text-xs uppercase tracking-wider text-on-surface-variant flex justify-between items-center">
          <span>Personality Blueprint</span>
          <span className="text-[10px] font-mono font-bold text-primary px-2.5 py-0.5 bg-primary-fixed rounded-full lowercase leading-none">
            from match quiz
          </span>
        </h3>

        <div className="glass-card card-shadow rounded-2xl p-5 border border-outline-variant/20 space-y-4">
          {/* SOCIAL RESONANCE */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono font-semibold text-on-surface-variant">
              <span>SOCIAL RESONANCE</span>
              <span className="text-primary font-bold">{socialRes}%</span>
            </div>
            <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
              <div 
                className="h-full crimson-gradient transition-all duration-500 ease-out"
                style={{ width: `${socialRes}%` }}
              />
            </div>
          </div>

          {/* INTELLECTUAL DEPTH */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono font-semibold text-on-surface-variant">
              <span>INTELLECTUAL DEPTH</span>
              <span className="text-primary font-bold">{intelDepth}%</span>
            </div>
            <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
              <div 
                className="h-full crimson-gradient transition-all duration-500 ease-out"
                style={{ width: `${intelDepth}%` }}
              />
            </div>
          </div>

          {/* SPONTANEITY */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono font-semibold text-on-surface-variant">
              <span>SPONTANEITY</span>
              <span className="text-primary font-bold">{spontaneity}%</span>
            </div>
            <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
              <div 
                className="h-full crimson-gradient transition-all duration-500 ease-out"
                style={{ width: `${spontaneity}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Account controls list */}
      <section className="bg-white dark:bg-surface-container rounded-2xl overflow-hidden shadow-md border border-outline-variant/20 dark:border-outline/30 divide-y divide-surface-container/40 dark:divide-outline/20">
        
        {/* Verification review date */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-primary" />
            <div>
              <p className="font-display text-xs font-bold text-on-surface">Campus Elite Access</p>
              <p className="text-[10px] text-on-surface-variant font-mono">Status active since onboarding</p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold text-primary px-2.5 py-0.5 bg-primary-fixed rounded-full leading-none">
            Verified
          </span>
        </div>

        {/* Dynamic status */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-primary" />
            <div>
              <p className="font-display text-xs font-bold text-on-surface">Social Matching Visibility</p>
              <p className="text-[10px] text-on-surface-variant font-mono">Visible to prospective classmates</p>
            </div>
          </div>
          <div className="relative inline-flex items-center cursor-pointer">
            <div className="w-9 h-5 bg-primary rounded-full transition-all flex items-center justify-end px-0.5">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
        </div>

        {/* 90%+ Match Push Notifications alerts */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <BellRing className={`w-5 h-5 transition-colors ${highMatchAlerts ? 'text-primary' : 'text-on-surface-variant/40'}`} />
              {highMatchAlerts && (
                <span className="absolute -top-1 -right-0.5 w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              )}
            </div>
            <div>
              <p className="font-display text-xs font-bold text-on-surface">90%+ Match Alerts</p>
              <p className="text-[10px] text-on-surface-variant font-mono">Alert when highly compatible peers join</p>
            </div>
          </div>
          <button 
            id="high-match-push-toggle"
            onClick={handleToggleAlerts}
            className="focus:outline-none cursor-pointer outline-none"
            aria-label="Toggle 90%+ Match Alerts"
          >
            <div className={`w-10 h-6 rounded-full transition-all duration-350 flex items-center p-0.5 ${
              highMatchAlerts ? 'bg-primary justify-end' : 'bg-surface-container-highest justify-start'
            }`}>
              <div className="w-5 h-5 bg-white rounded-full shadow-sm"></div>
            </div>
          </button>
        </div>

        {/* Haptic Vibrations Toggle Option */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Smartphone className={`w-5 h-5 transition-colors ${hapticFeedback ? 'text-primary' : 'text-on-surface-variant/40'}`} />
            </div>
            <div>
              <p className="font-display text-xs font-bold text-on-surface">Haptic Vibrations</p>
              <p className="text-[10px] text-on-surface-variant font-mono">Tactile feedback for button interactions</p>
            </div>
          </div>
          <button 
            id="haptic-toggle-button"
            onClick={handleToggleHaptic}
            className="focus:outline-none cursor-pointer outline-none"
            aria-label="Toggle Haptic Vibrations"
          >
            <div className={`w-10 h-6 rounded-full transition-all duration-350 flex items-center p-0.5 ${
              hapticFeedback ? 'bg-primary justify-end' : 'bg-surface-container-highest justify-start'
            }`}>
              <div className="w-5 h-5 bg-white rounded-full shadow-sm"></div>
            </div>
          </button>
        </div>

        {/* Dark Mode Toggle Option */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              {isDarkMode ? (
                <Moon className="w-5 h-5 text-primary transition-colors" />
              ) : (
                <Sun className="w-5 h-5 text-primary transition-colors" />
              )}
            </div>
            <div>
              <p className="font-display text-xs font-bold text-on-surface">Dark Theme Aesthetic</p>
              <p className="text-[10px] text-on-surface-variant font-mono">Switch between light and charcoal palettes</p>
            </div>
          </div>
          <button 
            id="theme-toggle-button"
            onClick={onToggleDarkMode}
            className="focus:outline-none cursor-pointer outline-none"
            aria-label="Toggle Dark Mode"
          >
            <div className={`w-10 h-6 rounded-full transition-all duration-350 flex items-center p-0.5 ${
              isDarkMode ? 'bg-primary justify-end' : 'bg-surface-container-highest justify-start'
            }`}>
              <div className="w-5 h-5 bg-white rounded-full shadow-sm flex items-center justify-center">
                {isDarkMode ? (
                  <Moon className="w-3 h-3 text-primary" />
                ) : (
                  <Sun className="w-3 h-3 text-primary" />
                )}
              </div>
            </div>
          </button>
        </div>

        {/* Log-out button action */}
        <button 
          onClick={onLogout}
          className="w-full p-4 flex items-center gap-3 text-error bg-error/5 hover:bg-error/10 transition-colors text-left"
        >
          <LogOut className="w-5 h-5" />
          <div>
            <p className="font-display text-xs font-bold">Logout to Fresh Splash</p>
            <p className="text-[10px] text-error/80 font-mono">Resets onboarding and state</p>
          </div>
        </button>

      </section>

      {/* Elegant Toast notification feedback */}
      {showToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-full text-xs font-medium shadow-2xl flex items-center gap-2 max-w-[90%] w-max animate-fade-in text-center">
          <span className="font-sans">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
