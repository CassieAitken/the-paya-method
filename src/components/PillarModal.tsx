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

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#FDFBF7] rounded-none shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-[#FDFBF7] border-b border-[#E8E2D9] p-6 flex items-start justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#9AB8C4] font-medium mb-1.5">The Seven Biology Markers</p>
            <h2 className="text-2xl font-serif text-[#2A2A28]">{pillar.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#8A8A86] hover:text-[#2A2A28] transition-colors mt-1"
          >
            <Icons.X size={22} strokeWidth={1.5} />
          </button>
        </div>

        <div className="p-8 space-y-10">
          <div className="space-y-4">
            <h3 className="text-[10px] uppercase tracking-[0.15em] text-[#8A8A86] font-medium">
              What We Measure
            </h3>
            <p className="text-lg leading-[1.8] text-[#5C534E] font-light">
              {pillar.guidance}
            </p>
          </div>

          <div className="border-t border-[#E8E2D9] pt-8 space-y-4">
            <h3 className="text-[10px] uppercase tracking-[0.15em] text-[#8A8A86] font-medium">
              The Human Bridge
            </h3>
            <p className="text-lg leading-[1.8] text-[#5C534E] font-light">
              {pillar.insight}
            </p>
          </div>

          <div className="border-t border-[#E8E2D9] pt-8 space-y-4">
            <h3 className="text-[10px] uppercase tracking-[0.15em] text-[#8A8A86] font-medium">
              The Vitality Opportunity
            </h3>
            <p className="text-base leading-[1.8] text-[#5C534E] font-light">
              {pillar.endpointDesc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
