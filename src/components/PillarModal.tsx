import { useEffect } from 'react';
import { Icons } from './Icons';

interface PillarModalProps {
  isOpen: boolean;
  pillar: any;
  onClose: () => void;
}

export function PillarModal({ isOpen, pillar, onClose }: PillarModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !pillar) return null;

  const Icon = pillar.Icon;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#4B1D5C] rounded-none shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-[#4B1D5C] border-b border-[#FDFBF7]/15 p-6 flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 flex items-center justify-center border border-[#FDFBF7]/15 bg-[#FDFBF7]/10 rounded-lg">
              <Icon size={24} strokeWidth={1.2} className="text-[#9AB8C4]" />
            </div>
            <div>
              <h2 className="text-2xl font-serif text-[#FDFBF7]">{pillar.title}</h2>
              <p className="text-sm text-[#C9B9CE] mt-1">The Seven Pillars of Vitality</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#9AB8C4] hover:text-[#FDFBF7] transition-colors"
          >
            <Icons.X size={24} strokeWidth={1.5} />
          </button>
        </div>

        <div className="p-8 space-y-10">
          <div className="space-y-4">
            <h3 className="text-sm uppercase tracking-[0.15em] text-[#9AB8C4] font-medium">
              What We Measure
            </h3>
            <p className="text-lg leading-[1.8] text-[#E4D9E8] font-light">
              {pillar.guidance}
            </p>
          </div>

          <div className="border-t border-[#FDFBF7]/15 pt-8 space-y-4">
            <h3 className="text-sm uppercase tracking-[0.15em] text-[#9AB8C4] font-medium">
              The Human Bridge
            </h3>
            <p className="text-lg leading-[1.8] text-[#E4D9E8] font-light">
              {pillar.insight}
            </p>
          </div>

          <div className="border-t border-[#FDFBF7]/15 pt-8 space-y-4">
            <h3 className="text-sm uppercase tracking-[0.15em] text-[#9AB8C4] font-medium">
              The Vitality Opportunity
            </h3>
            <p className="text-base leading-[1.8] text-[#E4D9E8] font-light">
              {pillar.endpointDesc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
