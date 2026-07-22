import { Icons } from '../components/Icons';
import { ResultsHero } from './ResultsHero';
import { ResultsBlueprint } from './ResultsBlueprint';

export function Results({
  dogData,
  results,
  directives,
  track,
  hasPaid,
  isProcessingPayment,
  paymentSuccess,
  shareCopied,
  auditShared,
  handlePurchase,
  handleShare,
  handleShareAudit,
  selectedRituals,
  selectedTier,
  setSelectedTier,
  onShowBookingModal,
  showTierModal,
  setShowTierModal,
}: any) {
  const name = dogData.name || 'your companion';
  const isLegacy = track === 'legacy';
  const isMaster = track === 'master';
  const { pSubj, pObj } = results.pronouns;

  return (
    <div className="pt-40 pb-48 animate-in-slow space-y-24 max-w-6xl mx-auto px-6">
      {/* Track Indicator */}
      {(isLegacy || isMaster) && (
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 border border-stone-300/60 bg-white/60 backdrop-blur-sm rounded-full">
            <span className="w-2 h-2 rounded-full bg-stone-500 animate-pulse"></span>
            <span className="text-[9px] font-mono uppercase tracking-[0.35em] text-stone-600 font-medium">
              {isLegacy ? '[LEGACY MODE]' : '[MASTER LEVEL]'}
            </span>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {paymentSuccess && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-stone-900 text-white px-8 py-5 rounded-full shadow-2xl flex items-center gap-3 border border-stone-800">
            <Icons.Check size={20} className="text-stone-300" />
            <div className="space-y-0.5">
              <p className="font-mono text-[11px] font-bold uppercase tracking-wider">Blueprint Unlocked</p>
              <p className="text-sm font-light">The full protocol is now yours.</p>
            </div>
          </div>
        </div>
      )}

      {/* HERO -- Free for everyone */}
      <ResultsHero
        dogData={dogData}
        results={results}
        hasPaid={hasPaid}
        track={track}
        onUnlock={() => setShowTierModal(true)}
      />

      {/* BLUEPRINT -- Paid content */}
      {hasPaid && (
        <ResultsBlueprint
          dogData={dogData}
          results={results}
          directives={directives}
          track={track}
          selectedRituals={selectedRituals}
          onShowBookingModal={onShowBookingModal}
          handleShare={handleShare}
          handleShareAudit={handleShareAudit}
          shareCopied={shareCopied}
          auditShared={auditShared}
        />
      )}

      {/* CLOSING */}
      <div className="space-y-16 pt-20 border-t border-stone-200/30">
        <div className="max-w-3xl mx-auto text-center space-y-12">
          <div>
            <h3 className="text-5xl sm:text-6xl lg:text-7xl font-serif text-stone-900 tracking-tight leading-[1.1] mb-8">
              {isLegacy ? 'The Golden Spark' : isMaster ? 'The Enduring Spark' : 'The Long-term Spark'}
            </h3>
            {isLegacy ? (
              <p className="text-lg sm:text-xl lg:text-2xl leading-[1.9] text-stone-800 font-light">
                {hasPaid
                  ? `In 30 days, you won't look at ${name} the same way. Not because ${pSubj}'ve changed — because you'll finally see what was always there. The quiet fire. The deep trust. The desire to stay close to you for as long as this body allows. Our protocol doesn't add time. It honors what remains — and helps it burn brighter.`
                  : `Every dog in the golden chapter still carries a spark — a reserve of warmth and vitality that the years haven't touched. For ${name}, that spark is tended by you. Whether you unlock the full blueprint today or hold what you've learned close, something between you has already deepened.`}
              </p>
            ) : isMaster ? (
              <p className="text-lg sm:text-xl lg:text-2xl leading-[1.9] text-stone-800 font-light">
                {hasPaid
                  ? `In 30 days, you won't look at ${name} the same way. Not because ${pSubj}'ve changed — because you'll finally see what a decade of shared life has actually built. The resilience. The responsiveness. The quiet defiance of the clock. Our protocol doesn't create vitality — it sharpens what you've already forged, at the stage where it matters most.`
                  : `A dog who has kept the fire burning for over a decade carries something most never achieve — an enduring spark that refuses to dim. For ${name}, that spark was built by you. Whether you unlock the full blueprint today or carry what you've learned forward, something has already shifted. The years ahead will feel it.`}
              </p>
            ) : (
              <p className="text-lg sm:text-xl lg:text-2xl leading-[1.9] text-stone-800 font-light">
                {hasPaid
                  ? `In 30 days, you won't look at ${name} the same way. Not because ${pSubj}'ve changed — because you'll finally see what was always there. The resilience. The responsiveness. The desire to be fully alive. Our protocol doesn't create vitality. It removes what was hiding it.`
                  : `Every dog carries a long-term spark — a reserve of vitality waiting for the right conditions to emerge. For ${name}, those conditions start with you. Whether you unlock the full blueprint today or carry what you've learned into tomorrow, something has already shifted.`}
              </p>
            )}
          </div>

          {hasPaid && (
            <div className="space-y-6 text-left bg-white/80 backdrop-blur-md border border-stone-200/70 p-10 lg:p-12 rounded-xl">
              {isLegacy ? (
                <>
                  <p className="text-stone-800 leading-[1.9] font-light">
                    The number on the chart says one thing. But the light in {name}'s eyes when you walk into the room? That says something else entirely. Our blueprint doesn't fight the clock. It changes the <strong>quality of every moment you share</strong> — making {pObj} feel held, felt, and deeply known.
                  </p>
                  <p className="text-stone-900 font-medium leading-[1.9]">
                    You already know how to love this dog. Now you have the map to love {pObj} with <strong>reverence</strong>.
                  </p>
                </>
              ) : isMaster ? (
                <>
                  <p className="text-stone-800 leading-[1.9] font-light">
                    A decade is not just a number — it's proof. Proof that the patterns you built are working, that the body you've cared for is still answering the call. Our blueprint doesn't change the years on the chart. It changes the <strong>precision of every decision you make from here</strong> — sharpening what you've already built into something that carries {pObj} further.
                  </p>
                  <p className="text-stone-900 font-medium leading-[1.9]">
                    You already know how to love this dog. Now you have the map to love {pObj} with <strong>mastery</strong>.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-stone-800 leading-[1.9] font-light">
                    Age is a number on a chart. What we're actually looking at is a body that learned patterns — some that serve vitality, some that don't. Our blueprint doesn't change that number. It changes the <strong>conversation between you and {name}'s biology</strong>. It makes {pObj} feel seen. Felt. Partnered with at the cellular level.
                  </p>
                  <p className="text-stone-900 font-medium leading-[1.9]">
                    You already know how to love this dog. Now you have the map to love {pObj} with <strong>precision</strong>.
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* SIGN-OFF */}
      <div className="text-center space-y-8 pt-20 border-t border-stone-200/30">
        <div className="max-w-xl mx-auto space-y-6">
          <p className="text-stone-800 text-lg sm:text-xl font-light leading-[1.9]">
            Thank you for caring enough to look this closely at {name}'s wellbeing. That alone sets you apart.
          </p>
          <p className="text-stone-600 text-base font-light leading-[1.8]">
            If you'd like to go deeper — or just want someone in your corner — we're here.
          </p>
        </div>
        <button
          onClick={onShowBookingModal}
          className="inline-flex items-center gap-3 px-8 py-4 border border-stone-300 text-stone-700 text-[9px] font-mono uppercase tracking-[0.3em] hover:border-stone-500 hover:bg-stone-50 transition-all rounded-lg font-bold"
        >
          <Icons.Heart size={16} />
          Book a Consultation
        </button>
      </div>
    </div>
  );
}
