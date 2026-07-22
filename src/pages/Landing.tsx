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
      <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen min-h-[90vh] flex flex-col items-center justify-center text-center px-6 sm:px-8 py-20 md:py-32 bg-[#4B1D5C]">
        <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12 hero-stagger">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[7rem] font-serif leading-[0.88] sm:leading-[0.85] text-[#FDFBF7] tracking-[-0.02em]">
            Your dog's lifespan<br className="hidden sm:block" /> is not pre-written.<br />
            <span className="font-serif italic text-[#9AB8C4]">Their vitality is yours<br className="hidden sm:block" /> to protect.</span>
          </h1>

          <div className="w-16 h-[0.5px] bg-[#9AB8C4]/50 mx-auto"></div>

          <p className="text-base sm:text-xl font-serif italic text-[#E4D9E8] leading-[1.9] sm:leading-[1.8] font-light max-w-xs sm:max-w-2xl mx-auto">
            You know the exact spot they love to be scratched, the unique cadence of their bark, and the gentle sigh they make when they finally settle against your feet. PayaLabs translates 50 carefully selected biological questions into a personalized Dog Biology Blueprint™ — a gentle, science-backed roadmap that uncovers what's quietly working against them, so you can protect their comfort and keep them moving, playing, and thriving for as long as possible.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.25em] text-[#C9B9CE]">
            <span>10-Minute Assessment</span>
            <span className="w-1 h-1 rounded-full bg-[#9AB8C4]/40" />
            <span>Personalized Dog Biology Blueprint™</span>
            <span className="w-1 h-1 rounded-full bg-[#9AB8C4]/40" />
            <span>Science-Backed Guidance</span>
          </div>

          <div className="flex flex-col items-center justify-center gap-3 w-full max-w-sm mx-auto">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('how-it-works');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 text-[13px] sm:text-[14px] font-serif italic text-[#9AB8C4] underline underline-offset-4 decoration-[#9AB8C4]/40 hover:decoration-[#9AB8C4] transition-colors cursor-pointer"
            >
              See what you get
              <Icons.ChevronDown size={13} strokeWidth={1.5} className="text-[#9AB8C4]/70" />
            </button>
            <button
              type="button"
              onClick={() => {
                setStep('intake');
                window.scrollTo(0, 0);
              }}
              className="group bg-[#0A4682] hover:bg-[#083A6D] text-white py-5 px-10 tracking-[0.22em] uppercase font-bold w-full transition-all duration-300 flex items-center justify-center gap-3"
            >
              <span>Begin the 10-Minute Assessment</span>
              <Icons.ArrowRight size={16} className="transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
            </button>
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#C9B9CE] font-bold mt-1 block w-full text-center">
              $49 &bull; Personalized to your dog &bull; Instant results
            </span>
          </div>

        </div>
      </section>

      {/* ===== SEVEN PILLARS (Card Grid) ===== */}
      <section ref={pillarsReveal.ref as React.RefObject<HTMLElement>} className={`relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-[#4B1D5C] py-16 sm:py-24 lg:py-32 px-6 ${pillarsReveal.className}`} data-section="pillars">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 sm:mb-16 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#FDFBF7] leading-[1.05] tracking-tight mb-4">
              The 7 Biology Markers
            </h2>
            <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#C9B9CE]">
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
                      ? 'border-[#9AB8C4]/40 bg-[#FDFBF7]/[0.06] shadow-sm'
                      : 'border-[#FDFBF7]/15 hover:border-[#FDFBF7]/30 hover:bg-[#FDFBF7]/[0.03]'
                  } ${i === 6 ? 'sm:col-span-2 sm:max-w-[calc(50%-0.625rem)] sm:mx-auto' : ''}`}
                  onClick={() => setOpenPillar(isOpen ? null : i)}
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                        isOpen ? 'bg-[#9AB8C4]/15' : 'bg-[#FDFBF7]/10'
                      }`}>
                        <Icon size={16} strokeWidth={1.4} className={`transition-colors ${isOpen ? 'text-[#9AB8C4]' : 'text-[#C9B9CE]'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-serif text-base sm:text-lg tracking-tight transition-colors leading-tight ${
                          isOpen ? 'text-[#FDFBF7]' : 'text-[#EDE6E9]'
                        }`}>
                          {f.title}
                        </h3>
                        <p className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#C9B9CE] mt-1.5">
                          {desc.focus}
                        </p>
                      </div>
                    </div>

                    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? 'max-h-64 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'
                    }`}>
                      <p className="text-[#E4D9E8] leading-[1.8] font-light text-[13px] sm:text-[14px] pl-[52px]">
                        {desc.definition}
                      </p>
                      <button
                        onClick={(e) => { e.stopPropagation(); onSelectPillar(f); }}
                        className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#9AB8C4] hover:text-[#FDFBF7] transition-colors font-bold mt-3 pl-[52px]"
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
      <section id="how-it-works" className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-[#4B1D5C] py-16 sm:py-24 lg:py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-14 sm:mb-20 text-center space-y-4">
            <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-[#C9B9CE]">Delivered instantly. Personalized to your dog.</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#FDFBF7] leading-[1.05] tracking-tight">
              The Dog Biology Blueprint™<br className="hidden sm:block" /> Includes
            </h2>
            <p className="text-[15px] text-[#E4D9E8] font-light leading-[1.8] max-w-xl mx-auto pt-2">
              Every Blueprint is built from your dog's specific answers — no generic profiles, no one-size-fits-all advice. Here's what you receive:
            </p>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#FDFBF7]/15 border border-[#FDFBF7]/15">
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
                <div key={item.title} className="bg-[#4B1D5C] p-8 sm:p-10 space-y-4">
                  <Icon size={20} className="text-[#9AB8C4]" strokeWidth={1.2} />
                  <h3 className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#FDFBF7] font-bold">{item.title}</h3>
                  <p className="text-[13px] text-[#E4D9E8] leading-[1.8] font-light">{item.desc}</p>
                </div>
              );
            })}
            <div className="bg-[#4B1D5C] p-8 sm:p-10 space-y-4 md:col-span-2">
              <Icons.Mail size={20} className="text-[#9AB8C4]" strokeWidth={1.2} />
              <h3 className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#FDFBF7] font-bold">Personalized Delivery</h3>
              <p className="text-[13px] text-[#E4D9E8] leading-[1.8] font-light max-w-2xl">
                Your Dog Biology Blueprint™ is delivered as two detailed personalized reports with individualized findings, explanations, recommendations, and a practical action plan tailored specifically to your dog.
              </p>
            </div>
          </div>

          <p className="text-center text-[12px] text-[#C9B9CE] font-light mt-8 tracking-wide">
            Delivered instantly as a visual report you can save, revisit, and share with your vet.
          </p>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section ref={ctaReveal.ref as React.RefObject<HTMLElement>} className={`border-t border-[#E8E2D9] py-20 sm:py-32 lg:py-40 px-6 bg-[#FAF8F3] ${ctaReveal.className}`}>
        <div className="max-w-3xl mx-auto text-center space-y-10 sm:space-y-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#2A2421] leading-[1.1] tracking-tight">
            Your dog is already telling you everything.{' '}
            <em className="text-[#0A4682]">The Dog Biology Blueprint™ teaches you how to listen.</em>
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
              <span>Begin the Assessment &middot; $49</span>
              <Icons.ArrowRight size={14} className="transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
            </button>
            <button
              onClick={onShowFounderMessage}
              className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8A7F72] hover:text-[#0A4682] transition-colors"
            >
              Meet the Founder →
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
