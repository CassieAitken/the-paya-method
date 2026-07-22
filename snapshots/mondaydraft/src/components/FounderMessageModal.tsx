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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-black/50" onClick={onClose}>
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-b from-stone-50 to-white p-8 lg:p-12 space-y-8">
          <div className="flex items-start justify-between">
            <h3 className="text-4xl lg:text-5xl font-serif text-stone-900 leading-tight">
              A Message From<br />the Founder
            </h3>
            <button
              onClick={onClose}
              className="ml-4 p-2 hover:bg-stone-100 rounded-lg transition-colors flex-shrink-0 mt-1"
            >
              <Icons.X size={22} className="text-stone-500" />
            </button>
          </div>

          <div className="space-y-6 text-stone-800 leading-[1.8] font-light">
            <p>
              I've sat with a lot of dogs. Every stage of life. And I've watched their people — noticing every shift, every change, wondering what they're missing. For too long, we've been reactive. Wait for the diagnosis. Wait for something to break. Wait for decline.
            </p>
            <p>
              The science tells us something different: <strong>vitality doesn't start at the vet's office.</strong> It starts now. In your living room. In the rhythm of your mornings.
            </p>
            <p>
              Your dog doesn't need more things. They need you to understand them at the cellular level. They need rhythm. They need to know you see them — not as a pet, but as a being whose nervous system is wired to yours. When you sleep well, they heal better. When you're calm, their inflammation drops. This isn't metaphor. This is biology.
            </p>
            <p>
              That's why we built this. Not another protocol. A map. These gentle souls ask for almost nothing — a rhythm, your presence, your calm — and in return they give us everything. The bare minimum is to give them back the same quality of attention.
            </p>
            <p>
              Thank you for caring enough to look this closely. You're not just changing your dog's biology — you're part of a movement of people who believe our dogs deserve this kind of devotion. The vitality of our dogs won't be rewritten by the industry — it will be rewritten one home at a time. Starting with yours.
            </p>

            <div className="pt-6 border-t border-stone-200">
              <p className="text-lg font-serif text-stone-900">Cassie Aitken</p>
              <p className="text-[10px] text-stone-500 font-mono uppercase tracking-[0.2em] mt-1">Founder, PayaLabs</p>
              <p className="text-xs text-stone-400 mt-2 leading-[1.6] font-light">
                Certified Ayurveda Therapist and Holistic Wellness Practitioner with over three decades of experience working with both dogs and their humans. Her guidance focuses on natural health, vitality, longevity, and lifestyle — and is intended to complement, not replace, veterinary or medical care.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-stone-900 text-white py-4 rounded-lg font-mono text-[11px] tracking-widest font-bold hover:bg-stone-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
