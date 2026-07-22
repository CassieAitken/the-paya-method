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
    <div className="w-full bg-[#FDFBF7]">
      {showIntro && (
        <div className="border-b border-[#E8E2D9] py-10 sm:py-16">
          <div className="max-w-4xl mx-auto px-6 space-y-8">
            <div className="flex items-start justify-between gap-6">
              <div className="space-y-4 flex-1">
                <p className="font-mono text-[8px] uppercase tracking-[0.35em] text-[#8A7F72]">What We're Building Together</p>
                <h2 className="text-3xl sm:text-4xl font-serif text-[#2A2421] leading-[1.1] tracking-tight">Your assessment will produce:</h2>
              </div>
              <button
                onClick={() => setShowIntro(false)}
                className="p-2 hover:bg-[#E8E2D9]/50 transition-colors flex-shrink-0 mt-2"
              >
                <Icons.X size={20} className="text-[#8A7F72]" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#E8E2D9]">
              {[
                { icon: Icons.TrendingUp, title: 'Vitality Score & Archetype', desc: 'One number that reveals how well your dog\'s daily life supports their body\'s needs.' },
                { icon: Icons.Brain, title: 'The Seven Pillars', desc: 'See exactly where they\'re thriving and where small changes make the biggest difference.' },
                { icon: Icons.Zap, title: 'Personalized Protocol', desc: 'Priority-ordered actions for your dog — starting with what moves the needle most.' },
                { icon: Icons.Compass, title: 'Mirror Analysis', desc: 'How your daily habits and energy shape your dog\'s biology in ways you might not expect.' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="bg-[#FDFBF7] p-6 sm:p-8 space-y-3">
                    <Icon size={18} className="text-[#415A42]" strokeWidth={1.3} />
                    <h4 className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#2A2421] font-bold">{item.title}</h4>
                    <p className="text-[13px] text-[#6B6159] leading-[1.7] font-light">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="py-12 sm:py-24 lg:py-36 max-w-4xl mx-auto px-6 space-y-16 sm:space-y-24 lg:space-y-32">
        <div className="space-y-4">
          <p className="font-mono text-[8px] uppercase tracking-[0.35em] text-[#8A7F72]">The Assessment</p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#2A2421] tracking-tight leading-[1.05]">Tell Us About Your Companion</h2>
        </div>

        <div className="space-y-16 sm:space-y-24 lg:space-y-32">
          <div className="space-y-6">
            <label className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#8A7F72] block">
              Dog's Name
            </label>
            <input
              className="w-full bg-transparent border-b border-[#C4B9A8] pb-4 sm:pb-6 outline-none font-serif text-3xl sm:text-4xl text-[#2A2421] focus:border-[#415A42] transition-colors placeholder:text-[#C4B9A8] font-light"
              placeholder="e.g., Paya"
              value={dogData.name}
              onChange={(e) => setDogData({ ...dogData, name: e.target.value })}
            />
          </div>

          <div className="space-y-6">
            <label className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#8A7F72] block">
              Photo <span className="text-[#C4B9A8]">(optional)</span>
            </label>
            <div className="flex items-center gap-6">
              {dogPhoto ? (
                <div className="relative group">
                  <img
                    src={dogPhoto}
                    alt="Dog"
                    className="w-20 h-20 rounded-full object-cover border border-[#E8E2D9]"
                  />
                  <button
                    onClick={() => setDogPhoto(null)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-[#2A2421] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Icons.X size={10} />
                  </button>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full border border-dashed border-[#C4B9A8] flex items-center justify-center">
                  <Icons.Camera size={20} className="text-[#C4B9A8]" strokeWidth={1.2} />
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#6B6159] border border-[#E8E2D9] px-5 py-3 hover:border-[#C4B9A8] transition-colors"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 sm:gap-20 lg:gap-28">
            <div className="space-y-6">
              <label className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#8A7F72] block">
                Sex
              </label>
              <div className="grid grid-cols-2 border border-[#E8E2D9] overflow-hidden">
                {['female', 'male'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setDogData({ ...dogData, gender: type })}
                    className={`py-5 px-5 text-[9px] font-mono uppercase tracking-[0.25em] transition-all ${
                      dogData.gender === type ? 'bg-[#2A2421] text-white' : 'text-[#6B6159] hover:bg-[#E8E2D9]/30'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <label className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#8A7F72] block">
                Age
              </label>
              <div className="flex gap-8">
                <div className="flex-1">
                  <input
                    type="number"
                    min="0"
                    max="30"
                    onKeyDown={handleNumberInput}
                    className="w-full bg-transparent border-b border-[#C4B9A8] pb-4 outline-none font-serif text-3xl text-[#2A2421] focus:border-[#415A42] transition-colors placeholder:text-[#C4B9A8] font-light"
                    placeholder="0"
                    value={dogData.age}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || (Number(val) >= 0 && Number(val) <= 30)) setDogData({ ...dogData, age: val });
                    }}
                  />
                  <span className="text-[8px] text-[#8A7F72] font-mono uppercase tracking-[0.25em] mt-3 block">Years</span>
                </div>
                <div className="flex-1">
                  <input
                    type="number"
                    min="0"
                    max="11"
                    onKeyDown={handleNumberInput}
                    className="w-full bg-transparent border-b border-[#C4B9A8] pb-4 outline-none font-serif text-3xl text-[#2A2421] focus:border-[#415A42] transition-colors placeholder:text-[#C4B9A8] font-light"
                    placeholder="0"
                    value={dogData.ageMonths}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || (Number(val) >= 0 && Number(val) <= 11)) setDogData({ ...dogData, ageMonths: val });
                    }}
                  />
                  <span className="text-[8px] text-[#8A7F72] font-mono uppercase tracking-[0.25em] mt-3 block">Months</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-12 sm:pt-20 border-t border-[#E8E2D9]">
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
              className="text-[9px] font-mono uppercase tracking-widest text-amber-600 border border-amber-300 px-4 py-2 hover:bg-amber-50 transition-colors"
            >
              Dev Skip
            </button>
          )}
          <button
            disabled={!dogData.name || (!dogData.age && !dogData.ageMonths) || !dogData.gender}
            onClick={handleProceed}
            className={`bg-[#2A2421] text-white px-10 py-5 sm:px-14 sm:py-5 text-[10px] font-mono uppercase tracking-[0.25em] flex items-center gap-3 transition-all font-bold ${
              !dogData.name || (!dogData.age && !dogData.ageMonths) || !dogData.gender ? 'opacity-25 cursor-not-allowed' : 'hover:bg-[#3A3330]'
            }`}
          >
            Proceed <Icons.ArrowRight size={14} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {showGrowthGate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-[#2A2421]/60 backdrop-blur-sm"
            onClick={() => setShowGrowthGate(false)}
          />
          <div className="relative bg-[#FDFBF7] max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in">
            <button
              onClick={() => setShowGrowthGate(false)}
              className="absolute top-5 right-5 p-2 hover:bg-[#E8E2D9]/50 transition-colors"
            >
              <Icons.X size={16} className="text-[#8A7F72]" />
            </button>

            <div className="p-10 sm:p-12 space-y-8">
              <div className="space-y-4">
                <p className="font-mono text-[8px] uppercase tracking-[0.35em] text-[#8A7F72]">The Growth Phase</p>
                <h3 className="text-3xl sm:text-4xl font-serif text-[#2A2421] tracking-tight leading-[1.1]">
                  Under 18 months
                </h3>
                <div className="h-px w-12 bg-[#C4B9A8]" />
              </div>

              <div className="space-y-5">
                <p className="text-[#5C534E] text-[15px] leading-[1.85] font-light">
                  {dogData.name || 'Your companion'} is still in the growth phase. Under 18 months, a dog's biology is writing foundational code that will shape every system for life — bones still forming, neural pathways still branching, the microbiome still finding its balance.
                </p>
                <p className="text-[#5C534E] text-[15px] leading-[1.85] font-light">
                  Our Vitality Audit is calibrated for dogs whose biological systems have stabilized enough to measure, map, and optimize.
                </p>
                <p className="text-[#2A2421] text-[15px] leading-[1.85] font-medium">
                  Come back when {dogData.name || 'your companion'} crosses 18 months. We'll be here.
                </p>
              </div>

              <div className="border-l border-[#415A42]/30 pl-6 space-y-3">
                <p className="text-[#5C534E] text-[14px] leading-[1.85] font-light">
                  In the meantime — reach out to{' '}
                  <a
                    href={`mailto:payalabs01@gmail.com?subject=${encodeURIComponent((dogData.name || 'My dog') + ' — Growth Phase Question')}&body=${encodeURIComponent(`Hi Paya Labs,\n\nMy dog ${dogData.name || ''} is currently in the growth phase and I'd love some guidance.\n\n`)}`}
                    className="underline underline-offset-2 text-[#2A2421] hover:text-[#415A42] transition-colors"
                  >
                    payalabs01@gmail.com
                  </a>
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <button
                  onClick={() => setShowGrowthGate(false)}
                  className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#8A7F72] hover:text-[#2A2421] transition-colors px-4 py-3"
                >
                  Adjust Age
                </button>
                <button
                  onClick={() => {
                    setShowGrowthGate(false);
                    setStep('landing');
                    window.scrollTo(0, 0);
                  }}
                  className="bg-[#2A2421] text-white px-8 py-3.5 text-[9px] font-mono uppercase tracking-[0.25em] hover:bg-[#3A3330] transition-all font-bold"
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
