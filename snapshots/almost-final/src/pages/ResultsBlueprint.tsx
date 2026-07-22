import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { Icons } from '../components/Icons';
import { foundations } from '../data/foundations';

function getAscentPillarBridge(score: number, label: string, name: string, pPoss: string, pillarId: string): string {
  const bridges: Record<string, Record<string, string>> = {
    metabolic: {
      high: `<strong>The engine is fed well.</strong> ${name}'s metabolic rhythms are running clean — digestion steady, energy stable across the day. Protect this foundation. It anchors everything else.`,
      mid: `${name}'s metabolic system is working — but it's working <strong>harder than it should</strong>. Meal timing, nutrient density, or gut rest windows are fragmenting what should be smooth, sustained fuel. The tweaks below bring ${pPoss} internal battery back to full capacity.`,
      low: `We see the <strong>highest-leverage opportunity</strong> here. ${name}'s metabolism isn't broken — it's under-supported. Inconsistent fuel, missing nutrients, or a gut that never fully rests are costing ${pPoss} body daily. Start with the first directive below.`,
      critical: `${name}'s metabolic foundation needs <strong>immediate attention</strong>. The body is spending energy managing what should be effortless — digestion, blood sugar, cellular fuel. The rituals below are ordered by what will stabilize ${pPoss} system fastest.`,
    },
    repair: {
      high: `<strong>${name}'s body is healing itself beautifully.</strong> Deep sleep cycles, efficient recovery, and strong restorative rhythms are doing their work every night. Guard these rituals — they are ${pPoss} longevity engine.`,
      mid: `${name} is resting — but <strong>not fully repairing</strong>. Something in the sleep environment, timing, or wind-down routine is pulling ${pPoss} body out of the deepest restorative cycles. The adjustments below target exactly where that repair is leaking.`,
      low: `This is where ${name}'s vitality is <strong>quietly losing ground</strong>. Without deep, uninterrupted repair cycles, everything else — energy, immunity, joint health — degrades faster than it should. A few environmental shifts here will produce outsized results.`,
      critical: `${name}'s restorative system is <strong>running on fumes</strong>. The body isn't getting the deep repair it needs to maintain itself. This isn't about more sleep — it's about creating the conditions for ${pPoss} nervous system to truly let go. Start here.`,
    },
    environmental: {
      high: `<strong>${name}'s environment is clean and intentional.</strong> Low toxic load, natural materials, and a home that supports rather than stresses ${pPoss} biology. This is rarer than people think — well done.`,
      mid: `${name}'s body is processing a <strong>low-grade chemical burden</strong> that most owners never notice. Not dramatic — subtle. Synthetic fragrances, floor chemicals, or off-gassing materials that ${pPoss} liver processes every single day. The swaps below lighten that load meaningfully.`,
      low: `The invisible stressors in ${name}'s environment are <strong>accumulating quietly</strong>. ${pPoss} body is spending immune resources on things that shouldn't be there — and those resources aren't available for repair, immunity, or vitality. Targeted swaps below make the biggest difference.`,
      critical: `${name}'s biology is <strong>fighting its own environment</strong>. Chemical exposure through skin, lungs, and paws is draining the system daily. The good news: environmental changes show results fast. Start with the first swap below and build from there.`,
    },
    sync: {
      high: `<strong>The bond is biologically real.</strong> ${name}'s nervous system treats your presence as a signal to heal. You've built something most owners never achieve — a true co-regulatory partnership. Protect it fiercely.`,
      mid: `The love is clear — but ${name}'s nervous system isn't <strong>fully trusting</strong> it yet. Micro-disconnections throughout the day — screens, stress, divided attention — keep ${pPoss} guard subtly raised. The rituals below deepen what you've already started.`,
      low: `${name} loves you. But <strong>love isn't landing as biology</strong> yet. The pack bond isn't just emotional — it's your dog's primary nervous system regulator. Without consistent co-regulation rituals, ${pPoss} body stays in low-grade alert. This section unlocks the deepest shift.`,
      critical: `The bond is there — we can see it. But ${name}'s nervous system hasn't received the <strong>consistent signal</strong> it needs to fully relax into your presence. This isn't a character flaw. It's a rhythm issue. The directives below build that signal, starting today.`,
    },
    cognitive: {
      high: `<strong>${name}'s mind is sharp and engaged.</strong> Novel challenges, sensory variety, and genuine mental stimulation are keeping ${pPoss} neural pathways fresh. A stimulated brain protects the body — you're investing in longevity here.`,
      mid: `${name}'s brain is <strong>under-challenged</strong>. Not bored, exactly — but not growing. Mental stagnation shows up as restlessness, fixation, or low-grade anxiety before it shows up as cognitive decline. The additions below feed what ${pPoss} brain is hungry for.`,
      low: `We see an <strong>untapped cognitive reserve</strong> in ${name}. The brain needs novelty like muscles need movement — without it, neural pathways prune themselves. The rituals below aren't entertainment. They're neurological maintenance.`,
      critical: `${name}'s brain is <strong>under-stimulated</strong>. Without regular novelty and problem-solving, cognitive decline accelerates far earlier than it should. The good news: the brain responds fast to enrichment. Two weeks of the rituals below and you'll see the difference.`,
    },
    biomechanical: {
      high: `<strong>${name} moves like ${pPoss} body was built to.</strong> Fluid, balanced, confident across terrain. Strong muscle tone, easy transitions, and no compensation patterns. Maintain this — it's the foundation of pain-free aging.`,
      mid: `${name} moves well — but there are <strong>subtle compensations</strong>. A slight hesitation getting up, favoring one side, or avoiding terrain ${pPoss} body used to handle easily. The directives below address these before they become structural.`,
      low: `${name}'s movement patterns reveal <strong>early mechanical stress</strong>. The body is routing around limitations instead of moving freely. This isn't pain yet — it's the stage before pain. Intervening now preserves years of comfortable mobility.`,
      critical: `${name}'s biomechanics need <strong>thoughtful, immediate support</strong>. Movement restrictions compound fast — what's compensation today becomes chronic discomfort tomorrow. The protocol below starts gentle and builds toward the full range ${pPoss} body is capable of.`,
    },
    baseline: {
      high: `<strong>${name}'s vital signs tell a clear story: thriving.</strong> Coat, eyes, energy, digestion — the body's outward markers all confirm what's happening at the cellular level. These are your monitoring system. Trust them.`,
      mid: `${name}'s baseline markers are <strong>mixed</strong>. Some systems are showing strength while others are quietly signaling that something is off — a dull coat, inconsistent energy, or minor digestive variability. The rituals below target what the body is telling you.`,
      low: `The body is <strong>speaking through its markers</strong> — coat quality, energy patterns, digestive consistency — and what it's saying is that the internal systems need more support. These aren't cosmetic issues. They're early signals. Address them now.`,
      critical: `Multiple baseline markers are <strong>flagging simultaneously</strong>. When the body signals through coat, energy, digestion, and vital signs at once, it's asking for foundational support. Don't chase individual symptoms. The protocol below addresses the root.`,
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
      high: `<strong>Master-level metabolic performance.</strong> After a decade, ${name}'s digestive rhythms and nutritional foundation are still firing clean. This didn't happen by accident — you built it meal by meal. Defend it. The body's nutritional demands shift with age; stay ahead of them.`,
      mid: `${name}'s metabolic engine has carried ${pPoss} body well for a decade — but it's <strong>working harder than it needs to</strong> now. At this stage, gut efficiency matters more than ever. The adjustments below fine-tune what's already strong and close the gaps that time is starting to widen.`,
      low: `After a decade, ${name}'s metabolism deserves <strong>precision it hasn't been getting</strong>. The body that powered through nutritional inconsistency at three can't absorb those costs anymore. A few targeted changes here will show results faster than you'd expect — the system is ready.`,
      critical: `We say this with respect for the years: ${name}'s metabolic foundation is <strong>asking for urgent support</strong>. At this stage, every day of suboptimal nutrition costs more than it did a decade ago. The rituals below are ordered by what stabilizes ${pPoss} system fastest. Start today.`,
    },
    repair: {
      high: `<strong>Exceptional restorative capacity at this age.</strong> ${name}'s sleep architecture and recovery rhythms are still producing deep, regenerative cycles after a decade. This is rare. Protect these rituals like the treasure they are — they're writing ${pPoss} next chapter.`,
      mid: `${name} is resting — but after a decade, ${pPoss} body needs <strong>deeper repair cycles</strong> than it's currently getting. The margin between "okay sleep" and "restorative sleep" widens with age. The adjustments below target exactly where that repair is falling short.`,
      low: `At the master level, insufficient repair <strong>compounds faster</strong>. What a younger body could absorb — fragmented sleep, disrupted recovery — now leaves a measurable deficit each night. ${name} has earned the conditions for true restoration. The protocol below provides them.`,
      critical: `${name}'s restorative system needs <strong>immediate, deliberate support</strong>. After a decade, the body's ability to self-repair is still there — but it needs the right conditions more than ever. Without them, decline accelerates. Create the sanctuary ${pPoss} body is asking for.`,
    },
    environmental: {
      high: `<strong>A decade of clean living shows.</strong> ${name}'s low toxic burden at this stage is a direct result of the environmental choices you've made. This baseline protects ${pPoss} immune system, liver, and longevity. Keep the standard high.`,
      mid: `After ten years, ${name}'s body has processed a <strong>cumulative chemical load</strong> that most owners never think about. At this stage, lightening that burden produces outsized results — the liver and immune system have less capacity to waste. The swaps below matter more now than ever.`,
      low: `A decade of low-grade environmental stress has <strong>accumulated quietly</strong> in ${name}'s system. The immune resources being spent on chemical processing aren't available for what matters most at this age — cellular maintenance and disease resistance. Targeted swaps below reclaim them.`,
      critical: `${name}'s biology is spending <strong>precious master-level resources</strong> fighting environmental toxins. After a decade, the body's filtration systems need relief, not more load. Environmental changes show results fast. Start with the first swap — ${name} has earned a cleaner world.`,
    },
    sync: {
      high: `<strong>A decade of co-regulation has built something rare.</strong> ${name}'s nervous system is fully entrained to yours — reading your calm as biological permission to heal. This depth of trust takes years. You've earned it. Defend these rhythms with everything.`,
      mid: `After ten years, the bond is <strong>deep but not fully optimized</strong>. ${name} reads you better than any creature on earth — and that means ${pPoss} system still catches your scattered moments. The rituals below sharpen what a decade has built into something even more protective.`,
      low: `A decade together — and the pack bond still has <strong>untapped depth</strong>. ${name} has spent years calibrating to your signal. What ${pPoss} nervous system needs now isn't more love — it's more consistent, intentional co-regulation. The rituals below unlock what's been waiting.`,
      critical: `We'll be direct, with respect for the years: ${name}'s nervous system is <strong>still waiting for a deeper signal</strong> from you. After a decade, that's not a failure — it's a revelation of how much is still possible. The directives below build the rhythm ${pPoss} body has been asking for.`,
    },
    cognitive: {
      high: `<strong>Remarkable mental acuity at this stage.</strong> ${name}'s brain is still building new pathways, still curious, still engaged. This is the strongest protection against age-related cognitive decline — and you've maintained it beautifully over a decade.`,
      mid: `After ten years, ${name}'s brain is <strong>capable of more than it's getting</strong>. Mental stagnation at this stage accelerates decline that's otherwise avoidable. ${pPoss} neural plasticity is still there — it just needs fresh material. The additions below feed that hunger.`,
      low: `At the master level, cognitive under-stimulation <strong>costs more per day</strong> than it did at three. The brain is still plastic — still capable of growth — but without novel challenge, those pathways are quietly pruning themselves. The rituals below reverse that trajectory.`,
      critical: `${name}'s cognitive system needs <strong>immediate enrichment</strong>. After a decade, an under-stimulated brain declines faster than a challenged one. But the response to enrichment is also faster at this stage — the foundation is deep. Start the protocol below and watch ${pPoss} spark return.`,
    },
    biomechanical: {
      high: `<strong>Master-level mobility.</strong> After a decade, ${name} still moves with fluid confidence — balanced, strong, pain-free. This is the result of consistent physical support over years. Maintain it relentlessly. Mobility lost at this stage is harder to recover.`,
      mid: `${name} moves well for ${pPoss} years — but there are <strong>compensations that weren't there before</strong>. A slight hesitation, a preference for one side, a stiffness that lingers longer in the morning. At this stage, addressing these early preserves years of comfortable movement.`,
      low: `After a decade of faithful service, ${name}'s body is showing <strong>mechanical stress</strong> that deserves your focused attention. These patterns compound faster now. What's slight stiffness today becomes limited mobility in six months without intervention. The protocol below addresses it gently.`,
      critical: `${name}'s movement patterns reveal <strong>structural needs that can't wait</strong>. After a decade, the body that carried ${pPoss} so far is asking for deliberate biomechanical support. Start gentle. Be consistent. Every day you act now buys comfortable days ahead.`,
    },
    baseline: {
      high: `<strong>After a decade, ${name}'s vital markers are still strong.</strong> Coat, eyes, energy, digestion — all confirming that the internal systems are functioning well for this stage. These are your early warning system. Keep watching them. They'll tell you before anything else will.`,
      mid: `${name}'s baseline markers at the master level are <strong>telling a nuanced story</strong>. Some systems are holding strong while others are beginning to signal — a coat that's lost some luster, energy that varies more than it used to. The directives below address what the body is communicating.`,
      low: `After a decade, ${name}'s body is <strong>signaling through multiple channels</strong>. Coat, energy, digestion — these aren't separate issues. They're one system asking for support. At this stage, addressing the foundation produces ripple effects across every marker.`,
      critical: `Multiple vital markers are <strong>flagging at once</strong>. After ten years, when the body speaks this clearly, it's asking for foundational support — not symptom management. The protocol below addresses root causes. ${name} has earned this level of attention.`,
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
      high: `<strong>This is something to honor.</strong> Even in the golden chapter, ${name}'s metabolic rhythms are holding strong — steady digestion, consistent energy, a body that still knows how to use fuel well. You built this foundation over years. Protect it with gentle precision.`,
      mid: `There is still real vitality flowing through ${name}'s metabolic system. But in the golden chapter, the gut needs <strong>gentler, more predictable rhythms</strong> — not more variety. Small refinements in meal timing, moisture, and nutrient density will bring ${pPoss} comfort measurably closer.`,
      low: `In the golden chapter, ${name}'s metabolism deserves your <strong>most compassionate attention</strong>. The digestive system isn't failing — it's asking for softer, more deliberate support. Warmer foods, gentler portions, more consistent timing. The adjustments below honor what ${pPoss} body needs now.`,
      critical: `We want to be tender but honest: ${name}'s metabolic system is <strong>quietly asking for help</strong>. At this stage, even a small shift in nutrition — warmer meals, better timing, more moisture — carries outsized comfort. Start gently with the first ritual below.`,
    },
    repair: {
      high: `<strong>Remarkable restorative health in the golden chapter.</strong> ${name}'s body is still cycling through deep repair — healing, restoring, rebuilding — night after night. This is the engine of comfortable aging. Guard these sleep rituals. They are ${pPoss} sanctuary.`,
      mid: `${name} is resting — but in the golden chapter, the body needs <strong>deeper, more protected repair</strong> than it's currently getting. The difference between light sleep and true restoration widens with age. The gentle adjustments below create the conditions for ${pPoss} body to truly let go.`,
      low: `In the golden chapter, rest becomes <strong>sacred medicine</strong>. ${name}'s body isn't getting the deep repair cycles it needs to maintain comfort, joint health, and that quiet spark of vitality. The adjustments below create a gentler landing place for ${pPoss} aging nervous system.`,
      critical: `${name}'s restorative system needs <strong>tender, immediate support</strong>. In the golden chapter, every night without deep repair costs more. The body isn't asking for much — just quieter conditions, more predictability, and permission to fully surrender into sleep. Start here.`,
    },
    environmental: {
      high: `<strong>A clean, gentle environment in the golden chapter is a gift.</strong> ${name}'s body is spending its resources on comfort rather than fighting invisible toxins. This is especially meaningful now — every immune resource preserved goes toward ${pPoss} quality of life.`,
      mid: `In the golden chapter, ${name}'s body has <strong>less filtration capacity</strong> to spare. Chemical exposures that a younger body managed easily now linger longer and cost more. The gentle swaps below lighten ${pPoss} toxic load at the stage where it matters most for comfort.`,
      low: `${name}'s aging immune system is <strong>spending resources on environmental toxins</strong> that could be supporting comfort and vitality instead. In the golden chapter, cleaning up the environment produces some of the fastest, most visible improvements. The swaps below are gentle and immediate.`,
      critical: `In the golden chapter, ${name}'s body <strong>cannot afford</strong> the chemical burden it's carrying. The immune system needs every resource for maintaining comfort and health. Environmental changes are the kindest intervention available — fast, gentle, and profoundly helpful. Start today.`,
    },
    sync: {
      high: `<strong>After all these years, the bond speaks for itself.</strong> ${name}'s nervous system rests in your presence like a prayer answered. In the golden chapter, this co-regulation is the single greatest predictor of comfort and peaceful aging. You are ${pPoss} medicine. Keep being exactly this.`,
      mid: `The love runs deep — but in the golden chapter, ${name}'s nervous system needs <strong>even more consistent reassurance</strong>. The world feels less predictable at this stage. Your steady, unhurried presence is the anchor that lets ${pPoss} body focus on comfort rather than vigilance.`,
      low: `In the golden chapter, the pack bond becomes <strong>the most important pillar of all</strong>. ${name}'s aging nervous system needs your calm presence more than ever — not as a nice-to-have, but as the biological signal that says "you're safe, you can rest." The rituals below build that signal.`,
      critical: `We say this gently: in the golden chapter, ${name}'s nervous system is <strong>still looking for permission to fully rest</strong>. After all these years, giving that signal now carries profound meaning. The connection rituals below aren't optional — they're ${pPoss} deepest source of comfort.`,
    },
    cognitive: {
      high: `<strong>Mental sharpness in the golden chapter is a treasure.</strong> ${name}'s brain is still engaged, still curious, still building connections. This is the strongest protection against age-related cognitive decline. Maintain this enrichment — it's keeping the lights on in ways that matter.`,
      mid: `In the golden chapter, ${name}'s brain benefits from <strong>gentle, consistent stimulation</strong>. Not intensity — novelty. New smells, soft challenges, varied sensory experiences. The additions below keep ${pPoss} neural pathways active without overwhelming a system that prefers a softer pace now.`,
      low: `${name}'s cognitive health in the golden chapter deserves <strong>intentional, gentle enrichment</strong>. The brain needs novelty to maintain its connections — and at this stage, the cost of stagnation is higher. Short, pleasurable challenges below keep ${pPoss} mind gently engaged.`,
      critical: `In the golden chapter, cognitive under-stimulation <strong>accelerates decline</strong> that gentle enrichment can slow. ${name}'s brain still responds to novelty — it just needs it delivered softly. The rituals below are designed for comfort and engagement, not difficulty. Start with one.`,
    },
    biomechanical: {
      high: `<strong>Comfortable, confident movement in the golden chapter is a gift you built.</strong> ${name} still navigates the world with ease — no pain signals, no hesitation. Maintain this gently. The body needs consistent, low-intensity support to keep moving freely.`,
      mid: `${name} is still moving — but in the golden chapter, the body reveals <strong>subtle limitations</strong> that deserve gentle attention. A longer warm-up, careful transitions, perhaps one side that carries more weight. The protocols below maintain comfort without pushing beyond what ${pPoss} body wants.`,
      low: `In the golden chapter, ${name}'s movement tells us ${pPoss} body needs <strong>compassionate physical support</strong>. Stiffness, hesitation, or reduced range aren't failures — they're the body asking for help. Gentle movement, supported surfaces, and patience go further than intensity ever could.`,
      critical: `${name}'s mobility in the golden chapter needs <strong>immediate, gentle intervention</strong>. The body is speaking clearly — and at this stage, comfort is the priority. The protocol below starts with the softest changes: better surfaces, easier transitions, and permission to move at ${pPoss} own pace.`,
    },
    baseline: {
      high: `<strong>Even in the golden chapter, ${name}'s vital markers are holding.</strong> Coat, eyes, energy, digestion — all telling you the internal systems are still supported. Watch these markers closely. In the golden chapter, they're your most trusted guide.`,
      mid: `${name}'s baseline markers in the golden chapter are <strong>telling a gentle story</strong>. Some vitality remains strong while other signals — perhaps coat texture, energy patterns, or minor digestive changes — ask for attention. The adjustments below honor what ${pPoss} body is communicating.`,
      low: `In the golden chapter, ${name}'s vital markers are <strong>asking for foundational support</strong>. When coat, energy, and digestion all signal together, the body is requesting deeper care — not individual fixes. The protocol below addresses the root with gentleness appropriate for this stage.`,
      critical: `Multiple vital markers are <strong>signaling at once</strong>. In the golden chapter, this is the body asking for help in the clearest way it can. Not alarm — awareness. The protocol below provides gentle, foundational support that honors where ${name} is and what ${pPoss} body needs most.`,
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
  onShowBookingModal,
  handleShare,
  handleShareAudit,
  shareCopied,
  auditShared,
  dogPhoto,
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
  dogPhoto: string | null;
}) {
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [isExportingBadge, setIsExportingBadge] = useState(false);
  const badgeRef = useRef<HTMLDivElement>(null);

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

  const captureBadge = async (): Promise<Blob | null> => {
    if (!badgeRef.current) return null;
    const canvas = await html2canvas(badgeRef.current, {
      backgroundColor: null,
      scale: 2,
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
          text: `${dogData.name || 'My dog'} scored ${results.score}/100 on the PayaLabs Vitality Assessment. Discover yours at payalabs.net`,
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

  return (
    <div className="space-y-20 border-t border-stone-200/30 pt-20">
      {/* ===== BLUEPRINT HEADER WITH DOG IDENTITY ===== */}
      <div className="flex items-center gap-5">
        {dogPhoto ? (
          <img src={dogPhoto} alt={Name} className="w-14 h-14 rounded-full object-cover border-2 border-stone-200 shadow-md flex-shrink-0" />
        ) : (
          <div className="w-14 h-14 rounded-full bg-stone-100 border-2 border-stone-200 flex items-center justify-center flex-shrink-0">
            <Icons.Leaf size={18} className="text-stone-400" />
          </div>
        )}
        <div>
          <h2 className="text-2xl font-serif text-stone-900 leading-tight">{Name}'s Vitality Blueprint</h2>
          <p className="text-sm text-stone-500 font-light mt-0.5">Personalized protocol based on {dogData.breed ? `${dogData.breed}, ` : ''}{dogData.age ? `${dogData.age} years` : 'your companion'}</p>
        </div>
      </div>

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
                  <p className="text-sm text-stone-700 leading-[1.7] font-light" dangerouslySetInnerHTML={{ __html: (track === 'legacy' ? getLegacyPillarBridge : track === 'master' ? getMasterPillarBridge : getAscentPillarBridge)(score, f.label, name, pPoss, f.id) }} />
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

                  {d.weeklyPlan && d.weeklyPlan.length > 0 && (
                    <div className="border border-stone-200 rounded-lg overflow-hidden">
                      <div className="bg-stone-100/60 px-6 py-4 border-b border-stone-200">
                        <span className="font-mono text-[8px] uppercase tracking-[0.35em] text-stone-600 font-medium">
                          Your 4-Week Path
                        </span>
                      </div>
                      <div className="divide-y divide-stone-100">
                        {d.weeklyPlan.map((week: string, wi: number) => (
                          <div key={wi} className="px-6 py-5 flex gap-4">
                            <div className="flex-shrink-0 w-16 pt-0.5">
                              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-stone-400 font-medium">
                                Week {wi + 1}
                              </span>
                            </div>
                            <p className="text-sm text-stone-700 leading-[1.75] font-light">{week}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {d.whyText && (
                    <div className="bg-stone-50 border border-stone-100 p-6 rounded-lg">
                      <span className="font-mono text-[8px] uppercase tracking-[0.35em] text-stone-600 font-medium block mb-3">
                        The Science Behind It
                      </span>
                      <p className="text-stone-700 text-sm leading-[1.8] font-light">{d.whyText}</p>
                    </div>
                  )}
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
              ref={badgeRef}
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
                  <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-stone-400 font-medium">
                    payalabs.net
                  </p>
                  <p className="font-mono text-[7px] text-stone-700 tracking-wide">
                    90-Point Canine Vitality Assessment
                  </p>
                </div>
              </div>
            </div>

            {/* Badge action buttons */}
            <div className="mt-6 space-y-3">
              <button
                onClick={handleShareBadge}
                disabled={isExportingBadge}
                className="w-full bg-stone-900 text-white px-8 py-4 text-[8.5px] font-mono uppercase tracking-[0.35em] hover:bg-stone-800 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 rounded-lg font-bold shadow-[0_10px_30px_-10px_rgba(0,0,0,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExportingBadge ? (
                  <>
                    <Icons.Loader className="animate-spin" size={15} />
                    Preparing...
                  </>
                ) : (
                  <>
                    <Icons.Share size={15} />
                    Share Badge
                  </>
                )}
              </button>
              <button
                onClick={handleDownloadBadge}
                disabled={isExportingBadge}
                className="w-full flex items-center justify-center gap-3 border border-stone-300 text-stone-700 px-6 py-3.5 text-[8.5px] font-mono uppercase tracking-[0.3em] hover:border-stone-500 hover:bg-stone-50 transition-all rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icons.Download size={15} />
                Download Badge
              </button>
              <p className="text-[10px] text-stone-400 font-light leading-[1.6] text-center pt-2">
                By completing this assessment, your results may be anonymously featured on our social channels (first name + breed only).
              </p>
            </div>
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
