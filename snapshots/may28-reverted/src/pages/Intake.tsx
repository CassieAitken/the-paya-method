import { Icons } from '../components/Icons';
import { DogData } from '../App';
import { useState, useRef } from 'react';

export function Intake({
  dogData,
  setDogData,
  setStep,
  dogPhoto,
  setDogPhoto,
}: {
  dogData: DogData;
  setDogData: (data: DogData) => void;
  setStep: (step: string) => void;
  dogPhoto: string | null;
  setDogPhoto: (photo: string | null) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [showGrowthGate, setShowGrowthGate] = useState(false);

  const handleNumberInput = (e: React.KeyboardEvent) => {
    if (e.key === '-' || e.key === 'e' || e.key === '+' || e.key === '.') {
      e.preventDefault();
    }
  };

  const getTotalMonths = () => {
    const years = parseInt(dogData.age) || 0;
    const months = parseInt(dogData.ageMonths) || 0;
    return years * 12 + months;
  };

  const handleProceed = () => {
    if (getTotalMonths() < 18) {
      setShowGrowthGate(true);
      return;
    }
    setStep('audit');
    window.scrollTo(0, 0);
  };

  return (
    <div className="w-full">
      {showIntro && (
        <div className="bg-gradient-to-b from-stone-50 to-white border-b border-stone-300 py-8 sm:py-16">
          <div className="max-w-5xl mx-auto px-6 space-y-8">
            <div className="flex items-start justify-between gap-6">
              <div className="space-y-4 flex-1">
                <h2 className="text-4xl lg:text-5xl font-serif text-stone-900 leading-tight">What We're Building Together</h2>
                <p className="text-ink text-lg leading-relaxed font-light">
                  Over the next few minutes, you'll share what you know about your dog. We'll turn it into:
                </p>
              </div>
              <button
                onClick={() => setShowIntro(false)}
                className="p-2 hover:bg-stone-200/50 rounded-lg transition-colors flex-shrink-0 mt-2"
              >
                <Icons.X size={24} className="text-ink-soft" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-4 p-4 sm:p-5 bg-white border border-stone-300 rounded-lg hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] transition-shadow">
                <Icons.TrendingUp size={22} className="text-ink-soft flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-mono text-[15px] uppercase tracking-[0.2em] text-ink font-semibold">Vitality Score & Archetype</h4>
                  <p className="text-ink text-sm leading-relaxed font-light">One number that reveals how well your dog's daily life supports their body's needs.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 sm:p-5 bg-white border border-stone-300 rounded-lg hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] transition-shadow">
                <Icons.Brain size={22} className="text-ink-soft flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-mono text-[15px] uppercase tracking-[0.2em] text-ink font-semibold">The Seven Pillars</h4>
                  <p className="text-ink text-sm leading-relaxed font-light">See exactly where they're thriving and where small changes make the biggest difference.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 sm:p-5 bg-white border border-stone-300 rounded-lg hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] transition-shadow">
                <Icons.Zap size={22} className="text-ink-soft flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-mono text-[15px] uppercase tracking-[0.2em] text-ink font-semibold">Personalized Protocol</h4>
                  <p className="text-ink text-sm leading-relaxed font-light">Priority-ordered actions for your dog — starting with what moves the needle most.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 sm:p-5 bg-white border border-stone-300 rounded-lg hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] transition-shadow">
                <Icons.Compass size={22} className="text-ink-soft flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-mono text-[15px] uppercase tracking-[0.2em] text-ink font-semibold">Mirror Analysis</h4>
                  <p className="text-ink text-sm leading-relaxed font-light">How your daily habits and energy shape your dog's biology in ways you might not expect.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="py-8 sm:py-24 lg:py-40 space-y-8 sm:space-y-20 lg:space-y-28 max-w-5xl mx-auto px-6">
      <div className="space-y-9">
        <div className="editorial-divider max-w-sm" style={{borderColor: 'rgb(120 113 108)'}}></div>
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-stone-900 tracking-tight leading-[1.05]">Tell Us About Your Companion</h2>
      </div>
      <div className="space-y-12 sm:space-y-20 lg:space-y-32">
        <div className="space-y-8">
          <label className="text-[15px] font-mono uppercase tracking-[0.2em] text-ink block font-medium">
            Dog's Name
          </label>
          <input
            className="w-full bg-transparent border-b-2 border-stone-500 pb-4 sm:pb-6 outline-none font-serif text-3xl sm:text-4xl text-ink focus:border-stone-700 transition-colors placeholder:text-ink-faint font-light"
            placeholder="e.g., Paya"
            value={dogData.name}
            onChange={(e) => setDogData({ ...dogData, name: e.target.value })}
          />
        </div>

        <div className="space-y-6">
          <label className="text-[15px] font-mono uppercase tracking-[0.2em] text-ink block font-medium">
            Photo <span className="text-ink-soft font-medium">(optional)</span>
          </label>
          <div className="flex items-center gap-6">
            {dogPhoto ? (
              <div className="relative group">
                <img
                  src={dogPhoto}
                  alt="Dog"
                  className="w-24 h-24 rounded-full object-cover border-2 border-stone-300 shadow-md"
                />
                <button
                  onClick={() => setDogPhoto(null)}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-stone-900 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Icons.X size={12} />
                </button>
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-stone-400 flex items-center justify-center bg-stone-50">
                <Icons.Camera size={24} className="text-ink-faint" strokeWidth={1.5} />
              </div>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-[8.5px] font-mono uppercase tracking-[0.3em] text-ink border border-stone-400 px-5 py-3 rounded-lg hover:bg-stone-50 hover:border-stone-500 transition-all font-medium"
            >
              {dogPhoto ? 'Change Photo' : 'Upload Photo'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => {
                  setDogPhoto(ev.target?.result as string);
                };
                reader.readAsDataURL(file);
                e.target.value = '';
              }}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16 lg:gap-24">
          <div className="space-y-8">
            <label className="text-[15px] font-mono uppercase tracking-[0.2em] text-ink block font-medium">
              Sex
            </label>
            <div className="grid grid-cols-2 border border-stone-400 overflow-hidden bg-white/50 rounded-lg">
              {['female', 'male'].map((type) => (
                <button
                  key={type}
                  onClick={() => setDogData({ ...dogData, gender: type })}
                  className={`py-6 px-5 text-[8.5px] font-mono uppercase tracking-[0.32em] transition-all font-medium ${
                    dogData.gender === type ? 'bg-stone-900 text-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.2)]' : 'text-ink hover:bg-white/80'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-8">
            <label className="text-[15px] font-mono uppercase tracking-[0.2em] text-ink block font-medium">
              Age
            </label>
            <div className="flex gap-8">
              <div className="flex-1">
                <input
                  type="number"
                  min="0"
                  max="30"
                  onKeyDown={handleNumberInput}
                  className="w-full bg-transparent border-b-2 border-stone-500 pb-4 outline-none font-serif text-3xl text-ink focus:border-stone-700 transition-colors placeholder:text-ink-faint font-light"
                  placeholder="0"
                  value={dogData.age}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '' || (Number(val) >= 0 && Number(val) <= 30)) setDogData({ ...dogData, age: val });
                  }}
                />
                <span className="text-[8px] text-ink-soft font-mono uppercase tracking-[0.32em] mt-3 block font-medium">Years</span>
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  min="0"
                  max="11"
                  onKeyDown={handleNumberInput}
                  className="w-full bg-transparent border-b-2 border-stone-500 pb-4 outline-none font-serif text-3xl text-ink focus:border-stone-700 transition-colors placeholder:text-ink-faint font-light"
                  placeholder="0"
                  value={dogData.ageMonths}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '' || (Number(val) >= 0 && Number(val) <= 11)) setDogData({ ...dogData, ageMonths: val });
                  }}
                />
                <span className="text-[8px] text-ink-soft font-mono uppercase tracking-[0.32em] mt-3 block font-medium">Months</span>
              </div>
            </div>
          </div>
        </div>

      </div>
      <div className="flex justify-between items-center pt-12 sm:pt-24 border-t border-stone-300">
        {import.meta.env.DEV && (
          <button
            onClick={() => {
              setDogData({
                ...dogData,
                name: 'Paya',
                age: '5',
                ageMonths: '0',
                gender: 'female',
                ownerName: 'Cassie',
                ownerEmail: 'cassieaitken1@gmail.com'
              });
              setStep('audit');
              window.scrollTo(0, 0);
            }}
            className="text-[9px] font-mono uppercase tracking-widest text-amber-600 border border-amber-300 px-4 py-2 rounded hover:bg-amber-50 transition-colors"
          >
            Dev Skip
          </button>
        )}
        <button
          disabled={!dogData.name || (!dogData.age && !dogData.ageMonths) || !dogData.gender}
          onClick={handleProceed}
          className={`bg-stone-900 text-white px-10 py-5 sm:px-16 sm:py-6 text-[8.5px] font-mono uppercase tracking-[0.35em] flex items-center gap-4 transition-all font-medium ${
            !dogData.name || (!dogData.age && !dogData.ageMonths) || !dogData.gender ? 'opacity-30 cursor-not-allowed' : 'hover:bg-stone-800 hover:-translate-y-1 hover:shadow-[0_25px_60px_-10px_rgba(0,0,0,0.2)]'
          }`}
        >
          Proceed <Icons.ArrowRight size={16} strokeWidth={1.5} />
        </button>
      </div>
      </div>

      {showGrowthGate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            onClick={() => setShowGrowthGate(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.25)] max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in">
            <button
              onClick={() => setShowGrowthGate(false)}
              className="absolute top-5 right-5 p-2 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <Icons.X size={18} className="text-ink-muted" />
            </button>

            <div className="p-10 sm:p-12 space-y-8 text-center">
              <Icons.Sprout className="text-ink-soft w-10 h-10 mx-auto" strokeWidth={1.5} />
              <div className="space-y-4">
                <h3 className="text-3xl sm:text-4xl font-serif text-stone-900 tracking-tight leading-[1.1]">
                  The Growth Phase
                </h3>
                <div className="h-px w-12 bg-stone-400 mx-auto" />
              </div>

              <div className="space-y-5 text-left">
                <p className="text-ink text-[15px] leading-[1.85] font-light">
                  {dogData.name || 'Your companion'} is still in the growth phase. Under 18 months, a dog's biology is writing foundational code that will shape every system for life — bones still forming, neural pathways still branching, the microbiome still finding its balance.
                </p>
                <p className="text-ink text-[15px] leading-[1.85] font-light">
                  Our Vitality Audit is calibrated for dogs whose biological systems have stabilized enough to measure, map, and optimize. Running it now would give you numbers, but they wouldn't mean what we need them to mean.
                </p>
                <p className="text-stone-900 text-[15px] leading-[1.85] font-medium">
                  Come back when {dogData.name || 'your companion'} crosses 18 months. We'll be here — and the audit will be sharper for the wait.
                </p>
              </div>

              <div className="bg-stone-50 border border-stone-300 rounded-xl p-6 text-left space-y-3">
                <p className="text-ink text-[14px] leading-[1.85] font-light">
                  In the meantime — if you have questions about {dogData.name || 'your companion'}'s growth phase, nutrition, or just want guidance on setting the right foundation early, we're always happy to help.
                </p>
                <p className="text-ink text-[14px] leading-[1.85] font-light">
                  Reach out to us at{' '}
                  <a
                    href={`mailto:payalabs01@gmail.com?subject=${encodeURIComponent((dogData.name || 'My dog') + ' — Growth Phase Question')}&body=${encodeURIComponent(`Hi Paya Labs,\n\nMy dog ${dogData.name || ''} is currently in the growth phase and I'd love some guidance.\n\n`)}`}
                    className="underline underline-offset-2 font-medium text-stone-900 hover:text-stone-700 transition-colors"
                  >
                    payalabs01@gmail.com
                  </a>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <button
                  onClick={() => setShowGrowthGate(false)}
                  className="text-[8.5px] font-mono uppercase tracking-[0.35em] text-ink-soft hover:text-stone-900 transition-colors font-medium px-6 py-3"
                >
                  Adjust Age
                </button>
                <button
                  onClick={() => {
                    setShowGrowthGate(false);
                    setStep('landing');
                    window.scrollTo(0, 0);
                  }}
                  className="bg-stone-900 text-white px-10 py-4 text-[8.5px] font-mono uppercase tracking-[0.35em] hover:bg-stone-800 transition-all font-medium rounded-lg"
                >
                  Return Home
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
