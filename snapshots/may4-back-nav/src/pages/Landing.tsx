import { Icons } from '../components/Icons';
import { foundations } from '../data/foundations';

interface LandingProps {
  setStep: (step: string) => void;
  onSelectPillar: (pillar: typeof foundations[0]) => void;
  onShowFounderMessage: () => void;
}

export function Landing({ setStep, onSelectPillar, onShowFounderMessage }: LandingProps) {

  return (
    <div className="animate-in-slow">

      <div className="flex flex-col items-center text-center py-20 lg:py-36 min-h-[90vh] justify-center space-y-14">
        <div className="inline-flex items-center gap-3 px-5 py-2.5 border border-stone-300/40 bg-white/40 backdrop-blur-sm">
          <Icons.Shield size={11} className="text-stone-500" strokeWidth={2} />
          <span className="text-[8.5px] font-mono uppercase tracking-[0.25em] text-stone-500">The Vitality Blueprint</span>
        </div>
        <div className="max-w-4xl space-y-8">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-[7rem] font-serif leading-[0.92] text-stone-900 tracking-tight">
            Your dog's vitality is speaking<br className="hidden sm:block" /> every single day.
          </h1>
          <p className="text-3xl sm:text-4xl lg:text-5xl font-serif italic font-light text-stone-400 leading-[1.1]">
            We teach you to listen.
          </p>
        </div>
        <div className="h-px w-24 bg-stone-300"></div>
        <div className="max-w-xl">
          <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-stone-400 leading-[2.4]">
            81 Biological Markers&ensp;&middot;&ensp;7 Vitality Pillars&ensp;&middot;&ensp;One Blueprint
          </p>
        </div>
        <button
          onClick={() => {
            const element = document.querySelector('[data-section="framework"]');
            element?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex flex-col items-center gap-3 pt-6 hover:opacity-70 transition-opacity cursor-pointer"
        >
          <Icons.ChevronDown size={18} className="text-stone-400 animate-bounce" strokeWidth={1.5} />
          <span className="font-mono text-[7.5px] uppercase tracking-[0.3em] text-stone-400">Discover the framework</span>
        </button>
      </div>

      <div className="py-28 lg:py-36 flex justify-center">
        <div className="editorial-divider max-w-xs"></div>
      </div>

      <div className="text-center pb-24 lg:pb-32 px-8 space-y-10 max-w-5xl mx-auto" data-section="framework">
        <span className="font-mono text-[8.5px] uppercase tracking-[0.3em] text-stone-400">
          The Vitality Framework
        </span>
        <h2 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-serif text-stone-900 leading-[1.02] tracking-tight">
          The Seven<br />Pillars of Vitality
        </h2>
        <div className="h-px w-16 bg-stone-300 mx-auto"></div>
      </div>

      <div className="max-w-5xl mx-auto mb-12">
        <div className="bg-stone-900 text-white py-16 px-12 lg:px-16 space-y-9 rounded-xl">
          <div className="flex items-start gap-8">
            <div className="w-14 h-14 flex items-center justify-center text-white flex-shrink-0 border border-white/20">
              <Icons.Gauge size={28} strokeWidth={1.2} />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-4xl lg:text-5xl text-white leading-[1.05] tracking-tight">
                The Vitality Index
              </h3>
              <p className="text-stone-400 text-xs font-mono tracking-[0.3em] uppercase">7 Pillars &middot; One Score</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4 border-l border-white pl-7">
              <span className="font-mono text-[8px] uppercase tracking-[0.28em] text-stone-400">
                The Mandate
              </span>
              <p className="text-lg leading-[1.7] text-white font-light">
                Know your dog at the <strong>cellular level</strong>. Not guessing. Not hoping. Knowing exactly what supports their vitality — and what quietly works against it.
              </p>
            </div>
            <div className="space-y-4 pl-7">
              <span className="font-mono text-[8px] uppercase tracking-[0.28em] text-stone-500">
                The Method
              </span>
              <p className="text-base leading-[1.75] text-stone-300 font-light">
                We distilled decades of vitality research into <strong>81 markers</strong> that map where your dog thrives — and where small shifts unlock the biggest gains.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {foundations.map((foundation) => {
          const Icon = foundation.Icon;
          return (
            <button
              key={foundation.id}
              onClick={() => onSelectPillar(foundation)}
              className="group bg-white/60 backdrop-blur-md border border-stone-200/70 p-8 rounded-xl hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] hover:border-stone-300/70 transition-all duration-300 text-left"
            >
              <div className="space-y-4">
                <div className="w-10 h-10 flex items-center justify-center text-stone-600 border border-stone-200/50 bg-stone-50 rounded-lg group-hover:bg-stone-100 transition-colors">
                  <Icon size={22} strokeWidth={1.2} />
                </div>
                <div>
                  <h3 className="font-serif text-2xl text-stone-900 leading-[1.2] tracking-tight mb-2">
                    {foundation.title}
                  </h3>
                  <p className="text-sm leading-[1.6] text-stone-700 font-light">
                    {foundation.tagline}
                  </p>
                </div>
                <div className="pt-2">
                  <span className="text-[8px] font-mono uppercase tracking-[0.25em] text-stone-500 group-hover:text-stone-700 transition-colors">
                    Learn More →
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="py-20 lg:py-32 flex justify-center">
        <button
          onClick={onShowFounderMessage}
          className="group max-w-2xl w-full mx-6 bg-white/60 backdrop-blur-md border border-stone-200/70 p-8 rounded-xl hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] hover:border-stone-300/70 transition-all duration-300 text-left"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Icons.Heart size={20} className="text-stone-600 flex-shrink-0" strokeWidth={1.2} />
              <span className="text-[8.5px] font-mono uppercase tracking-[0.25em] text-stone-600 font-medium">
                A Message from the Founder
              </span>
            </div>
            <p className="text-base leading-[1.6] text-stone-700 font-light">
              <strong>Meet Cassie</strong> — Certified Ayurveda Therapist and Holistic Wellness Practitioner with over three decades working alongside dogs and their humans. Her story is why this exists.
            </p>
            <div className="pt-2">
              <span className="text-[8px] font-mono uppercase tracking-[0.25em] text-stone-500 group-hover:text-stone-700 transition-colors">
                Read Message →
              </span>
            </div>
          </div>
        </button>
      </div>

      <div className="py-36 lg:py-48 flex flex-col items-center text-center space-y-16">
        <div className="editorial-divider max-w-md"></div>
        <h2 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-serif text-stone-900 leading-[1.02] max-w-3xl tracking-tight">
          Your dog is ready.<br />Are you?
        </h2>
        <button
          type="button"
          onClick={() => {
            setStep('intake');
            window.scrollTo(0, 0);
          }}
          className="group bg-stone-900 text-white px-16 py-7 text-[9.5px] font-mono uppercase tracking-[0.3em] flex items-center gap-4 hover:bg-stone-800 transition-all duration-500 border border-stone-900 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:-translate-y-1"
        >
          Start the Audit
          <Icons.ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-500" strokeWidth={1.5} />
        </button>
      </div>

    </div>
  );
}
