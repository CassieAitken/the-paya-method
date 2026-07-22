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

      {/* ===== HERO SECTION ===== */}
      <div className="flex flex-col items-center justify-center text-center py-16 md:py-32 min-h-[90vh] space-y-7 sm:space-y-12 max-w-4xl mx-auto px-5">
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[7rem] font-serif leading-[0.88] sm:leading-[0.85] text-[#2A2421] tracking-[-0.02em]">
          Your dog's lifespan<br className="hidden sm:block" /> is not pre-written.<br />
          <span className="font-serif italic text-[#415A42]">Their vitality is yours<br className="hidden sm:block" /> to protect.</span>
        </h1>

        <div className="w-16 h-[0.5px] bg-[#415A42]/60 mx-auto"></div>

        <p className="text-lg sm:text-xl font-serif italic text-[#5C534E] leading-[1.8] font-light max-w-2xl">
          You know the exact spot they love to be scratched, the unique cadence of their bark, and the gentle sigh they make when they finally settle against your feet. PayaLabs translates 50 carefully selected biological markers into a personalized Vitality Blueprint — a gentle, science-backed roadmap that uncovers what's quietly working against them, so you can protect their comfort and add beautiful, active years to their life.
        </p>

        {/* CTA Container */}
        <div className="flex flex-col items-center justify-center gap-3 w-full max-w-sm mx-auto">
          <button
            type="button"
            onClick={() => {
              setStep('intake');
              window.scrollTo(0, 0);
            }}
            className="group bg-[#2A2421] hover:bg-[#2F4230] text-white py-5 px-10 tracking-[0.22em] uppercase font-bold shadow-md w-full transition-all duration-300 flex items-center justify-center gap-3"
          >
            <span>Begin the 10-Minute Assessment</span>
            <Icons.ArrowRight size={16} className="transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
          </button>
          <span className="text-[10px] tracking-[0.2em] uppercase text-[#5C534E] font-bold mt-1 block w-full text-center">
            $29 &bull; Personalized to your dog &bull; Instant results
          </span>
        </div>

        <button
          onClick={() => {
            const element = document.querySelector('[data-section="pathway"]');
            element?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex flex-col items-center gap-3 pt-6 hover:opacity-70 transition-opacity cursor-pointer"
        >
          <Icons.ChevronDown size={18} className="text-[#415A42]/60 animate-bounce" strokeWidth={1.5} />
          <span className="font-mono text-[7.5px] uppercase tracking-[0.3em] text-[#5C534E]/60">Discover the framework</span>
        </button>
      </div>

      {/* ===== PATHWAY GRID ===== */}
      <div className="py-12 sm:py-20 max-w-4xl mx-auto px-5" data-section="pathway">
        <div className="grid grid-cols-1 sm:grid-cols-3">
          {[
            { label: 'Canine Pathways', value: '50 Biological Markers', sub: 'Mapped across 3 life phases' },
            { label: 'Taxonomy', value: '7 Vitality Pillars', sub: 'From nourishment to nervous system' },
            { label: 'Canine Report', value: '100-Point Vitality Blueprint', sub: 'One weighted score, infinite clarity' },
          ].map((col, i) => (
            <div key={col.label} className={`text-center py-6 sm:py-0 sm:px-8 ${i === 1 ? 'border-t sm:border-t-0 sm:border-x border-[#E6E0D5] py-6 sm:py-0' : ''}`}>
              <p className="font-mono text-[8px] uppercase tracking-[0.35em] text-[#5C534E]/60 mb-2">{col.label}</p>
              <p className="font-serif text-lg sm:text-xl text-[#2A2421] tracking-tight">{col.value}</p>
              <p className="text-[10px] text-[#5C534E]/50 font-light mt-1.5 leading-relaxed">{col.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== VITALITY INDEX CARD ===== */}
      <div className="max-w-5xl mx-auto mb-12 sm:mb-16 px-4 sm:px-6">
        <div className="bg-[#2A2421] text-white py-10 px-8 sm:py-16 sm:px-12 lg:px-16 space-y-7 sm:space-y-9 rounded-3xl">
          <div className="flex items-start gap-8">
            <div className="w-14 h-14 flex items-center justify-center text-white flex-shrink-0 border border-white/20 rounded-xl">
              <Icons.Gauge size={28} strokeWidth={1.2} />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-4xl lg:text-5xl text-white leading-[1.05] tracking-tight">
                The Vitality Index
              </h3>
              <p className="text-white/50 text-xs font-mono tracking-[0.3em] uppercase">7 Pillars &middot; One Score</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4 border-l border-[#415A42] pl-7">
              <span className="font-mono text-[8px] uppercase tracking-[0.28em] text-white/50">
                The Mandate
              </span>
              <p className="text-lg leading-[1.7] text-white font-light">
                Know your dog the way they know you. Not guessing. Not waiting. Understanding exactly what supports their vitality — and what quietly works against it.
              </p>
            </div>
            <div className="space-y-4 pl-7">
              <span className="font-mono text-[8px] uppercase tracking-[0.28em] text-white/50">
                The Method
              </span>
              <p className="text-base leading-[1.75] text-white/80 font-light">
                50 markers across 7 vitality pillars produce a single Vitality Index score out of 100. Each marker maps where your dog thrives and where small, specific shifts create the biggest gains.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== THE SILENT BUILD-UP ===== */}
      <section data-section="mandate" className="border-t border-[#E6E0D5] py-16 sm:py-28 px-6 bg-white">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-start text-left">
          <div className="md:col-span-5">
            <span className="font-sans text-[9px] tracking-[0.25em] text-[#415A42] uppercase block mb-4 font-bold">THE SILENT BUILD-UP</span>
            <h3 className="font-serif italic text-2xl sm:text-3xl text-[#2A2421] leading-tight tracking-tight">
              Most of us wait for something to go visibly wrong before we act. By then, the quiet signals have been accumulating for months — sometimes years.
            </h3>
          </div>
          <div className="md:col-span-7 text-[#5C534E] font-serif text-base md:text-lg italic leading-relaxed space-y-6">
            <p>
              Your dog cannot tell you when their environmental load is building or when their body is asking for more recovery. They simply adjust — resting a little longer, choosing cooler surfaces, moving with a subtle shift in how they carry themselves.
            </p>
            <p>
              PayaLabs maps these quiet signals before they become something harder to address. Across 7 core vitality pillars, we remove the guesswork and help you support what your dog's body is already trying to do.
            </p>
          </div>
        </div>
      </section>

      {/* ===== SEVEN PILLARS SECTION ===== */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20 lg:py-32" data-section="pillars">
        {/* Header */}
        <div className="text-center space-y-6 sm:space-y-10 mb-12 sm:mb-16">
          <span className="font-mono text-[8.5px] uppercase tracking-[0.3em] text-[#5C534E]/60">
            The Vitality Framework
          </span>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-serif text-[#2A2421] leading-[1.02] tracking-tight">
            The Seven<br />Vitality Pillars
          </h2>
          <p className="text-xl sm:text-2xl lg:text-3xl font-serif italic text-[#415A42] font-light leading-[1.4] max-w-2xl mx-auto">
            Our protocol doesn't create vitality.&nbsp;It removes what was hiding&nbsp;it.
          </p>
          <div className="w-16 h-[0.5px] bg-[#415A42]/60 mx-auto"></div>
        </div>

        {/* Interactive Tab System */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-0">
          {/* Left: Pillar List */}
          <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-1 lg:gap-0 pb-4 lg:pb-0 lg:border-r lg:border-[#E6E0D5]">
            {foundations.map((f, i) => {
              const Icon = f.Icon;
              const isActive = activePillar === i;
              return (
                <button
                  key={f.id}
                  onClick={() => setActivePillar(i)}
                  className={`flex items-center gap-3 px-4 lg:px-5 py-3 lg:py-4 text-left whitespace-nowrap lg:whitespace-normal transition-all duration-200 border-b lg:border-b-0 lg:border-r-2 flex-shrink-0 lg:flex-shrink ${
                    isActive
                      ? 'bg-white lg:bg-[#415A42]/5 border-[#415A42] lg:translate-x-1 text-[#2A2421]'
                      : 'border-transparent text-[#5C534E]/70 hover:text-[#2A2421] hover:bg-white/50'
                  }`}
                >
                  <Icon size={16} strokeWidth={1.3} className={isActive ? 'text-[#415A42]' : 'text-[#5C534E]/50'} />
                  <span className={`text-[11px] font-mono uppercase tracking-[0.15em] ${isActive ? 'font-bold' : 'font-medium'}`}>
                    {f.label}
                  </span>
                  {isActive && <Icons.ChevronRight size={14} className="text-[#415A42] hidden lg:block ml-auto" strokeWidth={2} />}
                </button>
              );
            })}
          </div>

          {/* Right: Featured Card */}
          <div className="bg-white border border-[#E6E0D5] p-6 sm:p-8 md:p-12 text-left min-h-[480px] flex flex-col">
            {(() => {
              const f = foundations[activePillar];
              const desc = pillarDescriptions[activePillar];
              const Icon = f.Icon;
              return (
                <>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 flex items-center justify-center border border-[#415A42]/20 bg-[#415A42]/5 rounded-xl">
                      <Icon size={24} strokeWidth={1.2} className="text-[#415A42]" />
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl sm:text-3xl text-[#2A2421] tracking-tight">{f.title}</h3>
                      <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-[#415A42] mt-1">{desc.focus}</p>
                    </div>
                  </div>

                  <p className="text-[#5C534E] leading-[1.8] font-light text-base mb-8">
                    {desc.definition}
                  </p>

                  <div className="mt-auto space-y-4">
                    <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-[#5C534E]/50 font-medium">Targeted Biological Markers</p>
                    <ul className="space-y-2.5">
                      {desc.markers.map((marker) => (
                        <li key={marker} className="flex items-center gap-3 text-sm text-[#5C534E]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#415A42] flex-shrink-0"></span>
                          {marker}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => onSelectPillar(f)}
                    className="mt-8 text-[8px] font-mono uppercase tracking-[0.25em] text-[#415A42] hover:text-[#2F4230] transition-colors font-bold"
                  >
                    Explore Full Pillar Detail →
                  </button>
                </>
              );
            })()}
          </div>
        </div>
      </div>

      {/* ===== FOUNDER BIO ===== */}
      <div className="py-12 sm:py-24 lg:py-36 max-w-5xl mx-auto px-4 sm:px-6" data-section="founder">
        <button
          onClick={onShowFounderMessage}
          className="group w-full bg-white border border-[#E6E0D5] p-8 sm:p-12 lg:p-16 rounded-3xl hover:shadow-[0_12px_40px_rgb(0,0,0,0.04)] hover:border-[#415A42]/20 transition-all duration-300 text-left"
        >
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10 lg:gap-16">
            {/* Left: Credentials */}
            <div className="space-y-5">
              <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-[#5C534E]/60">The Founder</p>
              <h4 className="font-serif italic text-3xl text-[#2A2421]">Cassandra "Cassie" Aitken</h4>
              <ul className="space-y-3 pt-3">
                {[
                  '15+ Years Wellness Business Practice',
                  'Holistic Nutrition & Lifestyle',
                  'Animal Communication Studies',
                  'Founder, PayaLabs',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-[#5C534E] font-light">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#415A42] flex-shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            {/* Right: Profile Copy */}
            <div className="space-y-6">
              <p className="text-xl sm:text-2xl font-serif italic text-[#2A2421] leading-[1.5]">
                "I built this for Paya. I stayed for yours."
              </p>
              <p className="text-sm text-[#5C534E] font-light leading-[1.8]">
                Cassie built her first wellness business from zero, growing it over fifteen years into a thriving practice that reached thousands of people. Throughout that time she watched conventional wellness repeatedly miss what was happening quietly beneath the surface — the environmental signals, the behavioral whispers, the small daily patterns that either protect a body or slowly deplete it.
              </p>
              <p className="text-sm text-[#5C534E] font-light leading-[1.8]">
                PayaLabs began as something deeply personal. Paya is her Australian Shepherd. And like every devoted dog parent, Cassie found herself paying close attention to the subtle changes — the way she moved in the morning, the surfaces she chose to rest on, the rhythms of her days. She couldn't find a framework that honored that level of attention.
              </p>
              <p className="text-sm text-[#5C534E] font-light leading-[1.8]">
                So she built one.
              </p>
              {/* Preservation Pledge */}
              <div className="border-l border-[#415A42] pl-8 py-3 mt-6 max-w-xl">
                <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-[#5C534E]/50 mb-2">The Preservation Pledge</p>
                <p className="text-sm text-[#5C534E] font-light leading-[1.8] italic">
                  Every protocol we build honors the dog's innate intelligence. We don't impose. We listen, we translate, and we gently guide the human hand toward what the body has been asking for all along.
                </p>
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* ===== FINAL CTA ===== */}
      <div className="py-10 sm:py-32 lg:py-48 flex flex-col items-center text-center space-y-8 sm:space-y-16 px-5">
        <div className="w-16 h-[0.5px] bg-[#415A42]/60 mx-auto"></div>
        <h2 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-serif text-[#2A2421] leading-[1.02] max-w-3xl tracking-tight">
          Your dog is already telling you everything.{' '}
          <span className="italic text-[#415A42]">The Vitality Blueprint teaches you how to listen.</span>
        </h2>
        <div className="flex flex-col items-center justify-center gap-3 w-full max-w-sm mx-auto">
          <button
            type="button"
            onClick={() => {
              setStep('intake');
              window.scrollTo(0, 0);
            }}
            className="group bg-[#2A2421] hover:bg-[#2F4230] text-white py-5 px-10 tracking-[0.22em] uppercase font-bold shadow-md w-full transition-all duration-300 flex items-center justify-center gap-3"
          >
            <span>Take the 10-Minute Assessment &bull; $29</span>
            <Icons.ArrowRight size={16} className="transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
          </button>
        </div>
      </div>

    </div>
  );
}
