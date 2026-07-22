import { useState } from 'react';
import { Icons } from '../components/Icons';
import { foundations } from '../data/foundations';

function getAscentPillarBridge(score: number, label: string, name: string, pPoss: string): string {
  if (score >= 75)
    return `<strong>Strong rhythms here.</strong> ${name}'s body is receiving what it needs. Your job now: protect what you've built. Don't let modern life erode these rituals.`;
  if (score >= 50)
    return `We see real momentum in ${name}'s <strong>${label.toLowerCase()}</strong> — and your intentionality shows. But ${pPoss} body is compensating in places instead of thriving. The directives below target those gaps.`;
  if (score >= 25)
    return `This is where we see the <strong>biggest opportunity</strong> for ${name}. The foundation isn't missing — it's fragmented. A few consistent changes here will produce the most visible shift in ${pPoss} vitality over the next 30 days.`;
  return `We'll be direct: ${name}'s body is <strong>asking for attention</strong> here. Not judgment — awareness. The rituals below are ordered by impact. Start with the first one and build from there.`;
}

function getMasterPillarBridge(score: number, label: string, name: string, pPoss: string): string {
  if (score >= 75)
    return `<strong>Master-level performance.</strong> After a decade, ${name}'s ${label.toLowerCase()} rhythms are still firing at peak — that is earned, not given. Your job now: defend these rituals like the hard-won ground they are. Time will test them. Don't let it win.`;
  if (score >= 50)
    return `Real momentum in ${name}'s <strong>${label.toLowerCase()}</strong> — and at this age, that momentum commands respect. But ${pPoss} body is compensating in places where it shouldn't have to anymore. The directives below close those gaps before they widen.`;
  if (score >= 25)
    return `This is where we see the <strong>highest-leverage opportunity</strong> for ${name} at this stage. The foundation isn't gone — it's fragmented. A dog who has stayed strong this long deserves the consistency to match ${pPoss} resilience. A few targeted changes here will produce the most visible shift.`;
  return `We'll be direct, and we say this with respect for the years: ${name}'s body is <strong>asking for attention</strong> here. At this stage, the ask carries more urgency. The rituals below are ordered by impact. Start with the first one. ${name} has earned that focus.`;
}

function getLegacyPillarBridge(score: number, label: string, name: string, pPoss: string): string {
  if (score >= 75)
    return `<strong>This is something to honor.</strong> Even in the golden chapter, ${name}'s ${label.toLowerCase()} rhythms are holding strong. This resilience didn't happen by accident — you built it. Protect these rituals fiercely. They are ${pPoss} foundation of comfort.`;
  if (score >= 50)
    return `There is still real vitality flowing through ${name}'s <strong>${label.toLowerCase()}</strong>. But at this stage, the body needs gentler consistency — not more intensity. The small refinements below can bring ${pPoss} comfort and spark measurably closer.`;
  if (score >= 25)
    return `In the golden chapter, this pillar deserves your <strong>most compassionate attention</strong>. ${name}'s body isn't broken here — it's asking for softer, more deliberate support. The adjustments below are ordered by what will bring ${pPoss} the most ease.`;
  return `We want to be tender but honest: ${name}'s body is <strong>quietly asking for help</strong> in this area. At this stage, even the smallest consistent change carries outsized meaning. Start gently. Start with the first ritual below. Let ${pPoss} body feel the shift.`;
}

export function ResultsBlueprint({
  dogData,
  results,
  directives,
  track,
  selectedRituals,
  onShowBookingModal,
  handleShare,
  handleShareAudit,
  shareCopied,
  auditShared,
}: {
  dogData: any;
  results: any;
  directives: any[];
  track: string;
  selectedRituals: any;
  onShowBookingModal: () => void;
  handleShare: () => void;
  handleShareAudit: () => void;
  shareCopied: boolean;
  auditShared: boolean;
}) {
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const name = dogData.name || 'your companion';
  const Name = dogData.name || 'Your Companion';
  const { pPoss, pSubj, pObj, pVerb } = results.pronouns;

  const handleSendPDF = async () => {
    if (!dogData.ownerEmail) return;
    setIsSendingEmail(true);
    setEmailError(false);
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-results-pdf`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dogData, results, directives, selectedRituals }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setEmailSent(true);
        setTimeout(() => setEmailSent(false), 5000);
      } else {
        throw new Error(data.error || 'Failed to send email');
      }
    } catch (error) {
      console.error('Error sending PDF:', error);
      setEmailError(true);
      setTimeout(() => setEmailError(false), 5000);
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="space-y-20 border-t border-stone-200/30 pt-20">
      {/* ===== SECTION: THE SEVEN PILLARS ===== */}
      <div className="space-y-12">
        <div className="space-y-4">
          <h3 className="text-4xl lg:text-5xl font-serif text-stone-900 border-b border-stone-200/40 pb-8 tracking-tight leading-[1.08]">
            The Seven Pillars — What We Found
          </h3>
          <p className="text-stone-700 text-lg leading-[1.8] font-light max-w-3xl">
            We evaluated {Name} across <strong>seven biological systems</strong>. Each score below is paired with our clinical read and the <strong>Human Bridge</strong> — connecting each finding to your daily life together.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {foundations.map((f, i) => {
            const Icon = f.Icon;
            const score = results.phaseScores[i];
            return (
              <div
                key={i}
                className="space-y-5 border border-stone-200/70 p-8 lg:p-9 bg-white/80 backdrop-blur-md shadow-[0_15px_50px_-12px_rgba(0,0,0,0.08)] rounded-xl hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] transition-shadow duration-300"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Icon size={18} strokeWidth={1.3} className="text-stone-600" />
                    <span className="font-mono text-[8.5px] uppercase tracking-[0.35em] text-stone-700 font-medium">
                      {f.label}
                    </span>
                  </div>
                  <span className="text-stone-900 text-xl font-serif font-light">{score}%</span>
                </div>
                <div className="w-full h-2 bg-stone-200/60 relative rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-stone-700 transition-all duration-700 rounded-full"
                    style={{ width: `${score}%` }}
                  />
                </div>
                {/* Human Bridge */}
                <div className="space-y-3 border-t border-stone-200/50 pt-5">
                  <h5 className="font-mono text-[8px] uppercase tracking-[0.35em] text-stone-600 font-medium">
                    Our Read
                  </h5>
                  <p className="text-sm text-stone-700 leading-[1.7] font-light" dangerouslySetInnerHTML={{ __html: (track === 'legacy' ? getLegacyPillarBridge : track === 'master' ? getMasterPillarBridge : getAscentPillarBridge)(score, f.label, name, pPoss) }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== SECTION: THE MIRROR — YOUR REFLECTION ===== */}
      <div className="space-y-12 pt-12 border-t border-stone-200/40">
        <h3 className="text-4xl lg:text-5xl font-serif text-stone-900 tracking-tight leading-[1.08]">
          {track === 'legacy' ? 'The Mirror — What You Both Carry' : track === 'master' ? 'The Mirror — What a Decade Reveals' : 'The Mirror — What You Already See'}
        </h3>
        <div className="bg-white/80 backdrop-blur-md border border-stone-200/70 p-10 lg:p-12 shadow-[0_15px_50px_-12px_rgba(0,0,0,0.08)] rounded-xl">
          <p className="text-stone-700 text-lg mb-8 border-l-3 border-stone-400 pl-6 italic font-light leading-[1.8]">
            "{dogData.reflection || 'I notice shifts in my dog based on the rhythm of my own energy.'}"
          </p>
          <div className="space-y-6">
            <span className="font-mono text-[8px] uppercase tracking-[0.35em] text-stone-600 font-medium block">
              Our Clinical Interpretation
            </span>
            {track === 'legacy' ? (
              <p className="text-stone-800 leading-[1.8] font-light">
                What you described carries even more weight in the golden chapter. The phenomenon is called <strong>interspecies autonomic co-regulation</strong> — and after all the years you've shared, it runs deeper than you realize. {Name}'s nervous system has spent a lifetime calibrating to yours. {pSubj.charAt(0).toUpperCase() + pSubj.slice(1)} feel{pVerb === 'is' ? 's' : ''} your heartbeat shift before you're aware it's changed. At this stage, your <strong>calm is {pPoss} medicine</strong>. Your presence is the thing {pPoss} body trusts most in this world.
              </p>
            ) : track === 'master' ? (
              <p className="text-stone-800 leading-[1.8] font-light">
                What you described is not a feeling — it's a measurable biological phenomenon called <strong>interspecies autonomic co-regulation</strong>, and after a decade together, the circuitry runs deep. {Name}'s nervous system has been reading yours for years — the micro-tensions, the breath patterns, the moments you let go. {pSubj.charAt(0).toUpperCase() + pSubj.slice(1)} feel{pVerb === 'is' ? 's' : ''} it all. At this stage, that read is <strong>faster and more precise</strong> than it's ever been. Which means your grounded state triggers deeper repair — and your scattered state disrupts more.
              </p>
            ) : (
              <p className="text-stone-800 leading-[1.8] font-light">
                What you described above is not a feeling — it's a measurable biological phenomenon called <strong>interspecies autonomic co-regulation</strong>. {Name} can't rationalize threat. {pSubj.charAt(0).toUpperCase() + pSubj.slice(1)} feel{pVerb === 'is' ? 's' : ''} it through your heartbeat, your breath, the micro-tensions in your body you don't even notice. When you're grounded, {pPoss} <strong>parasympathetic system activates</strong> and deep cellular repair begins. When you're scattered, that repair halts.
              </p>
            )}
            <div className="bg-stone-50 border border-stone-200/70 p-6 rounded-lg mt-4">
              <p className="text-[8px] font-mono uppercase tracking-[0.35em] text-stone-600 font-medium mb-3">
                The Human Bridge
              </p>
              {track === 'legacy' ? (
                <p className="text-stone-800 leading-[1.8] font-light">
                  After all the years, the connection isn't something you need to build — it's something you need to <strong>protect</strong>. You are still the single most powerful variable in {Name}'s biology. In the golden chapter, that means less doing and more <strong>being</strong>. Being present. Being still. Being the steady heartbeat {pSubj} rest{pVerb === 'is' ? 's' : ''} against.
                </p>
              ) : track === 'master' ? (
                <p className="text-stone-800 leading-[1.8] font-light">
                  A decade of co-regulation has made this connection <strong>deeper than most owners will ever know</strong>. You are still the single most powerful variable in {Name}'s biology — and at this stage, that power is amplified. Every directive below starts with you. {Name} has spent a lifetime learning to trust your signal. <strong>Make it count.</strong>
                </p>
              ) : (
                <p className="text-stone-800 leading-[1.8] font-light">
                  You're not imagining the connection. <strong>You are the single most powerful variable in {Name}'s biology.</strong> Every directive below starts with you — because that's where {Name}'s healing starts.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== SECTION: THE 30-DAY PROTOCOL ===== */}
      <div className="space-y-12 pt-12 border-t border-stone-200/40">
        <div className="border-b border-stone-200/40 pb-8">
          <h3 className="text-4xl lg:text-5xl font-serif text-stone-900 tracking-tight leading-[1.08]">
            {track === 'legacy' ? 'Your 30-Day Comfort Protocol' : track === 'master' ? 'Your 30-Day Master Protocol' : 'Your 30-Day Protocol'}
          </h3>
          <p className="text-stone-700 text-base mt-4 leading-[1.8] font-light max-w-3xl">
            {track === 'legacy'
              ? <>We analyzed all <strong>90 markers</strong> and isolated the rituals that will bring {Name} the <strong>most comfort and spark</strong> in this golden chapter. Ordered by what matters most now. Gentle shifts. Meaningful impact.</>
              : track === 'master'
                ? <>We analyzed all <strong>90 markers</strong> and isolated the rituals with the <strong>highest leverage</strong> for {Name}'s profile at this stage. After a decade, every optimization carries more weight. Ordered by biological impact. Precision over volume.</>
                : <>We analyzed all <strong>90 markers</strong> and isolated the rituals with the <strong>highest leverage</strong> for {Name}'s profile. Ordered by biological impact. Start at the top. Work down.</>
            }
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-md border border-stone-200/70 p-10 lg:p-12 shadow-[0_15px_50px_-12px_rgba(0,0,0,0.08)] text-left rounded-xl">
          <div className="flex items-center gap-3 mb-6">
            <Icons.Activity size={14} className="text-stone-700" strokeWidth={1.5} />
            <h4 className="font-mono text-[8px] uppercase tracking-[0.35em] text-stone-700 font-medium">
              Why 30 Days
            </h4>
          </div>
          {track === 'legacy' ? (
            <p className="text-stone-800 text-sm leading-[1.8] font-light">
              <span className="block">
                In the golden chapter, <strong>30 days</strong> is enough time for {Name}'s body to register a new pattern of care — to feel the difference in {pPoss} joints, {pPoss} sleep, {pPoss} appetite for the world. These aren't aggressive changes. They're <strong>acts of reverence</strong> — small, consistent signals that tell {pPoss} body it is still deeply cared for.
              </span>
              <span className="block text-stone-900 font-medium mt-4">
                This is not about fixing. It's about honoring what remains — and helping it burn a little brighter.
              </span>
            </p>
          ) : track === 'master' ? (
            <p className="text-stone-800 text-sm leading-[1.8] font-light">
              <span className="block">
                At the master level, <strong>30 days</strong> is the window where precision compounds. New neural pathways consolidate, cortisol baselines shift, and {Name}'s body — which has spent a decade learning your rhythms — locks into the upgrade faster than a younger dog ever could. The experience is already there. The biology is ready. <strong>Give it the signal.</strong>
              </span>
              <span className="block text-stone-900 font-medium mt-4">
                This is a partnership commitment — and after a decade, {name} has earned your very best.
              </span>
            </p>
          ) : (
            <p className="text-stone-800 text-sm leading-[1.8] font-light">
              <span className="block">
                Cellular adaptation takes time. But <strong>30 days</strong> is the window where new neural pathways consolidate, cortisol baselines shift, and {Name}'s body starts trusting a new rhythm. Long enough for measurable change. Short enough that every day feels purposeful.
              </span>
              <span className="block text-stone-900 font-medium mt-4">
                This is a partnership commitment. We're asking you to change with {name}.
              </span>
            </p>
          )}
        </div>

        {directives.length > 0 ? (
          <div className="grid grid-cols-1 gap-8">
            {directives.map((d: any, i: number) => (
              <div
                key={i}
                className="bg-white/60 backdrop-blur-md border border-stone-200 shadow-lg rounded-2xl overflow-hidden"
              >
                <div className="flex items-center gap-4 px-8 pt-8 pb-5 border-b border-stone-100">
                  <div className="w-8 h-8 rounded-full bg-stone-900 flex items-center justify-center flex-shrink-0 text-white font-mono text-[10px] font-medium">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <span className="text-[8px] uppercase font-mono text-stone-600 font-medium block tracking-[0.35em]">
                      {d.phaseTitle.split('—')[0].trim()}
                    </span>
                    <h4 className="text-lg font-serif text-stone-900 leading-tight">{d.label}</h4>
                  </div>
                </div>

                <div className="p-8 space-y-5">
                  <div className="bg-stone-900 text-white p-6 rounded-lg">
                    <span className="font-mono text-[8px] uppercase tracking-[0.35em] text-stone-400 font-medium block mb-3">
                      Our Directive
                    </span>
                    <p className="text-white text-sm leading-[1.8] font-light">{d.actionText}</p>
                  </div>

                  <div className="bg-stone-50 border border-stone-100 p-6 rounded-lg">
                    <span className="font-mono text-[8px] uppercase tracking-[0.35em] text-stone-600 font-medium block mb-3">
                      The Science Behind It
                    </span>
                    <p className="text-stone-700 text-sm leading-[1.8] font-light">{d.whyText}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-md p-10 border border-stone-200/70 text-center shadow-[0_15px_50px_-12px_rgba(0,0,0,0.08)] rounded-xl">
            <Icons.Check size={32} className="mx-auto text-stone-700 mb-4" />
            <h4 className="text-lg font-serif text-stone-900 mb-3">
              Exceptional Across All Markers
            </h4>
            <p className="text-stone-700 text-sm leading-[1.7] font-light">
              Our assessment did not find corrective directives to recommend — {Name} is hitting the vital markers across all seven pillars. Your focus now is maintenance: protect the rhythms you've built and stay vigilant against modern disruptions.
            </p>
          </div>
        )}
      </div>

      {/* ===== SECTION: FULL VITALITY RECORD ===== */}
      <div className="space-y-12 pt-12 border-t border-stone-200/40">
        <div>
          <h3 className="text-4xl lg:text-5xl font-serif text-stone-900 border-b border-stone-200/40 pb-8 tracking-tight leading-[1.08]">
            The Complete Vitality Record
          </h3>
          <p className="text-stone-700 text-sm mt-4 leading-[1.8] font-light">
            All 90 markers across all seven pillars. Your permanent reference — revisit this as you implement the protocol.
          </p>
        </div>
        <div className="bg-white/80 backdrop-blur-md border border-stone-200/70 p-10 lg:p-12 shadow-[0_15px_50px_-12px_rgba(0,0,0,0.08)] space-y-12 rounded-xl">
          {foundations.map((f, i) => (
            <div key={i} className="space-y-6 border-b border-stone-200/50 pb-10 last:border-0 last:pb-0">
              <div className="space-y-2">
                <h4 className="text-xl font-serif text-stone-900">{f.title}</h4>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-stone-200/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-stone-700 transition-all"
                      style={{ width: `${results.phaseScores[i]}%` }}
                    />
                  </div>
                  <span className="text-stone-900 font-serif text-lg font-light min-w-[50px] text-right">
                    {results.phaseScores[i]}%
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                {f.rituals.map((r: any, j: number) => {
                  const isPassed = selectedRituals[r.id] && selectedRituals[r.id] !== 'never';
                  return (
                    <div
                      key={j}
                      className={`p-4 rounded-lg border transition-all ${isPassed ? 'bg-stone-50 border-stone-200/70' : 'bg-stone-50/40 border-stone-200/30'}`}
                    >
                      <div className="flex items-start gap-3 mb-2">
                        {isPassed ? (
                          <span className="inline-block w-5 h-5 bg-stone-700 rounded-full flex-shrink-0 mt-[2px]" />
                        ) : (
                          <span className="inline-block w-5 h-5 border border-stone-300 rounded-full flex-shrink-0 mt-[2px]" />
                        )}
                        <span className={`text-sm font-medium ${isPassed ? 'text-stone-900' : 'text-stone-500'}`}>
                          {r.label}
                        </span>
                      </div>
                      <p className="text-[13px] leading-[1.6] text-stone-700 font-light pl-8">{r.insight}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== SECTION: NEXT STEPS ===== */}
      <div className="space-y-12 pt-12 border-t border-stone-200/40">
        <h3 className="text-4xl lg:text-5xl font-serif text-stone-900 border-b border-stone-200/40 pb-8 tracking-tight leading-[1.08]">
          Your Next Steps
        </h3>
        <div className="bg-white/80 backdrop-blur-md border border-stone-200/70 p-10 lg:p-12 shadow-[0_15px_50px_-12px_rgba(0,0,0,0.08)] space-y-6 rounded-xl">
          <div className="bg-stone-50 border border-stone-200 p-8 rounded-lg space-y-5">
            <div>
              <h4 className="font-mono text-[8px] uppercase tracking-[0.35em] text-stone-700 font-medium mb-3">
                1-on-1 Consultation
              </h4>
              <p className="text-stone-700 text-sm leading-[1.8] font-light mb-4">
                We can go deeper. One hour. We review {Name}'s <strong>lineage, environment, and the nuances</strong> a 90-point assessment identifies but can't fully address. Your protocol, tailored to your exact circumstances. <strong>$100</strong> (normally $150).
              </p>
              <ul className="text-sm text-stone-700 space-y-2 font-light mb-6">
                <li className="flex items-start gap-2">
                  <Icons.Check size={16} className="text-stone-700 flex-shrink-0 mt-0.5" />
                  <span>Bring {name} if you'd like — we love meeting them</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icons.Check size={16} className="text-stone-700 flex-shrink-0 mt-0.5" />
                  <span>Preparation questions sent 24 hours before your session</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icons.Check size={16} className="text-stone-700 flex-shrink-0 mt-0.5" />
                  <span>Zoom link sent immediately after booking</span>
                </li>
              </ul>
            </div>
            <button
              onClick={onShowBookingModal}
              className="w-full bg-stone-900 text-white px-6 py-4 text-[8.5px] font-mono uppercase tracking-[0.35em] hover:bg-stone-800 hover:-translate-y-1 transition-all rounded-lg font-medium shadow-[0_10px_30px_-10px_rgba(0,0,0,0.2)]"
            >
              Book a Consultation
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-stone-200/40 mt-6">
            <div className="flex items-center justify-center md:justify-start gap-3 text-stone-700">
              <Icons.Globe size={18} />
              <span className="font-mono text-[11px] font-bold">payalabs.net</span>
            </div>
            <a
              href="mailto:payalabs01@gmail.com"
              className="flex items-center justify-center md:justify-start gap-3 text-stone-700 hover:text-stone-900 transition-colors"
            >
              <Icons.Mail size={18} />
              <span className="font-mono text-[11px] font-bold">payalabs01@gmail.com</span>
            </a>
          </div>
        </div>
      </div>

      {/* ===== SECTION: SHARE ===== */}
      <div className="space-y-16 pt-12 border-t border-stone-200/40">
        <div className="border-b border-stone-200/40 pb-8">
          <h3 className="text-4xl lg:text-5xl font-serif text-stone-900 tracking-tight leading-[1.08]">
            Share the Journey
          </h3>
          <p className="text-stone-700 text-sm mt-4 leading-[1.8] font-light">
            Every dog deserves this level of attention. If this resonated, share it with someone whose dog deserves the same.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-14 items-start">
          {/* Share Badge */}
          <div className="w-full max-w-sm mx-auto lg:mx-0 flex-shrink-0">
            <div
              id="share-badge"
              className="relative bg-stone-950 rounded-3xl overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)]"
              style={{ aspectRatio: '9/16' }}
            >
              <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                  backgroundImage:
                    'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
                }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(180,160,130,0.07) 0%, transparent 70%)',
                }}
              />

              <div className="relative h-full flex flex-col justify-between p-8 sm:p-10">
                <div className="flex items-center gap-2.5">
                  <Icons.Leaf size={16} className="text-stone-500" strokeWidth={1.5} />
                  <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-stone-500 font-medium">
                    PayaLabs
                  </span>
                </div>

                <div className="space-y-6">
                  {dogData.name && (
                    <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-stone-500">
                      {dogData.name}'s Result
                    </p>
                  )}
                  <div className="flex items-end gap-2">
                    <span className="font-serif text-[5.5rem] leading-none text-white tracking-tight">
                      {results.score}
                    </span>
                    <span className="font-serif text-3xl text-stone-600 mb-3 leading-none">/100</span>
                  </div>
                  <div className="h-px bg-stone-800 w-full" />
                  <div className="space-y-2">
                    <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-stone-600">
                      Vitality Archetype
                    </p>
                    <h2 className="font-serif text-3xl text-white leading-tight tracking-tight">
                      {results.archetype.name}
                    </h2>
                  </div>
                  <p className="text-stone-400 text-[12px] leading-[1.75] font-light line-clamp-5">
                    {results.archetype.freeTeaser}
                  </p>
                  <div className="space-y-2.5 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-stone-600">
                        Human-Dog Sync
                      </span>
                      <span className="font-serif text-lg text-stone-300">{results.packSync}%</span>
                    </div>
                    <div className="w-full h-1 bg-stone-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-stone-400 rounded-full"
                        style={{ width: `${results.packSync}%` }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-1 pt-1">
                    {results.phaseScores.map((s: number, i: number) => (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div className="w-full bg-stone-800 rounded-sm overflow-hidden" style={{ height: 28 }}>
                          <div
                            className="w-full bg-stone-500 rounded-sm"
                            style={{ height: `${s}%`, marginTop: `${100 - s}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="h-px bg-stone-800 w-full mb-4" />
                  <p className="font-mono text-[8px] uppercase tracking-[0.4em] text-stone-600 font-medium">
                    payalabs.net
                  </p>
                  <p className="font-mono text-[7px] text-stone-700 tracking-wide">
                    90-Point Canine Vitality Assessment
                  </p>
                </div>
              </div>
            </div>
            <p className="text-center text-[10px] text-stone-400 font-mono mt-4 tracking-wider uppercase">
              Screenshot & share
            </p>
          </div>

          {/* Share Actions */}
          <div className="flex-1 space-y-8 w-full">
            <div className="space-y-3">
              <p className="font-mono text-[8px] uppercase tracking-[0.35em] text-stone-600 font-medium">
                Ready-made caption
              </p>
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-6 text-sm text-stone-700 leading-[1.8] font-light select-all">
                {dogData.name
                  ? `${dogData.name} just scored ${results.score}/100 on the Payalabs Vitality Assessment.`
                  : `My dog just scored ${results.score}/100 on the Payalabs Vitality Assessment.`}
                {'\n\n'}Archetype: {results.archetype.name}
                {'\n\n'}
                {results.archetype.freeTeaser.split('.').slice(0, 2).join('.') + '.'}
                {'\n\n'}Human-Dog Sync: {results.packSync}%{'\n\n'}Discover your dog's vitality score at
                payalabs.net
              </div>
              <button
                onClick={handleShare}
                className="w-full bg-stone-900 text-white px-8 py-4 text-[8.5px] font-mono uppercase tracking-[0.35em] hover:bg-stone-800 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 rounded-lg font-bold shadow-[0_10px_30px_-10px_rgba(0,0,0,0.25)]"
              >
                {shareCopied ? (
                  <>
                    <Icons.Check size={15} />
                    Caption Copied!
                  </>
                ) : (
                  <>
                    <Icons.Copy size={15} />
                    Copy Caption
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <button
                onClick={() => {
                  const subject = encodeURIComponent(
                    `${dogData.name || 'My dog'} scored ${results.score}/100 on Payalabs`
                  );
                  const body = encodeURIComponent(
                    `${dogData.name ? dogData.name + ' just scored' : 'My dog just scored'} ${results.score}/100 on the Payalabs Vitality Assessment.\n\nArchetype: ${results.archetype.name}\n\n${results.archetype.freeTeaser}\n\nHuman-Dog Sync: ${results.packSync}%\n\nDiscover your dog's vitality score at payalabs.net`
                  );
                  window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
                }}
                className="flex items-center justify-center gap-3 border border-stone-300 text-stone-700 px-6 py-4 text-[8.5px] font-mono uppercase tracking-[0.3em] hover:border-stone-500 hover:bg-stone-50 transition-all rounded-lg font-bold"
              >
                <Icons.Mail size={15} />
                Email a Friend
              </button>

              <button
                onClick={handleShareAudit}
                className="flex items-center justify-center gap-3 border border-stone-300 text-stone-700 px-6 py-4 text-[8.5px] font-mono uppercase tracking-[0.3em] hover:border-stone-500 hover:bg-stone-50 transition-all rounded-lg font-bold"
              >
                {auditShared ? (
                  <>
                    <Icons.Check size={15} />
                    Link Copied!
                  </>
                ) : (
                  <>
                    <Icons.Link size={15} />
                    Copy Site Link
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  const text = `${dogData.name ? dogData.name + ' scored' : 'My dog scored'} ${results.score}/100 on the Payalabs Vitality Assessment. Archetype: "${results.archetype.name}" — ${results.packSync}% Human-Dog Sync. Check it out at payalabs.net`;
                  window.open(
                    `https://reddit.com/r/dogs/submit?text=${encodeURIComponent(text)}&title=${encodeURIComponent((dogData.name || 'My dog') + ' scored ' + results.score + '/100 on Payalabs')}`,
                    '_blank'
                  );
                }}
                className="flex items-center justify-center gap-3 border border-stone-300 text-stone-700 px-6 py-4 text-[8.5px] font-mono uppercase tracking-[0.3em] hover:border-stone-500 hover:bg-stone-50 transition-all rounded-lg font-bold"
              >
                <Icons.Reddit size={15} />
                Share on Reddit
              </button>

              {dogData.ownerEmail && (
                <button
                  onClick={handleSendPDF}
                  disabled={isSendingEmail || emailSent}
                  className="flex items-center justify-center gap-3 border border-stone-300 text-stone-700 px-6 py-4 text-[8.5px] font-mono uppercase tracking-[0.3em] hover:border-stone-500 hover:bg-stone-50 transition-all rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSendingEmail ? (
                    <>
                      <Icons.Loader className="animate-spin" size={15} /> Sending PDF...
                    </>
                  ) : emailSent ? (
                    <>
                      <Icons.Check size={15} /> PDF Sent!
                    </>
                  ) : emailError ? (
                    <>
                      <Icons.X size={15} /> Try Again
                    </>
                  ) : (
                    <>
                      <Icons.Mail size={15} /> Email My PDF
                    </>
                  )}
                </button>
              )}
            </div>
            {emailError && (
              <p className="text-xs text-red-600 font-mono">
                Failed to send. Please try again or contact support.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
