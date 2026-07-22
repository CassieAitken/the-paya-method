import { useEffect } from 'react';
import { Icons } from './Icons';

interface TierModalProps {
  dogName: string;
  isProcessingPayment: boolean;
  onPurchase: () => void;
  onBookConsultation: () => void;
  onClose: () => void;
}

export function TierModal({ dogName, isProcessingPayment, onPurchase, onBookConsultation, onClose }: TierModalProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const namePossessive = dogName ? dogName + "'s" : "your dog's";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-b from-stone-50 to-white p-8 lg:p-10 space-y-8">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-4xl lg:text-5xl font-serif text-stone-900 leading-tight tracking-tight">
                Unlock the Blueprint
              </h3>
              <p className="text-stone-600 text-base mt-3 font-light leading-relaxed">
                Instant access to {namePossessive} complete <strong>Vitality Blueprint</strong> — the full analysis, 30-day directives, and every insight we found.
              </p>
            </div>
            <button
              onClick={onClose}
              className="ml-4 p-2 hover:bg-stone-100 rounded-lg transition-colors flex-shrink-0"
            >
              <Icons.X size={22} className="text-stone-500" />
            </button>
          </div>

          <div className="border-2 border-stone-900 rounded-xl p-8 bg-stone-50 space-y-6">
            <div>
              <h4 className="text-2xl font-serif text-stone-900 mb-2">Vitality Blueprint</h4>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-5xl font-serif text-stone-900">$19</span>
                <span className="text-stone-500 text-lg">one-time</span>
              </div>
              <p className="text-sm text-stone-500 font-light">Everything you need, right now</p>
            </div>
            <div className="border-t border-stone-200 pt-5">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Icons.Check size={16} className="text-stone-700 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-stone-700"><strong>Full archetype analysis</strong> & vitality blueprint</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icons.Check size={16} className="text-stone-700 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-stone-700"><strong>7 corrective directives</strong> — your 30-day protocol</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icons.Check size={16} className="text-stone-700 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-stone-700">Complete <strong>90-marker breakdown</strong> & pillar scores</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icons.Check size={16} className="text-stone-700 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-stone-700"><strong>Mirror analysis</strong> & Human-Dog Sync insights</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icons.Check size={16} className="text-stone-700 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-stone-700">PDF emailed to you instantly</span>
                </li>
              </ul>
            </div>
          </div>

          <button
            onClick={onPurchase}
            disabled={isProcessingPayment}
            className="w-full bg-stone-900 text-white py-6 font-mono text-[11px] tracking-widest font-bold hover:bg-stone-800 hover:-translate-y-1 transition-all active:scale-95 shadow-lg rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessingPayment ? (
              <>
                <Icons.Loader className="animate-spin inline mr-2" size={16} />
                PROCESSING...
              </>
            ) : (
              'UNLOCK FOR $19'
            )}
          </button>

          <div className="border-t border-stone-200 pt-6 space-y-4">
            <p className="font-mono text-[8px] uppercase tracking-[0.35em] text-stone-500 text-center">
              Want deeper personalised guidance?
            </p>
            <button
              onClick={onBookConsultation}
              className="w-full border-2 border-stone-300 text-stone-800 py-4 rounded-lg font-mono text-[10px] tracking-widest font-bold hover:border-stone-500 hover:bg-stone-50 transition-all flex items-center justify-center gap-3"
            >
              <Icons.Calendar size={15} strokeWidth={1.5} />
              Book a 1-on-1 Consultation — $100
            </button>
            <p className="text-[11px] text-stone-400 text-center font-light">
              One hour with Cassie. Calibrated to {namePossessive} specific biology and your daily life.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
