import { useState, useEffect, useRef } from 'react';
import { Icons } from '../components/Icons';

const TOTAL_DURATION = 40_000;
const PHASE_DURATION = 10_000;
const FADE_MS = 600;

interface Phase {
  label: string;
  body: (name: string) => string;
}

const phases: Phase[] = [
  {
    label: 'Calibrating the Baseline',
    body: (name) =>
      `We're cross-referencing ${name}'s 50 markers against the vitality curve for their life stage. Every answer you gave is shaping a profile unique to ${name}'s biology.`,
  },
  {
    label: 'Building the Human Bridges',
    body: (name) =>
      `Analyzing ${name}'s movement patterns, cognitive flow, and recovery rhythms. We're connecting each data point to your daily life together \u2014 the walks, the mornings, the quiet moments.`,
  },
  {
    label: 'Your Vitality Vision',
    body: (name) =>
      `This isn't just a report. We're building ${name}'s roadmap to more good days, more fluid motion, and a deeper bond between you. Every directive is prioritized by biological impact.`,
  },
  {
    label: 'Finalizing Your Blueprint',
    body: (name) =>
      `We've completed ${name}'s analysis. Your personalized Dog Biology Blueprint™ is ready. Preparing your roadmap now\u2026`,
  },
];

export function AnalysisLoader({
  dogName,
  onComplete,
}: {
  dogName: string;
  onComplete: () => void;
}) {
  const name = dogName || 'your companion';
  const [progress, setProgress] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [textOpacity, setTextOpacity] = useState(0);
  const startRef = useRef(0);
  const completedRef = useRef(false);

  useEffect(() => {
    startRef.current = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.min((elapsed / TOTAL_DURATION) * 100, 100);
      setProgress(pct);

      const newPhase = Math.min(Math.floor(elapsed / PHASE_DURATION), phases.length - 1);
      setPhaseIndex(newPhase);

      if (elapsed >= TOTAL_DURATION && !completedRef.current) {
        completedRef.current = true;
        setTimeout(onComplete, 600);
        return;
      }

      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [onComplete]);

  useEffect(() => {
    setTextOpacity(0);
    const fadeIn = setTimeout(() => setTextOpacity(1), 60);
    return () => clearTimeout(fadeIn);
  }, [phaseIndex]);

  const phase = phases[phaseIndex];
  const phaseCounter = `${String(phaseIndex + 1).padStart(2, '0')} / ${String(phases.length).padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-[100] bg-[#F5F0EB] flex items-center justify-center">
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
        }}
      />

      <div className="relative w-full max-w-xl mx-auto px-8">
        {/* Top branding */}
        <div className="flex items-center gap-3 mb-6">
          <Icons.Leaf size={18} className="text-[#8A7F72]" strokeWidth={1.5} />
          <span className="text-[11px] uppercase tracking-[0.15em] text-[#0A4682] font-medium font-medium">
            PayaLabs Bio-Audit
          </span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl text-[#2A2421] tracking-tight leading-[1.1] mb-16">
          Biological Blueprint in Progress.
        </h1>

        {/* Phase counter */}
        <p className="text-[10px] uppercase tracking-[0.15em] text-[#C4B9A8] mb-6 font-medium">
          {phaseCounter}
        </p>

        {/* Phase label */}
        <h2
          className="font-serif text-3xl sm:text-4xl text-[#2A2421] tracking-tight leading-[1.15] mb-8"
          style={{
            opacity: textOpacity,
            transition: `opacity ${FADE_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`,
          }}
        >
          {phase.label}
        </h2>

        {/* Phase body */}
        <p
          className="text-[#5C534E] text-base sm:text-lg leading-[1.85] font-light max-w-lg mb-16"
          style={{
            opacity: textOpacity,
            transition: `opacity ${FADE_MS}ms cubic-bezier(0.16, 1, 0.3, 1) 150ms`,
          }}
        >
          {phase.body(name)}
        </p>

        {/* Progress bar */}
        <div className="space-y-4">
          <div className="w-full h-[2px] bg-stone-300/40 relative overflow-hidden rounded-full">
            <div
              className="absolute top-0 left-0 h-full bg-stone-700 rounded-full"
              style={{
                width: `${progress}%`,
                transition: 'width 200ms linear',
              }}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] uppercase tracking-[0.15em] text-[#C4B9A8] font-medium">
              {progress < 100 ? 'Analyzing' : 'Complete'}
            </span>
            <span className="text-[10px] uppercase tracking-[0.15em] text-[#C4B9A8] font-medium">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
