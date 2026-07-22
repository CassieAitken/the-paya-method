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
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center px-6 py-16 sm:py-24">
      <div className="max-w-2xl w-full space-y-12 sm:space-y-16 animate-in">
        <div className="space-y-6">
          <p className="text-[10px] uppercase tracking-[0.15em] text-[#8A7F72]">Almost There</p>
          <h2 className="text-4xl sm:text-5xl font-serif text-[#2A2421] tracking-tight leading-[1.05]">
            One Last Thing
          </h2>
          <p className="text-[#6B6159] text-base sm:text-lg leading-[1.85] font-light max-w-lg">
            Before we build {dogData.name || 'your companion'}'s blueprint, we need to know who's on the other end of the leash.
          </p>
        </div>

        <div className="space-y-10">
          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-[0.15em] text-[#8A7F72] block">
              Breed <span className="text-[#C4B9A8]">(optional)</span>
            </label>
            <input
              className="w-full bg-transparent border-b border-[#C4B9A8] pb-4 outline-none font-serif text-xl sm:text-2xl text-[#2A2421] focus:border-[#0A4682] transition-colors placeholder:text-[#C4B9A8] font-light"
              placeholder="e.g., Golden Retriever, Lab Mix"
              value={dogData.breed}
              onChange={(e) => setDogData({ ...dogData, breed: e.target.value })}
            />
            <p className="text-[10px] text-[#8A7F72] font-light">If you know it, great. If not, leave blank.</p>
          </div>

          <div className="border border-[#E8E2D9] bg-white/60 p-6 sm:p-8 lg:p-10 space-y-10">
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-[0.15em] text-[#8A7F72] block">
                Your Name
              </label>
              <input
                className="w-full bg-transparent border-b border-[#C4B9A8] pb-4 outline-none font-serif text-2xl sm:text-3xl text-[#2A2421] focus:border-[#0A4682] transition-colors placeholder:text-[#C4B9A8] font-light"
                placeholder="e.g., Cassie"
                value={dogData.ownerName}
                onChange={(e) => setDogData({ ...dogData, ownerName: e.target.value })}
                onBlur={(e) => setDogData({ ...dogData, ownerName: e.target.value.trim() })}
                autoFocus
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-[0.15em] text-[#8A7F72] block">
                Email Address
              </label>
              <input
                type="email"
                className="w-full bg-transparent border-b border-[#C4B9A8] pb-4 outline-none font-serif text-2xl sm:text-3xl text-[#2A2421] focus:border-[#0A4682] transition-colors placeholder:text-[#C4B9A8] font-light"
                placeholder="you@example.com"
                value={dogData.ownerEmail}
                onChange={(e) => setDogData({ ...dogData, ownerEmail: e.target.value })}
              />
              <p className="text-[10px] text-[#8A7F72] font-light">
                For your results PDF and blueprint delivery
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-8 border-t border-[#E8E2D9]">
          <button
            onClick={() => {
              setStep('reflection');
              window.scrollTo(0, 0);
            }}
            className="text-[10px] uppercase tracking-[0.15em] text-[#8A7F72] hover:text-[#2A2421] transition-colors"
          >
            Back
          </button>
          <button
            disabled={!canProceed}
            onClick={() => {
              setStep('analyzing');
              window.scrollTo(0, 0);
            }}
            className={`bg-[#0A4682] text-white px-10 py-5 text-[10px] uppercase tracking-[0.15em] flex items-center gap-3 transition-all font-bold ${
              !canProceed ? 'opacity-25 cursor-not-allowed' : 'hover:bg-[#3A3330]'
            }`}
          >
            Reveal {dogData.name || 'Your'}'s Score <Icons.ArrowRight size={14} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
