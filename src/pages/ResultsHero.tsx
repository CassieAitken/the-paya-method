import { Icons } from '../components/Icons';
import { VitalityBadge } from '../components/VitalityBadge';

export function ResultsHero({
  dogData,
  results,
  directives,
  hasPaid,
  track,
  onUnlock,
  dogPhoto,
}: {
  dogData: any;
  results: any;
  directives?: any;
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
    mid: `After a decade, ${name} ${pVerb} still absorbing your love and meeting you with everything ${pSubj} ${pVerb === 'is' ? 'has' : 'have'}. That alone commands respect. But we detected a <strong>vitality ceiling</strong> — places where energy is pooling instead of flowing. At this stage, those gaps carry more weight. The good news: they're still within your reach to close. The window is open. Move now.`,
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

  // Radial progress SVG helper
  const RadialScore = ({ score }: { score: number }) => {
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    return (
      <div className="relative w-52 h-52 sm:w-64 sm:h-64 lg:w-72 lg:h-72 mx-auto">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r={radius} fill="none" stroke="#e7e5e4" strokeWidth="8" opacity="0.4" />
          <circle
            cx="100" cy="100" r={radius} fill="none"
            stroke="#14B8A6" strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl sm:text-6xl lg:text-7xl font-serif text-[#2A2421] font-light tracking-tight">{score}</span>
          <span className="text-base sm:text-lg font-serif text-[#5C534E]/50 -mt-1">/100</span>
          <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#5C534E]/40 mt-2">Vitality Index</span>
        </div>
      </div>
    );
  };

  if (!hasPaid) {
    return (
      <div className="space-y-8 sm:space-y-20 lg:space-y-24">

        {/* 1. Intro card with name, score, archetype */}
        <div className="space-y-6 sm:space-y-10 pb-4">
          <div className="bg-white rounded-none shadow-none border border-[#E8E2D9] p-8 sm:p-12 text-center space-y-6">
            <p className="text-[9px] font-mono uppercase tracking-[0.35em] text-[#5C534E]/50 font-medium">
              Prepared for {dogData.ownerName || 'you'} & {name} — {trackLabel} Track
            </p>
            <RadialScore score={results.score} />
            <div className="space-y-3 pt-2">
              <div className="h-px w-16 bg-[#14B8A6]/30 mx-auto"></div>
              <h3 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif text-[#2A2421] tracking-tight leading-[0.96]">
                {results.archetype.name}
              </h3>
            </div>
          </div>
        </div>

        {/* 2. Archetype description — preview with fade */}
        {results.archetype.freeTeaser && (() => {
          const sentences = results.archetype.freeTeaser.match(/[^.!?]+[.!?]+/g) || [results.archetype.freeTeaser];
          const firstSentence = sentences[0].trim();
          const remaining = sentences.slice(1).join(' ').trim();
          return (
            <div className="max-w-2xl mx-auto relative">
              <p className="text-lg sm:text-xl leading-[1.9] text-[#5C534E] font-light">
                {firstSentence}
              </p>
              {remaining && (
                <div className="relative mt-2">
                  <p className="text-lg sm:text-xl leading-[1.9] text-[#5C534E] font-light">
                    {remaining}
                  </p>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FAF9F5]/70 to-[#FAF9F5] pointer-events-none" />
                </div>
              )}
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#5C534E]/40 mt-4 text-center">
                Full analysis unlocks with purchase
              </p>
            </div>
          );
        })()}

        {/* Vitality Badge */}
        <VitalityBadge
          dogName={Name}
          score={results.score}
          dogPhoto={dogPhoto}
          phaseScores={results.phaseScores}
          archetypeName={results.archetype?.name}
        />

        {/* Blueprint deliverables + preview — unified section */}
        <div className="max-w-3xl mx-auto space-y-8 border-t border-[#E8E2D9] pt-8 sm:pt-16">
          <p className="text-[#5C534E] text-base sm:text-lg font-medium leading-[1.85]">
            Here's what unlocks the moment you pay:
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Deliverables list */}
            <ul className="space-y-3">
              {[
                <><strong>Full archetype analysis</strong> — what {name}'s score actually means for {pPoss} long-term health</>,
                <><strong>7 pillar breakdown</strong> — exactly where {pSubj}'re thriving and where {pSubj} need{pVerb === 'is' ? 's' : ''} you most</>,
                <><strong>Priority action steps</strong> — start with what moves the needle most</>,
                <><strong>Human-Dog Sync report</strong> — your role in {pPoss} biology, made visible</>,
                <><strong>Complete 50-marker record</strong> — your permanent reference as {pSubj} grow{pVerb === 'is' ? 's' : ''}</>,
                <><strong>PDF emailed instantly</strong> — yours to keep and share with your vet</>,
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Icons.Check size={16} className="text-[#14B8A6] flex-shrink-0 mt-1" />
                  <span className="text-base text-[#5C534E] leading-[1.7]">{item}</span>
                </li>
              ))}
              <li>
                <p className="text-[#5C534E]/60 text-sm font-light leading-[1.8] italic pt-2">
                  Your dog's vitality changes as they age. Most owners reassess every 6 months.
                </p>
              </li>
            </ul>

            {/* Preview panels */}
            {directives && (
              <div className="space-y-4">
                {/* Vitality phases preview */}
                <div className="space-y-2.5">
                  <span className="font-mono text-[8px] uppercase tracking-[0.35em] text-[#5C534E]/40 font-medium">{Name}'s Vitality Phases</span>
                  {[
                    { label: "The Nourished Spark", desc: "Nourishment, digestion & physiological baseline", icon: Icons.Activity, pillars: [0, 6] },
                    { label: "The Healing Sanctuary", desc: "Sleep recovery & environmental purification", icon: Icons.Moon, pillars: [1, 2] },
                    { label: "The Instinctive Bond", desc: "Nervous balance, cognition & movement symmetry", icon: Icons.Shield, pillars: [3, 4, 5] },
                  ].map((phase, idx) => {
                    const PhaseIcon = phase.icon;
                    const phaseScore = Math.round(
                      phase.pillars.reduce((sum, pi) => sum + (results.phaseScores[pi] || 0), 0) / phase.pillars.length
                    );
                    return (
                      <div key={idx} className="bg-white border border-[#E8E2D9] p-4 space-y-2.5">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2.5">
                            <PhaseIcon size={14} strokeWidth={1.3} className="text-[#415A42]" />
                            <div>
                              <span className="font-mono text-[7.5px] uppercase tracking-[0.3em] font-medium text-[#2A2421] block leading-tight">
                                {phase.label}
                              </span>
                              <span className="text-[9.5px] text-[#5C534E]/50 font-light">{phase.desc}</span>
                            </div>
                          </div>
                          <span className="text-[#2A2421] text-base font-serif font-light">{phaseScore}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-stone-200/60 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#415A42] rounded-full transition-all duration-700"
                            style={{ width: `${phaseScore}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Protocol step preview */}
                <div className="bg-white border border-[#E8E2D9] overflow-hidden">
                  <div className="bg-[#2A2421] text-white p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{directives.priorityShift.emoji}</span>
                      <div>
                        <span className="font-mono text-[7px] uppercase tracking-[0.3em] text-white/50 font-medium block">
                          {directives.bottomPillar.title} — Step 1 of {directives.priorityShift.protocolSteps.length}
                        </span>
                        <span className="text-xs font-light text-white/90">{directives.priorityShift.protocolTitle}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#14B8A6] flex items-center justify-center text-white font-mono text-[9px] font-medium mt-0.5">
                        1
                      </div>
                      <p className="text-[13px] text-[#5C534E] leading-[1.8] font-light pt-0.5">
                        {directives.priorityShift.protocolSteps[0].action}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 6. Unlock CTA — the money-maker */}
        <div className="max-w-2xl mx-auto text-center space-y-6 sm:space-y-8 pt-8 sm:pt-12">
          <div className="bg-[#2A2421] rounded-none p-8 sm:p-12 shadow-none relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#14B8A6]/5 to-transparent pointer-events-none" />
            <div className="relative z-10 space-y-6">
              <p className="text-white/50 text-[9px] font-mono uppercase tracking-[0.35em]">Unlock the Full Blueprint</p>
              <p className="text-white text-lg sm:text-xl font-light leading-[1.85] max-w-xl mx-auto">
                You spent 10 minutes learning how to love them better. Spend $49 to know exactly how.
              </p>
              <div className="space-y-3 text-left max-w-md mx-auto">
                <p className="text-sm text-white/60 leading-[1.8] font-light">Join 100+ dog owners who have discovered what their dog's biology has been trying to tell them.</p>
              </div>
              <div className="pt-4 space-y-4">
                <button
                  onClick={onUnlock}
                  className="bg-[#14B8A6] text-white px-10 sm:px-16 py-4 sm:py-5 text-[10px] font-mono uppercase tracking-[0.25em] sm:tracking-[0.3em] hover:bg-[#0D9488] hover:-translate-y-1 transition-all font-bold rounded-none inline-flex items-center gap-3 shadow-none"
                >
                  <span>UNLOCK {Name.toUpperCase()}'S BLUEPRINT — $49</span>
                  <Icons.ArrowRight size={16} strokeWidth={1.5} />
                </button>
                <p className="text-[10px] text-white/40 font-mono tracking-wider flex items-center justify-center gap-3">
                  <Icons.Shield size={12} strokeWidth={1.5} />
                  Instant access. One-time payment. PDF emailed immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PAID STATE: Full Results Hero
  const openingText = isLegacy
    ? <>We sat with {Name}'s data — all <strong>50 markers</strong>, every pattern, every signal {pPoss} body is sending in this golden chapter. Some of this will confirm what you already feel in your bones. Some of it will move you. All of it is a map for honoring the time you have together.</>
    : isMaster
      ? <>We sat with {Name}'s data — all <strong>50 markers</strong>, every pattern, every signal {pPoss} body is still sending after a decade of life. Some of this will confirm what you already know in your gut. Some will earn a deeper respect for what {pSubj}'ve maintained. All of it is actionable — and at this stage, every action carries more weight.</>
      : <>We sat with {Name}'s data — all <strong>50 markers</strong>, every pattern, every signal {pPoss} body is sending. Some of this will confirm what you already feel in your gut. Some of it will surprise you. All of it is actionable.</>;

  const blueprintLine = isLegacy
    ? <>What follows is {Name}'s <strong>Legacy Blueprint</strong> — a map honoring every system still carrying {pObj} forward.</>
    : isMaster
      ? <>What follows is {Name}'s <strong>Master Blueprint</strong> — calibrated to the precision a decade of partnership demands.</>
      : <>What follows is {Name}'s <strong>Dog Biology Blueprint™</strong> — your roadmap to unlocking what's next.</>;

  return (
    <div className="space-y-8 sm:space-y-20 lg:space-y-24">
      {/* THE OPENING */}
      <div className="space-y-6 sm:space-y-14 lg:space-y-16 pb-4 sm:pb-12">
        <div className="h-px w-24 bg-[#14B8A6]/30 mx-auto"></div>

        <div className="max-w-3xl mx-auto text-left space-y-8">
          <p className="text-[9px] font-mono uppercase tracking-[0.35em] text-[#5C534E]/60 font-medium">
            Prepared for {dogData.ownerName || 'you'} & {name} — {trackLabel} Track
          </p>
          <p className="text-lg sm:text-xl lg:text-2xl leading-[1.9] text-[#5C534E] font-light">
            {openingText}
          </p>
          <p className="text-lg sm:text-xl lg:text-2xl leading-[1.9] text-[#2A2421]/80 font-light italic">
            {blueprintLine}
          </p>
        </div>

        <div className="h-px w-16 bg-[#14B8A6]/30 mx-auto"></div>

        {/* ABOUT YOUR DOG BIOLOGY BLUEPRINT */}
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h3 className="text-[11px] font-mono uppercase tracking-[0.35em] text-[#5C534E]/70 font-medium">
            About Your Dog Biology Blueprint™
          </h3>
          <p className="text-base sm:text-lg leading-[1.8] text-[#5C534E] font-light">
            Your Dog Biology Blueprint™ was created using The Paya Method™, a personalized framework that evaluates your dog's biology across 7 Biology Markers.
          </p>
          <p className="text-base sm:text-lg leading-[1.8] text-[#5C534E] font-light">
            Rather than providing generic advice, your Blueprint identifies your dog's unique strengths, priority areas, and practical next steps to help them thrive.
          </p>
        </div>

        {/* ARCHETYPE REVEAL */}
        <h2 className="text-center text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-serif text-[#2A2421] tracking-tight leading-[0.92]">
          {results.archetype.name}
        </h2>

        <div className="max-w-3xl mx-auto space-y-8 text-center">
          <p className="text-[#5C534E] text-lg sm:text-xl lg:text-2xl leading-[1.8] font-light">
            {results.archetype.analysis}
          </p>
        </div>
      </div>

      {/* THE VITALITY INDEX */}
      <div className="space-y-12 sm:space-y-16 lg:space-y-20 border-t border-[#E8E2D9] pt-12 sm:pt-16 lg:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-20 items-center">
          {/* Score Display — Radial */}
          <div className="text-center space-y-10">
            <RadialScore score={results.score} />
            <div className="inline-block bg-[#2A2421] text-white text-[8px] font-mono uppercase tracking-[0.3em] px-4 py-1.5 rounded-full shadow-none">
              Founding Member
            </div>
            <div className="space-y-3 text-left max-w-md mx-auto">
              <p className="text-sm leading-[1.8] text-[#5C534E] font-light" dangerouslySetInnerHTML={{ __html: scoreNarrative[scoreTier] }} />
            </div>
          </div>

          {/* Human-Dog Sync */}
          <div className="space-y-14">
            <div className="p-6 sm:p-8 lg:p-10 bg-white border border-[#E8E2D9] rounded-none shadow-none space-y-7">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[8.5px] uppercase tracking-[0.35em] text-[#5C534E]/60 font-medium">
                  Human-Dog Sync
                </span>
                <span className="text-[#2A2421] text-2xl font-serif font-light">
                  {results.packSync}%
                </span>
              </div>
              <div className="w-full h-2 bg-stone-200/60 relative overflow-hidden rounded-full">
                <div
                  className="absolute top-0 left-0 h-full bg-[#14B8A6] transition-all duration-1000 rounded-full"
                  style={{ width: `${results.packSync}%` }}
                />
              </div>
              <p className="text-sm leading-[1.8] text-[#5C534E] font-light" dangerouslySetInnerHTML={{ __html: syncNarrative }} />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
