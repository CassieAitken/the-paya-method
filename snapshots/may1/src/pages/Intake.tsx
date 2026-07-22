import { Icons } from '../components/Icons';
import { DogData, DOG_SIZES, DOG_GROUPS } from '../App';
import { useState } from 'react';

export function Intake({
  dogData,
  setDogData,
  setStep
}: {
  dogData: DogData;
  setDogData: (data: DogData) => void;
  setStep: (step: string) => void;
}) {
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
    setStep('profile');
    window.scrollTo(0, 0);
  };

  return (
    <div className="w-full">
      {showIntro && (
        <div className="bg-gradient-to-b from-stone-50 to-white border-b border-stone-200/50 py-16">
          <div className="max-w-5xl mx-auto px-6 space-y-8">
            <div className="flex items-start justify-between gap-6">
              <div className="space-y-4 flex-1">
                <h2 className="text-4xl lg:text-5xl font-serif text-stone-900 leading-tight">What We're Building Together</h2>
                <p className="text-stone-600 text-lg leading-relaxed font-light">
                  Over the next few minutes, you'll share what you know about your dog. We'll turn it into:
                </p>
              </div>
              <button
                onClick={() => setShowIntro(false)}
                className="p-2 hover:bg-stone-200/50 rounded-lg transition-colors flex-shrink-0 mt-2"
              >
                <Icons.X size={24} className="text-stone-700" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-4 p-5 bg-white border border-stone-200/70 rounded-lg hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] transition-shadow">
                <Icons.TrendingUp size={22} className="text-stone-700 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-mono text-[8px] uppercase tracking-[0.32em] text-stone-700 font-medium">Vitality Score & Archetype</h4>
                  <p className="text-stone-700 text-sm leading-relaxed font-light">One number that reveals how well your dog's daily life supports their body's needs.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-white border border-stone-200/70 rounded-lg hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] transition-shadow">
                <Icons.Brain size={22} className="text-stone-700 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-mono text-[8px] uppercase tracking-[0.32em] text-stone-700 font-medium">The Seven Pillars</h4>
                  <p className="text-stone-700 text-sm leading-relaxed font-light">See exactly where they're thriving and where small changes make the biggest difference.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-white border border-stone-200/70 rounded-lg hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] transition-shadow">
                <Icons.Zap size={22} className="text-stone-700 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-mono text-[8px] uppercase tracking-[0.32em] text-stone-700 font-medium">Personalized Protocol</h4>
                  <p className="text-stone-700 text-sm leading-relaxed font-light">Priority-ordered actions for your dog — starting with what moves the needle most.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-white border border-stone-200/70 rounded-lg hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] transition-shadow">
                <Icons.Compass size={22} className="text-stone-700 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-mono text-[8px] uppercase tracking-[0.32em] text-stone-700 font-medium">Mirror Analysis</h4>
                  <p className="text-stone-700 text-sm leading-relaxed font-light">How your daily habits and energy shape your dog's biology in ways you might not expect.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="py-40 space-y-28 max-w-5xl mx-auto px-6">
      <div className="space-y-9">
        <div className="editorial-divider max-w-sm"></div>
        <h2 className="text-5xl sm:text-6xl lg:text-7xl font-serif text-stone-900 tracking-tight leading-[1.05]">Tell Us About Your Companion</h2>
      </div>
      <div className="space-y-32">
        <div className="space-y-8">
          <label className="text-[8px] font-mono uppercase tracking-[0.35em] text-stone-600 block font-medium">
            Dog's Name
          </label>
          <input
            className="w-full bg-transparent border-b-2 border-stone-300 pb-6 outline-none font-serif text-4xl text-stone-900 focus:border-stone-700 transition-colors placeholder:text-stone-300 font-light"
            placeholder="e.g., Paya"
            value={dogData.name}
            onChange={(e) => setDogData({ ...dogData, name: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
          <div className="space-y-8">
            <label className="text-[8px] font-mono uppercase tracking-[0.35em] text-stone-600 block font-medium">
              Sex
            </label>
            <div className="grid grid-cols-2 border border-stone-200/70 overflow-hidden bg-white/50 rounded-lg">
              {['female', 'male'].map((type) => (
                <button
                  key={type}
                  onClick={() => setDogData({ ...dogData, gender: type })}
                  className={`py-6 px-5 text-[8.5px] font-mono uppercase tracking-[0.32em] transition-all font-medium ${
                    dogData.gender === type ? 'bg-stone-900 text-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.2)]' : 'text-stone-600 hover:bg-white/80'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-8">
            <label className="text-[8px] font-mono uppercase tracking-[0.35em] text-stone-600 block font-medium">
              Age
            </label>
            <div className="flex gap-8">
              <div className="flex-1">
                <input
                  type="number"
                  min="0"
                  max="30"
                  onKeyDown={handleNumberInput}
                  className="w-full bg-transparent border-b-2 border-stone-300 pb-4 outline-none font-serif text-3xl text-stone-900 focus:border-stone-700 transition-colors placeholder:text-stone-300 font-light"
                  placeholder="0"
                  value={dogData.age}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '' || (Number(val) >= 0 && Number(val) <= 30)) setDogData({ ...dogData, age: val });
                  }}
                />
                <span className="text-[8px] text-stone-500 font-mono uppercase tracking-[0.32em] mt-3 block font-medium">Years</span>
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  min="0"
                  max="11"
                  onKeyDown={handleNumberInput}
                  className="w-full bg-transparent border-b-2 border-stone-300 pb-4 outline-none font-serif text-3xl text-stone-900 focus:border-stone-700 transition-colors placeholder:text-stone-300 font-light"
                  placeholder="0"
                  value={dogData.ageMonths}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '' || (Number(val) >= 0 && Number(val) <= 11)) setDogData({ ...dogData, ageMonths: val });
                  }}
                />
                <span className="text-[8px] text-stone-500 font-mono uppercase tracking-[0.32em] mt-3 block font-medium">Months</span>
              </div>
            </div>
          </div>
          <div className="space-y-8">
            <label className="text-[8px] font-mono uppercase tracking-[0.35em] text-stone-600 block font-medium">
              Weight
            </label>
            <div className="max-w-[200px]">
              <input
                type="number"
                min="0"
                onKeyDown={handleNumberInput}
                className="w-full bg-transparent border-b-2 border-stone-300 pb-4 outline-none font-serif text-3xl text-stone-900 focus:border-stone-700 transition-colors placeholder:text-stone-300 font-light"
                placeholder="Weight"
                value={dogData.weight}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '' || Number(val) >= 0) setDogData({ ...dogData, weight: val });
                }}
              />
              <span className="text-[8px] text-stone-500 font-mono uppercase tracking-[0.32em] mt-3 block font-medium">Lbs</span>
            </div>
          </div>
        </div>
        <div className="space-y-8">
          <label className="text-[8px] font-mono uppercase tracking-[0.35em] text-stone-600 block font-medium">
            Breed
          </label>
          <div className="space-y-4">
            <input
              className="w-full bg-transparent border-b-2 border-stone-300 pb-4 outline-none font-serif text-2xl text-stone-900 focus:border-stone-700 transition-colors placeholder:text-stone-300 font-light"
              placeholder="e.g., Golden Retriever, Lab Mix"
              value={dogData.breed}
              onChange={(e) => setDogData({ ...dogData, breed: e.target.value })}
            />
            <p className="text-[8px] text-stone-500 font-mono uppercase tracking-[0.32em] font-medium">Optional -- type whatever you know</p>
          </div>
        </div>

        <div className="space-y-10">
          <label className="text-[8px] font-mono uppercase tracking-[0.35em] text-stone-600 block font-medium">
            Size Category
          </label>
          <div className="grid grid-cols-5 border border-stone-200/70 overflow-hidden bg-white/50 rounded-lg">
            {DOG_SIZES.map((size) => (
              <button
                key={size}
                onClick={() => setDogData({ ...dogData, size })}
                className={`py-6 px-3 text-[8.5px] font-mono uppercase tracking-[0.25em] transition-all border-r last:border-r-0 border-stone-200/70 font-medium ${
                  dogData.size === size ? 'bg-stone-900 text-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.2)]' : 'text-stone-600 hover:bg-white/80'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-10">
          <label className="text-[8px] font-mono uppercase tracking-[0.35em] text-stone-600 block font-medium">
            Breed Group
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {DOG_GROUPS.map((g) => (
              <button
                key={g.value}
                onClick={() => setDogData({ ...dogData, group: g.value })}
                className={`text-left px-5 py-4 border rounded-lg transition-all ${
                  dogData.group === g.value
                    ? 'bg-stone-900 text-white border-stone-900 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.2)]'
                    : 'border-stone-200/70 bg-white/50 text-stone-700 hover:bg-white/80 hover:border-stone-300'
                }`}
              >
                <span className="text-[9px] font-mono uppercase tracking-[0.25em] font-medium block">{g.label}</span>
                <span className={`text-[10px] mt-1 block font-light ${dogData.group === g.value ? 'text-stone-300' : 'text-stone-400'}`}>{g.examples}</span>
              </button>
            ))}
          </div>
        </div>

      </div>
      <div className="flex justify-between items-center pt-24 border-t border-stone-200/30">
        {import.meta.env.DEV && (
          <button
            onClick={() => {
              setDogData({ ...dogData, name: dogData.name || 'Paya', age: dogData.age || '5', ageMonths: dogData.ageMonths || '0', weight: dogData.weight || '45', gender: dogData.gender || 'female', breed: 'Golden Retriever', size: 'Large', group: 'sporting' });
              setStep('profile');
              window.scrollTo(0, 0);
            }}
            className="text-[9px] font-mono uppercase tracking-widest text-amber-600 border border-amber-300 px-4 py-2 rounded hover:bg-amber-50 transition-colors"
          >
            Dev Skip
          </button>
        )}
        <button
          disabled={!dogData.name || (!dogData.age && !dogData.ageMonths) || !dogData.gender || !dogData.weight || !dogData.size || !dogData.group}
          onClick={handleProceed}
          className={`bg-stone-900 text-white px-16 py-6 text-[8.5px] font-mono uppercase tracking-[0.35em] flex items-center gap-4 transition-all font-medium ${
            !dogData.name || (!dogData.age && !dogData.ageMonths) || !dogData.gender || !dogData.weight || !dogData.size || !dogData.group ? 'opacity-30 cursor-not-allowed' : 'hover:bg-stone-800 hover:-translate-y-1 hover:shadow-[0_25px_60px_-10px_rgba(0,0,0,0.2)]'
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
              <Icons.X size={18} className="text-stone-400" />
            </button>

            <div className="p-10 sm:p-12 space-y-8 text-center">
              <Icons.Sprout className="text-stone-600 w-10 h-10 mx-auto" strokeWidth={1.5} />
              <div className="space-y-4">
                <h3 className="text-3xl sm:text-4xl font-serif text-stone-900 tracking-tight leading-[1.1]">
                  The Growth Phase
                </h3>
                <div className="h-px w-12 bg-stone-300 mx-auto" />
              </div>

              <div className="space-y-5 text-left">
                <p className="text-stone-700 text-[15px] leading-[1.85] font-light">
                  {dogData.name || 'Your companion'} is still in the growth phase. Under 18 months, a dog's biology is writing foundational code that will shape every system for life — bones still forming, neural pathways still branching, the microbiome still finding its balance.
                </p>
                <p className="text-stone-700 text-[15px] leading-[1.85] font-light">
                  Our Vitality Audit is calibrated for dogs whose biological systems have stabilized enough to measure, map, and optimize. Running it now would give you numbers, but they wouldn't mean what we need them to mean.
                </p>
                <p className="text-stone-900 text-[15px] leading-[1.85] font-medium">
                  Come back when {dogData.name || 'your companion'} crosses 18 months. We'll be here — and the audit will be sharper for the wait.
                </p>
              </div>

              <div className="bg-stone-50 border border-stone-200/70 rounded-xl p-6 text-left space-y-3">
                <p className="text-stone-700 text-[14px] leading-[1.85] font-light">
                  In the meantime — if you have questions about {dogData.name || 'your companion'}'s growth phase, nutrition, or just want guidance on setting the right foundation early, we're always happy to help.
                </p>
                <p className="text-stone-700 text-[14px] leading-[1.85] font-light">
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
                  className="text-[8.5px] font-mono uppercase tracking-[0.35em] text-stone-600 hover:text-stone-800 transition-colors font-medium px-6 py-3"
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
