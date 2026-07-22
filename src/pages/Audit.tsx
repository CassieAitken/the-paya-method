import { useState, useEffect, useRef } from 'react';
import { foundations, type FrequencyLevel } from '../data/foundations';
import { Icons } from '../components/Icons';
import type { DogData } from '../App';

export interface RitualFrequencies {
  [ritualId: string]: FrequencyLevel;
}

const SOULFUL_SCALE_FALLBACK = {
  resilient: "A steady, natural rhythm of ease",
  whispering: "Occasional or seasonal signs of subtle noise",
  burdened: "Systemic fatigue calling for deep, active clearing",
};

const AUDIT_PHASES: Record<number, { name: string; desc: string }> = {
  1: { name: "The Nourished Spark", desc: "Nourishment, digestion, and physiological baseline" },
  2: { name: "The Healing Sanctuary", desc: "Sleep recovery and environmental purification" },
  3: { name: "The Instinctive Bond", desc: "Nervous balance, cognition, and movement symmetry" },
};

function getPhaseId(pillarIndex: number): number {
  if (pillarIndex === 0 || pillarIndex === 6) return 1;
  if (pillarIndex === 1 || pillarIndex === 2) return 2;
  return 3;
}

export function Audit({
  currentFoundation,
  setCurrentFoundation,
  selectedRituals,
  setSelectedRituals,
  setStep,
  dogData,
}: {
  currentFoundation: number;
  setCurrentFoundation: (n: number) => void;
  selectedRituals: RitualFrequencies;
  setSelectedRituals: (rituals: RitualFrequencies) => void;
  setStep: (step: string) => void;
  dogData: DogData;
}) {
  const foundation = foundations[currentFoundation];
  const rituals = foundation.rituals;
  const CurrentPhaseIcon = foundation?.Icon || Icons.Activity;
  const currentPhaseId = getPhaseId(currentFoundation);

  const getInitialQuestion = () => {
    const firstUnanswered = rituals.findIndex((r: any) => !selectedRituals[r.id]);
    return firstUnanswered === -1 ? rituals.length - 1 : firstUnanswered;
  };

  const [currentQuestion, setCurrentQuestion] = useState(getInitialQuestion);
  const [animating, setAnimating] = useState(false);
  const [slideDir, setSlideDir] = useState<'forward' | 'back'>('forward');
  const [showPhaseTransition, setShowPhaseTransition] = useState(false);
  const [completedPhaseId, setCompletedPhaseId] = useState(0);
  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isAdvancing = useRef(false);

  useEffect(() => {
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = null;
    }
    isAdvancing.current = false;
    setCurrentQuestion(getInitialQuestion());
    setAnimating(false);
  }, [currentFoundation]);

  const ritual = rituals[currentQuestion];
  const currentFrequency = selectedRituals[ritual?.id] || null;

  const totalQuestions = foundations.reduce((sum: number, f: any) => sum + f.rituals.length, 0);
  const answeredTotal = Object.values(selectedRituals).filter(f => f != null).length;


  const advanceQuestion = (dir: 'forward' | 'back') => {
    if (isAdvancing.current) return;
    isAdvancing.current = true;
    setSlideDir(dir);
    setAnimating(true);
    setTimeout(() => {
      if (dir === 'forward') {
        if (currentQuestion < rituals.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
        } else {
          if (currentFoundation === foundations.length - 1) {
            setStep('reflection');
          } else {
            const nextFoundation = currentFoundation + 1;
            const currentPhase = getPhaseId(currentFoundation);
            const nextPhase = getPhaseId(nextFoundation);
            if (nextPhase !== currentPhase && nextPhase > currentPhase) {
              setCompletedPhaseId(currentPhase);
              setShowPhaseTransition(true);
            } else {
              setCurrentFoundation(nextFoundation);
            }
          }
          window.scrollTo(0, 0);
        }
      } else {
        if (currentQuestion > 0) {
          setCurrentQuestion(currentQuestion - 1);
        } else {
          if (currentFoundation === 0) {
            setStep('intake');
          } else {
            setCurrentFoundation(currentFoundation - 1);
          }
          window.scrollTo(0, 0);
        }
      }
      setAnimating(false);
      isAdvancing.current = false;
    }, 220);
  };

  const handleSelect = (option: FrequencyLevel) => {
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = null;
    }
    setSelectedRituals({ ...selectedRituals, [ritual.id]: option });
    autoAdvanceTimer.current = setTimeout(() => {
      if (!isAdvancing.current) {
        advanceQuestion('forward');
      }
    }, 350);
  };

  useEffect(() => {
    return () => {
      if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    };
  }, []);

  const isLastQuestion = currentQuestion === rituals.length - 1;
  const isLastPillar = currentFoundation === foundations.length - 1;
  const canAdvanceManually = !!currentFrequency;
  const overallProgress = Math.round((answeredTotal / totalQuestions) * 100);

  // Phase-level progress for the 3 broad phases
  const phaseProgress = [1, 2, 3].map(phaseId => {
    let total = 0;
    let answered = 0;
    foundations.forEach((f: any, idx: number) => {
      if (getPhaseId(idx) === phaseId) {
        total += f.rituals.length;
        answered += f.rituals.filter((r: any) => selectedRituals[r.id] != null).length;
      }
    });
    return { total, answered, pct: total > 0 ? Math.round((answered / total) * 100) : 0 };
  });

  const PHASE_CELEBRATIONS: Record<number, string> = {
    1: `Beautiful — ${dogData.name || 'your companion'}'s nourishment picture is clear.`,
    2: `Wonderful — ${dogData.name || 'your companion'}'s healing environment is mapped.`,
    3: `Complete — ${dogData.name || 'your companion'}'s instinctive portrait is whole.`,
  };

  if (showPhaseTransition) {
    const nextPhaseId = completedPhaseId + 1;
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center animate-[fade-in_0.4s_ease-out]">
          <div className="w-16 h-16 rounded-full bg-[#0A4682]/[0.03] flex items-center justify-center mx-auto mb-6">
            <Icons.Check size={28} strokeWidth={2} className="text-[#0A4682]" />
          </div>
          <p className="text-[10px] uppercase tracking-[0.15em] text-[#0A4682] mb-3">
            Phase {completedPhaseId} Complete
          </p>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#2A2421] mb-3 tracking-tight">
            {AUDIT_PHASES[completedPhaseId].name}
          </h2>
          <p className="text-sm text-[#8A7F72] font-light leading-relaxed mb-8">
            {PHASE_CELEBRATIONS[completedPhaseId]}
          </p>
          <div className="border-t border-[#E8E2D9] pt-6 mb-6">
            <p className="text-[10px] uppercase tracking-[0.15em] text-[#8A7F72]/40 mb-1">Up Next</p>
            <p className="text-lg font-serif text-[#2A2421]">{AUDIT_PHASES[nextPhaseId]?.name}</p>
            <p className="text-xs text-[#8A7F72]/50 font-light mt-1">{AUDIT_PHASES[nextPhaseId]?.desc}</p>
          </div>
          <button
            onClick={() => {
              setShowPhaseTransition(false);
              const nextFoundation = foundations.findIndex((_: any, idx: number) => getPhaseId(idx) === nextPhaseId);
              if (nextFoundation !== -1) setCurrentFoundation(nextFoundation);
              window.scrollTo(0, 0);
            }}
            className="bg-[#0A4682] text-white px-8 py-3.5 text-[10px] uppercase tracking-[0.15em] font-bold hover:bg-[#083A6D] transition-colors inline-flex items-center gap-2"
          >
            Continue
            <Icons.ChevronRight size={16} strokeWidth={2} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
      {/* Sticky progress header */}
      <div className="sticky top-0 z-30 bg-[#FDFBF7]/95 backdrop-blur-sm border-b border-[#E8E2D9] px-4 py-3">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-2.5">
            {[1, 2, 3].map((phaseId) => {
              const isActive = currentPhaseId === phaseId;
              const isComplete = phaseProgress[phaseId - 1].pct === 100;
              return (
                <div
                  key={phaseId}
                  className={`flex-1 flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.15em] whitespace-nowrap transition-all duration-300 ${
                    isActive
                      ? 'bg-[#4B1D5C] text-white'
                      : isComplete
                      ? 'bg-[#0A4682]/[0.03] text-[#0A4682] border border-[#0A4682]/30'
                      : 'bg-white text-[#8A7F72] border border-[#E8E2D9]'
                  }`}
                >
                  <span className="hidden sm:inline truncate">{AUDIT_PHASES[phaseId].name}</span>
                  <span className="sm:hidden">Phase {phaseId}</span>
                  {isComplete && <Icons.Check size={8} strokeWidth={3} className="text-[#0A4682]" />}
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-[#E8E2D9] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0A4682] rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-2xl">

          {/* Phase header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] text-[#8A7F72]">
                <CurrentPhaseIcon size={11} strokeWidth={1.5} />
                Phase {currentPhaseId} of 3 — {AUDIT_PHASES[currentPhaseId].name}
              </span>
            </div>
            <div className="bg-[#4B1D5C] text-white p-5 sm:p-7">
              <p className="text-[10px] uppercase tracking-[0.15em] text-white/50 mb-3 flex items-center gap-2">
                <Icons.Waves size={11} strokeWidth={1.5} /> The Soul Mirror
              </p>
              <p className="text-sm sm:text-base leading-[1.8] text-white/85 font-light">
                {foundation.dogNote(dogData.name || 'Your Companion')}
              </p>
              <div className="flex items-center gap-1.5 mt-4 pt-4 border-t border-white/10">
                <Icons.Heart size={12} className="text-rose-300 fill-current flex-shrink-0" />
                <p className="text-xs font-serif text-white/70">{dogData.name || 'Your Companion'}</p>
              </div>
            </div>
          </div>

          {/* Question card */}
          <div
            className={`transition-all duration-200 ${
              animating
                ? slideDir === 'forward'
                  ? 'opacity-0 translate-x-4'
                  : 'opacity-0 -translate-x-4'
                : 'opacity-100 translate-x-0'
            }`}
          >
            {/* Progress dots */}
            <div className="flex justify-end mb-3">
              <div className="flex gap-1">
                {rituals.map((_: any, i: number) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      i < currentQuestion
                        ? 'bg-[#0A4682] w-4'
                        : i === currentQuestion
                        ? 'bg-[#4B1D5C] w-6'
                        : 'bg-stone-200/80 w-3'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Question text */}
            <div className="bg-white/60 border border-[#E8E2D9] p-6 sm:p-8 mb-4">
              <h3 className="text-xl sm:text-2xl font-serif text-[#2A2421] leading-[1.3] mb-2 tracking-tight">
                {ritual?.label}
              </h3>
              <p className="text-sm text-[#8A7F72] leading-[1.7] font-light">
                {ritual?.desc(dogData.name || 'your dog')}
              </p>
            </div>

            {/* Answer tap cards — 3-point Soulful Scale */}
            <div className="space-y-2.5">
              {(['resilient', 'whispering', 'burdened'] as FrequencyLevel[]).map((level) => {
                const scale = foundation.scale || SOULFUL_SCALE_FALLBACK;
                const isSelected = currentFrequency === level;
                const label = level.charAt(0).toUpperCase() + level.slice(1);
                return (
                  <button
                    key={level}
                    onClick={() => handleSelect(level)}
                    className={`w-full flex items-center justify-between px-5 py-4 border-2 transition-all duration-150 text-left group ${
                      isSelected
                        ? 'border-[#0A4682] bg-[#0A4682]/5'
                        : 'border-[#E8E2D9] bg-white/60 hover:border-stone-300/80'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        isSelected
                          ? 'border-[#0A4682] bg-[#0A4682]'
                          : 'border-stone-300/80 group-hover:border-stone-400'
                      }`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <div>
                        <p className={`font-medium text-sm transition-colors ${
                          isSelected ? 'text-[#2A2421]' : 'text-[#2A2421]'
                        }`}>
                          {label}
                        </p>
                        <p className={`text-xs font-light mt-0.5 transition-colors ${
                          isSelected ? 'text-[#5C534E]' : 'text-[#6B6159]'
                        }`}>
                          {scale[level]}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <Icons.Check size={16} strokeWidth={2.5} className="text-[#0A4682] flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation row */}
          <div className="flex items-center justify-between mt-6 pt-5 border-t border-[#E8E2D9]">
            <button
              onClick={() => advanceQuestion('back')}
              className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-[#8A7F72]/50 hover:text-[#2A2421] transition-colors py-2"
            >
              <Icons.ChevronLeft size={14} strokeWidth={2} />
              Back
            </button>

            <div className="flex items-center gap-3">
              {import.meta.env.DEV && (
                <button
                  onClick={() => {
                    const filled: Record<string, FrequencyLevel> = { ...selectedRituals };
                    const testScores: FrequencyLevel[] = ['resilient', 'whispering', 'resilient', 'whispering', 'resilient', 'burdened', 'resilient'];
                    let idx = 0;
                    foundations.forEach((f: any) => {
                      f.rituals.forEach((r: any) => {
                        if (!filled[r.id]) filled[r.id] = testScores[idx % testScores.length];
                        idx++;
                      });
                    });
                    setSelectedRituals(filled);
                    setStep('reflection');
                    window.scrollTo(0, 0);
                  }}
                  className="text-[10px] uppercase tracking-[0.15em] text-amber-600 border border-amber-300 px-3 py-1.5 rounded hover:bg-amber-50 transition-colors"
                >
                  Dev Skip
                </button>
              )}

              <button
                onClick={() => canAdvanceManually && advanceQuestion('forward')}
                disabled={!canAdvanceManually}
                className={`flex items-center gap-2 px-6 py-3 text-[10px] uppercase tracking-[0.15em] font-medium transition-all ${
                  canAdvanceManually
                    ? 'bg-[#0A4682] text-white hover:bg-[#344a35] hover:-translate-y-0.5'
                    : 'bg-stone-100 text-[#8A7F72]/30 cursor-not-allowed'
                }`}
              >
                {isLastQuestion && isLastPillar ? 'Complete' : isLastQuestion ? 'Next Phase' : 'Next'}
                <Icons.ChevronRight size={13} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Biological insight — subtle footer */}
          <div className="mt-8 pl-4 border-l-2 border-[#0A4682]/20">
            <p className="text-[10px] uppercase tracking-[0.15em] text-[#8A7F72]/40 mb-1.5 flex items-center gap-1.5">
              <Icons.Microscope size={10} strokeWidth={1.5} /> Biological Insight
            </p>
            <p className="text-xs text-[#8A7F72] leading-[1.7] font-light">
              {foundation.insight}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
