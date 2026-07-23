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
      <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen min-h-[90vh] flex flex-col items-center justify-center text-center px-6 sm:px-8 py-20 md:py-32 bg-[#FDFBF7]">
        <div className="max-w-4xl mx-auto hero-stagger">
          <div className="flex items-center justify-center gap-3 mb-7 sm:mb-9">
            <div className="w-8 h-px bg-[#9AB8C4]"></div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#9AB8C4] font-medium">The Paya Method</p>
            <div className="w-8 h-px bg-[#9AB8C4]"></div>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[7rem] font-serif leading-[0.88] sm:leading-[0.85] text-[#2A2A28] tracking-[-0.02em]">
            Your dog's lifespan<br className="hidden sm:block" /> is not pre-written.
          </h1>

          <div className="max-w-xl mx-auto mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-[#9AB8C4]/40">
            <p className="font-serif italic text-2xl sm:text-3xl text-[#4B1D5C] leading-[1.3]">
              Their vitality is yours to protect.
            </p>
          </div>

          <p className="text-base sm:text-lg text-[#5C534E] leading-[1.9] sm:leading-[1.8] font-light max-w-xs sm:max-w-[650px] mx-auto mt-8 sm:mt-10">
            You know the exact spot they love to be scratched, the unique cadence of their bark, and the gentle sigh they make when they finally settle against your feet. The Paya Method translates 50 carefully selected biological questions into a personalized Dog Biology Blueprint™ — a gentle, science-backed roadmap that uncovers what's quietly working against them, so you can protect their comfort and keep them moving, playing, and thriving for as long as possible.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[10px] sm:text-[11px] uppercase tracking-[0.15em] text-[#8A8A86] mt-4 sm:mt-5">
            <span>10-Minute Assessment</span>
            <span className="w-1 h-1 rounded-full bg-[#8A8A86]/40" />
            <span>Personalized Dog Biology Blueprint™</span>
            <span className="w-1 h-1 rounded-full bg-[#8A8A86]/40" />
            <span>Science-Backed Guidance</span>
          </div>

          <div className="flex flex-col items-center justify-center gap-3 w-full max-w-sm mx-auto mt-8 sm:mt-10">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('how-it-works');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 text-[13px] sm:text-[14px] font-serif italic text-[#4B1D5C] underline underline-offset-4 decoration-[#9AB8C4]/50 hover:decoration-[#9AB8C4] transition-all cursor-pointer px-4 py-2 rounded-full hover:bg-[#4B1D5C]/[0.04]"
            >
              See what you get
              <Icons.ChevronDown size={13} strokeWidth={1.5} className="text-[#9AB8C4]" />
            </button>
            <button
              type="button"
              onClick={() => {
                setStep('intake');
                window.scrollTo(0, 0);
              }}
              className="group bg-[#0A4682] hover:bg-[#083A6D] text-white py-5 px-10 tracking-[0.22em] uppercase font-bold w-full transition-all duration-300 flex items-center justify-center gap-3"
            >
              <span>Begin Assessment</span>
              <Icons.ArrowRight size={16} className="transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
            </button>
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#8A8A86] font-bold mt-1 block w-full text-center">
              $49 &bull; 10 Minutes &bull; Instant Results
            </span>
          </div>

        </div>
      </section>

      {/* ===== SEVEN PILLARS (Editorial List) ===== */}
      <section ref={pillarsReveal.ref as React.RefObject<HTMLElement>} className={`relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-[#FDFBF7] py-16 sm:py-24 lg:py-32 px-6 ${pillarsReveal.className}`} data-section="pillars">
        <div className="max-w-3xl mx-auto">
          <div className="mb-14 sm:mb-20 text-center">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="w-8 h-px bg-[#9AB8C4]"></div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#9AB8C4] font-medium">Department 01</p>
              <div className="w-8 h-px bg-[#9AB8C4]"></div>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#2A2A28] leading-[1.05] tracking-tight mb-4">
              The 7 Biology Markers
            </h2>
            <p className="text-[11px] uppercase tracking-[0.15em] text-[#8A8A86]">
              50 Markers &middot; 7 Biology Markers &middot; One Score out of 100
            </p>
          </div>

          <div className="divide-y divide-[#E8E2D9]">
            {foundations.map((f, i) => {
              const isOpen = openPillar === i;
              const desc = pillarDescriptions[i];
              return (
                <div
                  key={f.id}
                  className="group cursor-pointer py-6 sm:py-7"
                  onClick={() => setOpenPillar(isOpen ? null : i)}
                >
                  <div className="flex items-start gap-5 sm:gap-6">
                    <span className="font-serif text-2xl sm:text-3xl text-[#C9C4B8] tracking-tight flex-shrink-0 leading-none pt-1">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-4">
                        <h3 className="font-serif text-lg sm:text-xl tracking-tight leading-tight text-[#2A2A28] group-hover:text-[#4B1D5C] transition-colors">
                          {f.title}
                        </h3>
                        <Icons.ChevronDown size={14} strokeWidth={1.5} className={`text-[#8A8A86] flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                      </div>
                      <p className="text-[10px] uppercase tracking-[0.15em] text-[#8A8A86] mt-1.5">
                        {desc.focus}
                      </p>

                      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        isOpen ? 'max-h-64 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'
                      }`}>
                        <p className="text-[#5C534E] leading-[1.8] font-light text-[13px] sm:text-[14px]">
                          {desc.definition}
                        </p>
                        <button
                          onClick={(e) => { e.stopPropagation(); onSelectPillar(f); }}
                          className="text-[10px] uppercase tracking-[0.15em] text-[#9AB8C4] hover:text-[#4B1D5C] transition-colors font-bold mt-3"
                        >
                          Explore Full Detail
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== YOUR DOG BIOLOGY BLUEPRINT INCLUDES (Editorial List) ===== */}
      <section id="how-it-works" className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-[#FDFBF7] py-16 sm:py-24 lg:py-32 px-6 border-t border-[#E8E2D9]">
        <div className="max-w-3xl mx-auto">
          <div className="mb-14 sm:mb-20 text-center">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="w-8 h-px bg-[#9AB8C4]"></div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#9AB8C4] font-medium">Department 02</p>
              <div className="w-8 h-px bg-[#9AB8C4]"></div>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#2A2A28] leading-[1.05] tracking-tight">
              The Dog Biology Blueprint™<br className="hidden sm:block" /> Includes
            </h2>
            <p className="text-[15px] text-[#5C534E] font-light leading-[1.8] max-w-xl mx-auto pt-4">
              Every Blueprint is built from your dog's specific answers — no generic profiles, no one-size-fits-all advice. Here's what you receive:
            </p>
          </div>

          <div className="divide-y divide-[#E8E2D9]">
            {[
              {
                title: 'Vitality Score',
                desc: 'One number that tells the truth about how well your dog\'s daily life supports their biology. Plus their unique archetype — the lens for everything that follows.',
              },
              {
                title: '7 Biology Markers Map',
                desc: 'Where they\'re thriving. Where small shifts make the biggest difference. No guessing — just clarity across all 7 Biology Markers.',
              },
              {
                title: 'Priority Actions',
                desc: 'The specific changes that move the needle most, ordered by impact. Not a rigid plan — a clear starting point you can act on today.',
              },
              {
                title: 'The Mirror',
                desc: 'How your rhythms shape their biology. The piece no one else is showing you — and often the single highest-leverage shift available.',
              },
              {
                title: 'Personalized Delivery',
                desc: 'Your Dog Biology Blueprint™ is delivered as two detailed personalized reports with individualized findings, explanations, recommendations, and a practical action plan tailored specifically to your dog.',
              },
            ].map((item, i) => (
              <div key={item.title} className="py-6 sm:py-7">
                <div className="flex items-start gap-5 sm:gap-6">
                  <span className="font-serif text-2xl sm:text-3xl text-[#C9C4B8] tracking-tight flex-shrink-0 leading-none pt-1">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-lg sm:text-xl tracking-tight leading-tight text-[#2A2A28]">
                      {item.title}
                    </h3>
                    <p className="text-[13px] sm:text-[14px] text-[#5C534E] leading-[1.8] font-light mt-2">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-[12px] text-[#8A8A86] font-light mt-10 tracking-wide">
            Delivered instantly as a visual report you can save, revisit, and share with your vet.
          </p>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section ref={ctaReveal.ref as React.RefObject<HTMLElement>} className={`relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-[#FDFBF7] py-20 sm:py-32 lg:py-40 px-6 border-t border-[#E8E2D9] ${ctaReveal.className}`}>
        <div className="max-w-3xl mx-auto text-center space-y-10 sm:space-y-14">
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-px bg-[#9AB8C4]"></div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#9AB8C4] font-medium">Department 03</p>
            <div className="w-8 h-px bg-[#9AB8C4]"></div>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#2A2A28] leading-[1.1] tracking-tight">
            Your dog is already telling you everything.{' '}
            <em className="text-[#4B1D5C]">The Dog Biology Blueprint™ teaches you how to listen.</em>
          </h2>
          <div className="flex flex-col items-center gap-6">
            <button
              type="button"
              onClick={() => {
                setStep('intake');
                window.scrollTo(0, 0);
              }}
              className="group bg-[#0A4682] hover:bg-[#083A6D] text-white py-5 px-10 sm:px-14 tracking-[0.2em] uppercase text-[10px] font-bold transition-all duration-300 flex items-center justify-center gap-3 w-full sm:w-auto"
            >
              <span>Begin the Assessment &middot; $49</span>
              <Icons.ArrowRight size={14} className="transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
            </button>
            <button
              onClick={onShowFounderMessage}
              className="text-[10px] uppercase tracking-[0.15em] text-[#8A8A86] hover:text-[#4B1D5C] transition-colors"
            >
              Meet the Founder →
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
