import { useState, useRef, useCallback } from 'react';
import { foundations, frequencyLabels, type FrequencyLevel } from '../data/foundations';
import { Icons } from '../components/Icons';
import type { DogData } from '../App';

export interface RitualFrequencies {
  [ritualId: string]: FrequencyLevel;
}

export function Audit({
  currentFoundation,
  setCurrentFoundation,
  selectedRituals,
  setSelectedRituals,
  setStep,
  dogData
}: {
  currentFoundation: number;
  setCurrentFoundation: (n: number) => void;
  selectedRituals: RitualFrequencies;
  setSelectedRituals: (rituals: RitualFrequencies) => void;
  setStep: (step: string) => void;
  dogData: DogData;
}) {
  const CurrentPhaseIcon = foundations[currentFoundation]?.Icon || Icons.Activity;
  const [validationError, setValidationError] = useState(false);
  const ritualRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const updateRitualFrequency = (ritualId: string, frequency: FrequencyLevel) => {
    setSelectedRituals({
      ...selectedRituals,
      [ritualId]: frequency
    });
    setValidationError(false);
  };

  const getUnansweredRituals = useCallback(() => {
    return foundations[currentFoundation].rituals.filter(
      (r: any) => !selectedRituals[r.id]
    );
  }, [currentFoundation, selectedRituals]);

  const handleAdvance = () => {
    const unanswered = getUnansweredRituals();
    if (unanswered.length > 0) {
      setValidationError(true);
      const firstId = unanswered[0].id;
      const el = ritualRefs.current[firstId];
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    setValidationError(false);
    if (currentFoundation === foundations.length - 1) setStep('reflection');
    else setCurrentFoundation(currentFoundation + 1);
    window.scrollTo(0, 0);
  };

  const frequencyOptions: FrequencyLevel[] = ['never', 'rarely', 'sometimes', 'often', 'daily'];

  return (
    <div className="min-h-screen py-24 animate-in-slow px-6">
      {/* Soul Mirror - Prominent Top Section */}
      <div className="max-w-6xl mx-auto mb-28">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          <div className="lg:col-span-1">
            <span className="text-[8px] font-mono uppercase text-stone-600 flex items-center gap-3 tracking-[0.35em] font-medium mb-6">
              <CurrentPhaseIcon size={18} strokeWidth={1.5} className="text-stone-700" /> Phase 0{currentFoundation + 1} of {foundations.length}
            </span>
            <h2 className="text-5xl sm:text-6xl lg:text-5xl font-serif text-stone-900 tracking-tight leading-[1.02]">
              {foundations[currentFoundation].title}
            </h2>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-stone-900 text-white p-12 relative shadow-[0_30px_80px_-15px_rgba(0,0,0,0.25)] overflow-hidden h-full flex flex-col justify-between rounded-lg">
              <div>
                <p className="text-[8px] font-mono uppercase tracking-[0.35em] text-stone-400 mb-6 flex items-center gap-3 relative z-10 font-medium">
                  <Icons.Waves size={14} className="text-stone-500" strokeWidth={1.5} /> The Soul Mirror
                </p>
                <p className="text-lg leading-[1.8] relative z-10 text-white font-light">
                  {foundations[currentFoundation].dogNote(dogData.name || 'Your Companion')}
                </p>
              </div>
              <div className="flex items-center justify-end gap-2 mt-6 pt-6 border-t border-stone-700 relative z-10">
                <Icons.Heart size={16} className="text-red-400 fill-current flex-shrink-0" />
                <p className="text-sm font-serif text-white font-light">
                  {dogData.name || 'Your Companion'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto grid lg:grid-cols-[1fr,520px] gap-20 items-start">
        {/* Left Column - Audit Content */}
        <div className="space-y-20">
          <div className="space-y-14 border-b border-stone-200/30 pb-20">
            <div className="pl-8 border-l-3 border-stone-700 py-4 space-y-10">
              <p className="text-stone-700 text-lg lg:text-xl leading-[1.8] font-light">
                {foundations[currentFoundation].guidance}
              </p>
              <div className="space-y-5">
                <p className="text-[8px] font-mono uppercase tracking-[0.35em] text-stone-600 mb-3 flex items-center gap-2.5 font-medium">
                  <Icons.Microscope size={14} strokeWidth={1.5} className="text-stone-700" /> The Biological Insight
                </p>
                <p className="text-stone-800 text-base lg:text-lg leading-[1.8] font-light">
                  {foundations[currentFoundation].insight}
                </p>
              </div>
            </div>
          </div>

          <div className="py-6 border-b border-stone-200/30">
            <p className="text-stone-700 text-sm leading-[1.8] font-light">
              Be honest. No judgment here — every answer shows us where your intentionality already lives and where the next <strong>Vitality Opportunity</strong> sits.
            </p>
          </div>

          <div className="divide-y divide-stone-200/20 space-y-2 pt-6">
            {foundations[currentFoundation].rituals.map((ritual: any) => {
              const currentFrequency = selectedRituals[ritual.id] || null;
              const isUnanswered = validationError && !currentFrequency;
              return (
                <div
                  key={ritual.id}
                  ref={(el) => { ritualRefs.current[ritual.id] = el; }}
                  className={`py-11 px-9 -mx-9 rounded-lg transition-all duration-300 ${
                    isUnanswered
                      ? 'bg-amber-50/80 ring-1 ring-amber-300/60'
                      : 'hover:bg-white/50'
                  }`}
                >
                  <div className="mb-6">
                    <h4 className="text-lg font-serif text-stone-900 mb-2 tracking-tight leading-[1.3]">{ritual.label}</h4>
                    <p className="text-sm leading-[1.8] font-light text-stone-700">
                      {ritual.desc(dogData.name || 'your dog')}
                    </p>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {frequencyOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => updateRitualFrequency(ritual.id, option)}
                        className={`py-3 px-2 text-[7.5px] font-mono uppercase tracking-[0.25em] transition-all rounded-md border text-center ${
                          currentFrequency === option
                            ? 'bg-stone-900 text-white border-stone-900 shadow-[0_4px_12px_rgba(0,0,0,0.2)]'
                            : 'bg-white/60 text-stone-700 border-stone-200/70 hover:bg-white hover:border-stone-300'
                        }`}
                      >
                        {frequencyLabels[option]}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {validationError && (
            <div className="flex items-start gap-4 bg-amber-50 border border-amber-200/80 rounded-lg px-6 py-5 mt-4">
              <Icons.AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-stone-800 font-medium">
                  {getUnansweredRituals().length} unanswered {getUnansweredRituals().length === 1 ? 'question' : 'questions'} remaining
                </p>
                <p className="text-xs text-stone-600 mt-1 font-light leading-relaxed">
                  Every marker shapes {dogData.name ? dogData.name + "'s" : "your dog's"} vitality profile. Missing answers reduce blueprint accuracy and can shift the archetype classification.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-10">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setValidationError(false);
                  if (currentFoundation === 0) setStep('profile');
                  else setCurrentFoundation(currentFoundation - 1);
                  window.scrollTo(0, 0);
                }}
                className="text-[8.5px] font-mono uppercase tracking-[0.35em] text-stone-600 hover:text-stone-800 transition-colors font-medium"
              >
                Previous
              </button>
              {import.meta.env.DEV && (
                <button
                  onClick={() => {
                    const filled: Record<string, FrequencyLevel> = { ...selectedRituals };
                    foundations.forEach((f: any) => {
                      f.rituals.forEach((r: any) => {
                        if (!filled[r.id]) filled[r.id] = ['daily', 'often', 'sometimes', 'rarely'][Math.floor(Math.random() * 4)] as FrequencyLevel;
                      });
                    });
                    setSelectedRituals(filled);
                    setStep('reflection');
                    window.scrollTo(0, 0);
                  }}
                  className="text-[9px] font-mono uppercase tracking-widest text-amber-600 border border-amber-300 px-4 py-2 rounded hover:bg-amber-50 transition-colors"
                >
                  Dev Skip All
                </button>
              )}
            </div>
            <button
              onClick={handleAdvance}
              className="bg-stone-900 text-white px-12 py-6 text-[8.5px] font-mono uppercase tracking-[0.35em] hover:bg-stone-800 hover:-translate-y-1 transition-all font-medium rounded-lg"
            >
              {currentFoundation === foundations.length - 1 ? 'Complete Assessment' : 'Next Phase'}
            </button>
          </div>
        </div>

        {/* Right Column - Review Sidebar */}
        <div className="lg:sticky lg:top-24 space-y-8">
          {/* Progress Summary */}
          <div className="bg-white/60 backdrop-blur-sm border border-stone-200/40 rounded-lg p-5 space-y-4">
            <p className="text-[8px] font-mono uppercase tracking-[0.3em] text-stone-500">Progress</p>
            <div className="space-y-2.5">
              {foundations.map((foundation: any, idx: number) => {
                const foundationRituals = foundation.rituals.map((r: any) => r.id);
                const respondedCount = foundationRituals.filter((id: string) => selectedRituals[id] != null).length;
                const isCurrentPhase = idx === currentFoundation;
                const FoundationIcon = foundation.Icon;
                const progress = Math.round((respondedCount / foundationRituals.length) * 100);

                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FoundationIcon
                          size={13}
                          strokeWidth={1.5}
                          className={isCurrentPhase ? 'text-stone-900' : 'text-stone-400'}
                        />
                        <span className={`text-xs font-light ${
                          isCurrentPhase ? 'text-stone-800' : 'text-stone-600'
                        }`}>
                          {foundation.label}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-stone-400">{progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-stone-200/60 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 rounded-full ${
                          isCurrentPhase ? 'bg-stone-800' : 'bg-stone-400'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="pt-3 border-t border-stone-200/30 flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-stone-500">Questions Answered</span>
              <span className="text-2xl font-serif text-stone-900">
                {Object.values(selectedRituals).filter(f => f != null).length}
                <span className="text-sm text-stone-400 font-light">/{foundations.reduce((sum: number, f: any) => sum + f.rituals.length, 0)}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
