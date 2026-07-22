import { useState } from 'react';
import { Icons } from '../components/Icons';
import { foundations } from '../data/foundations';

interface LandingProps {
  setStep: (step: string) => void;
  onSelectPillar: (pillar: typeof foundations[0]) => void;
  onShowFounderMessage: () => void;
}

export function Landing({ setStep, onSelectPillar, onShowFounderMessage }: LandingProps) {
  const [activePillar, setActivePillar] = useState(0);

  const pillarDescriptions = [
    { focus: 'Metabolic Science', definition: 'Measures how efficiently your dog converts food into cellular fuel — tracking digestive rhythms, nutrient absorption windows, and gut rest cycles that determine daily energy output.', markers: ['Meal timing consistency', 'Digestive calm signals', 'Protein rotation diversity', 'Hydration & moisture intake', 'Overnight fasting window'] },
    { focus: 'Restorative Biology', definition: 'Evaluates the depth and quality of your dog\'s cellular repair cycles — mapping sleep architecture, recovery speed, and the nervous system conditions required for deep tissue regeneration.', markers: ['Sleep cycle depth', 'Morning mobility ease', 'Emotional recovery speed', 'Co-regulation quality', 'Daytime rest patterns'] },
    { focus: 'Environmental Toxicology', definition: 'Assesses the invisible chemical burden your dog\'s biology processes daily — from synthetic fragrances and floor chemicals to water quality and material off-gassing in their living space.', markers: ['Chemical exposure load', 'Air & water purity', 'Surface contact toxins', 'Material safety profile', 'Immune drain indicators'] },
    { focus: 'Nervous System Synchronization', definition: 'Quantifies the biological bond between you and your dog — measuring how your calm, your stress, and your daily rhythms directly regulate their autonomic nervous system and healing capacity.', markers: ['Cortisol co-regulation', 'Presence response quality', 'Routine predictability', 'Touch & proximity patterns', 'Separation resilience'] },
    { focus: 'Cognitive Neuroscience', definition: 'Tracks your dog\'s mental sharpness and neural pathway health — evaluating novelty exposure, problem-solving engagement, and the sensory variety that prevents cognitive decline.', markers: ['Novel challenge frequency', 'Sensory environment variety', 'Problem-solving engagement', 'Social cognitive skills', 'Mental fatigue recovery'] },
    { focus: 'Biomechanical Assessment', definition: 'Maps your dog\'s movement quality and structural integrity — identifying compensation patterns, joint mobility, muscle tone balance, and terrain confidence that predict long-term physical freedom.', markers: ['Gait symmetry analysis', 'Joint mobility range', 'Muscle tone distribution', 'Terrain confidence', 'Recovery from exertion'] },
    { focus: 'Vital Sign Baseline', definition: 'Establishes your dog\'s biological fingerprint through outward markers — coat quality, eye clarity, energy distribution, and digestive consistency that reflect cellular health status.', markers: ['Coat & skin vitality', 'Eye clarity signals', 'Energy distribution', 'Weight stability', 'Systemic harmony indicators'] },
  ];

  return (
    <div className="animate-in-slow bg-[#FDFBF7]">

      {/* ===== HERO ===== */}
      <section className="min-h-[90vh] flex flex-col items-center justify-center text-center px-6 sm:px-8 py-20 md:py-32">
        <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[7rem] font-serif leading-[0.88] sm:leading-[0.85] text-[#2A2421] tracking-[-0.02em]">
            Your dog's lifespan<br className="hidden sm:block" /> is not pre-written.<br />
            <span className="font-serif italic text-[#415A42]">Their vitality is yours<br className="hidden sm:block" /> to protect.</span>
          </h1>

          <div className="w-16 h-[0.5px] bg-[#415A42]/60 mx-auto"></div>

          <p className="text-base sm:text-xl font-serif italic text-[#5C534E] leading-[1.9] sm:leading-[1.8] font-light max-w-xs sm:max-w-2xl mx-auto">
            You know the exact spot they love to be scratched, the unique cadence of their bark, and the gentle sigh they make when they finally settle against your feet. PayaLabs translates 50 carefully selected biological markers into a personalized Vitality Blueprint — a gentle, science-backed roadmap that uncovers what's quietly working against them, so you can protect their comfort and add beautiful, active years to their life.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 w-full max-w-sm mx-auto">
            <button
              type="button"
              onClick={() => {
                setStep('intake');
                window.scrollTo(0, 0);
              }}
              className="group bg-[#2A2421] hover:bg-[#2F4230] text-white py-5 px-10 tracking-[0.22em] uppercase font-bold w-full transition-all duration-300 flex items-center justify-center gap-3"
            >
              <span>Begin the 10-Minute Assessment</span>
              <Icons.ArrowRight size={16} className="transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
            </button>
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#5C534E] font-bold mt-1 block w-full text-center">
              $49 &bull; Personalized to your dog &bull; Instant results
            </span>
          </div>

          <button
            onClick={() => {
              const element = document.querySelector('[data-section="mandate"]');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hidden sm:flex flex-col items-center gap-3 pt-6 hover:opacity-70 transition-opacity cursor-pointer"
          >
            <Icons.ChevronDown size={18} className="text-[#415A42]/60 animate-bounce" strokeWidth={1.5} />
            <span className="font-mono text-[7.5px] uppercase tracking-[0.3em] text-[#5C534E]/60">Discover the framework</span>
          </button>
        </div>
      </section>

      {/* ===== NUMBERS ROW ===== */}
      <section className="border-t border-[#E8E2D9] py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-6 grid grid-cols-3 gap-4 sm:gap-0 sm:divide-x divide-[#E8E2D9]">
          {[
            { value: '50', label: 'Biological Markers', sub: 'Mapped across 3 life phases' },
            { value: '7', label: 'Vitality Pillars', sub: 'From nourishment to nervous system' },
            { value: '100', label: 'Point Index', sub: 'One score, infinite clarity' },
          ].map((col) => (
            <div key={col.label} className="text-center sm:px-8">
              <p className="text-5xl sm:text-6xl lg:text-7xl font-serif text-[#2A2421] tracking-tight leading-none">{col.value}</p>
              <p className="font-mono text-[7px] sm:text-[8px] uppercase tracking-[0.3em] text-[#8A7F72] mt-3">{col.label}</p>
              <p className="text-[10px] sm:text-[11px] text-[#8A7F72] mt-1 font-light hidden sm:block">{col.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== THE MANDATE ===== */}
      <section className="border-t border-[#E8E2D9] py-16 sm:py-32 lg:py-40 px-6 bg-[#F5F1EB]" data-section="mandate">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-20 items-start">
          <div className="md:col-span-4">
            <p className="font-mono text-[9px] sm:text-[8px] uppercase tracking-[0.25em] sm:tracking-[0.35em] text-[#6B6259] mb-4 sm:mb-6 font-semibold sm:font-normal">01 / The Mandate</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#2A2421] leading-[1.15] tracking-tight">
              The silent build-up no one warns you about.
            </h2>
          </div>
          <div className="md:col-span-8 space-y-5 sm:space-y-6 text-[#4A4340] text-[15px] sm:text-base md:text-[17px] leading-[1.85] font-light">
            <p>
              Your dog cannot tell you when their environmental load is building or when their body is asking for more recovery. They simply adjust — resting a little longer, choosing cooler surfaces, moving with a subtle shift in how they carry themselves.
            </p>
            <p>
              PayaLabs maps these quiet signals before they become something harder to address. Across 7 core vitality pillars, we remove the guesswork and help you support what your dog's body is already trying to do.
            </p>
          </div>
        </div>
      </section>

      {/* ===== THE VITALITY INDEX ===== */}
      <section className="bg-[#2A2421] py-20 sm:py-28 lg:py-36 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-start">
          <div className="md:col-span-5 space-y-6">
            <p className="font-mono text-[8px] uppercase tracking-[0.35em] text-white/40">02 / The Index</p>
            <h2 className="text-4xl sm:text-5xl font-serif text-white leading-[1.05] tracking-tight">
              The Vitality Index
            </h2>
            <p className="text-white/40 text-xs font-mono tracking-[0.2em] uppercase">7 Pillars &middot; One Score</p>
          </div>
          <div className="md:col-span-7 space-y-8">
            <div className="border-l border-[#415A42] pl-6">
              <p className="text-white text-base sm:text-lg leading-[1.8] font-light">
                Know your dog the way they know you. Not guessing. Not waiting. Understanding exactly what supports their vitality — and what quietly works against it.
              </p>
            </div>
            <p className="text-white/60 text-sm sm:text-base leading-[1.8] font-light">
              50 markers across 7 vitality pillars produce a single Vitality Index score out of 100. Each marker maps where your dog thrives and where small, specific shifts create the biggest gains.
            </p>
          </div>
        </div>
      </section>

      {/* ===== SEVEN PILLARS ===== */}
      <section className="py-20 sm:py-32 lg:py-40 px-6" data-section="pillars">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-2xl mb-16 sm:mb-24">
            <p className="font-mono text-[8px] uppercase tracking-[0.35em] text-[#8A7F72] mb-6">03 / The Framework</p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#2A2421] leading-[1.05] tracking-tight mb-6">
              The Seven Vitality Pillars
            </h2>
            <p className="text-xl sm:text-2xl font-serif italic text-[#415A42] leading-[1.4] font-light">
              Our protocol doesn't create vitality. It removes what was hiding it.
            </p>
          </div>

          {/* Interactive Tab System */}
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-0">
            <div className="relative lg:static">
              <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-1 sm:gap-0 pb-4 lg:pb-0 lg:border-r lg:border-[#E8E2D9] scrollbar-hide">
                {foundations.map((f, i) => {
                  const Icon = f.Icon;
                  const isActive = activePillar === i;
                  return (
                    <button
                      key={f.id}
                      onClick={() => setActivePillar(i)}
                      className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 lg:px-5 py-3 sm:py-3.5 lg:py-4 text-left whitespace-nowrap lg:whitespace-normal transition-all duration-200 flex-shrink-0 lg:flex-shrink rounded-md lg:rounded-none ${
                        isActive
                          ? 'lg:border-r-2 lg:border-[#415A42] lg:-mr-[1px] text-[#2A2421] bg-[#415A42]/10 lg:bg-[#415A42]/[0.03] border border-[#415A42]/20 lg:border-0'
                          : 'text-[#5C534E] hover:text-[#2A2421] border border-transparent'
                      }`}
                    >
                      <Icon size={16} strokeWidth={1.4} className={`sm:w-3.5 sm:h-3.5 lg:w-3.5 lg:h-3.5 ${isActive ? 'text-[#415A42]' : 'text-[#5C534E]'}`} />
                      <span className={`text-[11px] sm:text-[10px] font-mono uppercase tracking-[0.08em] sm:tracking-[0.12em] ${isActive ? 'font-bold text-[#2A2421]' : 'font-medium'}`}>
                        {f.label}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-[#FDFBF7] to-transparent pointer-events-none lg:hidden" />
            </div>

            <div className="border border-[#E8E2D9] lg:border-l-0 p-6 sm:p-10 lg:p-12 text-left min-h-[460px] flex flex-col">
              {(() => {
                const f = foundations[activePillar];
                const desc = pillarDescriptions[activePillar];
                const Icon = f.Icon;
                return (
                  <>
                    <div className="flex items-center gap-4 mb-8">
                      <Icon size={20} strokeWidth={1} className="text-[#415A42]" />
                      <div>
                        <h3 className="font-serif text-2xl sm:text-3xl text-[#2A2421] tracking-tight">{f.title}</h3>
                        <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-[#8A7F72] mt-1">{desc.focus}</p>
                      </div>
                    </div>

                    <p className="text-[#5C534E] leading-[1.85] font-light text-[15px] mb-10">
                      {desc.definition}
                    </p>

                    <div className="mt-auto space-y-4">
                      <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-[#8A7F72]">Targeted Markers</p>
                      <ul className="space-y-2.5">
                        {desc.markers.map((marker) => (
                          <li key={marker} className="flex items-center gap-3 text-sm text-[#5C534E] font-light">
                            <span className="w-1 h-1 rounded-full bg-[#415A42] flex-shrink-0"></span>
                            {marker}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => onSelectPillar(f)}
                      className="mt-8 text-[9px] font-mono uppercase tracking-[0.2em] text-[#415A42] hover:text-[#2A2421] transition-colors font-bold"
                    >
                      Explore Full Detail →
                    </button>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOUNDER ===== */}
      <section className="border-t border-[#E8E2D9] py-20 sm:py-32 lg:py-40 px-6 bg-[#FDFBF7]" data-section="founder">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onShowFounderMessage}
            className="group w-full text-left"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
              <div className="md:col-span-4 space-y-5">
                <p className="font-mono text-[8px] uppercase tracking-[0.35em] text-[#8A7F72]">04 / The Founder</p>
                <h3 className="font-serif italic text-3xl text-[#2A2421] leading-[1.1]">Cassandra "Cassie" Aitken</h3>
                <ul className="space-y-2.5 pt-2">
                  {[
                    '15+ Years Wellness Practice',
                    'Holistic Nutrition & Lifestyle',
                    'Animal Communication Studies',
                    'Founder, PayaLabs',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-[13px] text-[#6B6159] font-light">
                      <span className="w-1 h-1 rounded-full bg-[#415A42] flex-shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:col-span-8 space-y-6">
                <div className="relative">
                  <span className="absolute -top-6 -left-2 text-6xl sm:text-7xl font-serif text-[#415A42]/10 leading-none select-none" aria-hidden="true">"</span>
                  <p className="text-2xl sm:text-3xl font-serif italic text-[#2A2421] leading-[1.35]">
                    "I built this for Paya. I stayed for yours."
                  </p>
                </div>
                <p className="text-[15px] text-[#5C534E] font-light leading-[1.85]">
                  Cassie built her first wellness business from zero, growing it over fifteen years into a thriving practice that reached thousands. Throughout that time she watched conventional wellness repeatedly miss what was happening quietly beneath the surface — the environmental signals, the behavioral whispers, the small daily patterns that either protect a body or slowly deplete it.
                </p>
                <p className="text-[15px] text-[#5C534E] font-light leading-[1.85]">
                  PayaLabs began as something deeply personal. Paya is her Australian Shepherd. She couldn't find a framework that honored the level of attention she was already paying. So she built one.
                </p>
                <div className="border-l border-[#415A42]/30 pl-6 pt-2">
                  <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-[#8A7F72] mb-2">The Preservation Pledge</p>
                  <p className="text-sm text-[#5C534E] font-light leading-[1.85] italic">
                    Every protocol we build honors the dog's innate intelligence. We don't impose. We listen, we translate, and we gently guide the human hand toward what the body has been asking for all along.
                  </p>
                </div>
                <span className="inline-block text-[9px] font-mono uppercase tracking-[0.2em] text-[#415A42] group-hover:translate-x-1 transition-transform pt-2">
                  Read the full story →
                </span>
              </div>
            </div>
          </button>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="border-t border-[#E8E2D9] py-24 sm:py-36 lg:py-48 px-6 bg-[#FAF8F3]">
        <div className="max-w-3xl mx-auto text-center space-y-10 sm:space-y-14">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#2A2421] leading-[1.05] tracking-tight">
            Your dog is already telling you everything.{' '}
            <em className="text-[#415A42]">The Vitality Blueprint teaches you how to listen.</em>
          </h2>
          <div className="flex flex-col items-center gap-4">
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
          </div>
        </div>
      </section>

    </div>
  );
}
