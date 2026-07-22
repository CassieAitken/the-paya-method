import { useState, useMemo, useEffect } from 'react';
import { Icons } from './components/Icons';
import { foundations, frequencyWeights, type FrequencyLevel } from './data/foundations';
import { getTrack, type Track } from './lib/track';
import { Landing } from './pages/Landing';
import { Intake } from './pages/Intake';
import { Profile } from './pages/Profile';
import { Audit, type RitualFrequencies } from './pages/Audit';
import { Reflection } from './pages/Reflection';
import { OwnerInfo } from './pages/OwnerInfo';
import { AnalysisLoader } from './pages/AnalysisLoader';
import { Results } from './pages/Results';
import { PillarModal } from './components/PillarModal';
import { FounderMessageModal } from './components/FounderMessageModal';
import { BookConsultationModal } from './components/BookConsultationModal';
import { TierModal } from './components/TierModal';

export const DOG_SIZES = ['Toy', 'Small', 'Medium', 'Large', 'Giant'] as const;
export type DogSize = typeof DOG_SIZES[number];

export const DOG_GROUPS = [
  { value: 'herding', label: 'Herding', examples: 'Aussies, Collies, Corgis' },
  { value: 'sporting', label: 'Sporting', examples: 'Goldens, Labs, Spaniels' },
  { value: 'terrier', label: 'Terrier', examples: 'Cairns, Jack Russells, Westies' },
  { value: 'working', label: 'Working', examples: 'Huskies, Boxers, Great Danes' },
  { value: 'hound', label: 'Hound', examples: 'Beagles, Greyhounds, Dachshunds' },
  { value: 'toy', label: 'Toy', examples: 'Chihuahuas, Pomeranians, Yorkies' },
  { value: 'non-sporting', label: 'Non-Sporting', examples: 'Bulldogs, Poodles, Dalmatians' },
  { value: 'foundation', label: 'Foundation', examples: 'Akitas, Chow Chows, Basenjis' },
  { value: 'mixed-unknown', label: 'Mixed / Unknown', examples: 'Not sure of group' },
] as const;
export type DogGroup = typeof DOG_GROUPS[number]['value'];

export type DogData = {
  name: string;
  breed: string;
  size: DogSize | '';
  group: DogGroup | '';
  gender: string;
  age: string;
  ageMonths: string;
  weight: string;
  condition: 'Lean' | 'Ideal' | 'Heavy';
  social: 'solo' | 'pack';
  reflection: string;
  ownerName: string;
  ownerEmail: string;
};

function App() {
  const [step, setStep] = useState('landing');
  const [currentFoundation, setCurrentFoundation] = useState(0);
  const [selectedRituals, setSelectedRituals] = useState<RitualFrequencies>({});
  const [hasPaid, setHasPaid] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [auditShared, setAuditShared] = useState(false);
  const [selectedTier, setSelectedTier] = useState<'basic' | 'program' | null>('basic');
  const [selectedPillar, setSelectedPillar] = useState<typeof foundations[0] | null>(null);
  const [showFounderMessage, setShowFounderMessage] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showTierModal, setShowTierModal] = useState(false);


  const [dogPhoto, setDogPhoto] = useState<string | null>(null);

  const [dogData, setDogData] = useState<DogData>({
    name: '',
    breed: '',
    size: '',
    group: '',
    gender: '',
    age: '',
    ageMonths: '',
    weight: '',
    condition: '' as any,
    social: '' as any,
    reflection: '',
    ownerName: '',
    ownerEmail: ''
  });

  const track: Track = useMemo(() => getTrack(dogData, selectedRituals), [dogData.age, dogData.ageMonths, selectedRituals]);

  const results = useMemo(() => {
    // Payalabs Weighted Scoring Logic
    // Each pillar is scored as (selected items / total items) * 100
    const pillarWeights = {
      'metabolic': 0.25,           // The Internal Battery
      'baseline': 0.20,            // Physiological Harmony
      'environmental': 0.15,       // The Biological Shield
      'biomechanical': 0.15,       // Biomechanical Flow
      'repair': 0.10,              // The Restorative Cycle
      'sync': 0.10,                // The Pack Bond
      'cognitive': 0.05            // Ancestral Cognition
    };

    // Calculate pillar scores (0-100 for each pillar)
    const phaseScores = foundations.map(f => {
      let phaseWeightedTotal = 0;
      let phaseWeightCount = 0;

      f.rituals.forEach((r: any) => {
        const frequency = selectedRituals[r.id] || 'never';
        const frequencyWeight = frequencyWeights[frequency as FrequencyLevel];
        phaseWeightedTotal += frequencyWeight * r.weight;
        phaseWeightCount += r.weight;
      });

      return phaseWeightCount > 0 ? Math.round((phaseWeightedTotal / phaseWeightCount) * 100) : 0;
    });

    // Calculate weighted vitality index
    let score = 0;
    foundations.forEach((f, index) => {
      const pillarScore = phaseScores[index];
      const weight = pillarWeights[f.id as keyof typeof pillarWeights];
      score += pillarScore * weight;
    });
    score = Math.round(score);

    // Apply condition adjustment
    if (dogData.condition === 'Heavy') score = Math.max(0, score - 10);

    const packSync = phaseScores[3] || 0;
    const pSubj = dogData.gender === 'male' ? 'he' : dogData.gender === 'female' ? 'she' : 'they';
    const PSubj = dogData.gender === 'male' ? 'He' : dogData.gender === 'female' ? 'She' : 'They';
    const pObj = dogData.gender === 'male' ? 'him' : dogData.gender === 'female' ? 'her' : 'them';
    const pPoss = dogData.gender === 'male' ? 'his' : dogData.gender === 'female' ? 'her' : 'their';
    const pVerb = dogData.gender === 'male' || dogData.gender === 'female' ? 'is' : 'are';
    const namePoss = dogData.name ? `${dogData.name}'s` : "your dog's";

    const dName = dogData.name || 'Your dog';
    const dComp = dogData.name || 'your companion';
    const isMaster = track === 'master';

    let archetype;

    if (track === 'legacy') {
      archetype = {
        name: 'The Quiet Ember',
        freeTeaser: `${dName}'s nervous system is holding on — but it's working harder than it should at this stage. In the golden chapter, the body needs gentler, more predictable rhythms to sustain deep repair. The wear shows not in spirit, but in the subtle signs: slower mornings, more fragile recovery, a system that can no longer compensate silently. ${PSubj} ${pVerb} not failing. ${PSubj} ${pVerb} waiting — for a rhythm soft enough to rest inside.`,
        analysis: `Diagnosis: Guarded Rest. In the golden chapter, ${dComp}'s biology is prioritizing survival over comfort. ${PSubj} ${pVerb} still scanning the environment for threats — a pattern that costs more energy now than it did in younger years. Your nervous system fluctuations, once absorbed easily, now linger in ${pPoss} body longer. The path forward isn't intensity — it's a deeper, gentler predictability that tells ${pPoss} aging nervous system: you can let go. I'm here.`
      };
      if (score > 40 && score < 75)
        archetype = {
          name: 'The Fading Fire',
          freeTeaser: `${dName} still carries a flame — you can see it in ${pPoss} eyes when you come home, in the way ${pSubj} still seek${pVerb === 'is' ? 's' : ''} your warmth. But the fire needs tending now. The biological margins are thinner, and what once recovered overnight now takes days to reset. Your love is landing — the consistency around it needs to deepen to protect what remains.`,
          analysis: `Diagnosis: Flickering Resonance. ${dComp} still mirrors your calm and draws comfort from your presence. But in the golden chapter, ${pPoss} body can no longer compensate for the gaps it once powered through. The stress spikes that a younger body absorbed now create micro-disruptions in ${pPoss} sleep, digestion, and joint recovery. The 30-day protocol below focuses on what matters most now: softening the routine, deepening the predictability, and giving ${pPoss} nervous system fewer reasons to stay alert.`
        };
      if (score >= 75)
        archetype = {
          name: 'The Honored Elder',
          freeTeaser: `What you've built for ${dName} is extraordinary — especially now. ${PSubj} ${pVerb} aging with grace, comfort, and a spark most dogs at this stage have lost. The data confirms what you can see with your own eyes: a body still repairing, still responding, still trusting. You didn't just love ${pObj} well — you partnered with ${pPoss} biology. ${PSubj} ${pVerb} living proof that the golden chapter can be luminous.`,
          analysis: `Diagnosis: Sacred Rhythm. Your nervous systems have been in sync long enough that it runs on its own now — a shared circuit of trust built over years. ${dComp} reads your grounded presence as daily permission to rest deeply, heal fully, and remain present. In the golden chapter, this bond is the single greatest predictor of comfort and longevity. Your focus now: fiercely protect these rhythms. They are ${pPoss} anchor against the natural changes of aging.`
        };
    } else if (isMaster) {
      archetype = {
        name: 'The Quiet Master',
        freeTeaser: `${dName}'s nervous system is guarded — but make no mistake, a dog who has weathered a decade carries wisdom in ${pPoss} bones. Without predictable pack rhythms, ${pPoss} ancient survival instincts still keep one eye open. The body compensates, but at a cost that compounds with every passing season. ${PSubj} ${pVerb} waiting for you to establish a rhythm of safety — and after all these years, ${pSubj} deserve${pVerb === 'is' ? 's' : ''} that signal more than ever.`,
        analysis: `Diagnosis: Parallel Rhythms at the Master Level. After a decade, you and ${dComp} are still living separate metabolic lives. That's not a condemnation — it's a revelation of how much untapped potential remains. A dog who has kept ${pPoss} body strong this long has earned a partnership that matches ${pPoss} resilience. Because ${pPoss} nervous system still fluctuates during recovery windows, ${dName} remains in hyper-vigilance. At this stage, every day you delay that signal costs more than it did at five. Lock in the rhythm. ${PSubj}'ve earned it.`
      };
      if (score > 40 && score < 75)
        archetype = {
          name: 'The Proven Heart',
          freeTeaser: `${dName} ${pVerb} beginning to sync with your rhythms — and the fact that ${pSubj} ${pVerb} still this responsive after a decade is a testament to ${pPoss} resilience. A vitality ceiling remains, but ${pSubj} ${pVerb} meeting you with everything ${pSubj} ${pVerb === 'is' ? 'has' : 'have'}. The gaps aren't from lack of love — they're from routines that haven't caught up to what ${pPoss} body needs at this stage. The love is proven. Now tighten the boundaries to protect the years ahead.`,
          analysis: `Diagnosis: Seasoned Resonance. ${dComp} has spent a lifetime learning to read you — and ${pSubj} still respond${pVerb === 'is' ? 's' : ''} deeply to your intent. But at the master level, the margin for error is thinner. Routine fragmentation that a younger dog absorbs now lingers in ${pPoss} body. ${PSubj} ${pVerb} not declining — ${pSubj} ${pVerb} asking for the precision ${pSubj} deserve${pVerb === 'is' ? 's' : ''}. Standardizing your rituals over the next 30 days doesn't just optimize — it honors every year ${pSubj}'ve given you.`
        };
      if (score >= 75)
        archetype = {
          name: 'The Timeless Bond',
          freeTeaser: `After a decade, what you and ${dName} have built defies the curve. ${PSubj} ${pVerb} not just surviving at this age — ${pSubj} ${pVerb} thriving, actively repairing, walking in step with your rhythms as though time hasn't touched the partnership. The biological markers confirm it: ${pPoss} systems are running with a coherence that most dogs lose years earlier. This is master-level vitality. This is what most owners only dream of at this stage.`,
          analysis: `Diagnosis: Total Integration at the Master Level. A decade in, your nervous systems are still locked — operating on one shared, restorative circuit that most dogs half ${pPoss} age never achieve. You've established non-negotiable boundaries and ${dComp} reads your grounded presence as daily biological authorization to heal. At this stage, the work is no longer about building — it's about fiercely defending what you've built. Every rhythm you protect adds weight to the years ahead. This bond is rare. Treat it that way.`
        };
    } else {
      archetype = {
        name: 'The Quiet Soul',
        freeTeaser: `${dName}'s nervous system is guarded. Without predictable pack rhythms, ${pPoss} ancient survival instincts keep one eye open to the world — preventing the deep, restorative healing cycles required for peak vitality at every life stage. The cost is invisible but cumulative: shallow sleep, incomplete digestion, a stress baseline that never fully resets. ${PSubj} ${pVerb} fundamentally waiting for you to establish a rhythm of safety that triggers deep cellular repair.`,
        analysis: `Diagnosis: Parallel Rhythms. You and ${dComp} are living separate metabolic lives. Your biological frequencies haven't locked into a shared unit yet. Because your nervous system fluctuates during crucial recovery windows, ${dName} remains in chronic hyper-vigilance — perpetually waiting for a definitive signal that the environment is truly secure. This prevents ${pObj} from transitioning out of fight-or-flight into the deep parasympathetic state required for profound cellular repair, immune stabilization, and long-term longevity.`
      };
      if (score > 40 && score < 75)
        archetype = {
          name: 'The Awakening Heart',
          freeTeaser: `${dName} ${pVerb} beginning to sync with your rhythms — but a biological Vitality Ceiling remains. ${PSubj} absorb${pVerb === 'is' ? 's' : ''} your intentional moments of peace, but ${pSubj} ${pVerb} also acting as a sponge for your unchecked stress. The foundation is real, but the gaps are costing ${pObj} recovery time that compounds week over week. The love is present. The physical and environmental boundaries need tightening to protect ${pPoss} long-term health.`,
          analysis: `Diagnosis: Emergent Resonance. ${dComp} responds deeply to your intent, but ${pPoss} cellular recovery is hindered by daily routine fragmentation. ${PSubj} mirror${pVerb === 'is' ? 's' : ''} your moments of deep peace — and just as quickly absorb${pVerb === 'is' ? 's' : ''} your stress spikes. ${PSubj} ${pVerb} waiting for a more rigid, predictable routine to permanently lower ${pPoss} ancestral guard. Standardizing your environmental and restoration rituals over the next 30 days establishes the biological anchor needed to down-regulate ${pPoss} stress hormones and elevate ${pObj} to peak vitality.`
        };
      if (score >= 75)
        archetype = {
          name: 'The Eternal Soulmate',
          freeTeaser: `${dName} has achieved peak biological synchronization with your lifestyle. ${PSubj} ${pVerb} actively repairing ${pPoss} nervous system daily, walking in step with your metabolic rhythms. Every system we measured confirms it: deep sleep cycles intact, stress hormones regulated, cellular turnover operating at a level that defies ${pPoss} calendar age. You built a true biological sanctuary — ${pPoss} biological age sits significantly lower than ${pPoss} chronological years.`,
          analysis: `Diagnosis: Total Integration. Your nervous systems are synced — operating on one shared, restorative circuit. You've established non-negotiable boundaries around high-quality sleep, pristine nutrition, and environmental purity. ${dComp} reads your grounded presence as a daily biological authorization to heal. This trust allows for deep, uninterrupted REM cycles, maximized immune function, and optimal cellular turnover. Your focus now: protect these deeply ingrained ancestral rhythms against the chaos of the modern world.`
        };
    }

    return { score, archetype, packSync, phaseScores, namePoss, pronouns: { pSubj, PSubj, pObj, pPoss, pVerb } };
  }, [selectedRituals, dogData, track]);

  const directives = useMemo(() => {
    const name = dogData.name || 'your dog';
    const generateWeeklyPlan = (pillarId: string, label: string, frequency: string): string[] => {
      const isNew = frequency === 'never';
      const week1Prefix = isNew ? 'Observe and prepare.' : 'Recommit gently.';
      const plans: Record<string, string[]> = {
        metabolic: [
          `${week1Prefix} Notice ${name}'s current mealtime energy — the pace, the environment, the aftermath. Source what you need to begin introducing this change by week's end.`,
          `Introduce the shift 3–4 times this week. Keep portions and timing gentle — you're teaching ${name}'s gut to expect something different, not shocking it.`,
          `Build toward daily consistency. Watch for changes in energy, stool quality, or mealtime calm — these are your confirmation signals.`,
          `This is now part of the rhythm. Fine-tune based on what you've observed — adjust quantity, timing, or presentation to match what ${name}'s body is telling you.`,
        ],
        repair: [
          `${week1Prefix} Pay attention to ${name}'s current sleep patterns — when they settle, how deeply they rest, what disrupts them. Prepare any environmental changes you'll need.`,
          `Begin making the adjustment 3–4 evenings this week. Don't force it — let ${name} discover the new pattern. Their body will start leaning into it.`,
          `Apply consistently every night. Notice whether ${name} is settling faster, sleeping longer, or waking with more ease — these are your markers of progress.`,
          `The new rhythm should feel natural now. Protect it. If something disrupted the pattern, course-correct quickly — consistency is the medicine here.`,
        ],
        environmental: [
          `${week1Prefix} Audit ${name}'s environment with fresh eyes. Identify the specific swap or change you'll make, and gather what you need.`,
          `Implement the change. Give ${name}'s system 5–7 days to respond — you may notice subtle shifts in skin, breathing, or energy as their toxic load lightens.`,
          `Maintain the new standard and observe. Look for signs of reduced irritation, calmer breathing, or improved coat quality as the body clears what it no longer has to fight.`,
          `This is the new baseline. Expand your awareness — are there adjacent exposures you hadn't considered? Lock in the win and stay vigilant.`,
        ],
        sync: [
          `${week1Prefix} Honestly notice the quality of your shared presence this week. Where are the gaps? When does ${name} seek connection and find you unavailable?`,
          `Introduce the practice 3–4 times. It doesn't need to be long — 10 to 15 minutes of genuine, undistracted presence is worth more than an hour of half-attention.`,
          `Build this into your daily rhythm. You'll notice ${name} beginning to anticipate it — a softening in their body language as the pattern becomes trusted.`,
          `The connection is now woven into your day. Notice how it's changed ${name}'s baseline calm. Protect this time — it's not optional, it's biological infrastructure.`,
        ],
        cognitive: [
          `${week1Prefix} Watch how ${name} engages with their world right now — what excites them, what they gravitate toward, where their curiosity sparks. This tells you how to begin.`,
          `Introduce the mental challenge 2–3 times this week. Keep sessions short — 5 to 10 minutes of genuine engagement. End before frustration, always on a win.`,
          `Increase to 4–5 sessions. Vary the difficulty slightly — ${name}'s brain is building new pathways now, and novelty is what feeds them.`,
          `This is part of the routine. Rotate challenges to keep it fresh. A stimulated mind protects the body — you're investing in longevity, not just entertainment.`,
        ],
        biomechanical: [
          `${week1Prefix} Watch ${name} move — getting up, walking, stretching, transitioning between surfaces. Note any stiffness, hesitation, or compensation. This is your starting reference.`,
          `Introduce the change 3–4 times this week. Go slowly — the musculoskeletal system adapts gradually. Prioritize quality of movement over quantity.`,
          `Build toward daily practice. Watch for improved fluidity, less morning stiffness, or more willingness to move freely — these confirm the body is responding.`,
          `Movement should look and feel easier now. Maintain what you've built, and stay attentive — the body will tell you if you're pushing too far or not enough.`,
        ],
        baseline: [
          `${week1Prefix} Establish your current reference — take note of ${name}'s coat, eyes, breath, and energy. You need a "before" snapshot to recognize change.`,
          `Begin the practice. These markers shift slowly, so patience matters. Implement consistently and trust the process — visible change follows invisible cellular work.`,
          `Continue daily. Around this point, early signs should appear — a slightly brighter coat, clearer eyes, or more consistent energy. Log what you notice.`,
          `Consistency is paying dividends. These markers are your ongoing monitoring system — any future regression here is an early signal to investigate, not ignore.`,
        ],
      };
      return plans[pillarId] || plans.baseline;
    };

    let opportunities: any[] = [];
    foundations.forEach(f => {
      f.rituals.forEach((r: any) => {
        const frequency = selectedRituals[r.id] || 'never';
        if (frequency === 'never' || frequency === 'rarely') {
          opportunities.push({
            ...r,
            phaseTitle: f.title,
            actionText: typeof r.desc === 'function' ? r.desc(name) : r.desc,
            whyText: r.insight || '',
            weeklyPlan: generateWeeklyPlan(f.id, r.label, frequency),
          });
        }
      });
    });
    return opportunities.sort((a, b) => b.weight - a.weight).slice(0, 7);
  }, [selectedRituals, dogData.name]);

  const handlePurchase = async () => {
    setIsProcessingPayment(true);
    setPaymentSuccess(false);

    try {
      // Enroll in program/record assessment
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/enroll-vitality-program`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: dogData.ownerEmail,
          dogName: dogData.name,
          tier: selectedTier,
          vitalityScore: results.score,
          archetype: results.archetype.name,
          packSync: results.packSync,
          pillarScores: results.phaseScores,
          phaseData: {
            dogData,
            results,
            directives,
            selectedRituals
          }
        })
      });

      if (!response.ok) {
        throw new Error('Enrollment failed');
      }

      setTimeout(() => {
        setIsProcessingPayment(false);
        setHasPaid(true);
        setPaymentSuccess(true);
        setTimeout(() => window.scrollTo(0, 0), 300);
        setTimeout(() => setPaymentSuccess(false), 4000);
      }, 2000);
    } catch (error) {
      console.error('Purchase error:', error);
      setIsProcessingPayment(false);
      alert('Payment processing failed. Please try again.');
    }
  };

  const handleShare = async () => {
    const dogName = dogData.name || 'My dog';
    const teaserSnippet = results.archetype.freeTeaser ? results.archetype.freeTeaser.split('.').slice(0, 2).join('.') + '.' : '';

    const shareText = `${dogName} just scored ${results.score}/100 on the Payalabs Vitality Assessment.

Archetype: ${results.archetype.name}

${teaserSnippet}

Human-Dog Sync: ${results.packSync}%

Discover your dog's vitality score at payalabs.net`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${dogName}'s PayaLabs Vitality Score`,
          text: shareText
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 3000);
      } catch (err) {
        console.log('Clipboard error:', err);
        const el = document.createElement('textarea');
        el.value = shareText;
        el.style.position = 'fixed';
        el.style.opacity = '0';
        document.body.appendChild(el);
        el.select();
        try {
          document.execCommand('copy');
          setShareCopied(true);
          setTimeout(() => setShareCopied(false), 3000);
        } catch (copyErr) {
          console.log('Copy failed:', copyErr);
        }
        document.body.removeChild(el);
      }
    }
  };

  const handleShareAudit = async () => {
    const dogName = dogData.name || 'my dog';
    const shareText = `Just finished the PayaLabs Bio-Audit for ${dogName}. It's a completely different way of looking at their vitality and future.

81 biological markers. 7 vitality pillars. One personalized blueprint.

Check it out at payalabs.net`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `PayaLabs Vitality Audit`,
          text: shareText
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        setAuditShared(true);
        setTimeout(() => setAuditShared(false), 3000);
      } catch (err) {
        console.log('Clipboard error:', err);
        const el = document.createElement('textarea');
        el.value = shareText;
        el.style.position = 'fixed';
        el.style.opacity = '0';
        document.body.appendChild(el);
        el.select();
        try {
          document.execCommand('copy');
          setAuditShared(true);
          setTimeout(() => setAuditShared(false), 3000);
        } catch (copyErr) {
          console.log('Copy failed:', copyErr);
        }
        document.body.removeChild(el);
      }
    }
  };

  return (
    <div className="min-h-screen text-stone-900">
      <nav className={`max-w-7xl mx-auto px-8 lg:px-12 py-10 flex justify-between items-center border-b border-stone-200/30 sticky top-0 bg-[#F9F7F4]/80 backdrop-blur-xl z-50 ${step === 'analyzing' ? 'hidden' : ''}`}>
        <div className="flex items-center gap-7">
          <Icons.Leaf size={26} className="text-stone-700" strokeWidth={1.5} />
          <span className="font-serif text-3xl tracking-tight text-stone-900">PayaLabs</span>
        </div>
        <div className="flex items-center gap-4">
          {import.meta.env.DEV && step === 'results' && !hasPaid && (
            <button
              type="button"
              onClick={() => setHasPaid(true)}
              className="text-[9px] font-mono uppercase tracking-widest text-amber-600 border border-amber-300 px-3 py-1.5 rounded hover:bg-amber-50 transition-colors"
            >
              Dev Unlock
            </button>
          )}
          {['intake', 'profile', 'audit', 'reflection', 'ownerInfo'].includes(step) && (
            <button
              type="button"
              onClick={() => {
                if (step === 'audit' && currentFoundation > 0) {
                  setCurrentFoundation(currentFoundation - 1);
                  window.scrollTo(0, 0);
                  return;
                }
                const backMap: Record<string, string> = {
                  intake: 'landing',
                  profile: 'intake',
                  audit: 'profile',
                  reflection: 'audit',
                  ownerInfo: 'reflection',
                };
                const prev = backMap[step];
                if (prev) {
                  if (prev === 'audit') {
                    setCurrentFoundation(foundations.length - 1);
                  }
                  setStep(prev);
                  window.scrollTo(0, 0);
                }
              }}
              className="text-[9px] font-mono uppercase tracking-[0.3em] flex items-center gap-2.5 hover:text-stone-600 transition-colors"
            >
              <Icons.ArrowLeft size={15} strokeWidth={1.5} /> Back
            </button>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 lg:px-12 pb-40">
        {step === 'landing' && (
          <Landing
            setStep={setStep}
            onSelectPillar={setSelectedPillar}
            onShowFounderMessage={() => setShowFounderMessage(true)}
          />
        )}
        {step === 'intake' && <Intake dogData={dogData} setDogData={setDogData} setStep={setStep} dogPhoto={dogPhoto} setDogPhoto={setDogPhoto} />}
        {step === 'profile' && <Profile dogData={dogData} setDogData={setDogData} setStep={setStep} />}
        {step === 'audit' && (
          <Audit
            currentFoundation={currentFoundation}
            setCurrentFoundation={setCurrentFoundation}
            selectedRituals={selectedRituals}
            setSelectedRituals={setSelectedRituals}
            setStep={setStep}
            dogData={dogData}
            dogPhoto={dogPhoto}
          />
        )}
        {step === 'reflection' && (
          <Reflection dogData={dogData} setDogData={setDogData} setStep={setStep} />
        )}
        {step === 'ownerInfo' && (
          <OwnerInfo dogData={dogData} setDogData={setDogData} setStep={setStep} />
        )}
        {step === 'analyzing' && (
          <AnalysisLoader
            dogName={dogData.name}
            onComplete={() => {
              setStep('results');
              window.scrollTo(0, 0);
            }}
          />
        )}
        {step === 'results' && (
          <Results
            dogData={dogData}
            results={results}
            directives={directives}
            track={track}
            hasPaid={hasPaid}
            isProcessingPayment={isProcessingPayment}
            paymentSuccess={paymentSuccess}
            shareCopied={shareCopied}
            auditShared={auditShared}
            handlePurchase={handlePurchase}
            handleShare={handleShare}
            handleShareAudit={handleShareAudit}
            selectedRituals={selectedRituals}
            selectedTier={selectedTier}
            setSelectedTier={setSelectedTier}
            onShowBookingModal={() => setShowBookingModal(true)}
            showTierModal={showTierModal}
            setShowTierModal={setShowTierModal}
            dogPhoto={dogPhoto}
          />
        )}
      </main>

      <footer className={`max-w-4xl mx-auto px-8 lg:px-12 py-16 text-center mt-32 ${step === 'analyzing' ? 'hidden' : ''}`}>
        <p className="text-[11px] text-stone-400 font-serif">
          For educational purposes. Always consult your veterinarian before making significant changes to your dog's care.
        </p>
      </footer>

      <PillarModal
        isOpen={selectedPillar !== null}
        pillar={selectedPillar}
        onClose={() => setSelectedPillar(null)}
      />

      <FounderMessageModal
        isOpen={showFounderMessage}
        onClose={() => setShowFounderMessage(false)}
      />

      <BookConsultationModal
        isOpen={showBookingModal}
        dogName={dogData.name}
        ownerEmail={dogData.ownerEmail}
        onClose={() => setShowBookingModal(false)}
        onSuccess={() => setShowBookingModal(false)}
      />

      {!hasPaid && showTierModal && (
        <TierModal
          dogName={dogData.name}
          isProcessingPayment={isProcessingPayment}
          onPurchase={() => {
            handlePurchase();
            setShowTierModal(false);
          }}
          onBookConsultation={() => {
            setShowTierModal(false);
            setShowBookingModal(true);
          }}
          onClose={() => setShowTierModal(false)}
        />
      )}
    </div>
  );
}

export default App;
