import React, { useState, useEffect } from 'react';
import { 
  ChevronsUp, ChevronRight, Bell, Home, Search, Heart, Car, User, 
  Menu, Info, ShieldCheck, HelpCircle, LogOut 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ActiveTab, OnboardingStep } from './types';
import Onboarding from './components/Onboarding';
import CampusHub from './components/CampusHub';
import ClassmateSearch from './components/ClassmateSearch';
import BlindDatePicker from './components/BlindDatePicker';
import RideHub from './components/RideHub';
import ProfileTab from './components/ProfileTab';
import TabSkeleton from './components/TabSkeleton';

export default function App() {
  const [onboardingState, setOnboardingState] = useState<OnboardingStep>(() => {
    // Persistent launch state so user is not prompted constantly if they refresh
    const saved = localStorage.getItem('veil_onboarding_completed');
    return saved === 'true' ? 'COMPLETED' : 'SPLASH';
  });
  const [activeTab, setActiveTab] = useState<ActiveTab>('HOME');
  const [isTabLoading, setIsTabLoading] = useState<boolean>(true);
  const [methodUsed, setMethodUsed] = useState<string>(() => {
    return localStorage.getItem('veil_verify_method') || 'SHEERID';
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('veil_theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('veil_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('veil_theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (onboardingState === 'COMPLETED') {
      setIsTabLoading(true);
      const timer = setTimeout(() => {
        setIsTabLoading(false);
      }, 550); // Elegant 550ms period to display pulse animation before layout
      return () => clearTimeout(timer);
    }
  }, [activeTab, onboardingState]);

  const handleToggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const handleCompleteOnboarding = (method: string) => {
    setMethodUsed(method);
    localStorage.setItem('veil_verify_method', method);
    localStorage.setItem('veil_onboarding_completed', 'true');
    setOnboardingState('COMPLETED');
    setActiveTab('HOME');
  };

  const handleLogout = () => {
    localStorage.removeItem('veil_onboarding_completed');
    localStorage.removeItem('veil_verify_method');
    setOnboardingState('SPLASH');
    setActiveTab('HOME');
  };

  // Simulate haptic vibrations for buttons
  const triggerHaptic = () => {
    const isHapticDisabled = localStorage.getItem('veil_haptic_disabled') === 'true';
    if (!isHapticDisabled && window.navigator?.vibrate) {
      window.navigator.vibrate(10);
    }
  };

  // Screen selection renderer inside app shell
  const renderTabContent = () => {
    switch (activeTab) {
      case 'HOME':
        return <CampusHub />;
      case 'SEARCH':
        return <ClassmateSearch />;
      case 'BLIND_DATE':
        return <BlindDatePicker />;
      case 'RIDES':
        return <RideHub />;
      case 'PROFILE':
        return (
          <ProfileTab 
            methodUsed={methodUsed} 
            onLogout={handleLogout} 
            isDarkMode={isDarkMode} 
            onToggleDarkMode={handleToggleDarkMode} 
          />
        );
      default:
        return <CampusHub />;
    }
  };

  if (onboardingState !== 'COMPLETED') {
    if (onboardingState === 'SPLASH') {
      return (
        <div className="flex flex-col min-h-screen w-full relative select-none bg-background dark:bg-background justify-between pb-12 overflow-y-auto pt-8 text-left scrollbar-hide">
          {/* Background atmosphere elements */}
          <div className="absolute inset-0 premium-gradient-bg pointer-events-none"></div>

          {/* Spacer */}
          <div className="h-6"></div>

          {/* Splash Brand Container */}
          <main className="flex-1 flex flex-col items-center justify-center px-10 text-center relative z-10">
            {/* Crimson logo visual mark */}
            <div className="w-20 h-20 mb-8 crimson-gradient hover:scale-[1.03] active:scale-95 duration-300 transition-transform flex items-center justify-center rounded-3xl logo-glow shadow-xl shadow-primary/25">
              <ChevronsUp className="w-11 h-11 text-white stroke-[1.5]" />
            </div>

            {/* Brand Title: Plus Jakarta Sans bold tracking tight */}
            <h1 className="font-display font-extrabold text-[42px] text-primary tracking-tighter mb-1.5 leading-none px-1 select-none">
              Veil
            </h1>

            {/* Subtitle brand tag */}
            <p className="font-sans text-sm font-medium tracking-wide text-on-surface-variant/80 select-none">
              Built for College Life
            </p>
          </main>

          {/* Bottom Call to Action Grid */}
          <footer className="w-full px-6 flex flex-col items-center relative z-10 space-y-6 max-w-sm mx-auto">
            {/* Accent delicate vector divider */}
            <div className="w-12 h-[1px] bg-outline-variant/35 mb-2"></div>

            {/* Premium crimson gradient CTA button */}
            <button 
              onClick={() => {
                triggerHaptic();
                setOnboardingState('IDENTITY_VERIFICATION');
              }}
              className="crimson-gradient w-full h-14 rounded-full flex items-center justify-center text-white font-display text-sm font-bold shadow-xl shadow-primary/25 cursor-pointer transition-all hover:brightness-105 active:scale-[0.98] group"
            >
              <span>Get Started</span>
              <ChevronRight className="w-5 h-5 ml-1.5 transition-transform group-hover:translate-x-1" />
            </button>

            {/* footnote security */}
            <p className="font-mono text-[10px] tracking-[0.12em] font-extrabold text-on-surface-variant/50 uppercase select-none">
              Elite Access Only
            </p>
          </footer>
        </div>
      );
    }

    // IDENTITY VERIFICATION AND PERSONALITY QUESTION WORKFLOWS
    return (
      <div className="min-h-screen w-full overflow-y-auto scrollbar-hide bg-background dark:bg-background">
        <Onboarding 
          onComplete={handleCompleteOnboarding}
          onBackToSplash={() => setOnboardingState('SPLASH')}
        />
      </div>
    );
  }

  // AUTHENTIC STUDENT APP PORTAL ENTRY
  return (
    <div className="flex flex-col min-h-screen w-full bg-surface text-on-surface selection:bg-primary-fixed select-none pb-28">
      
      {/* Top Header Spacing fixed */}
      <header className="bg-white/85 dark:bg-surface/85 backdrop-blur-md sticky top-0 z-40 flex justify-between items-center px-5 py-3 border-b border-surface-container-high/35 dark:border-outline-variant/10 w-full shrink-0">
        <div className="flex items-center gap-3">
          {/* Avatar frame */}
          <div className="relative shrink-0">
            <div 
              onClick={() => { triggerHaptic(); setActiveTab('PROFILE'); }}
              className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center overflow-hidden border border-outline-variant/30 cursor-pointer hover:border-primary active:scale-95 duration-150 shrink-0"
            >
              <img 
                alt="User profile avatar of Aryan" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDN6tE-Nq-4JM6ymFe0W807zmzJF8hryvwLS68F0TRD6ykdzPmAGvfTg5y44RrYVOVgnkkizr92qndlS49ghrStkLmOtOV-poW80tQEx-2_PQiUoRFkpOOnO5cNbjXoqfpYAF1eJNKzZHrWXdI6KwzkmIHpm3a2aav7YaKzhCoKL45kzmWdQTbAMkMc2aMl06FMnsZ0BFnAgLjuNDS0ud7FlAv8-0Lev8mCaRCKUk6Nawn7cvlRjOfotX7ASrjQhY5P7jKw8wIXhTfN"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Elegant online status indicator dot */}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-1.5 border-white dark:border-surface rounded-full shadow-sm"></span>
          </div>

          <div className="flex flex-col text-left">
            <span className="font-display font-black text-sm text-primary leading-none">
              Hi, Aryan
            </span>
            <span className="text-[9px] font-mono font-bold text-on-surface-variant flex items-center gap-1 mt-1 leading-none">
              IIT Delhi
              <ShieldCheck className="w-3.5 h-3.5 text-primary fill-primary-fixed" />
            </span>
          </div>
        </div>

        {/* Brand visual header name */}
        <h1 className="font-display font-extrabold text-[15px] text-primary uppercase tracking-wider absolute left-1/2 -translate-x-1/2">
          Veil
        </h1>

        {/* Notifications and messages indicators */}
        <button className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container-low hover:bg-surface-container-high transition-colors active:scale-95 duration-100 relative shrink-0">
          <Bell className="w-4.5 h-4.5 text-primary" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full animate-pulse border border-white"></span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-md mx-auto px-4 py-5 text-left overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + (isTabLoading ? '-loading' : '-loaded')}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="w-full"
          >
            {isTabLoading ? (
              <TabSkeleton activeTab={activeTab} />
            ) : (
              renderTabContent()
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Glassmorphic Bottom Navigation Bar */}
      <nav className="fixed bottom-5 left-5 right-5 z-40 flex justify-around items-center h-16 px-2 bg-white/90 dark:bg-surface-container/90 backdrop-blur-2xl border border-outline-variant/15 dark:border-outline/30 rounded-full shadow-2xl max-w-sm mx-auto">
        {/* Tab 1: HOME */}
        <button 
          onClick={() => { triggerHaptic(); setActiveTab('HOME'); }}
          className={`flex flex-col items-center justify-center p-2 rounded-full duration-150 transition-all cursor-pointer ${
            activeTab === 'HOME'
              ? 'bg-primary text-white shadow-md shadow-primary/20 scale-110 -translate-y-2'
              : 'text-on-surface-variant/80 hover:bg-surface-container/40'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[8px] font-display font-bold uppercase mt-0.5 tracking-wider">Home</span>
        </button>

        {/* Tab 2: SEARCH */}
        <button 
          onClick={() => { triggerHaptic(); setActiveTab('SEARCH'); }}
          className={`flex flex-col items-center justify-center p-2 rounded-full duration-150 transition-all cursor-pointer ${
            activeTab === 'SEARCH'
              ? 'bg-primary text-white shadow-md shadow-primary/20 scale-110 -translate-y-2'
              : 'text-on-surface-variant/80 hover:bg-surface-container/40'
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[8px] font-display font-bold uppercase mt-0.5 tracking-wider">Search</span>
        </button>

        {/* Tab 3: BLIND DATE */}
        <button 
          onClick={() => { triggerHaptic(); setActiveTab('BLIND_DATE'); }}
          className={`flex flex-col items-center justify-center p-2 rounded-full duration-150 transition-all cursor-pointer ${
            activeTab === 'BLIND_DATE'
              ? 'bg-primary text-white shadow-md shadow-primary/20 scale-110 -translate-y-2'
              : 'text-on-surface-variant/80 hover:bg-surface-container/40'
          }`}
        >
          <Heart className="w-5 h-5" />
          <span className="text-[8px] font-display font-bold uppercase mt-0.5 tracking-wider">Match</span>
        </button>

        {/* Tab 4: RIDES */}
        <button 
          onClick={() => { triggerHaptic(); setActiveTab('RIDES'); }}
          className={`flex flex-col items-center justify-center p-2 rounded-full duration-150 transition-all cursor-pointer ${
            activeTab === 'RIDES'
              ? 'bg-primary text-white shadow-md shadow-primary/20 scale-110 -translate-y-2'
              : 'text-on-surface-variant/80 hover:bg-surface-container/40'
          }`}
        >
          <Car className="w-5 h-5" />
          <span className="text-[8px] font-display font-bold uppercase mt-0.5 tracking-wider">Rides</span>
        </button>

        {/* Tab 5: PROFILE */}
        <button 
          onClick={() => { triggerHaptic(); setActiveTab('PROFILE'); }}
          className={`flex flex-col items-center justify-center p-2 rounded-full duration-150 transition-all cursor-pointer ${
            activeTab === 'PROFILE'
              ? 'bg-primary text-white shadow-md shadow-primary/20 scale-110 -translate-y-2'
              : 'text-on-surface-variant/80 hover:bg-surface-container/40'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[8px] font-display font-bold uppercase mt-0.5 tracking-wider">Profile</span>
        </button>
      </nav>
    </div>
  );
}
