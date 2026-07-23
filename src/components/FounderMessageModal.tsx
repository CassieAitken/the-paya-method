import { useEffect } from 'react';
import { Icons } from './Icons';

export function FounderMessageModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-black/60" onClick={onClose}>
      <div className="relative bg-[#4B1D5C] rounded-none shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-8 lg:p-12 space-y-8">
          <div className="flex items-start justify-between">
            <h3 className="text-4xl lg:text-5xl font-serif text-[#FDFBF7] leading-tight">
              A Message From<br />the Founder
            </h3>
            <button
              onClick={onClose}
              className="ml-4 p-2 hover:bg-[#FDFBF7]/10 rounded-lg transition-colors flex-shrink-0 mt-1"
            >
              <Icons.X size={22} className="text-[#B09469]" />
            </button>
          </div>

          <div className="space-y-6 text-[#E4D9E8] leading-[1.8] font-light">
            <p>
              I've sat with a lot of dogs. Every stage of life. And I've watched their people — noticing every shift, every change, wondering what they're missing. For too long, we've been reactive. Wait for the diagnosis. Wait for something to break. Wait for decline.
            </p>
            <p>
              The science tells us something different: vitality doesn't start at the vet's office. It starts now. In your living room. In the rhythm of your mornings.
            </p>
            <p>
              Paya Labs was built in collaboration with a small group of veterinary researchers, canine biologists, and wellness scientists who believed the same thing — that the markers of decline are visible long before decline arrives, and that the people best positioned to act on them are the ones who love these animals most.
            </p>
            <p>
              Your dog doesn't need more things. They need you to understand them at the cellular level. They need rhythm. They need to know you see them — not as a pet, but as a being whose nervous system is wired to yours. When you sleep well, they heal better. When you're calm, their inflammation drops. This isn't metaphor. This is biology.
            </p>
            <p>
              That's why we built this. Not another protocol. A map. These souls ask for almost nothing — a rhythm, your presence, your calm — and in return they give us everything. The least we can do is meet their devotion with the same quality of attention.
            </p>
            <p>
              Thank you for caring enough to look this closely. It means everything — to me, and to them.
            </p>

            <div className="pt-6 border-t border-[#FDFBF7]/15">
              <p className="text-lg font-serif text-[#FDFBF7]">Cassie Aitken</p>
              <p className="text-[10px] text-[#C9B9CE] uppercase tracking-[0.15em] mt-1">Founder, The Paya Method</p>
              <ul className="mt-3 space-y-1.5">
                {[
                  '15+ Years Wellness Practice',
                  'Holistic Nutrition & Lifestyle',
                  'Animal Behaviorist',
                  'Canine Biology & Nervous System Researcher',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-[#C9B9CE] font-light">
                    <span className="w-1 h-1 rounded-full bg-[#B09469] flex-shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
