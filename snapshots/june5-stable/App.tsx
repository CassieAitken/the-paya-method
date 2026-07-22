import { useState, useMemo, useEffect, useRef } from 'react';
import { Icons } from './components/Icons';
import { foundations, frequencyWeights, type FrequencyLevel } from './data/foundations';
import { getTrack, type Track } from './lib/track';
import { Landing } from './pages/Landing';
import { Intake } from './pages/Intake';
import { Audit, type RitualFrequencies } from './pages/Audit';
import { Reflection } from './pages/Reflection';
import { OwnerInfo } from './pages/OwnerInfo';
import { AnalysisLoader } from './pages/AnalysisLoader';
import { Results } from './pages/Results';
import { PillarModal } from './components/PillarModal';
import { FounderMessageModal } from './components/FounderMessageModal';
import { TierModal, type ProductKey } from './components/TierModal';
import { BadgePreview } from './pages/BadgePreview';

export type DogData = {
  name: string;
  breed: string;
  gender: string;
  age: string;
  ageMonths: string;
  condition: 'Lean' | 'Ideal' | 'Heavy';
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
  const [selectedProduct, setSelectedProduct] = useState<ProductKey>('complete_vitality_system');
  const [selectedPillar, setSelectedPillar] = useState<typeof foundations[0] | null>(null);
  const [showFounderMessage, setShowFounderMessage] = useState(false);
  const [showTierModal, setShowTierModal] = useState(false);


  const [dogPhoto, setDogPhoto] = useState<string | null>(null);

  const [dogData, setDogData] = useState<DogData>({
    name: '',
    breed: '',
    gender: '',
    age: '',
    ageMonths: '',
    condition: '' as any,
    reflection: '',
    ownerName: '',
    ownerEmail: ''
  });

  // Capture Stripe return params at module evaluation time (before any effect runs or URL is cleaned)
  const stripeParamsRef = useRef(() => {
    const p = new URLSearchParams(window.location.search);
    return {
      stripeSuccess: p.get('stripe_success'),
      pendingId: p.get('pending_id'),
      sessionId: p.get('session_id'),
      stripeCancel: p.get('stripe_cancel'),
    };
  });
  const stripeParams = useRef(stripeParamsRef.current());

  // Handle return from Stripe Checkout
  useEffect(() => {
    const { stripeSuccess, pendingId, sessionId, stripeCancel } = stripeParams.current;

    if (stripeSuccess === '1' && pendingId) {
      // Clean the URL
      window.history.replaceState({}, '', window.location.pathname);

      setIsProcessingPayment(true);
      setStep('results');

      const completeUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/complete-purchase`;
      fetch(completeUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pendingId, sessionId }),
      })
        .then(r => r.json())
        .then(data => {
          if (data.success && data.purchaseData) {
            const { dogData: pd, selectedRituals: psr, dogPhoto: pphoto, productKey: ppk } = data.purchaseData;
            setDogData(pd);
            setSelectedRituals(psr || {});
            if (pphoto) setDogPhoto(pphoto);
            if (ppk) setSelectedProduct(ppk);
            setIsProcessingPayment(false);
            setHasPaid(true);
            setPaymentSuccess(true);
            setTimeout(() => window.scrollTo(0, 0), 300);
            setTimeout(() => setPaymentSuccess(false), 4000);
          } else {
            console.error('complete-purchase failed:', data.error);
            setIsProcessingPayment(false);
          }
        })
        .catch(err => {
          console.error('complete-purchase error:', err);
          setIsProcessingPayment(false);
        });
    }

    if (stripeCancel === '1') {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

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
          analysis: `Diagnosis: Sacred Rhythm. Your nervous systems have been in sync long enough that it runs on its own now — a shared circuit of trust built over years. ${dComp} reads your grounded presence as daily permission to rest deeply, heal fully, and remain present. In the golden chapter, this bond is the single greatest predictor of comfort and vitality. Your focus now: fiercely protect these rhythms. They are ${pPoss} anchor against the natural changes of aging.`
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
        analysis: `Diagnosis: Parallel Rhythms. You and ${dComp} are living separate metabolic lives. Your biological frequencies haven't locked into a shared unit yet. Because your nervous system fluctuates during crucial recovery windows, ${dName} remains in chronic hyper-vigilance — perpetually waiting for a definitive signal that the environment is truly secure. This prevents ${pObj} from transitioning out of fight-or-flight into the deep parasympathetic state required for profound cellular repair, immune stabilization, and long-term vitality.`
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
    const { pPoss, pSubj, pObj, pVerb } = results.pronouns;

    const pillarIds = foundations.map(f => f.id);
    const scores = results.phaseScores as number[];

    let topIdx = 0;
    let bottomIdx = 0;
    scores.forEach((s: number, i: number) => {
      if (s > scores[topIdx]) topIdx = i;
      if (s < scores[bottomIdx]) bottomIdx = i;
    });

    const sorted = scores.map((s: number, i: number) => ({ s, i })).sort((a, b) => a.s - b.s);
    const secondaryIdx = sorted.length > 1 && sorted[1].i !== topIdx ? sorted[1].i : (sorted.length > 2 ? sorted[2].i : topIdx);

    const topPillar = { id: pillarIds[topIdx], title: foundations[topIdx].title, score: scores[topIdx] };
    const bottomPillar = { id: pillarIds[bottomIdx], title: foundations[bottomIdx].title, score: scores[bottomIdx] };
    const secondaryPillar = { id: pillarIds[secondaryIdx], title: foundations[secondaryIdx].title, score: scores[secondaryIdx] };

    const goldStandard: Record<string, { emoji: string; biologicalWhy: string; compassionateWhat: string; protocolTitle: string; protocolSteps: { reasoning: string; action: string; outcome: string }[] }> = {
      sync: {
        emoji: '\u{1F91D}',
        biologicalWhy: `Social obligate species are neurologically wired to co-regulate through autonomic synchronization. ${name}'s heart rate variability, cortisol rhythm, and vagal tone are directly modulated by the predictability of your shared presence. When routine fragmentation introduces unpredictable gaps, ${pPoss} nervous system interprets absence as environmental threat — maintaining sympathetic dominance that blocks deep restorative cycling.`,
        compassionateWhat: `Build a "Rhythm of Safety" by smoothing out the micro-disconnections in your daily routine. ${name} doesn't need more love — ${pSubj} need${pVerb === 'is' ? 's' : ''} that love to arrive on a schedule ${pPoss} nervous system can predict and trust. When ${pSubj} know${pVerb === 'is' ? 's' : ''} exactly when your undivided presence will land, ${pPoss} body stops scanning and starts healing.`,
        protocolTitle: 'The Rhythm of Safety Protocol',
        protocolSteps: [
          {
            reasoning: `The vagus nerve — ${name}'s primary parasympathetic regulator — calibrates its "safety threshold" based on predictable, low-stimulation contact with the primary attachment figure. Without a daily anchor of undivided presence, vagal tone remains suppressed and the nervous system cannot transition into deep repair mode.`,
            action: `Choose one 15-minute window each day that belongs exclusively to ${name}. Same time. No phone. No multitasking. Sit on the floor at ${pPoss} level. Let ${pObj} come to you. Do not initiate — allow ${pPoss} nervous system to register your calm availability.`,
            outcome: `Within 7-10 days, ${name}'s baseline heart rate variability increases measurably. You'll observe earlier settling in the evenings, softer body posture during your anchor time, and a visible reduction in attention-seeking behaviors outside of it.`,
          },
          {
            reasoning: `Separation anxiety is not emotional weakness — it's a biological response to unpredictable loss of the co-regulatory signal. When departures vary in energy, timing, and ritual, the nervous system cannot distinguish "temporary absence" from "permanent threat," maintaining cortisol elevation for the entire duration you're gone.`,
            action: `Before leaving the house, give ${name} a calm, consistent goodbye — same phrase, same touch, same energy. Every time. Create a 30-second ritual: a specific word, a specific touch point (e.g., a slow stroke from ears to shoulders), then leave without looking back.`,
            outcome: `${name}'s cortisol spike at departure drops significantly within two weeks. You'll notice less pacing, less vocalization at the door, and a calmer demeanor when you return — because ${pPoss} system learned that this specific signal always precedes your safe return.`,
          },
          {
            reasoning: `Reunion triggers a massive dopamine and cortisol surge in canines — the "joy spike" is actually physiological over-arousal that, if reinforced, trains the nervous system to associate your return with sympathetic activation rather than parasympathetic relief. Over time, this creates a pattern where your presence paradoxically increases physiological stress.`,
            action: `When you come home, wait 2-3 minutes before greeting ${name}. Set your things down. Breathe. Change your shoes. Then offer calm, grounded attention — slow touch, soft voice, no excitement. Match the energy you want ${pPoss} nervous system to adopt.`,
            outcome: `Reunion becomes a signal for calm rather than chaos. Within days, ${name}'s greeting behavior softens from frantic to warm. ${pPoss} nervous system learns that your return means "safe now" rather than "finally — be hypervigilant to keep them here."`,
          },
          {
            reasoning: `Melatonin onset — the neurochemical gateway to deep restorative sleep — requires progressive reduction in environmental stimulation. Canine circadian systems are exquisitely sensitive to the energy state of their primary attachment figure. When you remain active and stimulated in the final hour before sleep, ${name}'s system reads this as "environment still requires vigilance" and delays sleep architecture initiation.`,
            action: `In the final hour before sleep, reduce stimulation in the shared space. Dim lights to warm tones. Lower your voice. Move slowly. Put screens away. If possible, lie on the floor near ${name} for 5-10 minutes of shared stillness. Let ${pPoss} breathing pattern entrain to yours.`,
            outcome: `Sleep onset accelerates by 15-20 minutes. REM duration increases. You'll observe ${name} entering sleep postures (full lateral recumbency with relaxed extremities) earlier and with fewer position changes through the night — indicating deeper, more restorative cycling.`,
          },
          {
            reasoning: `Co-regulatory circuits require periodic "recalibration" through extended, low-demand shared experience in novel environments. Nature provides multi-sensory grounding (varied terrain, natural sounds, organic scent profiles) that resets the autonomic baseline more effectively than any indoor routine. Without this weekly reset, micro-stress accumulates and the co-regulatory bond gradually loses coherence.`,
            action: `One extended session (30-45 minutes) of unstructured, outdoor time together weekly — no training agenda, no social pressure, no destination. Just parallel existence in nature. Walk at ${name}'s pace. Let ${pObj} sniff. Breathe. Be bored together.`,
            outcome: `This becomes ${name}'s deepest weekly reset. You'll observe a measurable difference in ${pPoss} baseline calm for 2-3 days following each session. Over a month, the cumulative effect lowers ${pPoss} resting cortisol and strengthens the co-regulatory signal for the entire week.`,
          },
        ],
      },
      metabolic: {
        emoji: '\u{1F50B}',
        biologicalWhy: `Nutrient bioavailability is governed by circadian metabolic demand — meaning the same food delivers different cellular value depending on when and how it enters the system. ${name}'s digestive enzymes, gut motility, and insulin sensitivity all follow a predictable daily curve. When meal timing is inconsistent or nutrient density mismatches metabolic need, the gut operates under chronic low-grade inflammation that silently drains energy reserves and compromises immune function.`,
        compassionateWhat: `Honor ${name}'s spirit through the bowl. Every meal is a direct message from you to ${pPoss} biology — not just "I fed you" but "I understand what your body needs right now." The goal isn't perfection. It's alignment between what goes in and when ${pPoss} body is primed to receive it.`,
        protocolTitle: 'The Fueling Protocol',
        protocolSteps: [
          {
            reasoning: `The gut's enzymatic output is circadian-regulated — digestive enzymes, bile salts, and gastric acid all follow a predictable daily curve governed by the suprachiasmatic nucleus. When meal timing varies by more than 30 minutes day-to-day, the enteric nervous system cannot anticipate food arrival, resulting in incomplete enzymatic preparation and up to 25% reduced nutrient bioavailability.`,
            action: `Feed ${name} within the same 30-minute window each day. Morning meal between 7-8am, evening meal between 5-6pm. Set a timer if needed. Consistency of timing matters more than the exact hour you choose.`,
            outcome: `Within 5-7 days, ${name}'s digestive system begins anticipating meals — you'll notice increased eagerness at feeding time, faster eating without gulping, and more consistent stool quality as enzymatic preparation aligns with food arrival.`,
          },
          {
            reasoning: `The "cephalic phase" of digestion — triggered by sight, smell, and anticipation of food — accounts for up to 30% of total digestive enzyme secretion. When meals appear without warning or in a state of arousal, this critical preparatory phase is bypassed entirely. The food arrives in a gut that hasn't been primed to receive it.`,
            action: `10 minutes before feeding, reduce all stimulation. No play, no excitement. Place the bowl preparation in ${name}'s sight line so ${pPoss} digestive system begins secreting enzymes in anticipation. Move slowly and calmly through the preparation ritual.`,
            outcome: `Nutrient extraction improves measurably. You'll observe less bloating, fewer post-meal gas episodes, and ${name} settling into a calm post-meal rest naturally rather than pacing or seeking activity — signs that digestion is proceeding efficiently.`,
          },
          {
            reasoning: `Dry food (kibble) absorbs moisture from the intestinal lining during digestion, creating a localized dehydration effect that slows motility, reduces nutrient absorption surface area, and strains the mucosal barrier. Over months, this chronic low-grade mucosal stress contributes to "leaky gut" — increased intestinal permeability that triggers systemic inflammation.`,
            action: `Add 2-3 tablespoons of warm bone broth or plain water to every meal. Stir gently and let it soak for 60 seconds before offering. For raw or fresh food diets, ensure each meal has visible moisture content rather than dry-packed preparation.`,
            outcome: `Stool quality improves within 3-5 days — firmer but not hard, easier to pass, and more consistent in color. Long-term, ${name}'s coat quality and skin hydration improve as the gut barrier heals and systemic inflammation decreases.`,
          },
          {
            reasoning: `Gut microbiome diversity is directly correlated with immune resilience. A single-protein diet, sustained over months, narrows the microbial population to specialists that process only that protein's specific amino acid profile. This creates fragility — sensitivity reactions, incomplete protein utilization, and reduced adaptive immunity when the body encounters novel biological challenges.`,
            action: `Cycle ${name}'s primary protein source every 2-3 weeks: chicken to beef to fish to lamb to duck. Introduce new proteins gradually (mix 75/25 for 2-3 days) to allow microbiome adaptation without digestive upset.`,
            outcome: `Over 6-8 weeks, you'll notice reduced sensitivity reactions (less scratching, less ear inflammation), more enthusiasm at mealtimes, and improved muscle tone as ${name}'s body accesses a broader spectrum of amino acids and micronutrients.`,
          },
          {
            reasoning: `During digestion, blood flow is diverted to the gastrointestinal tract to support nutrient absorption and peristalsis. Physical activity during this window redirects blood to skeletal muscles, fragmenting the digestive cycle mid-process. The result: incomplete extraction, gas production from partially fermented food, and increased risk of gastric distress — particularly dangerous in deep-chested breeds.`,
            action: `Enforce a 60-90 minute rest period after eating. No walks, no vigorous play, no excitement. Create a designated "post-meal zone" — a comfortable spot where ${name} naturally settles after eating. If ${pSubj} seek${pVerb === 'is' ? 's' : ''} activity, redirect with a calm chew or lick mat.`,
            outcome: `Post-meal discomfort disappears within days. Long-term, nutrient extraction efficiency improves — visible in coat shine, energy stability through the day, and the elimination of the "crash" pattern many dogs exhibit 2-3 hours after meals.`,
          },
        ],
      },
      repair: {
        emoji: '\u{1F319}',
        biologicalWhy: `Deep restorative sleep requires a specific neurochemical cascade: cortisol must drop below threshold, melatonin must rise unimpeded, and the autonomic nervous system must shift fully into parasympathetic dominance. "Biological noise" — light pollution, sound intrusions, temperature fluctuations, and electromagnetic interference — disrupts this cascade at any stage, producing sleep that appears restful but fails to reach the REM and deep-wave cycles where cellular repair, immune consolidation, and memory processing occur.`,
        compassionateWhat: `Create a sanctuary of profound stillness for ${name}'s healing. Sleep isn't just rest — it's the only time ${pPoss} body can perform deep maintenance on every system: joints, organs, immune cells, brain tissue. When you protect the conditions around ${pPoss} sleep, you're authorizing ${pPoss} body to rebuild itself nightly.`,
        protocolTitle: 'Designing Stillness Protocol',
        protocolSteps: [
          {
            reasoning: `Deep restorative sleep occurs in 20-minute cycles that require absolute environmental consistency to complete. A single unexpected stimulus — a light flicker, a sound spike, a temperature shift — triggers the reticular activating system, resetting the entire cycle. Most owners have never experienced their dog's sleep environment from ground level, where sensory intrusions are amplified.`,
            action: `Tonight, lie on the floor where ${name} sleeps for 10 full minutes. Close your eyes. What do you hear? What light enters through your eyelids? What's the temperature at floor level? What surfaces touch your body? Document every source of sensory input that could fragment deep sleep cycles.`,
            outcome: `You'll identify 3-5 sleep disruptors you weren't aware of. Addressing even two of these produces measurable improvement in sleep depth within 48 hours — visible as longer periods of lateral recumbency, dream activity (twitching paws), and slower morning rising.`,
          },
          {
            reasoning: `Canine pineal glands are more photosensitive than human ones — even 5 lux of ambient light (the equivalent of a single LED power indicator) suppresses melatonin production by up to 50%. This doesn't prevent sleep, but it prevents the deepest phases of sleep where growth hormone release, immune cell production, and neural consolidation occur. ${name} may appear to sleep in light — but ${pPoss} body isn't truly repairing.`,
            action: `Remove or cover all LED indicators, night lights, and ambient light sources within 10 feet of ${name}'s sleeping area. Use electrical tape over device lights. If streetlight enters the space, install a blackout solution. The goal is complete darkness — not "dim."`,
            outcome: `Melatonin production normalizes within 2-3 nights. You'll observe ${name} entering deep sleep faster, maintaining sleep positions longer without repositioning, and waking with more energy and less morning stiffness — signs that repair cycles are completing fully.`,
          },
          {
            reasoning: `The canine auditory system never fully deactivates during sleep — it evolved to detect threats. Intermittent sound (a car door, a furnace cycling, a notification ping) triggers micro-arousals that pull the brain out of deep-wave sleep without fully waking the animal. These fragments are invisible to you but cumulative for ${name} — each one resets the 20-minute cycle required for cellular repair.`,
            action: `If ${name}'s sleeping area receives intermittent noise (traffic, appliances cycling, household members), introduce consistent low-level white noise or a fan. The key is consistency — the sound must be continuous and predictable. Set volume just high enough to mask sudden environmental sounds without being stimulating.`,
            outcome: `Uninterrupted sleep cycles lengthen significantly. Within a week, you'll notice ${name} sleeping deeper (full lateral position with relaxed limbs), dreaming more visibly, and requiring less total sleep time because the sleep ${pSubj} get${pVerb === 'is' ? 's' : ''} is actually restorative.`,
          },
          {
            reasoning: `Melatonin release is not an on/off switch — it's a gradual cascade triggered by progressive reduction in environmental stimulation. The suprachiasmatic nucleus begins this cascade 30-45 minutes before sleep onset IF it receives consistent pre-sleep cues. Without a wind-down ritual, the transition from activity to sleep is abrupt, melatonin arrives late, and the first 60-90 minutes of sleep remain in light stages rather than dropping into deep restoration.`,
            action: `Begin 30 minutes before ${name}'s expected sleep time. Same sequence nightly: final bathroom trip, a small calming chew or lick mat (5 minutes of rhythmic licking activates the parasympathetic nervous system), lights dimming progressively, your energy visibly settling. End with ${name} in ${pPoss} designated sleep space.`,
            outcome: `Sleep onset accelerates dramatically — from 15-20 minutes of repositioning to settling within 5 minutes. The first deep-wave cycle begins earlier, extending total deep sleep by an estimated 45-60 minutes per night. You'll notice calmer mornings and more stable daytime energy.`,
          },
          {
            reasoning: `Positional discomfort is the leading cause of micro-awakenings in canines over age 4. When a sleep surface doesn't support spinal alignment in the lateral (side-lying) position, pressure points on shoulders and hips trigger pain receptors that force repositioning every 15-20 minutes. Additionally, heat-trapping surfaces cause thermoregulatory arousals — the canine ideal sleep temperature (65-70°F) is lower than most heated homes provide at floor level.`,
            action: `Ensure ${name}'s bed supports ${pPoss} joints without trapping heat. Choose memory foam or bolstered beds that allow side-lying with full spinal alignment. Test by pressing your palm into the center — it should compress but not bottom out. Position the bed away from heat vents and direct radiator proximity. In warm months, consider a cooling mat beneath the bed cover.`,
            outcome: `Repositioning frequency drops from every 15-20 minutes to every 60-90 minutes. ${name} achieves full lateral recumbency (the deepest sleep position) for sustained periods. Morning stiffness reduces noticeably as joints receive uninterrupted recovery time. Overall sleep quality improves within the first night.`,
          },
        ],
      },
      environmental: {
        emoji: '\u{1F6E1}\u{FE0F}',
        biologicalWhy: `"Environmental load" refers to the cumulative burden of microscopic chemical, synthetic, and biological stressors that ${name}'s detoxification pathways must process daily. Unlike humans, canines absorb toxins through paw pads (transdermal), inhalation of floor-level particulates, and direct oral contact with surfaces. Every immune resource spent neutralizing environmental toxins is a resource unavailable for cellular repair, disease surveillance, and vitality maintenance.`,
        compassionateWhat: `Build a "Sanctuary of Purity" that protects ${name}'s intimate space — the surfaces ${pSubj} sleep${pVerb === 'is' ? 's' : ''} on, the air ${pSubj} breathe${pVerb === 'is' ? 's' : ''}, and the ground ${pSubj} walk${pVerb === 'is' ? 's' : ''} on. You don't need to purify the entire world. Just the 200 square feet where ${pPoss} body spends the most time.`,
        protocolTitle: 'The Clean Paw Protocol',
        protocolSteps: [
          {
            reasoning: `Canine paw pads are highly permeable — transdermal absorption through the interdigital skin is 3-5x more efficient than through furred areas. Every walk deposits herbicides, petroleum residue, road salt, and lawn treatment chemicals onto these absorptive surfaces. Dogs then lick their paws, converting transdermal exposure into direct oral ingestion. This dual-route absorption means a single untreated walk can deliver measurable levels of glyphosate, 2,4-D, and heavy metals directly into the bloodstream.`,
            action: `After every outdoor walk, wipe or rinse ${name}'s paws with plain warm water and a clean cloth. Focus between the toes and on the pad surface. Keep a designated "paw station" by the door — a shallow tray with a damp cloth or a small basin of warm water. Make it a 30-second ritual, not a chore.`,
            outcome: `Daily toxin ingestion drops by an estimated 60%. Within 2-3 weeks, you may notice reduced paw licking/chewing (a common sign of chemical irritation), less redness between toes, and improved skin on the paw pads themselves. Long-term, liver burden decreases measurably.`,
          },
          {
            reasoning: `Dogs breathe at floor level — their respiratory zone is the exact altitude where cleaning chemical residue concentrates. They also make constant oral contact with floor surfaces (dropping food, licking spills, resting their muzzle). Commercial floor cleaners leave invisible chemical films that off-gas for 24-48 hours after application. ${name} is inhaling and ingesting these compounds continuously in the space where ${pSubj} spend${pVerb === 'is' ? 's' : ''} the most time.`,
            action: `Replace all chemical floor cleaners in ${name}'s living space with a simple vinegar-water solution (1:10 ratio) or a plant-based enzyme cleaner. For tough spots, use baking soda paste. Mop or wipe floors in ${name}'s primary zones at least twice weekly with the clean solution.`,
            outcome: `Respiratory irritation markers decrease within days — less sneezing, less reverse sneezing, clearer nasal passages. Over weeks, ${name}'s coat quality improves as the liver redirects resources from detoxification to skin and coat maintenance. You may notice reduced eye discharge as well.`,
          },
          {
            reasoning: `Synthetic fragrances — found in plug-ins, candles, fabric sprays, and laundry products — release volatile organic compounds (VOCs) continuously into indoor air. Canine olfactory systems process 10,000-100,000x more scent molecules per breath than humans. What registers as "pleasant" to you is an overwhelming chemical assault on ${name}'s respiratory mucosa, triggering chronic low-grade inflammation in nasal passages, bronchioles, and the liver's detoxification pathways.`,
            action: `Remove plug-in air fresheners, scented candles, and synthetic fabric sprays from ${name}'s primary living areas. Replace with natural ventilation (open windows 15 minutes daily), beeswax candles if ambiance is desired, or a single drop of pet-safe essential oil on a ceramic diffuser used sparingly.`,
            outcome: `Within 72 hours, ${name}'s respiratory rate at rest normalizes. Chronic low-grade inflammation decreases — visible as reduced eye discharge, less paw licking, and improved sleep quality. Over months, the cumulative reduction in liver burden produces visibly shinier coat and more stable energy.`,
          },
          {
            reasoning: `Fabric accumulates biological and chemical contaminants exponentially — dust mites, mold spores, bacterial colonies, dead skin cells, and environmental chemicals all concentrate in bedding material. A dog bed unwashed for two weeks contains bacterial populations comparable to a kitchen sponge. ${name} presses ${pPoss} face, respiratory passages, and open skin surfaces into this concentrated microbial environment for 8-12 hours nightly.`,
            action: `Wash ${name}'s bed cover weekly in fragrance-free, dye-free detergent on a hot cycle. Between washes, expose the bed to direct sunlight for 30 minutes when possible — UV light neutralizes mold spores, dust mites, and bacterial colonies naturally. Vacuum the bed insert monthly.`,
            outcome: `Skin irritation and hot spot frequency drops significantly. Sleep quality improves as respiratory irritants decrease. You'll notice less scratching upon waking and fewer unexplained skin flare-ups. Long-term, immune resources previously spent fighting bedding contaminants redirect to systemic health maintenance.`,
          },
          {
            reasoning: `Municipal water contains chlorine (which disrupts gut microbiome balance), fluoride (which accumulates in bone tissue over time), and trace pharmaceuticals that water treatment doesn't fully remove. Dogs consume proportionally more water relative to body weight than humans, and their smaller body mass means contaminant concentrations have outsized biological impact. Plastic bowls leach BPA and phthalates that act as endocrine disruptors — particularly when exposed to sunlight or heat.`,
            action: `Filter ${name}'s drinking water through a simple carbon filter (pitcher-style or faucet-mounted). Replace the bowl with stainless steel or ceramic. Wash the bowl daily with hot water — biofilm forms on water bowl surfaces within 24 hours. Refill with fresh filtered water at least twice daily.`,
            outcome: `Gut microbiome diversity improves within 2-3 weeks as chlorine exposure ceases. Stool consistency stabilizes. Over months, reduced endocrine disruptor exposure supports hormonal balance — visible as more consistent energy levels, stable weight maintenance, and healthier coat growth cycles.`,
          },
        ],
      },
      cognitive: {
        emoji: '\u{1F9E0}',
        biologicalWhy: `Canine neuroplasticity — the brain's ability to form and strengthen neural connections — is maintained through novel problem-solving, sensory exploration, and reward-based challenges. Without regular cognitive demand, synaptic pruning accelerates: the brain literally dismantles pathways it deems unnecessary. This manifests first as subtle restlessness or fixation behaviors, then progresses to measurable cognitive decline. Enrichment isn't entertainment — it's structural brain maintenance.`,
        compassionateWhat: `Activate ${name}'s instinctual mind. Every dog carries ancient neural circuitry built for tracking, hunting, foraging, and solving environmental puzzles. Modern life silences these pathways — and silence becomes atrophy. By engaging ${pPoss} problem-solving brain daily, you're giving ${pObj} purpose, discovery, and the deep satisfaction of using a mind that was built for more than waiting.`,
        protocolTitle: 'The Instinctual Foraging Protocol',
        protocolSteps: [
          {
            reasoning: `Olfactory processing activates 40% of the canine brain — more than any other single activity including physical exercise. The olfactory bulb connects directly to the hippocampus (memory) and amygdala (emotional processing), meaning scent work simultaneously exercises memory formation, spatial mapping, problem-solving, and emotional regulation. Without regular scent challenges, these neural pathways undergo synaptic pruning — the brain literally dismantles what it doesn't use.`,
            action: `Daily Scent Work (15 minutes): Hide 3-5 high-value treats around a room or outdoor space. Start obvious (visible but slightly hidden), then increase difficulty over days (inside boxes, under objects, elevated surfaces). Let ${name} use ${pPoss} nose — not your guidance — to locate them. Resist helping. The struggle IS the exercise.`,
            outcome: `Within 7-10 days, ${name}'s problem-solving speed increases visibly. You'll notice improved focus during other activities, reduced restlessness and fixation behaviors, and a calmer overall demeanor — because a cognitively satisfied brain doesn't need to manufacture its own stimulation through anxiety or repetitive behaviors.`,
          },
          {
            reasoning: `Standard bowl feeding takes 30-90 seconds and activates zero cognitive pathways. The ancestral canine brain evolved spending 4-6 hours daily on food acquisition — tracking, problem-solving, and foraging. When this drive has no outlet, it redirects into destructive behavior, anxiety, or learned helplessness. Enrichment feeding reactivates the "seeking system" — the dopaminergic circuit that produces satisfaction through earned discovery rather than passive consumption.`,
            action: `Retire the standard bowl for at least one meal daily. Use a snuffle mat, scatter feed in grass, or place kibble inside a puzzle toy (Kong, LickiMat, or treat-dispensing ball). Rotate enrichment methods every 3-4 days to maintain novelty. The meal should take 10-20 minutes to consume, not 60 seconds.`,
            outcome: `Post-meal energy stabilizes — the "eating then pacing" pattern disappears as ${name}'s brain receives the dopamine satisfaction of earned food. Destructive behaviors decrease as the seeking system gets appropriate daily expression. You'll also notice improved digestion, as slower eating supports the cephalic phase.`,
          },
          {
            reasoning: `Neural plasticity requires novel sensory input — the brain cannot build new pathways from familiar data. When ${name}'s daily environment is identical (same walks, same parks, same smells), the brain switches from "mapping mode" to "autopilot mode." Novel environments force the hippocampus to construct entirely new spatial maps, the olfactory system to categorize unfamiliar scent profiles, and the prefrontal cortex to make rapid risk assessments. This is cognitive exercise at its most natural and complete.`,
            action: `Once weekly, bring ${name} to a genuinely new location — a different trail, neighborhood, store that allows dogs, or park. Allow 30-45 minutes of unhurried exploration at ${pPoss} pace. Follow ${pPoss} curiosity. Let ${pObj} process the environment without rushing or directing.`,
            outcome: `Cognitive flexibility improves measurably — ${name} becomes more adaptable to new situations, less reactive to unexpected stimuli, and more confident in unfamiliar settings. Long-term, weekly novel exposure is the single strongest protective factor against age-related cognitive decline.`,
          },
          {
            reasoning: `Working memory — the ability to hold and manipulate information across time and space — is the cognitive function most vulnerable to age-related decline and the most protective when maintained. "Find It" games train sequential processing: ${name} must remember what ${pSubj}'${pVerb === 'is' ? 's' : 're'} looking for, hold spatial information about where ${pSubj}'ve already searched, and sustain focus through increasing difficulty. This directly exercises the prefrontal cortex and hippocampal circuits that degrade first in cognitive decline.`,
            action: `Teach ${name} to locate a specific item by scent. Start simple: place a treat under one of three cups, let ${pObj} choose. Progress to hiding the item in another room. Then progress to "find your toy" — hiding a specific named toy among others. Increase distance, add rooms, extend the delay between hiding and releasing.`,
            outcome: `Within 2-3 weeks, ${name}'s sustained attention span increases noticeably — ${pSubj}'ll stay engaged with complex tasks longer and show less frustration with difficulty. Long-term, working memory exercises are the most evidence-backed intervention for preserving cognitive function through aging.`,
          },
          {
            reasoning: `Social processing is the most computationally expensive cognitive task a canine brain performs — requiring simultaneous body language reading, emotional assessment, impulse regulation, and real-time behavioral adaptation. These recruit prefrontal cortex, mirror neuron networks, and limbic regulation circuits all at once. Without regular social challenge, these high-level integration pathways weaken — manifesting as social anxiety, over-reactivity, or withdrawal.`,
            action: `Arrange brief, positive interactions with unfamiliar (but safe) dogs or people weekly. Keep initial interactions to 5-10 minutes. Watch for signs of cognitive engagement (soft eyes, play bows, appropriate sniffing rituals) vs. overwhelm (whale eye, tucked tail, displacement behaviors). End on a positive note.`,
            outcome: `Social confidence builds progressively — ${name} will approach novel social situations with curiosity rather than anxiety. You'll notice faster "warm-up" times, more appropriate greeting behaviors, and improved impulse control in exciting social contexts. These gains transfer to overall emotional regulation in all settings.`,
          },
        ],
      },
      biomechanical: {
        emoji: '\u{1F415}',
        biologicalWhy: `Joint health, structural alignment, and pain-free movement depend on consistent mechanical loading, adequate synovial fluid circulation, and the absence of chronic inflammatory patterns. When movement becomes repetitive (same walk, same surfaces, same pace) or insufficient, cartilage receives inadequate nutrient exchange, muscle imbalances develop compensatory patterns, and fascial adhesions form. These changes are silent until they become painful — and by then, structural damage has already occurred.`,
        compassionateWhat: `Protect ${name}'s freedom to explore every adventure — every trail, every sprint, every joyful leap — for years to come. Mobility isn't just physical; it's the foundation of ${pPoss} confidence, independence, and quality of life. When ${pSubj} move${pVerb === 'is' ? 's' : ''} freely, ${pSubj} live${pVerb === 'is' ? 's' : ''} fully.`,
        protocolTitle: 'The Mobility Warm-Up Protocol',
        protocolSteps: [
          {
            reasoning: `Synovial fluid — the lubricant that protects joint surfaces from friction damage — is not pre-distributed in joints at rest. It requires gentle mechanical loading to circulate into cartilage surfaces and fill the joint capsule. Cold-starting a walk without warm-up means the first 5-10 minutes of load-bearing occur on unlubricated joint surfaces, causing microscopic cartilage damage that accumulates daily into early-onset osteoarthritis.`,
            action: `Morning Activation (3-5 minutes): Before the first walk of the day, guide ${name} through gentle movements — slow leash walking in tight circles (both directions), 2-3 sit-to-stand repetitions, and brief stretching by luring ${pObj} into a play bow position with a treat held at ground level. Move slowly. This is warm-up, not exercise.`,
            outcome: `Morning stiffness disappears within 3-5 days as joints receive proper pre-loading lubrication. ${name}'s gait in the first 100 meters of each walk becomes noticeably smoother and more confident. Long-term, this single habit delays osteoarthritis onset by years by preventing daily micro-damage accumulation.`,
          },
          {
            reasoning: `Proprioception — the body's spatial awareness system — relies on varied sensory input from different terrain types to maintain calibration. Monotonous surface walking (same sidewalk daily) creates muscle recruitment imbalances: the same fibers fire in the same pattern while stabilizers atrophy from disuse. This produces compensation patterns that look like "normal aging" but are actually preventable mechanical degradation from repetitive loading.`,
            action: `Ensure ${name} walks on at least 3 different surfaces weekly — grass, sand or gravel, pavement, and uneven natural terrain (trails with roots, hills, varied ground). Deliberately vary the route. Even alternating between left-side and right-side of a street provides different camber challenges for the musculoskeletal system.`,
            outcome: `Balance and confidence on varied terrain improves within 2-3 weeks. You'll notice ${name} navigating uneven ground with less hesitation, fewer stumbles, and more fluid transitions between surfaces. Proprioceptive sharpness protects against falls and maintains independent mobility long-term.`,
          },
          {
            reasoning: `Abrupt cessation of vigorous exercise traps lactic acid in muscle tissue, prevents adequate venous return of blood from extremities, and allows heart rate to drop too quickly — stressing the cardiovascular system. Muscles that cool without gentle post-exercise movement develop fascial adhesions (microscopic "sticking points") that accumulate into stiffness, reduced range of motion, and chronic discomfort over weeks and months.`,
            action: `After vigorous exercise, don't go from full activity to crate or bed. Walk slowly for 3-5 minutes, allowing heart rate to normalize and lactic acid to clear from muscles. Then offer a supported lying-down position where ${name} can stretch naturally. Provide water access after the cool-down, not during peak exertion.`,
            outcome: `Post-exercise stiffness eliminates within the first week. Recovery time between active days shortens. ${name} maintains enthusiasm for exercise rather than developing the reluctance that signals accumulated micro-damage. Long-term mobility is preserved through the prevention of fascial adhesion formation.`,
          },
          {
            reasoning: `Pain and mechanical dysfunction announce themselves through touch sensitivity long before they produce visible lameness. Temperature changes indicate inflammation. Muscle tension indicates compensation. Flinching indicates developing pathology. By the time a dog limps, structural damage has been progressing for weeks or months. Nightly tactile assessment catches these signals at the earliest, most treatable stage — when intervention is simple rather than surgical.`,
            action: `Nightly Body Scan (2 minutes): Run your hands slowly over ${name}'s entire body — shoulders, spine, hips, limbs, paws. Use consistent pressure. Notice any flinching, muscle tightness, temperature differences between symmetrical areas, or behavioral changes (pulling away, looking at you, licking lips). Track patterns over days.`,
            outcome: `You develop an intimate knowledge of ${name}'s physical baseline — making deviations immediately obvious. Early detection of developing issues means intervention at the inflammation stage (rest, targeted exercise) rather than the damage stage (surgery, chronic management). This is the single most effective preventive practice for long-term mobility.`,
          },
          {
            reasoning: `Joint stability depends on deep stabilizer muscles that standard walking and running do not adequately challenge. These small muscle groups — particularly around hips, stifles, and shoulders — require balance-demanding, low-impact loading to maintain strength. When stabilizers weaken, primary movers compensate, creating abnormal joint loading patterns that accelerate cartilage degradation. Controlled instability training builds these protective muscles without the impact stress that damages the very structures you're trying to protect.`,
            action: `2-3 times weekly, incorporate brief balance challenges — walking over a low cavaletti (broom handle laid on the ground), standing on a slightly unstable surface (folded towel or couch cushion on floor), or slow-speed leash walking up gentle inclines. Keep sessions to 5 minutes. Quality of movement matters more than duration.`,
            outcome: `Core strength and joint stability improve within 2-3 weeks — visible as smoother transitions (sit-to-stand, turning, navigating stairs), more confident movement on uneven ground, and reduced "wobble" during slow gaits. Long-term, these exercises extend pain-free mobility by years by protecting joint structures from inside out.`,
          },
        ],
      },
      baseline: {
        emoji: '\u{2696}\u{FE0F}',
        biologicalWhy: `Homeostasis — the body's ability to maintain stable internal conditions — is governed by the alignment of circadian rhythms, metabolic timing, and environmental consistency. When daily routines fluctuate unpredictably (feeding times, sleep-wake cycles, activity levels), the hypothalamic-pituitary-adrenal axis cannot establish a reliable cortisol curve. This produces "metabolic drift" — a state where no single system is in crisis, but none are operating at peak efficiency either.`,
        compassionateWhat: `Create a baseline of peace from which all healing and joy can emerge. ${name} doesn't need an exciting life — ${pSubj} need${pVerb === 'is' ? 's' : ''} a predictable one. When the body knows what's coming next, it stops spending energy on vigilance and redirects that energy toward repair, immunity, and vitality.`,
        protocolTitle: 'The Metabolic Anchor Protocol',
        protocolSteps: [
          {
            reasoning: `The hypothalamic-pituitary-adrenal (HPA) axis — the master hormonal regulator — calibrates its entire daily cortisol curve based on the timing predictability of core daily events. When wake time, feeding, and activity vary by more than 30 minutes day-to-day, the HPA axis cannot establish a stable rhythm, producing "cortisol drift" — a flattened curve where stress hormones neither peak properly for energy nor trough properly for repair. This single dysfunction cascades into disrupted sleep, impaired digestion, and suppressed immune function.`,
            action: `Standardize ${name}'s four key daily events within a 30-minute window: morning wake time, first meal, primary walk/exercise, and evening meal. Write these times down. Set phone reminders if needed. Precision matters more than the specific times you choose — pick what's sustainable and hold it.`,
            outcome: `Within 10-14 days, ${name}'s cortisol curve normalizes — visible as more consistent energy through the day (no late-morning crashes), improved appetite at mealtimes, and notably better sleep onset. The body stops spending resources on uncertainty and redirects them to maintenance and repair.`,
          },
          {
            reasoning: `The first sensory input of the day programs the suprachiasmatic nucleus — the brain's master clock — for the next 24 hours. When this input is consistent (same sequence, same timing, same environment), the entire hormonal cascade for the day fires in proper order: cortisol rises for alertness, thyroid hormones mobilize energy, digestive enzymes prepare for food. An inconsistent morning creates a "scrambled signal" that takes hours to resolve — wasting the most metabolically productive hours of the day.`,
            action: `Establish the same first 20 minutes every day — bathroom trip first (same door, same area), brief calm greeting (30 seconds of quiet contact), then breakfast (same location, same time). Do not deviate. This sequence becomes ${name}'s "biological anchor" that tells ${pPoss} entire hormonal system how to set its daily clock.`,
            outcome: `Morning behavior transforms within a week — ${name} wakes with calm anticipation rather than anxious uncertainty. Digestive efficiency at breakfast improves (cephalic phase activates on cue). The cascading benefit: every system downstream of the morning anchor functions more smoothly because it received a clear starting signal.`,
          },
          {
            reasoning: `Canine cortisol follows a natural diurnal pattern: peak 1-2 hours after waking (designed for hunting/activity), gradual decline through afternoon (designed for rest/digestion), and trough at night (designed for repair). When high-energy activities are scheduled during the cortisol trough (late afternoon) or rest is demanded during the peak (early morning), the body fights its own chemistry. This mismatch produces chronic low-grade stress as the system constantly compensates for working against its natural rhythm.`,
            action: `Match ${name}'s highest-energy activities (vigorous walks, play, training) to ${pPoss} natural cortisol peak — typically 1-2 hours after waking and again mid-morning. Schedule calmer activities (gentle sniffing walks, quiet chewing, rest) for the afternoon dip. Observe ${name}'s natural energy patterns for a few days and work WITH what you see.`,
            outcome: `Energy utilization becomes visibly more efficient — ${name} engages more enthusiastically during peak activities and settles more willingly during rest periods. The "wired but tired" phenomenon (restlessness despite adequate exercise) disappears as activity timing aligns with hormonal readiness.`,
          },
          {
            reasoning: `Melatonin production — the gateway to restorative sleep — requires a predictable sequence of declining stimulation to initiate. The canine brain needs 45-60 minutes of consistent pre-sleep cues to begin the neurochemical cascade. When the final 90 minutes before sleep vary in activity level, lighting, or sequence, melatonin onset is delayed or suppressed — meaning the first 1-2 hours of "sleep" remain in light stages that provide rest but not restoration.`,
            action: `The final 90 minutes before sleep should follow the same pattern nightly: final walk (same route, calm pace), last water access (then remove or limit), a brief settling ritual (a small chew or 5 minutes of gentle contact), then transition to the sleep environment. Same order, same timing, every night.`,
            outcome: `Sleep onset accelerates within 3-5 nights — ${name} begins settling into sleep position earlier and with fewer repositions. Total restorative sleep duration increases as melatonin production starts on cue. You'll notice more consistent morning energy and reduced daytime restlessness as nightly repair cycles complete fully.`,
          },
          {
            reasoning: `Canine circadian biology has no concept of "weekends." The HPA axis calibrates to whatever pattern is most consistent over a rolling 7-day window. When weekday timing is held at 7am but weekends shift to 9am, the system receives conflicting data and cannot optimize — it averages the confusion, resulting in a weaker cortisol curve all seven days. Two days of disruption doesn't "reset" on Monday; it takes until Wednesday to re-establish the rhythm that was broken on Saturday.`,
            action: `Resist the urge to dramatically change ${name}'s schedule on weekends. Maintain core timing (wake, feeding, primary walk) within the weekday 30-minute window. If you want to sleep in, set up ${name}'s morning routine to proceed without you — automated feeder at the usual time, dog door access for bathroom, same sequence even if you join 30 minutes later.`,
            outcome: `Weekly rhythm coherence improves dramatically — the Monday "reset" struggle disappears. ${name} shows consistent energy, digestion, and mood seven days a week instead of the common pattern of weekday stability followed by weekend disruption and Monday recovery. This single change amplifies the benefit of every other protocol element.`,
          },
        ],
      },
    };

    const priorityShift = goldStandard[bottomPillar.id] || goldStandard.baseline;
    const secondaryShift = goldStandard[secondaryPillar.id] || goldStandard.baseline;

    return {
      topPillar,
      bottomPillar,
      secondaryPillar,
      priorityShift,
      secondaryShift,
      goldStandard,
    };
  }, [selectedRituals, dogData.name, results]);

  const handlePurchase = async () => {
    setIsProcessingPayment(true);
    setPaymentSuccess(false);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productKey: selectedProduct,
          dogData,
          results,
          directives,
          selectedRituals,
          dogPhoto,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe hosted checkout
      window.location.href = data.url;
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

Human-Dog Sync: ${results.packSync}%`;

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
    const shareText = `I just did something I didn't expect to feel this much.

${dogName} scored ${results?.score || ''}/100 on the PayaLabs Vitality Assessment — 50 carefully selected markers, 7 vitality pillars, one personalized blueprint for their long-term health.

The part that got me? How much my own habits are showing up in their biology.`;

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

  // Preview route for badge design
  if (window.location.hash === '#preview' || window.location.search.includes('page=preview')) {
    return <BadgePreview />;
  }

  return (
    <div className="min-h-screen text-[#2A2421] bg-[#FDFBF7]">
      <nav className={`sticky top-0 z-50 w-full bg-[#FDFBF7]/95 backdrop-blur-xl border-b border-[#E6E0D5]/40 ${step === 'analyzing' ? 'hidden' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-4 sm:py-5 flex justify-between items-center">
        <button onClick={() => { setStep('landing'); window.scrollTo(0, 0); }} className="flex items-center gap-2.5 sm:gap-3 hover:opacity-80 transition-opacity flex-shrink-0">
          <Icons.Leaf size={18} className="text-[#415A42] sm:w-5 sm:h-5" strokeWidth={1.5} />
          <span className="font-serif text-lg sm:text-xl tracking-tight text-[#2A2421]">PayaLabs</span>
        </button>
        <div className="flex items-center gap-6 sm:gap-8">
          {step === 'landing' && (
            <div className="flex items-center gap-1 sm:gap-1">
              {[
                { label: 'The Mandate', mobileLabel: 'Mandate', target: 'mandate' },
                { label: 'The Pillars', mobileLabel: 'Pillars', target: 'pillars' },
                { label: 'The Founder', mobileLabel: 'Founder', target: 'founder' },
              ].map((link, i) => (
                <span key={link.target} className="flex items-center">
                  <button
                    onClick={() => {
                      const el = document.querySelector(`[data-section="${link.target}"]`);
                      if (el) {
                        const navHeight = document.querySelector('nav')?.getBoundingClientRect().height || 0;
                        const top = el.getBoundingClientRect().top + window.scrollY - navHeight;
                        window.scrollTo({ top, behavior: 'smooth' });
                      }
                    }}
                    className="text-[10px] sm:text-[10px] font-semibold sm:font-medium tracking-[0.06em] sm:tracking-[0.12em] text-[#2A2421] sm:text-[#5C534E]/80 hover:text-[#2A2421] transition-colors px-2 sm:px-3 py-1.5"
                  >
                    <span className="sm:hidden">{link.mobileLabel}</span>
                    <span className="hidden sm:inline">{link.label}</span>
                  </button>
                  {i < 2 && <span className="text-[#E6E0D5] text-[10px] select-none">&middot;</span>}
                </span>
              ))}
              <button
                onClick={() => { setStep('intake'); window.scrollTo(0, 0); }}
                className="ml-2 sm:ml-4 text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white bg-[#2A2421] hover:bg-[#415A42] px-4 py-2.5 sm:px-5 transition-all duration-300 whitespace-nowrap rounded-sm"
              >
                Begin Assessment
              </button>
            </div>
          )}
          {import.meta.env.DEV && step === 'results' && !hasPaid && (
            <button
              type="button"
              onClick={() => setHasPaid(true)}
              className="text-[9px] font-mono uppercase tracking-widest text-amber-600 border border-amber-300 px-3 py-1.5 rounded hover:bg-amber-50 transition-colors"
            >
              Dev Unlock
            </button>
          )}
          {['intake', 'audit', 'reflection', 'ownerInfo'].includes(step) && (
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
                  audit: 'intake',
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
              className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#5C534E] flex items-center gap-2.5 hover:text-[#2A2421] transition-colors"
            >
              <Icons.ArrowLeft size={15} strokeWidth={1.5} /> Back
            </button>
          )}
        </div>
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
        {step === 'audit' && (
          <Audit
            currentFoundation={currentFoundation}
            setCurrentFoundation={setCurrentFoundation}
            selectedRituals={selectedRituals}
            setSelectedRituals={setSelectedRituals}
            setStep={setStep}
            dogData={dogData}
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
            selectedProduct={selectedProduct}
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


      {!hasPaid && showTierModal && (
        <TierModal
          dogName={dogData.name}
          isProcessingPayment={isProcessingPayment}
          selectedProduct={selectedProduct}
          onSelectProduct={setSelectedProduct}
          onPurchase={() => {
            handlePurchase();
            setShowTierModal(false);
          }}
          onClose={() => setShowTierModal(false)}
        />
      )}
    </div>
  );
}

export default App;
