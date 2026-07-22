import { useEffect } from 'react';
import { Icons } from './Icons';

export type ProductKey = 'vitality_blueprint' | 'blueprint_in_motion' | 'complete_vitality_system';

interface TierModalProps {
  dogName: string;
  isProcessingPayment: boolean;
  selectedProduct: ProductKey;
  onSelectProduct: (product: ProductKey) => void;
  onPurchase: () => void;
  onClose: () => void;
}

const PRODUCTS: { key: ProductKey; title: string; description: string; price: number }[] = [
  {
    key: 'vitality_blueprint',
    title: 'The Dog Biology Blueprint™',
    description: 'Your dog\'s complete Dog Biology Blueprint™ — 50 carefully selected markers, 7 Biology Markers, priority action steps, and Human-Dog Sync analysis.',
    price: 49,
  },
];

function getButtonLabel(key: ProductKey, dogName: string): string {
  const upper = dogName ? dogName.toUpperCase() : 'YOUR DOG';
  switch (key) {
    case 'vitality_blueprint':
      return `UNLOCK ${upper}'S BLUEPRINT — $49`;
    case 'blueprint_in_motion':
      return `GET THE ACTION GUIDE — $19`;
    case 'complete_vitality_system':
      return `GET THE COMPLETE SYSTEM — $39`;
  }
}

export function TierModal({ dogName, isProcessingPayment, selectedProduct: _sp, onSelectProduct, onPurchase, onClose }: TierModalProps) {
  useEffect(() => {
    onSelectProduct('vitality_blueprint');
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const product = PRODUCTS[0];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-white rounded-none shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-b from-stone-50 to-white p-8 lg:p-10 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-4xl lg:text-5xl font-serif text-[#2A2421] leading-tight tracking-tight">
                Unlock the Blueprint
              </h3>
              <p className="text-[#6B6159] text-base mt-3 font-light leading-relaxed">
                {dogName || 'Your dog'}'s complete personalized protocol.
              </p>
            </div>
            <button
              onClick={onClose}
              className="ml-4 p-2 hover:bg-stone-100 rounded-lg transition-colors flex-shrink-0"
            >
              <Icons.X size={22} className="text-[#C4B9A8]" />
            </button>
          </div>

          <div className="rounded-xl p-5 border-2 border-stone-900 bg-stone-50">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-serif text-lg text-[#2A2421] leading-tight mb-1">{product.title}</p>
                <p className="text-sm text-[#C4B9A8] font-light leading-relaxed">{product.description}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-2xl font-serif text-[#2A2421]">${product.price}</span>
                <p className="text-[9px] text-[#C4B9A8] font-light whitespace-nowrap">Founding Member Price</p>
              </div>
            </div>
          </div>

          <button
            onClick={onPurchase}
            disabled={isProcessingPayment}
            className="w-full bg-stone-900 text-white py-6 text-[11px] tracking-[0.15em] font-bold hover:bg-stone-800 hover:-translate-y-1 transition-all active:scale-95 shadow-lg rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessingPayment ? (
              <>
                <Icons.Loader className="animate-spin inline mr-2" size={16} />
                PROCESSING...
              </>
            ) : (
              getButtonLabel('vitality_blueprint', dogName)
            )}
          </button>

          <p className="text-[11px] text-stone-400 text-center font-light pt-2">
            Your dog's vitality changes as they age. Most owners reassess every 6 months.
          </p>
        </div>
      </div>
    </div>
  );
}
