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
  selectedProduct,
  showTierModal,
  setShowTierModal,
  dogPhoto,
  dogNumber,
}: any) {
  const name = dogData.name || 'your companion';
  const isLegacy = track === 'legacy';
  const isMaster = track === 'master';
  const { pSubj, pObj } = results.pronouns;

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <div className="pt-10 sm:pt-28 lg:pt-40 pb-12 sm:pb-32 lg:pb-48 animate-in-slow space-y-10 sm:space-y-20 lg:space-y-24 max-w-6xl mx-auto px-5 sm:px-6">
        {/* Track Indicator */}
        {(isLegacy || isMaster) && (
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 border border-[#E8E2D9] bg-white">
              <span className="w-2 h-2 rounded-full bg-[#2A2421] animate-pulse"></span>
              <span className="text-[10px] uppercase tracking-[0.15em] text-[#5C534E] font-medium">
                {isLegacy ? '[LEGACY MODE]' : '[MASTER LEVEL]'}
              </span>
            </div>
          </div>
        )}

        {/* Success Toast */}
        {paymentSuccess && (
          <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50">
            <div className="bg-[#4B1D5C] text-white px-8 py-5 rounded-none shadow-none flex items-center gap-3 border border-white/10">
              <Icons.Check size={20} className="text-[#2A2421]" />
              <div className="space-y-0.5">
                <p className="text-[11px] font-bold uppercase tracking-[0.15em]">Blueprint Unlocked</p>
                <p className="text-sm font-light text-white/80">The full blueprint is now yours.</p>
              </div>
            </div>
          </div>
        )}

        {/* HERO -- Free for everyone */}
        <ResultsHero
          dogData={dogData}
          results={results}
          directives={directives}
          hasPaid={hasPaid}
          track={track}
          onUnlock={() => setShowTierModal(true)}
          dogPhoto={dogPhoto}
        />

        {/* BLUEPRINT -- Paid content */}
        {hasPaid && (
          <ResultsBlueprint
            dogData={dogData}
            results={results}
            directives={directives}
            track={track}
            selectedRituals={selectedRituals}
            handleShare={handleShare}
            handleShareAudit={handleShareAudit}
            shareCopied={shareCopied}
            auditShared={auditShared}
            dogPhoto={dogPhoto}
            dogNumber={dogNumber}
          />
        )}

        {/* CLOSING */}
        <div className="space-y-10 sm:space-y-14 lg:space-y-16 pt-12 sm:pt-16 lg:pt-20 border-t border-[#E8E2D9]">
          <div className="max-w-3xl mx-auto text-center space-y-8 sm:space-y-12">
            <div>
              <h3 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif text-[#2A2421] tracking-tight leading-[1.1] mb-8">
                {isLegacy ? 'The Golden Spark' : isMaster ? 'The Enduring Spark' : 'The Long-term Spark'}
              </h3>
              {isLegacy ? (
                <p className="text-lg sm:text-xl lg:text-2xl leading-[1.9] text-[#5C534E] font-light">
                  {hasPaid
                    ? `In the weeks ahead, you won't look at ${name} the same way. Not because ${pSubj} changed — because you'll finally see what was always there. The quiet fire. The deep trust. The desire to stay close to you for as long as this body allows. This blueprint doesn't add time. It honors what remains — and helps it burn brighter.`
                    : `Every dog in the golden chapter still carries a spark — a reserve of warmth and vitality that the years haven't touched. For ${name}, that spark is tended by you. Whether you unlock the full blueprint today or hold what you've learned close, something between you has already deepened.`}
                </p>
              ) : isMaster ? (
                <p className="text-lg sm:text-xl lg:text-2xl leading-[1.9] text-[#5C534E] font-light">
                  {hasPaid
                    ? `In the weeks ahead, you won't look at ${name} the same way. Not because ${pSubj} changed — because you'll finally see what a decade of shared life has actually built. The resilience. The responsiveness. The quiet defiance of the clock. This blueprint doesn't create vitality — it sharpens what you've already forged, at the stage where it matters most.`
                    : `A dog who has kept the fire burning for over a decade carries something most never achieve — an enduring spark that refuses to dim. For ${name}, that spark was built by you. Whether you unlock the full blueprint today or carry what you've learned forward, something has already shifted. The years ahead will feel it.`}
                </p>
              ) : (
                <p className="text-lg sm:text-xl lg:text-2xl leading-[1.9] text-[#5C534E] font-light">
                  {hasPaid
                    ? `In the weeks ahead, you won't look at ${name} the same way. Not because ${pSubj} changed — because you'll finally see what was always there. The resilience. The responsiveness. The desire to be fully alive. This blueprint doesn't create vitality. It removes what was hiding it.`
                    : `Every dog carries a long-term spark — a reserve of vitality waiting for the right conditions to emerge. For ${name}, those conditions start with you. Whether you unlock the full blueprint today or carry what you've learned into tomorrow, something has already shifted.`}
                </p>
              )}
            </div>

            {hasPaid && (
              <div className="space-y-6 text-left bg-white border border-[#E8E2D9] p-6 sm:p-8 lg:p-12 rounded-none shadow-none">
                {isLegacy ? (
                  <>
                    <p className="text-[#5C534E] leading-[1.9] font-light">
                      The number on the chart says one thing. But the light in {name}'s eyes when you walk into the room? That says something else entirely. Our blueprint doesn't fight the clock. It changes the <strong>quality of every moment you share</strong> — making {pObj} feel held, felt, and deeply known.
                    </p>
                    <p className="text-[#2A2421] font-medium leading-[1.9]">
                      You already know how to love this dog. Now you have the map to love {pObj} with <strong>reverence</strong>.
                    </p>
                  </>
                ) : isMaster ? (
                  <>
                    <p className="text-[#5C534E] leading-[1.9] font-light">
                      A decade is not just a number — it's proof. Proof that the patterns you built are working, that the body you've cared for is still answering the call. Our blueprint doesn't change the years on the chart. It changes the <strong>precision of every decision you make from here</strong> — sharpening what you've already built into something that carries {pObj} further.
                    </p>
                    <p className="text-[#2A2421] font-medium leading-[1.9]">
                      You already know how to love this dog. Now you have the map to love {pObj} with <strong>mastery</strong>.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-[#5C534E] leading-[1.9] font-light">
                      Age is a number on a chart. What we're actually looking at is a body that learned patterns — some that serve vitality, some that don't. Our blueprint doesn't change that number. It changes the <strong>conversation between you and {name}'s biology</strong>. It makes {pObj} feel seen. Felt. Partnered with at the cellular level.
                    </p>
                    <p className="text-[#2A2421] font-medium leading-[1.9]">
                      You already know how to love this dog. Now you have the map to love {pObj} with <strong>precision</strong>.
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* SIGN-OFF */}
        <div className="text-center space-y-8 pt-12 sm:pt-16 lg:pt-20 border-t border-[#E8E2D9]">
          <div className="max-w-xl mx-auto space-y-6">
            {hasPaid && selectedProduct === 'complete_vitality_system' && (
              <div className="text-left bg-white border border-[#E8E2D9] p-6 sm:p-8 rounded-none shadow-none space-y-3">
                <p className="text-[10px] uppercase tracking-[0.15em] text-[#5C534E]/60">You're in. Here's what happens next:</p>
                <p className="text-[#5C534E] font-light leading-[1.9]">Your Blueprint is on its way — check your inbox now.</p>
                <p className="text-[#5C534E] font-light leading-[1.9]">Everything you need is inside. Take it at your own pace.</p>
              </div>
            )}
            {hasPaid && selectedProduct === 'blueprint_in_motion' && (
              <div className="text-left bg-white border border-[#E8E2D9] p-6 sm:p-8 rounded-none shadow-none space-y-3">
                <p className="text-[#5C534E] font-light leading-[1.9]">You're in. Your guide arrives in your inbox shortly.</p>
                <p className="text-[#5C534E]/70 font-light leading-[1.8]">Want to know exactly which shifts matter most for your dog specifically? Your personal Dog Biology Blueprint™ takes just 10 minutes.</p>
              </div>
            )}
            {hasPaid && selectedProduct === 'vitality_blueprint' && (
              <div className="text-left bg-white border border-[#E8E2D9] p-6 sm:p-8 rounded-none shadow-none space-y-3">
                <p className="text-[#5C534E] font-light leading-[1.9]">You're in. Your Blueprint is on its way — check your inbox now.</p>
                <p className="text-[#5C534E]/70 font-light leading-[1.8]">Want to go deeper? Your personal Dog Biology Blueprint™ reveals exactly which shifts matter most — takes just 10 minutes.</p>
              </div>
            )}
            {!hasPaid && (
              <p className="text-[#5C534E] text-lg sm:text-xl font-light leading-[1.9]">
                Thank you for caring enough to look this closely at {name}'s wellbeing. That alone sets you apart.
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto pt-2">
            <div className="flex items-center justify-center gap-3 text-[#5C534E]/60">
              <Icons.Globe size={18} />
              <span className="text-[11px] font-semibold">PayaLabs</span>
            </div>
            <a
              href="mailto:payalabs01@gmail.com"
              className="flex items-center justify-center gap-3 text-[#5C534E]/60 hover:text-[#2A2421] transition-colors"
            >
              <Icons.Mail size={18} />
              <span className="text-[11px] font-semibold">payalabs01@gmail.com</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
