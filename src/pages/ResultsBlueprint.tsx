import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { Icons } from '../components/Icons';
import { foundations } from '../data/foundations';

function getAscentPillarBridge(score: number, label: string, name: string, pPoss: string, pillarId: string): string {
  const bridges: Record<string, Record<string, string>> = {
    metabolic: {
      high: `<strong>The engine is fed well.</strong> ${name}'s metabolic rhythms are running clean — digestion steady, energy stable across the day. Protect this foundation. It anchors everything else.`,
      mid: `${name}'s metabolic system is working — but it's working <strong>harder than it should</strong>. Meal timing, nutrient density, or gut rest windows are fragmenting what should be smooth, sustained fuel. The protocol below brings ${pPoss} internal battery back to full capacity.`,
      low: `We see the <strong>highest-leverage opportunity</strong> here. ${name}'s metabolism isn't broken — it's under-supported. Inconsistent fuel, missing nutrients, or a gut that never fully rests are costing ${pPoss} body daily.`,
      critical: `${name}'s metabolic foundation needs <strong>immediate attention</strong>. The body is spending energy managing what should be effortless — digestion, blood sugar, cellular fuel.`,
    },
    repair: {
      high: `<strong>${name}'s body is healing itself beautifully.</strong> Deep sleep cycles, efficient recovery, and strong restorative rhythms are doing their work every night. Guard these rituals — they are ${pPoss} vitality engine.`,
      mid: `${name} is resting — but <strong>not fully repairing</strong>. Something in the sleep environment, timing, or wind-down routine is pulling ${pPoss} body out of the deepest restorative cycles.`,
      low: `This is where ${name}'s vitality is <strong>quietly losing ground</strong>. Without deep, uninterrupted repair cycles, everything else — energy, immunity, joint health — degrades faster than it should.`,
      critical: `${name}'s restorative system is <strong>running on fumes</strong>. The body isn't getting the deep repair it needs to maintain itself.`,
    },
    environmental: {
      high: `<strong>${name}'s environment is clean and intentional.</strong> Low toxic load, natural materials, and a home that supports rather than stresses ${pPoss} biology. This is rarer than people think — well done.`,
      mid: `${name}'s body is processing a <strong>low-grade chemical burden</strong> that most owners never notice. Synthetic fragrances, floor chemicals, or off-gassing materials that ${pPoss} liver processes every single day.`,
      low: `The invisible stressors in ${name}'s environment are <strong>accumulating quietly</strong>. ${pPoss} body is spending immune resources on things that shouldn't be there.`,
      critical: `${name}'s biology is <strong>fighting its own environment</strong>. Chemical exposure through skin, lungs, and paws is draining the system daily.`,
    },
    sync: {
      high: `<strong>The bond is biologically real.</strong> ${name}'s nervous system treats your presence as a signal to heal. You've built something most owners never achieve — a true co-regulatory partnership. Protect it fiercely.`,
      mid: `The love is clear — but ${name}'s nervous system isn't <strong>fully trusting</strong> it yet. Micro-disconnections throughout the day keep ${pPoss} guard subtly raised.`,
      low: `${name} loves you. But <strong>love isn't landing as biology</strong> yet. The pack bond isn't just emotional — it's your dog's primary nervous system regulator.`,
      critical: `The bond is there — we can see it. But ${name}'s nervous system hasn't received the <strong>consistent signal</strong> it needs to fully relax into your presence.`,
    },
    cognitive: {
      high: `<strong>${name}'s mind is sharp and engaged.</strong> Novel challenges, sensory variety, and genuine mental stimulation are keeping ${pPoss} neural pathways fresh.`,
      mid: `${name}'s brain is <strong>under-challenged</strong>. Not bored, exactly — but not growing. Mental stagnation shows up as restlessness or fixation before it shows up as cognitive decline.`,
      low: `We see an <strong>untapped cognitive reserve</strong> in ${name}. The brain needs novelty like muscles need movement — without it, neural pathways prune themselves.`,
      critical: `${name}'s brain is <strong>under-stimulated</strong>. Without regular novelty and problem-solving, cognitive decline accelerates far earlier than it should.`,
    },
    biomechanical: {
      high: `<strong>${name} moves like ${pPoss} body was built to.</strong> Fluid, balanced, confident across terrain. Strong muscle tone, easy transitions, and no compensation patterns.`,
      mid: `${name} moves well — but there are <strong>subtle compensations</strong>. A slight hesitation getting up, favoring one side, or avoiding terrain ${pPoss} body used to handle easily.`,
      low: `${name}'s movement patterns reveal <strong>early mechanical stress</strong>. The body is routing around limitations instead of moving freely.`,
      critical: `${name}'s biomechanics need <strong>thoughtful, immediate support</strong>. Movement restrictions compound fast — what's compensation today becomes chronic discomfort tomorrow.`,
    },
    baseline: {
      high: `<strong>${name}'s vital signs tell a clear story: thriving.</strong> Coat, eyes, energy, digestion — the body's outward markers all confirm what's happening at the cellular level.`,
      mid: `${name}'s baseline markers are <strong>mixed</strong>. Some systems are showing strength while others are quietly signaling that something is off.`,
      low: `The body is <strong>speaking through its markers</strong> — coat quality, energy patterns, digestive consistency — and what it's saying is that the internal systems need more support.`,
      critical: `Multiple baseline markers are <strong>flagging simultaneously</strong>. When the body signals through coat, energy, digestion, and vital signs at once, it's asking for foundational support.`,
    },
  };

  const pillar = bridges[pillarId] || bridges.baseline;
  if (score >= 75) return pillar.high;
  if (score >= 50) return pillar.mid;
  if (score >= 25) return pillar.low;
  return pillar.critical;
}

function getMasterPillarBridge(score: number, label: string, name: string, pPoss: string, pillarId: string): string {
  const bridges: Record<string, Record<string, string>> = {
    metabolic: {
      high: `<strong>Master-level metabolic performance.</strong> After a decade, ${name}'s digestive rhythms and nutritional foundation are still firing clean. Defend it. The body's nutritional demands shift with age; stay ahead of them.`,
      mid: `${name}'s metabolic engine has carried ${pPoss} body well for a decade — but it's <strong>working harder than it needs to</strong> now. At this stage, gut efficiency matters more than ever.`,
      low: `After a decade, ${name}'s metabolism deserves <strong>precision it hasn't been getting</strong>. The body that powered through nutritional inconsistency at three can't absorb those costs anymore.`,
      critical: `We say this with respect for the years: ${name}'s metabolic foundation is <strong>asking for urgent support</strong>. At this stage, every day of suboptimal nutrition costs more than it did a decade ago.`,
    },
    repair: {
      high: `<strong>Exceptional restorative capacity at this age.</strong> ${name}'s sleep architecture and recovery rhythms are still producing deep, regenerative cycles after a decade. Protect these rituals like the treasure they are.`,
      mid: `${name} is resting — but after a decade, ${pPoss} body needs <strong>deeper repair cycles</strong> than it's currently getting. The margin between "okay sleep" and "restorative sleep" widens with age.`,
      low: `At the master level, insufficient repair <strong>compounds faster</strong>. What a younger body could absorb — fragmented sleep, disrupted recovery — now leaves a measurable deficit each night.`,
      critical: `${name}'s restorative system needs <strong>immediate, deliberate support</strong>. After a decade, the body's ability to self-repair is still there — but it needs the right conditions more than ever.`,
    },
    environmental: {
      high: `<strong>A decade of clean living shows.</strong> ${name}'s low toxic burden at this stage is a direct result of the environmental choices you've made. Keep the standard high.`,
      mid: `After ten years, ${name}'s body has processed a <strong>cumulative chemical load</strong>. At this stage, lightening that burden produces outsized results.`,
      low: `A decade of low-grade environmental stress has <strong>accumulated quietly</strong> in ${name}'s system.`,
      critical: `${name}'s biology is spending <strong>precious master-level resources</strong> fighting environmental toxins. After a decade, the body's filtration systems need relief, not more load.`,
    },
    sync: {
      high: `<strong>A decade of co-regulation has built something rare.</strong> ${name}'s nervous system is fully entrained to yours. This depth of trust takes years. Defend these rhythms with everything.`,
      mid: `After ten years, the bond is <strong>deep but not fully optimized</strong>. ${name} reads you better than any creature on earth — and that means ${pPoss} system still catches your scattered moments.`,
      low: `A decade in — and the pack bond still has <strong>untapped depth</strong>. What ${pPoss} nervous system needs now isn't more love — it's more consistent, intentional co-regulation.`,
      critical: `We'll be direct, with respect for the years: ${name}'s nervous system is <strong>still waiting for a deeper signal</strong> from you.`,
    },
    cognitive: {
      high: `<strong>Remarkable mental acuity at this stage.</strong> ${name}'s brain is still building new pathways, still curious, still engaged. This is the strongest protection against age-related cognitive decline.`,
      mid: `After ten years, ${name}'s brain is <strong>capable of more than it's getting</strong>. Mental stagnation at this stage accelerates decline that's otherwise avoidable.`,
      low: `At the master level, cognitive under-stimulation <strong>costs more per day</strong> than it did at three. The brain is still plastic — still capable of growth — but without novel challenge, those pathways are quietly pruning themselves.`,
      critical: `${name}'s cognitive system needs <strong>immediate enrichment</strong>. After a decade, an under-stimulated brain declines faster than a challenged one.`,
    },
    biomechanical: {
      high: `<strong>Master-level mobility.</strong> After a decade, ${name} still moves with fluid confidence. Maintain it relentlessly. Mobility lost at this stage is harder to recover.`,
      mid: `${name} moves well for ${pPoss} years — but there are <strong>compensations that weren't there before</strong>. Addressing these early preserves years of comfortable movement.`,
      low: `After a decade of faithful service, ${name}'s body is showing <strong>mechanical stress</strong> that deserves your focused attention.`,
      critical: `${name}'s movement patterns reveal <strong>structural needs that can't wait</strong>. After a decade, the body that carried ${pPoss} so far is asking for deliberate biomechanical support.`,
    },
    baseline: {
      high: `<strong>After a decade, ${name}'s vital markers are still strong.</strong> Coat, eyes, energy, digestion — all confirming that the internal systems are functioning well for this stage.`,
      mid: `${name}'s baseline markers at the master level are <strong>telling a nuanced story</strong>. Some systems are holding strong while others are beginning to signal.`,
      low: `After a decade, ${name}'s body is <strong>signaling through multiple channels</strong>. Coat, energy, digestion — these aren't separate issues. They're one system asking for support.`,
      critical: `Multiple vital markers are <strong>flagging at once</strong>. After ten years, when the body speaks this clearly, it's asking for foundational support — not symptom management.`,
    },
  };

  const pillar = bridges[pillarId] || bridges.baseline;
  if (score >= 75) return pillar.high;
  if (score >= 50) return pillar.mid;
  if (score >= 25) return pillar.low;
  return pillar.critical;
}

function getLegacyPillarBridge(score: number, label: string, name: string, pPoss: string, pillarId: string): string {
  const bridges: Record<string, Record<string, string>> = {
    metabolic: {
      high: `<strong>This is something to honor.</strong> Even in the golden chapter, ${name}'s metabolic rhythms are holding strong. Protect it with gentle precision.`,
      mid: `There is still real vitality flowing through ${name}'s metabolic system. But in the golden chapter, the gut needs <strong>gentler, more predictable rhythms</strong>.`,
      low: `In the golden chapter, ${name}'s metabolism deserves your <strong>most compassionate attention</strong>. The digestive system isn't failing — it's asking for softer, more deliberate support.`,
      critical: `We want to be tender but honest: ${name}'s metabolic system is <strong>quietly asking for help</strong>.`,
    },
    repair: {
      high: `<strong>Remarkable restorative health in the golden chapter.</strong> ${name}'s body is still cycling through deep repair night after night. Guard these sleep rituals.`,
      mid: `${name} is resting — but in the golden chapter, the body needs <strong>deeper, more protected repair</strong> than it's currently getting.`,
      low: `In the golden chapter, rest becomes <strong>sacred medicine</strong>. ${name}'s body isn't getting the deep repair cycles it needs to maintain comfort.`,
      critical: `${name}'s restorative system needs <strong>tender, immediate support</strong>.`,
    },
    environmental: {
      high: `<strong>A clean, gentle environment in the golden chapter is a gift.</strong> ${name}'s body is spending its resources on comfort rather than fighting invisible toxins.`,
      mid: `In the golden chapter, ${name}'s body has <strong>less filtration capacity</strong> to spare. Chemical exposures that a younger body managed easily now linger longer.`,
      low: `${name}'s aging immune system is <strong>spending resources on environmental toxins</strong> that could be supporting comfort and vitality instead.`,
      critical: `In the golden chapter, ${name}'s body <strong>cannot afford</strong> the chemical burden it's carrying.`,
    },
    sync: {
      high: `<strong>After all these years, the bond speaks for itself.</strong> ${name}'s nervous system rests in your presence like a prayer answered.`,
      mid: `The love runs deep — but in the golden chapter, ${name}'s nervous system needs <strong>even more consistent reassurance</strong>.`,
      low: `In the golden chapter, the pack bond becomes <strong>the most important pillar of all</strong>. ${name}'s aging nervous system needs your calm presence more than ever.`,
      critical: `We say this gently: in the golden chapter, ${name}'s nervous system is <strong>still looking for permission to fully rest</strong>.`,
    },
    cognitive: {
      high: `<strong>Mental sharpness in the golden chapter is a treasure.</strong> ${name}'s brain is still engaged, still curious, still building connections.`,
      mid: `In the golden chapter, ${name}'s brain benefits from <strong>gentle, consistent stimulation</strong>. Not intensity — novelty.`,
      low: `${name}'s cognitive health in the golden chapter deserves <strong>intentional, gentle enrichment</strong>.`,
      critical: `In the golden chapter, cognitive under-stimulation <strong>accelerates decline</strong> that gentle enrichment can slow.`,
    },
    biomechanical: {
      high: `<strong>Comfortable, confident movement in the golden chapter is a gift you built.</strong> ${name} still navigates the world with ease.`,
      mid: `${name} is still moving — but in the golden chapter, the body reveals <strong>subtle limitations</strong> that deserve gentle attention.`,
      low: `In the golden chapter, ${name}'s movement tells us ${pPoss} body needs <strong>compassionate physical support</strong>.`,
      critical: `${name}'s mobility in the golden chapter needs <strong>immediate, gentle intervention</strong>.`,
    },
    baseline: {
      high: `<strong>Even in the golden chapter, ${name}'s vital markers are holding.</strong> Watch these markers closely. They're your most trusted guide.`,
      mid: `${name}'s baseline markers in the golden chapter are <strong>telling a gentle story</strong>. Some vitality remains strong while other signals ask for attention.`,
      low: `In the golden chapter, ${name}'s vital markers are <strong>asking for foundational support</strong>.`,
      critical: `Multiple vital markers are <strong>signaling at once</strong>. In the golden chapter, this is the body asking for help in the clearest way it can.`,
    },
  };

  const pillar = bridges[pillarId] || bridges.baseline;
  if (score >= 75) return pillar.high;
  if (score >= 50) return pillar.mid;
  if (score >= 25) return pillar.low;
  return pillar.critical;
}

export function ResultsBlueprint({
  dogData,
  results,
  directives,
  track,
  selectedRituals,
  handleShare,
  handleShareAudit,
  shareCopied,
  auditShared,
  dogPhoto,
  dogNumber,
}: {
  dogData: any;
  results: any;
  directives: any;
  track: string;
  selectedRituals: any;
  handleShare: () => void;
  handleShareAudit: () => void;
  shareCopied: boolean;
  auditShared: boolean;
  dogPhoto: string | null;
  dogNumber?: number | null;
}) {
  const [isExportingBadge, setIsExportingBadge] = useState(false);
  const badgeRef = useRef<HTMLDivElement>(null);

  const name = dogData.name || 'your companion';
  const Name = dogData.name || 'Your Companion';
  const { pPoss } = results.pronouns;

  const { topPillar, bottomPillar, secondaryPillar, priorityShift, secondaryShift } = directives;

  const captureBadge = async (): Promise<Blob | null> => {
    if (!badgeRef.current) return null;
    const canvas = await html2canvas(badgeRef.current, {
      backgroundColor: '#F9F5ED',
      scale: 3,
      useCORS: true,
      logging: false,
    });
    return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), 'image/png'));
  };

  const handleShareBadge = async () => {
    setIsExportingBadge(true);
    try {
      const blob = await captureBadge();
      if (!blob) return;
      const file = new File([blob], `${dogData.name || 'dog'}-vitality-badge.png`, { type: 'image/png' });
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `${dogData.name || 'My dog'}'s Vitality Score`,
          text: `${dogData.name || 'My dog'} scored ${results.score}/100 on the Dog Biology Blueprint™.`,
        });
      } else {
        handleDownloadBadge();
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') handleDownloadBadge();
    } finally {
      setIsExportingBadge(false);
    }
  };

  const handleDownloadBadge = async () => {
    setIsExportingBadge(true);
    try {
      const blob = await captureBadge();
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${dogData.name || 'dog'}-vitality-badge.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setIsExportingBadge(false);
    }
  };

  const mirrorBridgeContent = () => {
    const score = results.score;
    if (score >= 75) {
      return {
        tier: 'Resonance',
        icon: '\u{1F48E}',
        text: `Your deep intuition is physically visible in the data. Because you and ${Name} have achieved peak synchronization, your heart rhythms are mirroring each other through Heart Rate Variability (HRV) synchronization. This biological resonance signals to ${Name}'s autonomic nervous system that the environment is perfectly secure, authorizing the highest levels of cellular repair and immune function.`,
        humanBridge: `This is not abstract. When you sit in stillness, ${Name}'s body enters its deepest repair state. When your breathing slows at night, ${pPoss} cortisol drops in tandem. You have become ${pPoss} biological pacemaker — and at this level of integration, protecting your own calm isn't self-care. It's ${pPoss} medicine.`,
      };
    }
    if (score > 40) {
      return {
        tier: 'Emergence',
        icon: '\u{1F331}',
        text: `The love you feel is the foundation, but "routine fragmentation" is creating biological static. This static is a physical elevation of cortisol. When these stress hormones remain elevated, they act as a biological block, preventing ${Name} from entering the deep REM cycles required for cellular repair and immune function.`,
        humanBridge: `The gap between where you are and where ${Name}'s biology needs you to be is not a chasm — it's a series of small, consistent shifts. The protocol below targets the exact points where routine fragmentation is producing cortisol spikes. Close those gaps, and ${Name}'s body will respond faster than you expect.`,
      };
    }
    return {
      tier: 'The Guarded Threshold',
      icon: '\u{1F6E1}\u{FE0F}',
      text: `Right now, ${Name}'s ancestral guard is up, placing you at a Guarded Threshold. This isn't a lack of bond — it's a biological signal that ${pPoss} nervous system is locked in a state of chronic hyper-vigilance. This sympathetic "fight-or-flight" state physically blocks the vagus nerve from signaling the body to enter deep restorative repair.`,
      humanBridge: `The vagus nerve is the bridge between survival mode and healing mode. Right now, ${Name}'s vagal tone is suppressed — meaning ${pPoss} body cannot access the parasympathetic state required for deep cellular maintenance. The protocol below is designed to systematically lower the threshold until ${pPoss} nervous system receives a clear, repeatable signal: safe. You can let go.`,
    };
  };

  const mirror = mirrorBridgeContent();

  return (
    <div className="space-y-12 sm:space-y-16 lg:space-y-20 border-t border-[#E8E2D9] pt-12 sm:pt-16 lg:pt-20">
      {/* ===== BLUEPRINT HEADER ===== */}
      <div>
        <h2 className="text-2xl font-serif text-[#2A2421] leading-tight">{Name}'s Dog Biology Blueprint™</h2>
        <p className="text-sm text-[#5C534E]/60 font-light mt-0.5">Personalized protocol based on {dogData.breed ? `${dogData.breed}, ` : ''}{dogData.age ? `${dogData.age} years` : 'your companion'}</p>
      </div>

      {/* ===== SUPERPOWER & PRIORITY GAP ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-[#E8E2D9] p-6 sm:p-8 rounded-none shadow-none">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#0A4682]/10 border border-[#0A4682]/20 flex items-center justify-center">
              <Icons.TrendingUp size={18} className="text-[#0A4682]" />
            </div>
            <div>
              <span className="font-mono text-[8px] uppercase tracking-[0.35em] text-[#0A4682] font-medium block">Superpower</span>
              <h4 className="text-lg font-serif text-[#2A2421] leading-tight">{topPillar.title}</h4>
            </div>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 h-2 bg-stone-200/60 rounded-full overflow-hidden">
              <div className="h-full bg-[#0A4682] rounded-full" style={{ width: `${topPillar.score}%` }} />
            </div>
            <span className="text-[#2A2421] font-serif text-lg font-light">{topPillar.score}%</span>
          </div>
          <p className="text-sm text-[#5C534E] leading-[1.7] font-light">
            This is {Name}'s strongest biological system. It's working in {pPoss} favor every single day — an anchor of vitality that elevates everything else. Your job: protect it.
          </p>
        </div>

        <div className="bg-white border border-[#E8E2D9] p-6 sm:p-8 rounded-none shadow-none">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200/60 flex items-center justify-center">
              <Icons.Target size={18} className="text-amber-600" />
            </div>
            <div>
              <span className="font-mono text-[8px] uppercase tracking-[0.35em] text-amber-600 font-medium block">Priority Gap</span>
              <h4 className="text-lg font-serif text-[#2A2421] leading-tight">{bottomPillar.title}</h4>
            </div>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 h-2 bg-stone-200/60 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${bottomPillar.score}%` }} />
            </div>
            <span className="text-[#2A2421] font-serif text-lg font-light">{bottomPillar.score}%</span>
          </div>
          <p className="text-sm text-[#5C534E] leading-[1.7] font-light">
            This is where {Name}'s vitality is being held back. The protocol below targets this system with precision — because raising this single pillar produces the largest ripple effect across {pPoss} entire biology.
          </p>
        </div>
      </div>

      {/* ===== THE SEVEN PILLARS ===== */}
      <div className="space-y-12">
        <div className="space-y-4">
          <h3 className="text-4xl lg:text-5xl font-serif text-[#2A2421] border-b border-[#E8E2D9] pb-8 tracking-tight leading-[1.08]">
            The Seven Pillars — What We Found
          </h3>
          <p className="text-[#5C534E] text-lg leading-[1.8] font-light max-w-3xl">
            We evaluated {Name} across <strong>7 Biology Markers</strong>. Each score is paired with our clinical read — connecting each finding to your daily life together.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {foundations.map((f, i) => {
            const Icon = f.Icon;
            const score = results.phaseScores[i];
            return (
              <div
                key={i}
                className="space-y-5 border border-[#E8E2D9] p-5 sm:p-7 lg:p-8 bg-white rounded-none shadow-none hover:shadow-none transition-shadow duration-300"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Icon size={18} strokeWidth={1.3} className="text-[#0A4682]" />
                    <span className="font-mono text-[8.5px] uppercase tracking-[0.35em] text-[#5C534E]/60 font-medium">
                      {f.label}
                    </span>
                  </div>
                  <span className="text-[#2A2421] text-xl font-serif font-light">{score}%</span>
                </div>
                <div className="w-full h-2 bg-stone-200/60 relative rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-[#0A4682] transition-all duration-700 rounded-full"
                    style={{ width: `${score}%` }}
                  />
                </div>
                <div className="space-y-3 border-t border-[#E8E2D9] pt-5">
                  <h5 className="font-mono text-[8px] uppercase tracking-[0.35em] text-[#5C534E]/40 font-medium">
                    Our Read
                  </h5>
                  <p className="text-sm text-[#5C534E] leading-[1.7] font-light" dangerouslySetInnerHTML={{ __html: (track === 'legacy' ? getLegacyPillarBridge : track === 'master' ? getMasterPillarBridge : getAscentPillarBridge)(score, f.label, name, pPoss, f.id) }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== MIRROR BRIDGE ===== */}
      <div className="space-y-12 pt-12 border-t border-[#E8E2D9]">
        <h3 className="text-4xl lg:text-5xl font-serif text-[#2A2421] tracking-tight leading-[1.08]">
          {track === 'legacy' ? 'The Mirror — What You Both Carry' : track === 'master' ? 'The Mirror — What a Decade Reveals' : 'The Mirror — What You Already See'}
        </h3>

        <div className="bg-white border border-[#E8E2D9] p-6 sm:p-8 lg:p-12 rounded-none shadow-none">
          {dogPhoto && (
            <div className="flex justify-center mb-8">
              <img src={dogPhoto} alt={Name} className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-[2.5px] border-[#E8E2D9] shadow-none" />
            </div>
          )}

          {dogData.reflection && (
            <p className="text-[#5C534E] text-lg mb-8 border-l-2 border-[#0A4682]/30 pl-6 italic font-light leading-[1.8]">
              "{dogData.reflection}"
            </p>
          )}

          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="text-3xl">{mirror.icon}</span>
              <div>
                <span className="font-mono text-[8px] uppercase tracking-[0.35em] text-[#5C534E]/50 font-medium block">Your Resonance Level</span>
                <h4 className="text-2xl font-serif text-[#2A2421]">{mirror.tier}</h4>
              </div>
            </div>

            <div className="space-y-4">
              <span className="font-mono text-[8px] uppercase tracking-[0.35em] text-[#5C534E]/50 font-medium block">
                The Biological Reality
              </span>
              <p className="text-[#5C534E] leading-[1.8] font-light text-base">
                {mirror.text}
              </p>
            </div>

            <div className="bg-[#FDFBF7] border border-[#E8E2D9]/60 p-6 rounded-none">
              <p className="text-[8px] font-mono uppercase tracking-[0.35em] text-[#5C534E]/50 font-medium mb-3">
                The Human Bridge
              </p>
              <p className="text-[#5C534E] leading-[1.8] font-light">
                {mirror.humanBridge}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== PRIORITY SHIFT PROTOCOL ===== */}
      <div className="space-y-12 pt-12 border-t border-[#E8E2D9]">
        <div className="border-b border-[#E8E2D9] pb-8">
          <h3 className="text-4xl lg:text-5xl font-serif text-[#2A2421] tracking-tight leading-[1.08]">
            Your Priority Shift — First Steps for Concentrated Results
          </h3>
          <p className="text-[#5C534E] text-base mt-4 leading-[1.8] font-light max-w-3xl">
            We analyzed all <strong>50 carefully selected markers</strong> and identified {Name}'s single highest-leverage system for change. This is not a calendar of small tasks — it's a focused, practitioner-level protocol targeting <strong>{bottomPillar.title}</strong> with specific, actionable steps designed to produce visible results.
          </p>
        </div>

        <div className="bg-white border border-[#E8E2D9] rounded-none shadow-none overflow-hidden">
          <div className="bg-[#2A2421] text-white p-6 sm:p-8 lg:p-10">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl">{priorityShift.emoji}</span>
              <div>
                <span className="font-mono text-[8px] uppercase tracking-[0.35em] text-white/40 font-medium block">{bottomPillar.title} — Priority Protocol</span>
                <h4 className="text-2xl font-serif text-white leading-tight">{priorityShift.protocolTitle}</h4>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10 border-b border-[#E8E2D9]">
            <div className="flex items-center gap-3 mb-4">
              <Icons.FlaskConical size={16} className="text-[#0A4682]" strokeWidth={1.5} />
              <span className="font-mono text-[8px] uppercase tracking-[0.35em] text-[#5C534E]/50 font-medium">The Biology — Why This Matters</span>
            </div>
            <p className="text-[#5C534E] leading-[1.85] font-light text-[15px]">
              {priorityShift.biologicalWhy}
            </p>
          </div>

          <div className="p-6 sm:p-8 lg:p-10 border-b border-[#E8E2D9] bg-[#FDFBF7]/50">
            <div className="flex items-center gap-3 mb-4">
              <Icons.Heart size={16} className="text-[#0A4682]" strokeWidth={1.5} />
              <span className="font-mono text-[8px] uppercase tracking-[0.35em] text-[#5C534E]/50 font-medium">The Connection — What This Means for {Name}</span>
            </div>
            <p className="text-[#5C534E] leading-[1.85] font-light text-[15px]">
              {priorityShift.compassionateWhat}
            </p>
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <div className="flex items-center gap-3 mb-6">
              <Icons.ClipboardList size={16} className="text-[#0A4682]" strokeWidth={1.5} />
              <span className="font-mono text-[8px] uppercase tracking-[0.35em] text-[#5C534E]/50 font-medium">Your Protocol — Exactly What to Do</span>
            </div>
            <div className="space-y-10">
              {priorityShift.protocolSteps.map((step: { reasoning: string; action: string; outcome: string }, i: number) => (
                <div key={i} className="space-y-5">
                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#2A2421] flex items-center justify-center text-white font-mono text-[10px] font-medium mt-0.5">
                      {i + 1}
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="space-y-2">
                        <span className="font-mono text-[7.5px] uppercase tracking-[0.3em] text-[#5C534E]/50 font-medium">Why This Matters</span>
                        <p className="text-[#5C534E] leading-[1.8] font-light text-[14px]">{step.reasoning}</p>
                      </div>
                      <div className="space-y-2 bg-[#FDFBF7] border border-[#E8E2D9]/60 rounded-none p-4">
                        <span className="font-mono text-[7.5px] uppercase tracking-[0.3em] text-[#2A2421] font-bold">The Action</span>
                        <p className="text-[#2A2421] leading-[1.8] font-normal text-[14.5px]">{step.action}</p>
                      </div>
                      <div className="space-y-2">
                        <span className="font-mono text-[7.5px] uppercase tracking-[0.3em] text-[#0A4682] font-medium">Expected Outcome</span>
                        <p className="text-[#5C534E] leading-[1.8] font-light text-[14px] italic">{step.outcome}</p>
                      </div>
                    </div>
                  </div>
                  {i < priorityShift.protocolSteps.length - 1 && (
                    <div className="border-b border-[#E8E2D9] ml-12" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== SECONDARY PROTOCOL ===== */}
      {secondaryPillar && secondaryPillar.id !== bottomPillar.id && secondaryShift && (
        <div className="space-y-12 pt-12 border-t border-[#E8E2D9]">
          <div className="border-b border-[#E8E2D9] pb-8">
            <h3 className="text-4xl lg:text-5xl font-serif text-[#2A2421] tracking-tight leading-[1.08]">
              Secondary Focus — Your Next Lever
            </h3>
            <p className="text-[#5C534E] text-base mt-4 leading-[1.8] font-light max-w-3xl">
              Once {Name}'s primary protocol is running smoothly, this is the second system to address. Targeting <strong>{secondaryPillar.title}</strong> (currently at {secondaryPillar.score}%) creates the next wave of improvement.
            </p>
          </div>

          <div className="bg-white border border-[#E8E2D9] rounded-none shadow-none overflow-hidden">
            <div className="bg-[#3D3530] text-white p-6 sm:p-8">
              <div className="flex items-center gap-4">
                <span className="text-2xl">{secondaryShift.emoji}</span>
                <div>
                  <span className="font-mono text-[8px] uppercase tracking-[0.35em] text-white/40 font-medium block">{secondaryPillar.title} — Secondary Protocol</span>
                  <h4 className="text-xl font-serif text-white leading-tight">{secondaryShift.protocolTitle}</h4>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 border-b border-[#E8E2D9]">
              <div className="flex items-center gap-3 mb-4">
                <Icons.FlaskConical size={16} className="text-[#0A4682]" strokeWidth={1.5} />
                <span className="font-mono text-[8px] uppercase tracking-[0.35em] text-[#5C534E]/50 font-medium">Why This System Matters</span>
              </div>
              <p className="text-[#5C534E] leading-[1.85] font-light text-[15px]">
                {secondaryShift.biologicalWhy}
              </p>
            </div>

            <div className="p-6 sm:p-8 bg-[#FDFBF7]/50 border-b border-[#E8E2D9]">
              <div className="flex items-center gap-3 mb-4">
                <Icons.Heart size={16} className="text-[#0A4682]" strokeWidth={1.5} />
                <span className="font-mono text-[8px] uppercase tracking-[0.35em] text-[#5C534E]/50 font-medium">What This Means for {Name}</span>
              </div>
              <p className="text-[#5C534E] leading-[1.85] font-light text-[15px]">
                {secondaryShift.compassionateWhat}
              </p>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <Icons.ClipboardList size={16} className="text-[#0A4682]" strokeWidth={1.5} />
                <span className="font-mono text-[8px] uppercase tracking-[0.35em] text-[#5C534E]/50 font-medium">Top 3 Actions</span>
              </div>
              <div className="space-y-8">
                {secondaryShift.protocolSteps.slice(0, 3).map((step: { reasoning: string; action: string; outcome: string }, i: number) => (
                  <div key={i} className="space-y-4">
                    <div className="flex gap-4 items-start">
                      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#3D3530] flex items-center justify-center text-white font-mono text-[10px] font-medium mt-0.5">
                        {i + 1}
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="space-y-2 bg-[#FDFBF7] border border-[#E8E2D9]/60 rounded-none p-4">
                          <span className="font-mono text-[7.5px] uppercase tracking-[0.3em] text-[#2A2421] font-bold">The Action</span>
                          <p className="text-[#2A2421] leading-[1.8] font-normal text-[14px]">{step.action}</p>
                        </div>
                        <div className="space-y-2">
                          <span className="font-mono text-[7.5px] uppercase tracking-[0.3em] text-[#0A4682] font-medium">Expected Outcome</span>
                          <p className="text-[#5C534E] leading-[1.8] font-light text-[13.5px] italic">{step.outcome}</p>
                        </div>
                      </div>
                    </div>
                    {i < 2 && <div className="border-b border-[#E8E2D9] ml-11" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== WEEKLY RHYTHM ===== */}
      <div className="space-y-12 pt-12 border-t border-[#E8E2D9]">
        <div className="border-b border-[#E8E2D9] pb-8">
          <h3 className="text-4xl lg:text-5xl font-serif text-[#2A2421] tracking-tight leading-[1.08]">
            Your Weekly Rhythm
          </h3>
          <p className="text-[#5C534E] text-base mt-4 leading-[1.8] font-light max-w-3xl">
            A structured cadence to integrate everything above into daily life. Consistency wins over intensity — {Name}'s biology responds to rhythm, not heroic effort.
          </p>
        </div>

        <div className="bg-white border border-[#E8E2D9] rounded-none shadow-none overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#E8E2D9]">
            {[
              { day: 'Daily — Non-Negotiables', items: [
                `${priorityShift.protocolSteps[0]?.action ? 'Priority protocol Step 1' : 'Primary pillar focus'}`,
                'Morning activation ritual (3-5 min)',
                'Structured meal timing',
                'Evening wind-down sequence',
              ]},
              { day: 'Every Other Day', items: [
                `${priorityShift.protocolSteps[1]?.action ? 'Priority protocol Step 2' : 'Secondary actions'}`,
                'Cognitive enrichment (puzzle feeder or scent game)',
                'Body scan check (2 min)',
              ]},
              { day: 'Weekly', items: [
                'Novel environment exploration',
                `${secondaryPillar && secondaryPillar.id !== bottomPillar.id ? `Secondary protocol: ${secondaryPillar.title}` : 'Rotate enrichment methods'}`,
                'Bed & environment refresh',
                'Progress check against markers below',
              ]},
            ].map((block) => (
              <div key={block.day} className="p-6 sm:p-8">
                <h5 className="font-mono text-[8px] uppercase tracking-[0.35em] text-[#0A4682] font-bold mb-5">{block.day}</h5>
                <ul className="space-y-3">
                  {block.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0A4682]/40 flex-shrink-0 mt-[7px]" />
                      <span className="text-[13.5px] text-[#5C534E] leading-[1.7] font-light">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== PROGRESS MARKERS ===== */}
      <div className="space-y-12 pt-12 border-t border-[#E8E2D9]">
        <div className="border-b border-[#E8E2D9] pb-8">
          <h3 className="text-4xl lg:text-5xl font-serif text-[#2A2421] tracking-tight leading-[1.08]">
            What to Watch For
          </h3>
          <p className="text-[#5C534E] text-base mt-4 leading-[1.8] font-light max-w-3xl">
            Biology moves on its own timeline. Here's what to expect as {Name}'s systems respond to consistent protocol adherence. These markers confirm you're on the right track.
          </p>
        </div>

        <div className="space-y-0">
          {[
            { timeframe: 'Days 1-7', label: 'Initial Response', markers: [
              `Settling into sleep faster (within 5 min vs. 15-20)`,
              `More predictable appetite at meal times`,
              `Subtle shift in morning energy — calmer, more present`,
              `May initially resist new enrichment routines (this is normal)`,
            ]},
            { timeframe: 'Days 8-14', label: 'System Calibration', markers: [
              `Cortisol curve normalizing — more consistent energy throughout the day`,
              `Stool consistency improving`,
              `Reduced paw licking, eye discharge, or skin irritation`,
              `Visibly deeper sleep positions (full lateral recumbency)`,
            ]},
            { timeframe: 'Days 15-30', label: 'Visible Transformation', markers: [
              `Coat beginning to show improved luster and texture`,
              `Sustained engagement during enrichment (longer attention span)`,
              `Improved social confidence and reduced reactivity`,
              `Morning stiffness reduced or eliminated`,
              `Overall demeanor shift — "they seem like themselves again"`,
            ]},
          ].map((phase, idx) => (
            <div key={phase.timeframe} className={`bg-white border border-[#E8E2D9] p-6 sm:p-8 ${idx === 0 ? '' : 'border-t-0'}`}>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-10 h-10 rounded-full bg-[#2A2421] flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-mono text-[10px] font-bold">{idx + 1}</span>
                </div>
                <div>
                  <span className="font-mono text-[8px] uppercase tracking-[0.35em] text-[#5C534E]/50 font-medium block">{phase.timeframe}</span>
                  <h5 className="text-lg font-serif text-[#2A2421]">{phase.label}</h5>
                </div>
              </div>
              <ul className="space-y-3 ml-14">
                {phase.markers.map((marker, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Icons.Check size={14} className="text-[#0A4682] flex-shrink-0 mt-[3px]" strokeWidth={2} />
                    <span className="text-[14px] text-[#5C534E] leading-[1.7] font-light">{marker}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="bg-[#FDFBF7] border border-[#E8E2D9] p-6 sm:p-8 rounded-none">
          <p className="text-[13.5px] text-[#5C534E] leading-[1.8] font-light">
            <strong className="text-[#2A2421]">Note:</strong> If you don't see initial markers by Day 10, don't adjust the protocol — increase consistency. Biology responds to repetition before it responds to intensity. The most common reason protocols "don't work" is subtle schedule drift that prevents the body from establishing new patterns.
          </p>
        </div>
      </div>

      {/* ===== FULL VITALITY RECORD ===== */}
      <div className="space-y-12 pt-12 border-t border-[#E8E2D9]">
        <div>
          <h3 className="text-4xl lg:text-5xl font-serif text-[#2A2421] border-b border-[#E8E2D9] pb-8 tracking-tight leading-[1.08]">
            The Complete Vitality Record
          </h3>
          <p className="text-[#5C534E]/60 text-sm mt-4 leading-[1.8] font-light">
            All 50 markers across all seven pillars. Your permanent reference — revisit as you implement the protocol.
          </p>
        </div>
        <div className="bg-white border border-[#E8E2D9] p-5 sm:p-8 lg:p-12 rounded-none shadow-none space-y-10 sm:space-y-12">
          {foundations.map((f, i) => (
            <div key={i} className="space-y-6 border-b border-[#E8E2D9] pb-10 last:border-0 last:pb-0">
              <div className="space-y-2">
                <h4 className="text-xl font-serif text-[#2A2421]">{f.title}</h4>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-stone-200/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#0A4682] transition-all"
                      style={{ width: `${results.phaseScores[i]}%` }}
                    />
                  </div>
                  <span className="text-[#2A2421] font-serif text-lg font-light min-w-[50px] text-right">
                    {results.phaseScores[i]}%
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                {f.rituals.map((r: any, j: number) => {
                  const answer = selectedRituals[r.id] || 'never';
                  const isPassed = answer !== 'never';
                  const frequencyDisplay: Record<string, { label: string; color: string }> = {
                    daily: { label: 'Always', color: 'bg-[#0A4682]' },
                    often: { label: 'Usually', color: 'bg-[#0A4682]/80' },
                    sometimes: { label: 'Sometimes', color: 'bg-amber-500' },
                    rarely: { label: 'Rarely', color: 'bg-amber-400' },
                    never: { label: 'Never', color: 'bg-stone-300' },
                  };
                  const freq = frequencyDisplay[answer] || frequencyDisplay.never;
                  return (
                    <div
                      key={j}
                      className={`p-4 rounded-none border transition-all ${isPassed ? 'bg-white border-[#E8E2D9]' : 'bg-[#FDFBF7] border-[#E8E2D9]'}`}
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0 mt-[2px] ${freq.color}`}>
                          {isPassed && (
                            <Icons.Check size={12} className="text-white" strokeWidth={2.5} />
                          )}
                        </span>
                        <span className={`text-sm font-medium flex-1 ${isPassed ? 'text-[#2A2421]' : 'text-[#5C534E]/60'}`}>
                          {r.label}
                        </span>
                        <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full ${isPassed ? 'bg-stone-100 text-[#5C534E]' : 'bg-stone-100 text-[#5C534E]/40'}`}>
                          {freq.label}
                        </span>
                      </div>
                      <p className="text-[13px] leading-[1.6] text-[#5C534E]/70 font-light pl-8">{r.desc ? r.desc(dogData.name || 'your dog') : ''}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== SHARE ===== */}
      <div className="space-y-10 sm:space-y-14 lg:space-y-16 pt-12 border-t border-[#E8E2D9]">
        <div className="border-b border-[#E8E2D9] pb-8">
          <h3 className="text-4xl lg:text-5xl font-serif text-[#2A2421] tracking-tight leading-[1.08]">
            Share the Journey
          </h3>
          <p className="text-[#5C534E]/60 text-sm mt-4 leading-[1.8] font-light">
            Every dog deserves this level of attention. If this resonated, share it with someone whose dog deserves the same.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">
          {/* Social-Ready Vitality Badge */}
          <div className="w-full max-w-md mx-auto lg:mx-0 flex-shrink-0">
            <div
              ref={badgeRef}
              id="share-badge"
              style={{
                backgroundColor: '#F9F5ED',
                width: '100%',
                maxWidth: '340px',
                aspectRatio: '9/16',
                margin: '0 auto',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                overflow: 'hidden',
              }}
            >
              {/* Inset border */}
              <div style={{
                position: 'absolute',
                top: '14px',
                left: '14px',
                right: '14px',
                bottom: '14px',
                border: '2px solid #CDC2B0',
                pointerEvents: 'none',
              }} />

              {/* Photo panel - reduced height */}
              <div style={{
                width: 'calc(100% - 40px)',
                height: '214px',
                marginTop: '20px',
                borderRadius: '12px',
                border: '3px solid #B09469',
                overflow: 'hidden',
                position: 'relative',
                backgroundColor: dogPhoto ? undefined : '#F2EBDC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}>
                {dogPhoto ? (
                  <img
                    src={dogPhoto}
                    alt={Name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 25%' }}
                  />
                ) : (
                  <>
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      border: '2px solid #B09469',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}>
                      <div style={{ position: 'absolute', inset: '-6px', borderRadius: '50%', border: '1px solid #CDC2B0' }} />
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#B09469" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="4" r="2" />
                        <circle cx="4.5" cy="8.5" r="2" />
                        <circle cx="17.5" cy="8.5" r="2" />
                        <circle cx="7" cy="13" r="1.5" />
                        <circle cx="17" cy="13" r="1.5" />
                        <path d="M12 17c-3.5 0-5.5 2-5.5 3.5 0 1 1.5 1.5 3 1.5 1 0 1.8-.5 2.5-1.2.7.7 1.5 1.2 2.5 1.2 1.5 0 3-.5 3-1.5 0-1.5-2-3.5-5.5-3.5z" />
                      </svg>
                    </div>
                    <p style={{ marginTop: '10px', fontSize: '10px', letterSpacing: '0.3em', color: '#867766', fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}>
                      EVERY DOG IS A GOOD DOG
                    </p>
                  </>
                )}
              </div>

              {/* DOG BIOLOGY BLUEPRINT */}
              <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: '#867766', fontFamily: "'Montserrat', sans-serif", fontWeight: 300, marginTop: '12px', marginBottom: '2px' }}>
                DOG BIOLOGY BLUEPRINT™
              </p>

              {/* Dog name */}
              <p style={{ fontSize: '43px', fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, color: '#4A3C2F', margin: '0', lineHeight: 1.1 }}>
                {dogData.name || 'Your Companion'}
              </p>

              {/* Archetype */}
              <p style={{ fontSize: '19px', fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontWeight: 300, color: '#867766', margin: '2px 0 0' }}>
                {results.archetype.name}
              </p>

              {/* Score */}
              <div style={{ display: 'flex', alignItems: 'baseline', marginTop: '6px' }}>
                <span style={{ fontSize: '85px', fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, color: '#4A3C2F', lineHeight: 1 }}>
                  {results.score}
                </span>
                <span style={{ fontSize: '29px', fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, color: '#867766', marginLeft: '2px' }}>
                  /100
                </span>
              </div>

              {/* VITALITY INDEX */}
              <p style={{ fontSize: '10px', letterSpacing: '0.3em', color: '#867766', fontFamily: "'Montserrat', sans-serif", fontWeight: 300, margin: '0 0 8px' }}>
                VITALITY INDEX
              </p>

              {/* Pillar bars */}
              {results.phaseScores && results.phaseScores.length >= 7 && (
                <>
                  <div style={{ display: 'flex', gap: '4px', width: 'calc(100% - 50px)', alignItems: 'flex-end', height: '47px', marginBottom: '3px' }}>
                    {['BATTERY', 'REST', 'SHIELD', 'BOND', 'MIND', 'MOTION', 'HARMONY'].map((label, i) => {
                      const pct = results.phaseScores[i] ?? 0;
                      const barHeight = Math.max(8, (pct / 100) * 47);
                      return (
                        <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                          <div style={{ width: '21px', height: `${barHeight}px`, borderRadius: '4.5px', border: '1px solid #CDC2B0', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${pct}%`, backgroundColor: '#B09469', borderRadius: '3.5px' }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ display: 'flex', gap: '4px', width: 'calc(100% - 50px)', marginBottom: '10px' }}>
                    {['BATTERY', 'REST', 'SHIELD', 'BOND', 'MIND', 'MOTION', 'HARMONY'].map((label) => (
                      <div key={label} style={{ flex: 1, textAlign: 'center' }}>
                        <span style={{ fontSize: '8px', letterSpacing: '0.05em', color: '#867766', fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}>
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Single consolidated bottom line */}
              <p style={{ position: 'absolute', bottom: '35px', left: 0, right: 0, textAlign: 'center', fontSize: '10px', letterSpacing: '0.25em', color: '#4A3C2F', fontFamily: "'Montserrat', sans-serif", fontWeight: 300, margin: 0 }}>
                DOG #{dogNumber ? String(dogNumber).padStart(3, '0') : '001'} &middot; {new Date().toLocaleString('default', { month: 'long' }).toUpperCase()} {new Date().getFullYear()}
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={handleShareBadge}
                disabled={isExportingBadge}
                className="w-full bg-[#4A3C2F] text-[#F9F5ED] px-8 py-4 text-[8.5px] font-mono uppercase tracking-[0.35em] hover:bg-[#3A2E22] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 rounded-none font-bold shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExportingBadge ? (
                  <>
                    <Icons.Loader className="animate-spin" size={15} />
                    Preparing...
                  </>
                ) : (
                  <>
                    <Icons.Share size={15} />
                    Share to Instagram
                  </>
                )}
              </button>
              <button
                onClick={handleDownloadBadge}
                disabled={isExportingBadge}
                className="w-full flex items-center justify-center gap-3 border border-[#CDC2B0] text-[#4A3C2F] px-6 py-3.5 text-[8.5px] font-mono uppercase tracking-[0.3em] hover:border-[#B09469] hover:text-[#B09469] transition-all rounded-none font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icons.Download size={15} />
                Download Badge
              </button>
              <p className="text-[10px] text-[#5C534E]/40 font-light leading-[1.6] text-center pt-2">
                By completing this Blueprint, your results may be anonymously featured on our social channels (first name + breed only).
              </p>
            </div>
          </div>

          {/* Share Actions */}
          <div className="flex-1 space-y-8 w-full">
            <div className="space-y-3">
              <p className="font-mono text-[8px] uppercase tracking-[0.35em] text-[#5C534E]/50 font-medium">
                Ready-made caption
              </p>
              <div className="bg-[#FDFBF7] border border-[#E8E2D9]/60 rounded-none p-6 text-sm text-[#5C534E] leading-[1.8] font-light select-all">
                {dogData.name
                  ? `${dogData.name} just scored ${results.score}/100 on the Dog Biology Blueprint™.`
                  : `My dog just scored ${results.score}/100 on the Dog Biology Blueprint™.`}
                {'\n\n'}Archetype: {results.archetype.name}
                {'\n\n'}
                {results.archetype.freeTeaser.split('.').slice(0, 2).join('.') + '.'}
                {'\n\n'}Human-Dog Sync: {results.packSync}%
              </div>
              <button
                onClick={handleShare}
                className="w-full bg-[#2A2421] text-white px-8 py-4 text-[8.5px] font-mono uppercase tracking-[0.35em] hover:bg-[#2A2421]/90 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 rounded-none font-bold shadow-none"
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

            <button
              onClick={handleShareAudit}
              className="w-full flex items-center justify-center gap-3 border border-[#E8E2D9] text-[#5C534E] px-6 py-4 text-[8.5px] font-mono uppercase tracking-[0.3em] hover:border-[#0A4682] hover:text-[#0A4682] transition-all rounded-none font-bold"
            >
              {auditShared ? (
                <>
                  <Icons.Check size={15} />
                  Link Copied!
                </>
              ) : (
                <>
                  <Icons.Link size={15} />
                  Share Site
                </>
              )}
            </button>

            <div className="flex items-start gap-3 bg-white border border-[#E8E2D9] rounded-none p-4 shadow-none">
              <Icons.Mail size={16} className="text-[#0A4682] flex-shrink-0 mt-0.5" />
              <p className="text-[13px] text-[#5C534E] leading-[1.7] font-light">
                A copy of {Name}'s full Dog Biology Blueprint™ has been sent to <strong>{dogData.ownerEmail}</strong>. Check your inbox (and spam folder) shortly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
