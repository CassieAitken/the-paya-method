import { useState, useEffect } from 'react';
import { Icons } from './Icons';

interface CheckinData {
  energyLevel: number;
  digestion: number;
  mobility: number;
  notes: string;
}

export function CheckinModal({
  checkinNumber,
  dogName,
  onSubmit,
  onClose,
  isLoading
}: {
  checkinNumber: number;
  dogName: string;
  onSubmit: (data: CheckinData) => Promise<void>;
  onClose: () => void;
  isLoading: boolean;
}) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const [formData, setFormData] = useState<CheckinData>({
    energyLevel: 3,
    digestion: 3,
    mobility: 3,
    notes: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      setError('');
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit check-in');
    }
  };

  const dayNumber = checkinNumber === 1 ? 30 : checkinNumber === 2 ? 60 : 90;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-white rounded-none shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-b from-stone-50 to-white p-8 lg:p-12 space-y-8">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <span className="text-sm text-[#6B6159] uppercase tracking-[0.15em]">Day {dayNumber} Check-In</span>
              <h3 className="text-4xl lg:text-5xl font-serif text-[#2A2421] leading-tight">
                How's {dogName} doing?
              </h3>
              <p className="text-[#6B6159] text-lg mt-4 font-light">
                Share observations about {dogName}'s vitality progress over the past month.
              </p>
            </div>
            <button
              onClick={onClose}
              className="ml-4 p-2 hover:bg-stone-100 rounded-lg transition-colors flex-shrink-0"
            >
              <Icons.X size={24} className="text-[#8A7F72]" />
            </button>
          </div>

          <div className="space-y-8">
            {/* Energy Level */}
            <div className="space-y-4">
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.15em] text-[#8A7F72] font-medium">
                  Energy Level
                </span>
                <p className="text-[#6B6159] text-sm mt-1 font-light">
                  How energized does {dogName} seem compared to the start?
                </p>
              </label>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => setFormData(prev => ({ ...prev, energyLevel: num }))}
                    className={`w-12 h-12 rounded-lg font-serif text-lg transition-all ${
                      formData.energyLevel === num
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-100 text-[#8A7F72] hover:bg-stone-200'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Digestion */}
            <div className="space-y-4">
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.15em] text-[#8A7F72] font-medium">
                  Digestion & Gut Health
                </span>
                <p className="text-[#6B6159] text-sm mt-1 font-light">
                  Any changes in digestion, stool quality, or appetite?
                </p>
              </label>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => setFormData(prev => ({ ...prev, digestion: num }))}
                    className={`w-12 h-12 rounded-lg font-serif text-lg transition-all ${
                      formData.digestion === num
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-100 text-[#8A7F72] hover:bg-stone-200'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobility */}
            <div className="space-y-4">
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.15em] text-[#8A7F72] font-medium">
                  Mobility & Movement
                </span>
                <p className="text-[#6B6159] text-sm mt-1 font-light">
                  How freely and easily does {dogName} move now?
                </p>
              </label>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => setFormData(prev => ({ ...prev, mobility: num }))}
                    className={`w-12 h-12 rounded-lg font-serif text-lg transition-all ${
                      formData.mobility === num
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-100 text-[#8A7F72] hover:bg-stone-200'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-4">
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.15em] text-[#8A7F72] font-medium">
                  Additional Observations (Optional)
                </span>
                <p className="text-[#6B6159] text-sm mt-1 font-light">
                  Any other changes you've noticed? What's standing out?
                </p>
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Share what you've noticed in the past month..."
                className="w-full bg-stone-50 border border-stone-200 rounded-lg p-4 text-sm text-[#5C534E] placeholder:text-[#C4B9A8] focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent font-light"
                rows={5}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 border-2 border-stone-300 text-[#8A7F72] py-4 rounded-lg text-[11px] tracking-[0.15em] font-bold hover:bg-stone-50 transition-colors disabled:opacity-50"
            >
              CANCEL
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 bg-stone-900 text-white py-4 rounded-lg text-[11px] tracking-[0.15em] font-bold hover:bg-stone-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading && <Icons.Loader className="animate-spin" size={16} />}
              SUBMIT CHECK-IN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
