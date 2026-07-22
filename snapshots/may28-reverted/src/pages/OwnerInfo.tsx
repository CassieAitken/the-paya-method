import { Icons } from '../components/Icons';
import { DogData } from '../App';

export function OwnerInfo({
  dogData,
  setDogData,
  setStep
}: {
  dogData: DogData;
  setDogData: (data: DogData) => void;
  setStep: (step: string) => void;
}) {
  const canProceed = dogData.ownerName.trim().length > 0 && dogData.ownerEmail.trim().length > 0 && dogData.ownerEmail.includes('@');

  return (
    <div className="py-10 sm:py-28 lg:py-40 space-y-8 sm:space-y-20 lg:space-y-28 animate-in max-w-4xl mx-auto px-5 sm:px-6">
      <div className="text-center space-y-6 sm:space-y-12">
        <Icons.User className="text-ink-muted w-12 h-12 mx-auto" strokeWidth={1.5} />
        <div className="editorial-divider max-w-md mx-auto"></div>
        <h2 className="text-5xl sm:text-6xl lg:text-7xl font-serif text-stone-900 tracking-tight leading-[1.05]">
          One Last Thing
        </h2>
        <p className="text-ink-soft text-lg lg:text-xl max-w-2xl mx-auto leading-[1.8] font-light">
          Before we build {dogData.name || 'your companion'}'s blueprint, we need to know who's on the other end of the leash. Your name personalizes the report. Your email delivers it.
        </p>
      </div>

      <div className="space-y-6">
        <label className="text-[8px] font-mono uppercase tracking-[0.35em] text-ink block font-medium">
          Breed <span className="text-ink-muted">(optional)</span>
        </label>
        <input
          className="w-full bg-transparent border-b-2 border-stone-400 pb-4 outline-none font-serif text-2xl text-stone-900 focus:border-stone-700 transition-colors placeholder:text-ink-faint font-light"
          placeholder="e.g., Golden Retriever, Lab Mix"
          value={dogData.breed}
          onChange={(e) => setDogData({ ...dogData, breed: e.target.value })}
        />
        <p className="text-[8px] text-ink-muted font-mono uppercase tracking-[0.32em] font-medium">If you know it, great. If not, leave blank.</p>
      </div>

      <div className="bg-white/80 backdrop-blur-md p-6 sm:p-8 lg:p-14 shadow-[0_15px_50px_-12px_rgba(0,0,0,0.08)] border border-stone-200/70 rounded-xl space-y-10 sm:space-y-12">
        <div className="space-y-8">
          <label className="text-[8px] font-mono uppercase tracking-[0.35em] text-ink block font-medium">
            Your Name
          </label>
          <input
            className="w-full bg-transparent border-b-2 border-stone-400 pb-4 sm:pb-6 outline-none font-serif text-2xl sm:text-3xl lg:text-4xl text-stone-900 focus:border-stone-700 transition-colors placeholder:text-ink-faint font-light"
            placeholder="e.g., Cassie"
            value={dogData.ownerName}
            onChange={(e) => setDogData({ ...dogData, ownerName: e.target.value })}
            autoFocus
          />
        </div>

        <div className="space-y-8">
          <label className="text-[8px] font-mono uppercase tracking-[0.35em] text-ink block font-medium">
            Email Address
          </label>
          <input
            type="email"
            className="w-full bg-transparent border-b-2 border-stone-400 pb-4 sm:pb-6 outline-none font-serif text-2xl sm:text-3xl lg:text-4xl text-stone-900 focus:border-stone-700 transition-colors placeholder:text-ink-faint font-light"
            placeholder="you@example.com"
            value={dogData.ownerEmail}
            onChange={(e) => setDogData({ ...dogData, ownerEmail: e.target.value })}
          />
          <p className="text-[8px] text-ink-soft font-mono uppercase tracking-[0.32em] font-medium">
            For your results PDF and blueprint delivery
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center pt-6 sm:pt-20 lg:pt-24 border-t border-stone-200/30">
        <button
          onClick={() => {
            setStep('reflection');
            window.scrollTo(0, 0);
          }}
          className="text-[8.5px] font-mono uppercase tracking-[0.35em] text-ink-soft hover:text-stone-900 transition-colors font-medium"
        >
          Back
        </button>
        <button
          disabled={!canProceed}
          onClick={() => {
            setStep('analyzing');
            window.scrollTo(0, 0);
          }}
          className={`bg-stone-900 text-white px-8 sm:px-14 lg:px-20 py-5 sm:py-6 text-[8.5px] font-mono uppercase tracking-[0.35em] flex items-center gap-4 transition-all font-medium rounded-lg ${
            !canProceed ? 'opacity-30 cursor-not-allowed' : 'hover:bg-stone-800 hover:-translate-y-1 hover:shadow-[0_25px_60px_-10px_rgba(0,0,0,0.2)]'
          }`}
        >
          Reveal {dogData.name || 'Your'}'s Score <Icons.ArrowRight size={16} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
