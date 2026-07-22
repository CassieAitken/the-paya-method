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
    <div className="py-40 space-y-28 animate-in max-w-4xl mx-auto px-6">
      <div className="text-center space-y-12">
        <Icons.PawPrint className="text-stone-600 w-12 h-12 mx-auto" strokeWidth={1.5} />
        <div className="editorial-divider max-w-md mx-auto"></div>
        <h2 className="text-5xl sm:text-6xl lg:text-7xl font-serif text-stone-900 tracking-tight leading-[1.05]">The Mirror</h2>
        <p className="text-stone-700 text-lg lg:text-xl max-w-2xl mx-auto leading-[1.8] font-light">
          One moment. One observation. Tell us: when does {dogData.name || 'your companion'} mirror something from <strong>your</strong> energy or rhythm? This shapes our analysis more than you'd expect.
        </p>
      </div>

      <div className="space-y-5">
        <div className="flex flex-wrap justify-center gap-3">
          {PROMPT_STARTERS.map((starter) => (
            <button
              key={starter}
              type="button"
              onClick={() => {
                if (!dogData.reflection) {
                  setDogData({ ...dogData, reflection: starter + ' ' });
                }
              }}
              className={`text-sm font-light px-5 py-2.5 rounded-full border transition-all duration-300 ${
                dogData.reflection
                  ? 'border-stone-200/40 text-stone-300 cursor-default'
                  : 'border-stone-300/60 text-stone-600 hover:border-stone-400 hover:bg-white/60 cursor-pointer'
              }`}
            >
              {starter}
            </button>
          ))}
        </div>

        <div className="bg-white/80 backdrop-blur-md p-10 shadow-[0_15px_50px_-12px_rgba(0,0,0,0.08)] border border-stone-200/70 rounded-xl">
          <textarea
            className="w-full h-64 bg-transparent p-8 outline-none text-2xl lg:text-3xl font-serif text-stone-900 placeholder:text-stone-400 resize-none leading-[1.7] font-light"
            placeholder="e.g., I noticed she sleeps much deeper on the days my own anxiety is low..."
            value={dogData.reflection}
            onChange={(e) => setDogData({ ...dogData, reflection: e.target.value })}
          />
          <div className="flex justify-end px-8">
            <span className={`text-xs font-mono tracking-wide transition-colors duration-300 ${
              isValid ? 'text-stone-400' : 'text-stone-400/60'
            }`}>
              {charCount < MIN_CHARS
                ? `${MIN_CHARS - charCount} more character${MIN_CHARS - charCount === 1 ? '' : 's'} needed`
                : 'Thank you for sharing'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-10 pt-20">
        <div className="editorial-divider max-w-xs"></div>
        <button
          disabled={!isValid}
          onClick={() => {
            setStep('ownerInfo');
            window.scrollTo(0, 0);
          }}
          className={`px-20 py-6 text-[8.5px] font-mono uppercase tracking-[0.35em] font-medium rounded-lg transition-all duration-500 ${
            isValid
              ? 'bg-stone-900 text-white hover:bg-stone-800 hover:-translate-y-1 hover:shadow-[0_25px_60px_-10px_rgba(0,0,0,0.2)] cursor-pointer'
              : 'bg-stone-300 text-stone-500 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
