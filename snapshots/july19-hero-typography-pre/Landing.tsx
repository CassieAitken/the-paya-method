import { useState, useEffect, useRef } from 'react';
import { Icons } from '../components/Icons';
import { foundations } from '../data/foundations';

function useReveal() {
  const ref = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setRevealed(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, className: `reveal${revealed ? ' revealed' : ''}` };
}

interface LandingProps {
  setStep: (step: string) => void;
  onSelectPillar: (pillar: typeof foundations[0]) => void;
  onShowFounderMessage: () => void;
}

const pillarDescriptions = [
  { focus: 'Metabolic Science', definition: 'Measures how efficiently your dog converts food into cellular fuel — tracking digestive rhythms, nutrient absorption windows, and gut rest cycles that determine daily energy output.' },
  { focus: 'Restorative Biology', definition: 'Evaluates the depth and quality of your dog\'s cellular repair cycles — mapping sleep architecture, recovery speed, and the nervous system conditions required for deep tissue regeneration.' },
  { focus: 'Environmental Toxicology', definition: 'Assesses the invisible chemical burden your dog\'s biology processes daily — from synthetic fragrances and floor chemicals to water quality and material off-gassing in their living space.' },
  { focus: 'Nervous System Synchronization', definition: 'Quantifies the biological bond between you and your dog — measuring how your calm, your stress, and your daily rhythms directly regulate their autonomic nervous system and healing capacity.' },
  { focus: 'Cognitive Neuroscience', definition: 'Tracks your dog\'s mental sharpness and neural pathway health — evaluating novelty exposure, problem-solving engagement, and the sensory variety that prevents cognitive decline.' },
  { focus: 'Biomechanical Flow', definition: 'Maps your dog\'s movement quality and structural integrity — identifying compensation patterns, joint mobility, muscle tone balance, and terrain confidence that predict long-term physical freedom.' },
  { focus: 'Vital Sign Baseline', definition: 'Establishes your dog\'s biological fingerprint through outward markers — coat quality, eye clarity, energy distribution, and digestive consistency that reflect cellular health status.' },
];

export function Landing({ setStep, onSelectPillar, onShowFounderMessage }: LandingProps) {
  const [openPillar, setOpenPillar] = useState<number | null>(null);
  const pillarsReveal = useReveal();
  const ctaReveal = useReveal();

  return (
    <div className="animate-in-slow bg-[#FDFBF7]">

      {/* ===== HERO ===== */}
      <section className="px-5 sm:px-8 py-16 md:py-24 bg-[#FBF9F5]">
        <div className="max-w-6xl mx-auto">
          <div className="lg:grid lg:grid-cols-[54%_46%] lg:gap-10 xl:gap-14 lg:items-start">

            {/* ----- Copy column ----- */}
            <div className="flex flex-col">
              <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#278AC7] mb-6">
                The Paya Method™ <span className="text-[#625B66]/50">·</span> A Clear Plan for Your Unique Dog
              </p>

              <h1 className="font-serif text-[2rem] sm:text-[2.5rem] lg:text-[2.75rem] xl:text-[3rem] leading-[1.12] tracking-[-0.02em] text-[#4E2D5C]">
                Understand what your dog needs today.<br />
                <span>Support more healthy years together.</span>
              </h1>

              <div className="mt-7 space-y-4 max-w-xl">
                <p className="text-[15px] sm:text-[16px] leading-[1.75] text-[#625B66] font-light">
                  The Paya Method turns your answers into a detailed picture of your dog's vitality: how well their daily life supports their energy, rest, movement, comfort, connection, and resilience.
                </p>
                <p className="text-[15px] sm:text-[16px] leading-[1.75] text-[#625B66] font-light">
                  See what's working, recognize patterns and everyday stressors that may need attention, and receive a clear 30-Day Plan for what to do next—so you can support their wellbeing with greater confidence.
                </p>
              </div>

              <p className="mt-6 font-serif italic text-[16px] sm:text-[17px] leading-[1.6] text-[#4E2D5C]/90 max-w-xl">
                Because understanding the factors shaping their wellbeing today gives you more opportunity to support the years ahead.
              </p>

              <div className="mt-8 flex flex-col items-start gap-3 max-w-md w-full">
                <button
                  type="button"
                  onClick={() => { setStep('intake'); window.scrollTo(0, 0); }}
                  className="group bg-[#4E2D5C] hover:opacity-90 text-white py-4 px-8 tracking-[0.04em] text-[13px] sm:text-[14px] font-semibold w-full transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <span>Get My Dog's Plan — $79</span>
                  <Icons.ArrowRight size={15} className="transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
                </button>

                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#625B66]">
                  About 10 minutes · 50 questions · 7 key areas
                </p>

                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#625B66]/80">
                  For dogs 18 months+ · Detailed results + 30-Day Plan delivered by email
                </p>
              </div>

              <div className="mt-10 max-w-xl border-l-2 border-[#278AC7]/40 pl-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#278AC7] mb-2">Vitality, Explained</p>
                <p className="text-[13px] sm:text-[14px] leading-[1.7] text-[#625B66] font-light">
                  Vitality is more than energy. It is your dog's ability to feel and function well throughout everyday life—from rest and movement to comfort, engagement, recovery, and resilience.
                </p>
              </div>
            </div>

            {/* ----- Report preview column ----- */}
            <div className="mt-12 lg:mt-0">
              <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.24em] text-[#625B66]/70 mb-3 text-center lg:text-left">Sample Report Preview</p>

              <div className="flex flex-col sm:flex-row gap-4">
                {/* Page 1 */}
                <div className="flex-1 bg-white border border-[#E5E2E6] rounded-md overflow-hidden shadow-sm">
                  <div className="px-4 sm:px-5 py-3 border-b border-[#E5E2E6] bg-[#FBF9F5]">
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#278AC7]">The Paya Method Blueprint + 30-Day Plan</p>
                  </div>
                  <div className="p-4 sm:p-5 space-y-4">
                    <p className="font-serif text-[15px] text-[#4E2D5C] leading-tight">Your Dog's Vitality Overview</p>

                    <div className="border border-[#E5E2E6] rounded-md px-4 py-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#625B66]">Overall Vitality Score</p>
                        <p className="font-serif text-[28px] leading-none text-[#4E2D5C] mt-1">83 <span className="text-[13px] text-[#625B66]">/ 100</span></p>
                      </div>
                      <div className="w-24 flex-shrink-0">
                        <div className="h-1.5 rounded-full bg-[#E5E2E6] overflow-hidden"><div className="h-full bg-[#278AC7] rounded-full" style={{ width: '83%' }} /></div>
                        <p className="font-mono text-[8px] uppercase tracking-[0.15em] text-[#278AC7] mt-1 text-right">Vital</p>
                      </div>
                    </div>

                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#625B66] mb-2">Your Seven Key Areas</p>
                      <div className="space-y-1.5">
                        {[
                          { l: 'Energy', v: 78 },
                          { l: 'Rest', v: 85 },
                          { l: 'Movement', v: 80 },
                          { l: 'Comfort', v: 88 },
                          { l: 'Connection', v: 90 },
                          { l: 'Engagement', v: 76 },
                          { l: 'Resilience', v: 82 },
                        ].map((a) => (
                          <div key={a.l} className="flex items-center gap-2">
                            <span className="w-[60px] sm:w-[72px] text-[10px] text-[#625B66] flex-shrink-0">{a.l}</span>
                            <div className="flex-1 h-1.5 rounded-full bg-[#E5E2E6] overflow-hidden">
                              <div className="h-full bg-[#278AC7] rounded-full" style={{ width: `${a.v}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border border-dashed border-[#278AC7]/40 rounded-md p-3 bg-[#FBF9F5]">
                      <div className="flex items-center justify-between">
                        <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-[#278AC7]">Shareable Summary</p>
                        <Icons.Share size={10} className="text-[#278AC7]" strokeWidth={1.5} />
                      </div>
                      <p className="text-[9px] text-[#625B66] mt-1 leading-snug">A compact version of your results to save or share.</p>
                    </div>
                  </div>
                </div>

                {/* Page 2 */}
                <div className="flex-1 bg-white border border-[#E5E2E6] rounded-md overflow-hidden shadow-sm">
                  <div className="px-4 sm:px-5 py-3 border-b border-[#E5E2E6] bg-[#FBF9F5]">
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#278AC7]">Detailed Findings &amp; Plan</p>
                  </div>
                  <div className="p-4 sm:p-5 space-y-4">
                    <div>
                      <p className="font-serif text-[14px] text-[#4E2D5C] leading-tight">What Your Answers Show</p>
                      <div className="mt-2 space-y-1.5">
                        <div className="h-1.5 rounded-full bg-[#E5E2E6] w-full" />
                        <div className="h-1.5 rounded-full bg-[#E5E2E6] w-[88%]" />
                      </div>
                    </div>

                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#278AC7] mb-2">What's Supporting Them</p>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#278AC7] flex-shrink-0" /><div className="h-1.5 rounded-full bg-[#E5E2E6] flex-1" /></div>
                        <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#278AC7] flex-shrink-0" /><div className="h-1.5 rounded-full bg-[#E5E2E6] flex-1" /></div>
                      </div>
                    </div>

                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#625B66] mb-2">What May Need Attention</p>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#625B66] flex-shrink-0" /><div className="h-1.5 rounded-full bg-[#E5E2E6] flex-1" /></div>
                        <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#625B66] flex-shrink-0" /><div className="h-1.5 rounded-full bg-[#E5E2E6] flex-1" /></div>
                      </div>
                    </div>

                    <div className="border-t border-[#E5E2E6] pt-3">
                      <p className="font-serif text-[14px] text-[#4E2D5C] leading-tight">Your 30-Day Plan</p>
                      <div className="mt-3 grid grid-cols-4 gap-1.5">
                        {['W1', 'W2', 'W3', 'W4'].map((w) => (
                          <div key={w} className="border border-[#E5E2E6] rounded p-1.5">
                            <p className="font-mono text-[8px] uppercase tracking-[0.1em] text-[#278AC7]">{w}</p>
                            <div className="mt-1 space-y-1">
                              <div className="h-1 rounded-full bg-[#E5E2E6] w-full" />
                              <div className="h-1 rounded-full bg-[#E5E2E6] w-[70%]" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="mt-10">
            <p className="text-[11px] sm:text-[12px] leading-[1.6] text-[#625B66]/80 font-light">
              Educational guidance designed to support—not replace—veterinary care.
            </p>
          </div>

        </div>
      </section>

      {/* ===== SEVEN PILLARS (Card Grid) ===== */}
      <section ref={pillarsReveal.ref as React.RefObject<HTMLElement>} className={`border-t border-[#E8E2D9] py-16 sm:py-24 lg:py-32 px-6 ${pillarsReveal.className}`} data-section="pillars">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 sm:mb-16 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#2A2421] leading-[1.05] tracking-tight mb-4">
              The 7 Biology Markers
            </h2>
            <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#8A7F72]">
              50 Markers &middot; 7 Biology Markers &middot; One Score out of 100
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {foundations.map((f, i) => {
              const Icon = f.Icon;
              const isOpen = openPillar === i;
              const desc = pillarDescriptions[i];
              return (
                <div
                  key={f.id}
                  className={`group relative border rounded-lg transition-all duration-300 cursor-pointer ${
                    isOpen
                      ? 'border-[#415A42]/30 bg-[#415A42]/[0.03] shadow-sm'
                      : 'border-[#E8E2D9] hover:border-[#C9C2B8] hover:shadow-sm'
                  } ${i === 6 ? 'sm:col-span-2 sm:max-w-[calc(50%-0.625rem)] sm:mx-auto' : ''}`}
                  onClick={() => setOpenPillar(isOpen ? null : i)}
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                        isOpen ? 'bg-[#415A42]/10' : 'bg-[#F5F2ED]'
                      }`}>
                        <Icon size={16} strokeWidth={1.4} className={`transition-colors ${isOpen ? 'text-[#415A42]' : 'text-[#8A7F72]'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-serif text-base sm:text-lg tracking-tight transition-colors leading-tight ${
                          isOpen ? 'text-[#2A2421]' : 'text-[#4A4340]'
                        }`}>
                          {f.title}
                        </h3>
                        <p className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#8A7F72] mt-1.5">
                          {desc.focus}
                        </p>
                      </div>
                    </div>

                    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? 'max-h-64 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'
                    }`}>
                      <p className="text-[#5C534E] leading-[1.8] font-light text-[13px] sm:text-[14px] pl-[52px]">
                        {desc.definition}
                      </p>
                      <button
                        onClick={(e) => { e.stopPropagation(); onSelectPillar(f); }}
                        className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#415A42] hover:text-[#2A2421] transition-colors font-bold mt-3 pl-[52px]"
                      >
                        Explore Full Detail
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== YOUR DOG BIOLOGY BLUEPRINT INCLUDES ===== */}
      <section id="how-it-works" className="border-t border-[#E8E2D9] py-16 sm:py-24 lg:py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-14 sm:mb-20 text-center space-y-4">
            <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-[#8A7F72]">Delivered instantly. Personalized to your dog.</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#2A2421] leading-[1.05] tracking-tight">
              The Dog Biology Blueprint™<br className="hidden sm:block" /> Includes
            </h2>
            <p className="text-[15px] text-[#6B6159] font-light leading-[1.8] max-w-xl mx-auto pt-2">
              Every Blueprint is built from your dog's specific answers — no generic profiles, no one-size-fits-all advice. Here's what you receive:
            </p>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#E8E2D9] border border-[#E8E2D9]">
            {[
              {
                icon: Icons.TrendingUp,
                title: 'Vitality Score',
                desc: 'One number that tells the truth about how well your dog\'s daily life supports their biology. Plus their unique archetype — the lens for everything that follows.',
              },
              {
                icon: Icons.Brain,
                title: '7 Biology Markers Map',
                desc: 'Where they\'re thriving. Where small shifts make the biggest difference. No guessing — just clarity across all 7 Biology Markers.',
              },
              {
                icon: Icons.Zap,
                title: 'Priority Actions',
                desc: 'The specific changes that move the needle most, ordered by impact. Not a rigid plan — a clear starting point you can act on today.',
              },
              {
                icon: Icons.Compass,
                title: 'The Mirror',
                desc: 'How your rhythms shape their biology. The piece no one else is showing you — and often the single highest-leverage shift available.',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="bg-[#FDFBF7] p-8 sm:p-10 space-y-4">
                  <Icon size={20} className="text-[#415A42]" strokeWidth={1.2} />
                  <h3 className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#2A2421] font-bold">{item.title}</h3>
                  <p className="text-[13px] text-[#6B6159] leading-[1.8] font-light">{item.desc}</p>
                </div>
              );
            })}
            <div className="bg-[#FDFBF7] p-8 sm:p-10 space-y-4 md:col-span-2">
              <Icons.Mail size={20} className="text-[#415A42]" strokeWidth={1.2} />
              <h3 className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#2A2421] font-bold">Personalized Delivery</h3>
              <p className="text-[13px] text-[#6B6159] leading-[1.8] font-light max-w-2xl">
                Your Dog Biology Blueprint™ is delivered as two detailed personalized reports with individualized findings, explanations, recommendations, and a practical action plan tailored specifically to your dog.
              </p>
            </div>
          </div>

          <p className="text-center text-[12px] text-[#8A7F72] font-light mt-8 tracking-wide">
            Delivered instantly as a visual report you can save, revisit, and share with your vet.
          </p>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section ref={ctaReveal.ref as React.RefObject<HTMLElement>} className={`border-t border-[#E8E2D9] py-20 sm:py-32 lg:py-40 px-6 bg-[#FAF8F3] ${ctaReveal.className}`}>
        <div className="max-w-3xl mx-auto text-center space-y-10 sm:space-y-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#2A2421] leading-[1.1] tracking-tight">
            Your dog is already telling you everything.{' '}
            <em className="text-[#415A42]">The Dog Biology Blueprint™ teaches you how to listen.</em>
          </h2>
          <div className="flex flex-col items-center gap-6">
            <button
              type="button"
              onClick={() => {
                setStep('intake');
                window.scrollTo(0, 0);
              }}
              className="group bg-[#2A2421] hover:bg-[#3A3330] text-white py-5 px-10 sm:px-14 tracking-[0.2em] uppercase text-[10px] font-bold transition-all duration-300 flex items-center justify-center gap-3 w-full sm:w-auto"
            >
              <span>Begin the Assessment &middot; $79</span>
              <Icons.ArrowRight size={14} className="transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
            </button>
            <button
              onClick={onShowFounderMessage}
              className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8A7F72] hover:text-[#415A42] transition-colors"
            >
              Meet the Founder →
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
