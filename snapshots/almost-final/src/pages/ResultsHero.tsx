import { Icons } from '../components/Icons';
import { foundations } from '../data/foundations';

export function ResultsHero({
  dogData,
  results,
  hasPaid,
  track,
  onUnlock,
  dogPhoto,
}: {
  dogData: any;
  results: any;
  hasPaid: boolean;
  track: string;
  onUnlock: () => void;
  dogPhoto: string | null;
}) {
  const name = dogData.name || 'your companion';
  const Name = dogData.name || 'Your Companion';
  const { pPoss, pSubj, pObj, pVerb } = results.pronouns;

  const scoreTier =
    results.score >= 75 ? 'high' : results.score > 40 ? 'mid' : 'low';

  const isLegacy = track === 'legacy';
  const isMaster = track === 'master';

  const trackLabel = isLegacy ? 'Legacy' : isMaster ? 'Master' : 'Ascent';

  const ascentScoreNarrative: Record<string, string> = {
    high: `Let's be direct: what you've built for ${name} is <strong>exceptional</strong>. We detected a vitality ecosystem most dogs never experience. ${Name}'s biological rhythms are synced with yours in a way that <strong>actively strengthens ${pPoss} vitality</strong> every single day. Your job now is protecting the peak.`,
    mid: `Here's the truth — ${name} ${pVerb} absorbing your love, your intent, your best efforts. And it shows. But we also detected a <strong>vitality ceiling</strong>. There are specific places where energy is pooling instead of flowing. Those places are within your reach to change.`,
    low: `These numbers tell us something you might not expect. This score does not mean you're failing ${name}. It means ${pSubj} ${pVerb} <strong>waiting</strong>. Waiting for a rhythm ${pSubj} can trust. Waiting for a signal that the world is safe enough to stop surviving and start healing. You are the only person who can give that signal.`,
  };

  const masterScoreNarrative: Record<string, string> = {
    high: `Let's be clear: what you've built for ${name} after all these years is <strong>extraordinary</strong>. A decade in, most dogs have lost a step. ${Name} hasn't — ${pPoss} biological rhythms are still locked with yours, <strong>actively strengthening ${pPoss} vitality</strong> at an age when most systems are winding down. This is master-level performance. Protect it fiercely.`,
    mid: `After a decade together, ${name} ${pVerb} still absorbing your love and meeting you with everything ${pSubj} ${pVerb === 'is' ? 'has' : 'have'}. That alone commands respect. But we detected a <strong>vitality ceiling</strong> — places where energy is pooling instead of flowing. At this stage, those gaps carry more weight. The good news: they're still within your reach to close. The window is open. Move now.`,
    low: `These numbers carry a different gravity for a dog who has weathered a decade. This score does not mean you're failing ${name} — it means ${pSubj} ${pVerb} <strong>waiting</strong>, with the patience only a seasoned soul carries. After all these years, ${pSubj} still trust${pVerb === 'is' ? 's' : ''} you to read the signal. The fact that ${pPoss} body is still asking — still fighting — is itself an act of resilience that deserves your full attention.`,
  };

  const legacyScoreNarrative: Record<string, string> = {
    high: `What you've built for ${name} is <strong>remarkable</strong> — especially now, in ${pPoss} golden chapter. Most dogs at this stage are quietly declining. ${Name} ${pVerb} not. ${pPoss} body still trusts yours. That trust is the most powerful medicine ${pSubj} ${pVerb === 'is' ? 'has' : 'have'}. Honor it by protecting every rhythm you've established.`,
    mid: `${Name} ${pVerb} in the golden chapter now — and ${pSubj} ${pVerb} still reaching for you. We see a body that wants to heal, a spirit that hasn't dimmed. But the margins are thinner at this stage. The <strong>vitality ceiling</strong> we detected isn't a failure — it's an invitation to refine what matters most while the window is open.`,
    low: `These numbers carry more weight in the golden chapter. ${Name}'s body is working harder now to maintain what once came easily. This score doesn't mean you've failed ${pObj} — it means ${pPoss} biology is <strong>asking for gentler, more intentional support</strong>. The kind only you can give. Every small adjustment matters more now than it ever did before.`,
  };

  const scoreNarrative = isLegacy
    ? legacyScoreNarrative
    : isMaster ? masterScoreNarrative : ascentScoreNarrative;

  const ascentSyncNarrative =
    results.packSync >= 70
      ? `<strong>${results.packSync}% nervous system alignment.</strong> When you exhale, ${pSubj} ${pVerb} already relaxing. When you settle into the couch at night, ${pPoss} cortisol drops in tandem. This is rare. This is earned. Protect it.`
      : results.packSync >= 40
        ? `<strong>${results.packSync}% synchronization.</strong> The foundation is real — ${name} reads your calm and responds. But ${pSubj} also absorb${pVerb === 'is' ? 's' : ''} your stress spikes, and right now those spikes are overriding the good. Our blueprint shows you exactly where to draw the line.`
        : `<strong>${results.packSync}% alignment.</strong> The biological conversation between you and ${name} hasn't found its rhythm yet. This isn't about love — you wouldn't be here if that were missing. It's about <strong>consistency</strong>. ${Name}'s nervous system is searching for a pattern it can trust.`;

  const masterSyncNarrative =
    results.packSync >= 70
      ? `<strong>${results.packSync}% nervous system alignment.</strong> After a decade, this number is a badge of honor. When you exhale, ${pSubj} ${pVerb} already relaxing. When you settle in at night, ${pPoss} cortisol drops in tandem — a synchronization that was <strong>earned over years</strong>, not weeks. At this stage, this bond is ${pPoss} greatest biological asset. Guard it.`
      : results.packSync >= 40
        ? `<strong>${results.packSync}% synchronization.</strong> The foundation you've built over these years is real — ${name} still reads your calm and responds. But at the master level, stress spikes land harder and linger longer. The blueprint below shows where to <strong>tighten the rhythm</strong> so ${pPoss} seasoned nervous system gets the predictability it has earned.`
        : `<strong>${results.packSync}% alignment.</strong> After all the years you've shared, this number tells us the biological conversation still hasn't locked in. That's not a judgment on the love — it's a call to <strong>match your consistency to ${pPoss} loyalty</strong>. A dog who has stayed by your side this long deserves a rhythm ${pSubj} can finally rest inside.`;

  const legacySyncNarrative =
    results.packSync >= 70
      ? `<strong>${results.packSync}% nervous system alignment.</strong> In the golden chapter, this is everything. When you breathe, ${pSubj} breathe${pVerb === 'is' ? 's' : ''}. When you settle in at night, ${pPoss} entire nervous system follows. You are ${pPoss} living anchor — and at this stage, that bond is the single greatest predictor of comfort and spark.`
      : results.packSync >= 40
        ? `<strong>${results.packSync}% synchronization.</strong> ${Name} still reads you — still mirrors your calm. But in the golden chapter, ${pPoss} nervous system needs <strong>more predictability, not less</strong>. The stress spikes that a younger body could absorb now linger longer. Our blueprint shows where to draw gentler, firmer lines.`
        : `<strong>${results.packSync}% alignment.</strong> At this stage of ${pPoss} life, this number matters deeply. ${Name}'s nervous system is searching for a rhythm it can rest inside — not just survive in. This isn't about doing more. It's about being <strong>more consistent</strong> with less. That's the gift of the golden chapter.`;

  const syncNarrative = isLegacy
    ? legacySyncNarrative
    : isMaster ? masterSyncNarrative : ascentSyncNarrative;

  const openingText = isLegacy
    ? <>We sat with {Name}'s data — all <strong>90 markers</strong>, every pattern, every signal {pPoss} body is sending in this golden chapter. Some of this will confirm what you already feel in your bones. Some of it will move you. All of it is a map for honoring the time you have together.</>
    : isMaster
      ? <>We sat with {Name}'s data — all <strong>90 markers</strong>, every pattern, every signal {pPoss} body is still sending after a decade of life. Some of this will confirm what you already know in your gut. Some will earn a deeper respect for what ${pSubj}'ve maintained. All of it is actionable — and at this stage, every action carries more weight.</>
      : <>We sat with {Name}'s data — all <strong>90 markers</strong>, every pattern, every signal {pPoss} body is sending. Some of this will confirm what you already feel in your gut. Some of it will surprise you. All of it is actionable.</>;

  const blueprintLine = isLegacy
    ? <>This is not a report. This is {Name}'s <strong>Legacy Blueprint</strong> — a reverent map of what still burns bright.</>
    : isMaster
      ? <>This is not a report. This is {Name}'s <strong>Master Blueprint</strong> — built with the respect a decade of vitality commands.</>
      : <>This is not a report. This is {Name}'s <strong>Vitality Blueprint</strong> — and it starts with you.</>;

  return (
    <div className="space-y-24">
      {/* THE OPENING — CLINICAL WARMTH */}
      <div className="space-y-16 pb-12">
        <div className="editorial-divider max-w-lg mx-auto"></div>

        <div className="max-w-3xl mx-auto text-left space-y-8">
          <p className="text-[8px] font-mono uppercase tracking-[0.35em] text-stone-500 font-medium">
            Prepared for {dogData.ownerName || 'you'} & {name} — {trackLabel} Track
          </p>
          <p className="text-lg sm:text-xl lg:text-2xl leading-[1.9] text-stone-800 font-light">
            {openingText}
          </p>
          <p className="text-lg sm:text-xl lg:text-2xl leading-[1.9] text-stone-900 font-medium">
            {blueprintLine}
          </p>
        </div>

        <div className="h-px w-24 bg-stone-300 mx-auto"></div>

        {/* ARCHETYPE REVEAL */}
        <h2 className="text-center text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-serif text-stone-900 tracking-tight leading-[0.92]">
          {results.archetype.name}
        </h2>

        <div className="max-w-3xl mx-auto space-y-8 text-center">
          <p className="text-stone-700 text-lg sm:text-xl lg:text-2xl leading-[1.8] font-light">
            {hasPaid ? results.archetype.analysis : results.archetype.freeTeaser}
          </p>
        </div>
      </div>

      {/* THE VITALITY INDEX — DATA + HUMAN BRIDGE */}
      <div className="space-y-20 border-t border-stone-200/30 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-28 items-center">
          {/* Score Display */}
          <div className="text-center space-y-14">
            <div className="w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 bg-white border border-stone-200/70 mx-auto flex flex-col items-center justify-center relative shadow-[0_40px_100px_-25px_rgba(0,0,0,0.15)]">
              {/* Dog photo on badge */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                {dogPhoto ? (
                  <img
                    src={dogPhoto}
                    alt={dogData.name}
                    className="w-16 h-16 rounded-full object-cover border-3 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full border-3 border-white shadow-lg bg-stone-100 flex items-center justify-center">
                    <Icons.Leaf size={22} className="text-stone-500" strokeWidth={1.5} />
                  </div>
                )}
              </div>
              <div className="flex items-baseline gap-1 mt-4">
                <span className="text-7xl sm:text-8xl md:text-9xl font-serif text-stone-900 font-light tracking-tight">
                  {results.score}
                </span>
                <span className="text-3xl sm:text-4xl md:text-5xl font-serif text-stone-400 mb-2 font-light">
                  /100
                </span>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-[0.35em] text-stone-600 mt-4 block">
                Vitality Index
              </span>
              {/* Founding Member label */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
                <span className="inline-block bg-stone-900 text-white text-[8px] font-mono uppercase tracking-[0.3em] px-4 py-1.5 rounded-full shadow-md whitespace-nowrap">
                  Founding Member
                </span>
              </div>
            </div>
            {/* Human Bridge for Score */}
            <div className="space-y-3 text-left max-w-md mx-auto">
              <p className="text-sm leading-[1.8] text-stone-700 font-light" dangerouslySetInnerHTML={{ __html: scoreNarrative[scoreTier] }} />
            </div>
          </div>

          {/* Human-Dog Sync */}
          <div className="space-y-14">
            <div className="p-10 lg:p-12 border border-stone-200/70 bg-white/80 backdrop-blur-md space-y-7 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[8.5px] uppercase tracking-[0.35em] text-stone-700 font-medium">
                  Human-Dog Sync
                </span>
                <span className="text-stone-800 text-2xl font-serif font-light">
                  {results.packSync}%
                </span>
              </div>
              <div className="w-full h-2 bg-stone-200/70 relative overflow-hidden rounded-full">
                <div
                  className="absolute top-0 left-0 h-full bg-stone-800 transition-all duration-1000 rounded-full"
                  style={{ width: `${results.packSync}%` }}
                />
              </div>
              {/* Human Bridge for Sync */}
              <p className="text-sm leading-[1.8] text-stone-700 font-light" dangerouslySetInnerHTML={{ __html: syncNarrative }} />
            </div>
          </div>
        </div>

        {/* PRE-PURCHASE: BLURRED PREVIEW + CTA */}
        {!hasPaid && (
          <div className="space-y-16">
            {/* Section intro */}
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h3 className="text-4xl lg:text-5xl font-serif text-stone-900 tracking-tight leading-[1.08]">
                We Found Something
              </h3>
              <p className="text-stone-700 text-lg lg:text-xl leading-[1.8] font-light max-w-2xl mx-auto">
                We've mapped {Name}'s biology across <strong>seven systems</strong>, identified the exact gaps holding {pObj} back, and built a <strong>personalized 30-day protocol</strong> to close them. Here's a glimpse of what's waiting.
              </p>
            </div>

            {/* Blurred pillar preview */}
            <div className="relative">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 opacity-90">
                {foundations.slice(0, 4).map((f, i) => {
                  const Icon = f.Icon;
                  const score = results.phaseScores[i];
                  return (
                    <div
                      key={i}
                      className="border border-stone-200/70 bg-white/80 backdrop-blur-md p-5 rounded-xl space-y-3"
                    >
                      <div className="flex items-center gap-2">
                        <Icon size={14} strokeWidth={1.3} className="text-stone-500" />
                        <span className="font-mono text-[7px] uppercase tracking-[0.3em] text-stone-600 font-medium truncate">
                          {f.label}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-serif text-stone-900">{score}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-stone-200/60 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-stone-700 rounded-full"
                          style={{ width: `${score}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-stone-400 font-light leading-snug line-clamp-2">
                        {score >= 75 ? 'Strong foundation detected' : score >= 50 ? 'Opportunity identified' : 'High-leverage gap found'}
                      </p>
                    </div>
                  );
                })}
              </div>
              {/* Fade overlay on pillar cards */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/95 pointer-events-none rounded-xl" />
            </div>

            {/* Blurred protocol preview */}
            <div className="relative max-w-3xl mx-auto">
              <div className="border border-stone-200/70 bg-white/60 backdrop-blur-md rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)]">
                {/* Fake directive header */}
                <div className="flex items-center gap-4 px-8 pt-8 pb-5 border-b border-stone-100">
                  <div className="w-8 h-8 rounded-full bg-stone-900 flex items-center justify-center flex-shrink-0 text-white font-mono text-[10px] font-medium">
                    01
                  </div>
                  <div>
                    <span className="text-[8px] uppercase font-mono text-stone-500 font-medium block tracking-[0.35em]">
                      Top Priority
                    </span>
                    <h4 className="text-lg font-serif text-stone-900 leading-tight">
                      {Name}'s First Directive
                    </h4>
                  </div>
                </div>
                {/* Blurred body */}
                <div className="p-8 space-y-4 select-none" style={{ filter: 'blur(6px)' }}>
                  <div className="bg-stone-900 text-white p-5 rounded-lg">
                    <p className="text-sm leading-relaxed">
                      Begin by adjusting the morning rhythm around mealtimes. Introduce a 15-minute calm window before feeding and shift protein sources to include more variety across the week.
                    </p>
                  </div>
                  <div className="border border-stone-200 rounded-lg p-5">
                    <p className="text-sm text-stone-700 leading-relaxed">
                      Week 1: Start with a single change. Week 2: Layer in the second adjustment. Week 3: Observe and calibrate. Week 4: Lock in the new pattern.
                    </p>
                  </div>
                </div>
              </div>
              {/* Lock overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-white/90 backdrop-blur-sm border border-stone-200 rounded-full px-6 py-3 shadow-lg flex items-center gap-3">
                  <Icons.Lock size={16} className="text-stone-500" strokeWidth={1.5} />
                  <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-stone-600 font-medium">
                    Locked
                  </span>
                </div>
              </div>
            </div>

            {/* What's included */}
            <div className="max-w-3xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: Icons.BarChart2, label: '7 Pillar Deep-Dive', desc: 'Score + clinical read for each biological system' },
                  { icon: Icons.Target, label: '30-Day Protocol', desc: 'Ordered directives with weekly action steps' },
                  { icon: Icons.Heart, label: 'Mirror Analysis', desc: 'How your nervous system shapes their biology' },
                  { icon: Icons.FileText, label: 'Full 90-Marker Record', desc: 'Every ritual mapped and assessed' },
                  { icon: Icons.Mail, label: 'PDF Delivered to You', desc: 'Your complete blueprint, emailed instantly' },
                  { icon: Icons.Shield, label: 'Science-Backed', desc: 'Each directive grounded in peer-reviewed research' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-5 border border-stone-100 bg-stone-50/50 rounded-xl">
                    <item.icon size={18} className="text-stone-600 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                    <div>
                      <p className="text-sm font-medium text-stone-900">{item.label}</p>
                      <p className="text-xs text-stone-500 font-light mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Final CTA */}
            <div className="max-w-2xl mx-auto text-center space-y-8 pt-4">
              <div className="space-y-4">
                <p className="text-stone-800 text-xl lg:text-2xl font-serif leading-[1.5]">
                  {Name}'s blueprint is ready. The directives are written. The path is clear.
                </p>
                <p className="text-stone-600 text-base font-light leading-[1.7]">
                  One purchase. Lifetime access. No subscription.
                </p>
              </div>
              <div className="space-y-4">
                <button
                  onClick={onUnlock}
                  className="bg-stone-900 text-white px-16 py-6 text-[9px] font-mono uppercase tracking-[0.35em] hover:bg-stone-800 hover:-translate-y-1 hover:shadow-[0_25px_60px_-10px_rgba(0,0,0,0.2)] transition-all font-medium rounded-lg inline-flex items-center gap-3 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.25)]"
                >
                  Unlock {Name}'s Blueprint — $19
                  <Icons.ArrowRight size={16} strokeWidth={1.5} />
                </button>
                <p className="text-[10px] text-stone-500 font-mono tracking-wider flex items-center justify-center gap-3">
                  <Icons.Shield size={12} strokeWidth={1.5} />
                  Secure checkout. Instant access.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
