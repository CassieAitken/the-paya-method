import { Icons } from '../components/Icons';
import { DogData } from '../App';

export function Profile({
  dogData,
  setDogData,
  setStep
}: {
  dogData: DogData;
  setDogData: (data: DogData) => void;
  setStep: (step: string) => void;
}) {
  return (
    <div className="py-10 sm:py-28 lg:py-40 space-y-8 sm:space-y-24 lg:space-y-28 animate-in max-w-5xl mx-auto px-6">
      <div className="space-y-9">
        <div className="editorial-divider max-w-sm"></div>
        <h2 className="text-5xl sm:text-6xl lg:text-7xl font-serif text-[#2A2421] tracking-tight leading-[1.05]">Pack Profile</h2>
      </div>
      <div className="space-y-8 sm:space-y-24">
        <div className="space-y-8">
          <label className="text-[10px] uppercase tracking-[0.15em] text-ink block font-medium">
            Pack Structure
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 border border-stone-200/70 overflow-hidden bg-white/50 rounded-lg">
            {[
              {
                id: 'solo',
                label: 'Solo Dog',
                Icon: Icons.Heart,
                desc: 'Only dog in the household.'
              },
              {
                id: 'pack',
                label: 'Multi-Dog Pack',
                Icon: Icons.Users,
                desc: 'Lives with other canine companions.'
              }
            ].map((opt) => {
              const OptIcon = opt.Icon;
              return (
                <button
                  key={opt.id}
                  onClick={() => setDogData({ ...dogData, social: opt.id as 'solo' | 'pack' })}
                  className={`p-6 sm:p-8 lg:p-10 text-left border-r last:border-r-0 border-stone-200/70 transition-all flex flex-col gap-4 ${
                    dogData.social === opt.id ? 'bg-stone-900 text-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.2)]' : 'hover:bg-white/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <OptIcon size={18} strokeWidth={1.4} />
                    <span className="text-[10px] uppercase tracking-[0.15em] font-medium">{opt.label}</span>
                  </div>
                  <span className="text-sm leading-[1.7] font-light">{opt.desc}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center pt-6 sm:pt-20 lg:pt-24 border-t border-stone-200/30">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setStep('intake');
              window.scrollTo(0, 0);
            }}
            className="text-[11px] uppercase tracking-[0.15em] text-[#2A2421] font-medium hover:text-[#2A2421] transition-colors font-medium"
          >
            Back
          </button>
          {import.meta.env.DEV && (
            <button
              onClick={() => {
                setDogData({ ...dogData, social: 'solo', condition: 'Ideal', reflection: 'When I am calm, Paya settles instantly and sleeps deeply through the night.' });
                setStep('audit');
                window.scrollTo(0, 0);
              }}
              className="text-[10px] uppercase tracking-[0.15em] text-amber-600 border border-amber-300 px-4 py-2 rounded hover:bg-amber-50 transition-colors"
            >
              Dev Skip
            </button>
          )}
        </div>
        <button
          disabled={!dogData.social}
          onClick={() => {
            setStep('audit');
            window.scrollTo(0, 0);
          }}
          className={`bg-stone-900 text-white px-16 py-6 text-[10px] uppercase tracking-[0.15em] transition-all font-medium ${
            !dogData.social ? 'opacity-30 cursor-not-allowed' : 'hover:bg-stone-800 hover:-translate-y-1 hover:shadow-[0_25px_60px_-10px_rgba(0,0,0,0.2)]'
          }`}
        >
          Begin Exploration
        </button>
      </div>
    </div>
  );
}
