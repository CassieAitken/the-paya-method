import { Icons } from '../components/Icons';
import { DogData } from '../App';

const MIN_CHARS = 20;

const PROMPT_STARTERS = [
  "When I\u2019m calm, my dog...",
  "My dog\u2019s energy shifts when...",
  "I\u2019ve noticed my dog mirrors...",
];

export function Reflection({
  dogData,
  setDogData,
  setStep
}: {
  dogData: DogData;
  setDogData: (data: DogData) => void;
  setStep: (step: string) => void;
}) {
  const charCount = dogData.reflection.trim().length;
  const isValid = charCount >= MIN_CHARS;

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center px-6 py-16 sm:py-24">
      <div className="max-w-2xl w-full space-y-12 sm:space-y-16 animate-in">
        <div className="space-y-6">
          <p className="font-mono text-[8px] uppercase tracking-[0.35em] text-[#8A7F72]">The Mirror</p>
          <h2 className="text-4xl sm:text-5xl font-serif text-[#2A2421] tracking-tight leading-[1.05]">One observation.</h2>
          <p className="text-[#6B6159] text-base sm:text-lg leading-[1.85] font-light max-w-lg">
            When does {dogData.name || 'your companion'} mirror something from <strong className="font-medium text-[#2A2421]">your</strong> energy or rhythm? This shapes our analysis more than you'd expect.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {PROMPT_STARTERS.map((starter) => (
              <button
                key={starter}
                type="button"
                onClick={() => {
                  if (!dogData.reflection) {
                    setDogData({ ...dogData, reflection: starter + ' ' });
                  }
                }}
                className={`text-[12px] font-light px-4 py-2 border transition-all duration-300 ${
                  dogData.reflection
                    ? 'border-[#E8E2D9] text-[#C4B9A8] cursor-default'
                    : 'border-[#C4B9A8] text-[#6B6159] hover:border-[#8A7F72] cursor-pointer'
                }`}
              >
                {starter}
              </button>
            ))}
          </div>

          <div className="border border-[#E8E2D9] bg-white/60 p-6 sm:p-8">
            <textarea
              className="w-full h-48 sm:h-56 bg-transparent outline-none text-lg sm:text-xl font-serif text-[#2A2421] placeholder:text-[#C4B9A8] resize-none leading-[1.75] font-light"
              placeholder="e.g., I noticed she sleeps much deeper on the days my own anxiety is low..."
              value={dogData.reflection}
              onChange={(e) => setDogData({ ...dogData, reflection: e.target.value })}
            />
            <div className="flex justify-end pt-2 border-t border-[#E8E2D9]">
              <span className={`text-[10px] font-mono tracking-wide transition-colors duration-300 ${
                isValid ? 'text-[#8A7F72]' : 'text-[#C4B9A8]'
              }`}>
                {charCount < MIN_CHARS
                  ? `${MIN_CHARS - charCount} more character${MIN_CHARS - charCount === 1 ? '' : 's'} needed`
                  : 'Thank you for sharing'}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[#E8E2D9]">
          <button
            disabled={!isValid}
            onClick={() => {
              setStep('ownerInfo');
              window.scrollTo(0, 0);
            }}
            className={`bg-[#2A2421] text-white px-12 py-5 text-[10px] font-mono uppercase tracking-[0.25em] font-bold transition-all duration-300 ${
              isValid
                ? 'hover:bg-[#3A3330] cursor-pointer'
                : 'opacity-25 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
