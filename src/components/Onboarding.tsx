import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Shield, Calendar, UserRound, ArrowRight, CheckCircle2, 
  BookOpen, Sparkles, Trophy, Heart, Coffee, Palette, Accessibility, 
  HelpCircle, Headphones, Compass, Terminal, ShieldCheck 
} from 'lucide-react';
import { OnboardingStep, VerifyMethod } from '../types';

export const PERSONALITY_QUESTIONS = [
  {
    id: 'q1',
    text: "What's your perfect Friday night?",
    options: [
      { text: 'Quiet dinner with close campus friends', scores: { socialResonance: 65, intellectualDepth: 80, spontaneity: 50 } },
      { text: 'High-energy hostel or house party', scores: { socialResonance: 95, intellectualDepth: 55, spontaneity: 85 } },
      { text: 'Late-night drive and deep talks', scores: { socialResonance: 75, intellectualDepth: 90, spontaneity: 70 } },
      { text: 'Grinding a pet project or gaming solo', scores: { socialResonance: 35, intellectualDepth: 95, spontaneity: 40 } }
    ]
  },
  {
    id: 'q2',
    text: "When assigned a complex group project, you usually...",
    options: [
      { text: 'Take charge, coordinate tasks, and keep everyone styled', scores: { socialResonance: 90, intellectualDepth: 75, spontaneity: 45 } },
      { text: 'Do the deep research and heavy technical code in silence', scores: { socialResonance: 45, intellectualDepth: 98, spontaneity: 35 } },
      { text: 'Pitch creative, wild ideas and skip the routine stuff', scores: { socialResonance: 80, intellectualDepth: 85, spontaneity: 90 } },
      { text: 'Support the team and mediate any disagreements', scores: { socialResonance: 85, intellectualDepth: 70, spontaneity: 55 } }
    ]
  },
  {
    id: 'q3',
    text: "An 8:00 AM lecture is suddenly canceled. What do you do?",
    options: [
      { text: 'Go back to sleep immediately – absolute bliss', scores: { socialResonance: 40, intellectualDepth: 60, spontaneity: 75 } },
      { text: 'Grab a double espresso and hit the library lounge', scores: { socialResonance: 50, intellectualDepth: 95, spontaneity: 35 } },
      { text: 'Gather friends for a spontaneous breakfast walk', scores: { socialResonance: 95, intellectualDepth: 65, spontaneity: 90 } },
      { text: 'Open my laptop to work on my personal side hustle', scores: { socialResonance: 45, intellectualDepth: 90, spontaneity: 60 } }
    ]
  },
  {
    id: 'q4',
    text: "Which conversation topic keeps you awake until 3:00 AM?",
    options: [
      { text: 'Simulation theory, AI ethics, and cosmology', scores: { socialResonance: 60, intellectualDepth: 99, spontaneity: 65 } },
      { text: 'Juicy campus confessions, secrets, and relationship vibes', scores: { socialResonance: 95, intellectualDepth: 60, spontaneity: 80 } },
      { text: 'Underrated indie bands, vinyl, and design philosophy', scores: { socialResonance: 75, intellectualDepth: 85, spontaneity: 85 } },
      { text: 'Startups, Web3/FinTech, and changing the world before graduation', scores: { socialResonance: 70, intellectualDepth: 90, spontaneity: 70 } }
    ]
  },
  {
    id: 'q5',
    text: "How do you make big decisions (like majors or flats)?",
    options: [
      { text: 'Rigorous pros/cons spreadsheet with calculated weightage', scores: { socialResonance: 40, intellectualDepth: 95, spontaneity: 30 } },
      { text: 'Listen to my gut feeling and vibe of the moment', scores: { socialResonance: 75, intellectualDepth: 75, spontaneity: 95 } },
      { text: 'Consult my trusted inner circle of friends and mentors', scores: { socialResonance: 92, intellectualDepth: 80, spontaneity: 55 } },
      { text: 'Flip a coin or say "we\'ll figure it out as we go!"', scores: { socialResonance: 60, intellectualDepth: 65, spontaneity: 98 } }
    ]
  }
];

interface OnboardingProps {
  onComplete: (verifyMethod: string) => void;
  onBackToSplash: () => void;
}

export default function Onboarding({ onComplete, onBackToSplash }: OnboardingProps) {
  const [step, setStep] = useState<number>(1);
  const [method, setMethod] = useState<VerifyMethod>('SHEERID');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [selectedVibes, setSelectedVibes] = useState<string[]>(['Creative']);
  const [selectedFridayOption, setSelectedFridayOption] = useState<string>('');
  
  // Progressive questions state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<number[]>([]);

  // Dynamic targeting calculated from personality choices
  const [targetSocialRes, setTargetSocialRes] = useState<number>(82);
  const [targetIntelDepth, setTargetIntelDepth] = useState<number>(94);
  const [targetSpontaneity, setTargetSpontaneity] = useState<number>(65);
  const [isAnalyzingComplete, setIsAnalyzingComplete] = useState<boolean>(false);

  // Progress score bars for step 4
  const [socialRes, setSocialRes] = useState(10);
  const [intelDepth, setIntelDepth] = useState(15);
  const [spontaneity, setSpontaneity] = useState(8);

  useEffect(() => {
    if (step === 4) {
      // Reset calculations slightly prior to animation start
      setSocialRes(8);
      setIntelDepth(12);
      setSpontaneity(5);
      setIsAnalyzingComplete(false);

      const interval = setInterval(() => {
        let done = true;
        setSocialRes(p => {
          if (p >= targetSocialRes) return targetSocialRes;
          done = false;
          return Math.min(targetSocialRes, p + Math.floor(Math.random() * 6) + 2);
        });
        setIntelDepth(p => {
          if (p >= targetIntelDepth) return targetIntelDepth;
          done = false;
          return Math.min(targetIntelDepth, p + Math.floor(Math.random() * 6) + 2);
        });
        setSpontaneity(p => {
          if (p >= targetSpontaneity) return targetSpontaneity;
          done = false;
          return Math.min(targetSpontaneity, p + Math.floor(Math.random() * 6) + 2);
        });

        if (done) {
          setIsAnalyzingComplete(true);
          clearInterval(interval);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [step, targetSocialRes, targetIntelDepth, targetSpontaneity]);

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setStep(2); // Move to personality quiz after brief mock verification delay!
    }, 1800);
  };

  const handleOptionSelect = (optionIdx: number) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = optionIdx;
    setAnswers(updatedAnswers);

    setTimeout(() => {
      if (currentQuestionIndex < PERSONALITY_QUESTIONS.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        // Calculate the actual scores based on answers!
        const totalQuestions = PERSONALITY_QUESTIONS.length;
        let sumSocial = 0;
        let sumIntel = 0;
        let sumSpon = 0;

        updatedAnswers.forEach((selectedOptId, qIdx) => {
          const score = PERSONALITY_QUESTIONS[qIdx].options[selectedOptId].scores;
          sumSocial += score.socialResonance;
          sumIntel += score.intellectualDepth;
          sumSpon += score.spontaneity;
        });

        const calculatedSocial = Math.round(sumSocial / totalQuestions);
        const calculatedIntel = Math.round(sumIntel / totalQuestions);
        const calculatedSpon = Math.round(sumSpon / totalQuestions);

        setTargetSocialRes(calculatedSocial);
        setTargetIntelDepth(calculatedIntel);
        setTargetSpontaneity(calculatedSpon);

        // Save first answer in local storage to prevent breaking any existing legacy references
        const firstAnswerText = PERSONALITY_QUESTIONS[0].options[updatedAnswers[0]].text;
        setSelectedFridayOption(firstAnswerText);
        localStorage.setItem('veil_friday_option', firstAnswerText);

        setStep(3); // Advance to step 3 (describe your vibe)
      }
    }, 350);
  };

  const handleFridayOptionSelect = (option: string) => {
    setSelectedFridayOption(option);
    setTimeout(() => {
      setStep(3); // Advance to step 3
    }, 450);
  };

  const toggleVibe = (vibe: string) => {
    if (selectedVibes.includes(vibe)) {
      setSelectedVibes(selectedVibes.filter(v => v !== vibe));
    } else {
      setSelectedVibes([...selectedVibes, vibe]);
    }
  };

  const handleBack = () => {
    if (step === 2 && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (step === 1) {
      onBackToSplash();
    } else {
      setStep(step - 1);
      if (step === 3) {
        setCurrentQuestionIndex(PERSONALITY_QUESTIONS.length - 1);
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-white text-on-surface flex flex-col relative select-none">
      {/* Background radial atmosphere */}
      <div className="absolute inset-0 premium-gradient-bg pointer-events-none"></div>

      {/* Top sticky app header */}
      <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 flex justify-between items-center px-5 py-4 border-b border-surface-container/40">
        <div className="flex items-center gap-3">
          <button 
            onClick={handleBack}
            className="p-2 hover:bg-surface-container-high/50 rounded-full transition-colors active:scale-95 duration-200"
          >
            <ArrowLeft className="w-5 h-5 text-primary" />
          </button>
          <h1 className="font-display font-black text-lg tracking-wider text-primary uppercase">
            Veil
          </h1>
        </div>
        <div>
          <span className="font-mono text-xs tracking-wider bg-primary-fixed text-on-primary-fixed-variant px-2.5 py-1 rounded-full font-semibold uppercase">
            STEP 0{step}/04
          </span>
        </div>
      </header>

      {/* Main Container Content */}
      <main className="flex-1 max-w-lg mx-auto w-full px-5 pt-6 pb-36 relative z-10">
        
        {/* Progress bar animation */}
        <div className="w-full h-1.5 bg-surface-container rounded-full mb-8 overflow-hidden">
          <div 
            className="h-full crimson-gradient transition-all duration-500 ease-in-out"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* STEP 1: IDENTITY VERIFICATION */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center md:text-left space-y-1.5">
              <h2 className="font-display font-bold text-2xl tracking-tight text-on-surface">
                Verify Your Identity
              </h2>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Choose a verification method to unlock exclusive campus matchmaking and ride shares.
              </p>
            </div>

            {/* Benefit Highlight Container */}
            <div className="glass-card card-shadow p-4 rounded-2xl border border-outline-variant/30 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-xs font-bold text-primary uppercase tracking-wider">
                  Verified Student Circle
                </h3>
                <p className="text-xs text-on-surface-variant leading-tight mt-0.5">
                  Exclusive access to university-only blind dates, campus feed polls, and ride shares.
                </p>
              </div>
            </div>

            {/* Selection Options */}
            <div className="space-y-4">
              <label 
                className={`block cursor-pointer group rounded-2xl transition-all duration-300 ${
                  method === 'SHEERID' 
                    ? 'border-2 border-primary bg-primary-fixed/20 shadow-sm' 
                    : 'border border-outline-variant/30 bg-white/75 hover:bg-surface-container-low'
                }`}
                onClick={() => setMethod('SHEERID')}
              >
                <div className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                      <BookOpen className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-display text-sm font-bold text-on-surface">
                        SheerID Verification
                      </h4>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        Instant check using university credentials login
                      </p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    method === 'SHEERID' ? 'border-primary' : 'border-outline'
                  }`}>
                    {method === 'SHEERID' && <div className="w-3 h-3 rounded-full bg-primary" />}
                  </div>
                </div>
              </label>

              <label 
                className={`block cursor-pointer group rounded-2xl transition-all duration-300 ${
                  method === 'COLLEGE_ID' 
                    ? 'border-2 border-primary bg-primary-fixed/20 shadow-sm' 
                    : 'border border-outline-variant/30 bg-white/75 hover:bg-surface-container-low'
                }`}
                onClick={() => setMethod('COLLEGE_ID')}
              >
                <div className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                      <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-display text-sm font-bold text-on-surface">
                        Upload College ID Card
                      </h4>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        Manual verification overview within 24 hours
                      </p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    method === 'COLLEGE_ID' ? 'border-primary' : 'border-outline'
                  }`}>
                    {method === 'COLLEGE_ID' && <div className="w-3 h-3 rounded-full bg-primary" />}
                  </div>
                </div>
              </label>
            </div>

            {/* Dynamic Campus Library Graphic */}
            <div className="rounded-2xl overflow-hidden shadow-md h-40 relative group border border-outline-variant/20">
              <img 
                loading="lazy"
                alt="College Campus Library" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAep6kYZAKmqy3vqt9HHBuxCveNVoPk31TMIyFXhGt-xj7bOTZwDKrycoi9s5tQG80qb2N0vNLTfWbsRT7gZieRt2RzQOcBYwqTEWep1NA1XQvviLMAFSeTubEzUxdHx_0rhl9dYa4xmpqRk2lSD7p7NlZFOYckWR4jzzIYjgnlVWl2V-b-zHemIQBAUiFmQat7DmnK9SWLICz4I59nYVtKKZ6Y0y6aXwoXNwoAaNS_Rr5qVa6UuvPNA8KDoMF3PmisPCvGKdHfKbfP"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-primary/25 to-transparent"></div>
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"></span>
                <span className="font-display font-semibold text-xs text-white drop-shadow-sm uppercase tracking-wide">
                  1,240 students verified today
                </span>
              </div>
            </div>
          </div>
        )}        {/* STEP 2: MULTI-QUESTION PERSONALITY MATCHING */}
        {step === 2 && (() => {
          const currentQuestion = PERSONALITY_QUESTIONS[currentQuestionIndex];
          const selectedOption = answers[currentQuestionIndex];

          return (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <h2 className="font-display font-bold text-2xl text-on-surface">
                    Find Your Match
                  </h2>
                  <span className="font-mono text-xs font-bold text-primary bg-primary-fixed px-2.5 py-1 rounded-full uppercase">
                    Q: {currentQuestionIndex + 1} / {PERSONALITY_QUESTIONS.length}
                  </span>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Let's decode your personality to find someone who actually gets you.
                </p>
              </div>

              {/* Progress Tick Line for Questions */}
              <div className="w-full flex gap-1 h-1.5 bg-surface-container rounded-full overflow-hidden">
                {PERSONALITY_QUESTIONS.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`h-full flex-1 transition-all duration-300 ${
                      idx <= currentQuestionIndex ? 'crimson-gradient' : 'bg-surface-container-high'
                    }`}
                  />
                ))}
              </div>

              <div className="glass-card card-shadow rounded-2xl p-6 border border-outline-variant/20 space-y-5">
                <p className="font-display text-base font-bold text-on-surface leading-snug">
                  {currentQuestion.text}
                </p>
                
                <div className="space-y-2.5">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = selectedOption === idx;
                    return (
                      <button 
                        key={idx}
                        onClick={() => handleOptionSelect(idx)}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 text-left cursor-pointer ${
                          isSelected 
                            ? 'border-primary bg-primary/5 text-primary font-semibold shadow-sm' 
                            : 'border-surface-container bg-white/50 hover:bg-surface-container-low text-on-surface hover:border-primary-fixed'
                        }`}
                      >
                        <span className="text-xs font-semibold leading-relaxed pr-2">{option.text}</span>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-primary bg-primary text-white font-bold' : 'border-outline'
                        }`}>
                          {isSelected && <span className="text-[10px]">✓</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Internal previous button */}
              {currentQuestionIndex > 0 && (
                <button
                  onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous Question</span>
                </button>
              )}
            </div>
          );
        })()}

        {/* STEP 3: SELECT YOUR VIBE */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-left space-y-1">
              <h2 className="font-display font-bold text-2xl text-on-surface">
                Describe Your Vibe
              </h2>
              <p className="text-sm text-on-surface-variant">
                Select your major interests and lifestyle preferences. This filters matching compatibility.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Caffeinated', emoji: '☕️', color: 'bg-amber-500/10 text-amber-700' },
                { label: 'Creative', emoji: '🎨', color: 'bg-rose-500/10 text-rose-700' },
                { label: 'Active', emoji: '👟', color: 'bg-blue-500/10 text-blue-700' },
                { label: 'Academic', emoji: '📚', color: 'bg-emerald-500/10 text-emerald-700' },
                { label: 'Audiophile', emoji: '🎧', color: 'bg-purple-500/10 text-purple-700' },
                { label: 'Dreamer', emoji: '🌌', color: 'bg-indigo-500/10 text-indigo-700' },
                { label: 'Competitive', emoji: '🏆', color: 'bg-amber-500/15 text-yellow-800' },
                { label: 'Chess Master', emoji: '♟️', color: 'bg-stone-500/10 text-stone-700' },
                { label: 'Deep Tech', emoji: '💻', color: 'bg-sky-500/10 text-sky-700' }
              ].map((v, i) => {
                const isActive = selectedVibes.includes(v.label);
                return (
                  <button
                    key={i}
                    onClick={() => toggleVibe(v.label)}
                    className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all duration-150 ${
                      isActive 
                        ? 'bg-primary text-white scale-[0.98] border border-primary font-semibold shadow-md shadow-primary/10' 
                        : 'bg-white hover:bg-surface-container-low border border-outline-variant/30 text-on-surface'
                    }`}
                  >
                    <span className="text-2xl">{v.emoji}</span>
                    <span className="text-xs uppercase tracking-wider font-semibold font-display">
                      {v.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="pt-4">
              <button
                onClick={() => setStep(4)}
                className="crimson-gradient w-full py-3.5 rounded-full text-white font-display font-semibold transition-all shadow-lg shadow-primary/20 hover:brightness-105 active:scale-95 flex items-center justify-center gap-2"
              >
                Continue to Assessment
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: DECODING YOUR VEIL PROGRESS METRICS */}
        {step === 4 && (
          <div className="space-y-6 text-center py-6">
            <div className="relative h-44 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 crimson-gradient opacity-15 rounded-full animate-ping"></div>
              </div>
              <div className="relative z-10 glass-card card-shadow w-24 h-24 rounded-full flex items-center justify-center border border-primary/20">
                <Heart className="w-10 h-10 text-primary animate-pulse" />
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="font-display font-bold text-2xl text-on-surface tracking-tight">
                Decoding Your Veil...
              </h2>
              <p className="text-xs text-on-surface-variant max-w-xs mx-auto">
                Analyzing credentials verification status and matchmaking parameters with real-time feedback loops.
              </p>
            </div>

            <div className="glass-card card-shadow rounded-2xl p-5 border border-outline-variant/20 space-y-4 text-left">
              {/* SOCIAL RESONANCE */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono font-semibold text-on-surface-variant">
                  <span>SOCIAL RESONANCE</span>
                  <span className="text-primary font-bold">{socialRes}%</span>
                </div>
                <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                  <div 
                    className="h-full crimson-gradient transition-all duration-300"
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
                    className="h-full crimson-gradient transition-all duration-300"
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
                    className="h-full crimson-gradient transition-all duration-300"
                    style={{ width: `${spontaneity}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => {
                  localStorage.setItem('veil_social_resonance', String(targetSocialRes));
                  localStorage.setItem('veil_intellectual_depth', String(targetIntelDepth));
                  localStorage.setItem('veil_spontaneity', String(targetSpontaneity));
                  onComplete(method);
                }}
                disabled={!isAnalyzingComplete}
                className={`w-full py-4 rounded-full font-display font-bold transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
                  isAnalyzingComplete 
                    ? 'crimson-gradient text-white shadow-primary/20 hover:brightness-105 active:scale-95' 
                    : 'bg-surface-container-high text-on-surface-variant cursor-not-allowed opacity-60'
                }`}
              >
                {isAnalyzingComplete ? 'Complete Assessment' : 'Synthesizing Compatibility Profile...'}
                {isAnalyzingComplete && <ArrowRight className="w-5 h-5" />}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Persistent Bottom Action/Terms Bar on Step 1 */}
      {step === 1 && (
        <footer className="p-5 bg-white/80 backdrop-blur-xl border-t border-surface-container/40 fixed bottom-0 left-0 right-0 z-40">
          <button 
            onClick={handleVerify}
            disabled={isVerifying}
            className="crimson-gradient w-full py-3.5 rounded-full font-display font-semibold text-white shadow-lg shadow-primary/25 hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {isVerifying ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Verifying Credentials via SheerID...
              </span>
            ) : (
              'Verify & Start Matching'
            )}
          </button>
          <p className="text-center text-[11px] text-on-surface-variant/70 mt-3 px-6 leading-relaxed">
            By continuing, you agree to our <span className="text-primary font-semibold underline underline-offset-4 cursor-pointer">Academic Integrity Terms</span> and Honor Code.
          </p>
        </footer>
      )}
    </div>
  );
}
