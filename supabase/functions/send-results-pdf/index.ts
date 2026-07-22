import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface PriorityShift {
  emoji: string;
  biologicalWhy: string;
  compassionateWhat: string;
  protocolTitle: string;
  protocolSteps: any[];
}

interface DirectivesPayload {
  topPillar: { id: string; title: string; score: number };
  bottomPillar: { id: string; title: string; score: number };
  secondaryPillar?: { id: string; title: string; score: number };
  priorityShift: PriorityShift;
  secondaryShift?: PriorityShift;
  goldStandard: Record<string, PriorityShift>;
}

interface RequestPayload {
  dogData: {
    name: string;
    ownerName: string;
    ownerEmail: string;
    age: string;
    weight: string;
    gender: string;
    breed: string;
    condition: string;
    reflection: string;
  };
  results: {
    score: number;
    archetype: { name: string; analysis: string; freeTeaser: string };
    packSync: number;
    phaseScores: number[];
  };
  directives: DirectivesPayload;
  selectedRituals: Record<string, string>;
  dogPhoto?: string | null;
  productKey?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const payload: RequestPayload = await req.json();
    const { dogData, results, directives, selectedRituals, dogPhoto, productKey } = payload;

    const emailHtml = generateEmailHTML(dogData, results, directives, selectedRituals || {}, dogPhoto, productKey);

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) throw new Error("RESEND_API_KEY not configured");

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Paya Labs <cassie@send.payalabs.net>",
        reply_to: "Cassie <payalabs01@gmail.com>",
        to: [dogData.ownerEmail],
        bcc: ["payalabs01@gmail.com"],
        subject: `${dogData.name}'s Complete Dog Biology Blueprint™ — 7 Biology Markers, 50 Markers`,
        html: emailHtml,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json();
      throw new Error(`Email send failed: ${JSON.stringify(errorData)}`);
    }

    const emailData = await emailResponse.json();
    return new Response(JSON.stringify({ success: true, data: emailData }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// ─── DATA ─────────────────────────────────────────────────────────────────────

const FOUNDATIONS = [
  { id: "metabolic", title: "The Internal Battery", rituals: [
    { id: "n1", label: "Fresh, Real Food" }, { id: "n2", label: "Rest Around Meals" },
    { id: "n3", label: "Predictable Mealtimes" }, { id: "n4", label: "Relaxed Around Food" },
    { id: "n5", label: "Real Food Treats" }, { id: "n6", label: "Clean, Fresh Water" },
    { id: "n7", label: "Moisture in Meals" }, { id: "n8", label: "Healthy Fats" },
    { id: "n9", label: "Rotating Proteins" }, { id: "n10", label: "Safe Food Bowls" },
    { id: "n11", label: "Thoughtful Portions" }, { id: "n12", label: "Healthy, Consistent Stools" },
    { id: "n13", label: "Comfortable Eating Position" }, { id: "n14", label: "Overnight Fasting Window" },
    { id: "n15", label: "Healthy Appetite" }, { id: "n16", label: "Comfortable Elimination" },
  ]},
  { id: "repair", title: "The Restorative Cycle", rituals: [
    { id: "s4", label: "Easy Morning Movement" }, { id: "s5", label: "Calm When Alone" },
    { id: "s8", label: "Emotional Steadiness" }, { id: "s10", label: "Sleeping Through the Night" },
  ]},
  { id: "environmental", title: "The Biological Shield", rituals: [
    { id: "e1", label: "Natural Pest Control" }, { id: "e2", label: "Clean, Natural Scents" },
    { id: "e4", label: "Natural Light Exposure" }, { id: "e6", label: "A Chemical-Free Yard" },
  ]},
  { id: "sync", title: "The Pack Bond", rituals: [
    { id: "pb1", label: "Undivided Presence" }, { id: "pb6", label: "Managing Your Own Stress" },
    { id: "pb8", label: "Time with Other Dogs" }, { id: "pb10", label: "They Come to You" },
  ]},
  { id: "cognitive", title: "Ancestral Cognition", rituals: [
    { id: "c1", label: "Nose Games" }, { id: "c5", label: "Sniff Walks" },
    { id: "c11", label: "Breed-Specific Play" }, { id: "c12", label: "Loves to Chew" },
  ]},
  { id: "biomechanical", title: "Biomechanical Flow", rituals: [
    { id: "bf0", label: "Daily Exercise" }, { id: "bf3", label: "Smooth, Balanced Movement" },
    { id: "bf6", label: "Free Running Time" }, { id: "bf13", label: "Time Outside" },
  ]},
  { id: "baseline", title: "Physiological Harmony", rituals: [
    { id: "v1", label: "Healthy Weight" }, { id: "v2", label: "Bright, Clear Eyes" },
    { id: "v3", label: "Comfortable Skin" }, { id: "v4", label: "Healthy Mouth" },
    { id: "v5", label: "Soft, Shiny Coat" }, { id: "v6", label: "Healthy Paw Pads" },
    { id: "v7", label: "Clean, Healthy Ears" }, { id: "v9", label: "Easy, Quiet Breathing" },
    { id: "v10", label: "Right Energy for Their Age" }, { id: "v11", label: "The Hydration Snap" },
    { id: "v13", label: "Vivid Gums and Tongue" }, { id: "v14", label: "Regular Brushing" },
    { id: "v15", label: "Clean, Healthy Nose" },
  ]},
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function getPillarNarrative(pillarId: string, score: number, name: string): string {
  const narratives: Record<string, Record<string, string>> = {
    metabolic: {
      high: `<strong>The engine is fed well.</strong> ${name}'s metabolic rhythms are running clean &mdash; digestion steady, energy stable across the day. This is a strong foundation to build on.`,
      mid: `${name}'s metabolic system is working &mdash; but it's working <strong>harder than it should</strong>. Meal timing, nutrient density, or gut rest windows are fragmenting what should be smooth, sustained fuel.`,
      low: `We see the <strong>highest-leverage opportunity</strong> here. ${name}'s metabolism isn't broken &mdash; it's under-supported. Inconsistent fuel, missing nutrients, or a gut that never fully rests are costing their body daily.`,
    },
    repair: {
      high: `<strong>${name}'s body is healing itself beautifully.</strong> Deep sleep cycles, efficient recovery, and strong restorative rhythms are doing their work every night.`,
      mid: `${name} is resting &mdash; but <strong>not fully repairing</strong>. Something in the sleep environment, timing, or wind-down routine is pulling their body out of the deepest restorative cycles.`,
      low: `This is where ${name}'s vitality is <strong>quietly losing ground</strong>. Without deep, uninterrupted repair cycles, everything else &mdash; energy, immunity, joint health &mdash; degrades faster than it should.`,
    },
    environmental: {
      high: `<strong>${name}'s environment is clean and intentional.</strong> Low toxic load, natural materials, and a home that supports rather than stresses their biology.`,
      mid: `${name}'s body is processing a <strong>low-grade chemical burden</strong> that most owners never notice. Synthetic fragrances, floor chemicals, or off-gassing materials that their liver processes every single day.`,
      low: `The invisible stressors in ${name}'s environment are <strong>accumulating quietly</strong>. Their body is spending immune resources on things that shouldn't be there.`,
    },
    sync: {
      high: `<strong>The bond is biologically real.</strong> ${name}'s nervous system treats your presence as a signal to heal. You've built something most owners never achieve &mdash; a true co-regulatory partnership.`,
      mid: `The love is clear &mdash; but ${name}'s nervous system isn't <strong>fully trusting</strong> it yet. Micro-disconnections throughout the day keep their guard subtly raised.`,
      low: `${name} loves you. But <strong>love isn't landing as biology</strong> yet. The pack bond isn't just emotional &mdash; it's your dog's primary nervous system regulator.`,
    },
    cognitive: {
      high: `<strong>${name}'s mind is sharp and engaged.</strong> Novel challenges, sensory variety, and genuine mental stimulation are keeping their neural pathways fresh.`,
      mid: `${name}'s brain is <strong>under-challenged</strong>. Not bored, exactly &mdash; but not growing. Mental stagnation shows up as restlessness or fixation before it shows up as cognitive decline.`,
      low: `We see an <strong>untapped cognitive reserve</strong> in ${name}. The brain needs novelty like muscles need movement &mdash; without it, neural pathways prune themselves.`,
    },
    biomechanical: {
      high: `<strong>${name} moves like their body was built to.</strong> Fluid, balanced, confident across terrain. Strong muscle tone, easy transitions, and no compensation patterns.`,
      mid: `${name} moves well &mdash; but there are <strong>subtle compensations</strong>. A slight hesitation getting up, favoring one side, or avoiding terrain their body used to handle easily.`,
      low: `${name}'s movement patterns reveal <strong>early mechanical stress</strong>. The body is routing around limitations instead of moving freely.`,
    },
    baseline: {
      high: `<strong>${name}'s vital signs tell a clear story: thriving.</strong> Coat, eyes, energy, digestion &mdash; the body's outward markers all confirm what's happening at the cellular level.`,
      mid: `${name}'s baseline markers are <strong>mixed</strong>. Some systems are showing strength while others are quietly signaling that something is off.`,
      low: `The body is <strong>speaking through its markers</strong> &mdash; coat quality, energy patterns, digestive consistency &mdash; and what it's saying is that the internal systems need more support.`,
    },
  };

  const pillar = narratives[pillarId] || narratives.baseline;
  if (score >= 70) return pillar.high;
  if (score >= 45) return pillar.mid;
  return pillar.low;
}

function getMirrorContent(score: number, name: string): { tier: string; text: string; humanBridge: string } {
  if (score >= 75) {
    return {
      tier: "Resonance",
      text: `You and ${name} have achieved peak synchronization. Your heart rhythms are mirroring each other through HRV synchronization. This biological resonance signals to ${name}'s autonomic nervous system that the environment is perfectly secure, authorizing the highest levels of cellular repair and immune function.`,
      humanBridge: `When you sit in stillness, ${name}'s body enters its deepest repair state. When your breathing slows at night, their cortisol drops in tandem. You have become their biological pacemaker &mdash; and at this level, protecting your own calm isn't self-care. It's their medicine.`,
    };
  }
  if (score > 40) {
    return {
      tier: "Emergence",
      text: `The love you feel is the foundation, but routine fragmentation is creating biological static &mdash; a physical elevation of cortisol. When these stress hormones remain elevated, they act as a biological block, preventing ${name} from entering the deep REM cycles required for cellular repair and immune function.`,
      humanBridge: `The gap between where you are and where ${name}'s biology needs you is not a chasm &mdash; it's a series of small, consistent shifts. The protocol targets the exact points where routine fragmentation is producing cortisol spikes. Close those gaps, and ${name}'s body will respond faster than you expect.`,
    };
  }
  return {
    tier: "The Guarded Threshold",
    text: `Right now, ${name}'s ancestral guard is up. This isn't a lack of bond &mdash; it's a biological signal that their nervous system is locked in chronic hyper-vigilance. This sympathetic "fight-or-flight" state physically blocks the vagus nerve from signaling the body to enter deep restorative repair.`,
    humanBridge: `The vagus nerve is the bridge between survival mode and healing mode. Right now, ${name}'s vagal tone is suppressed &mdash; meaning their body cannot access the parasympathetic state required for deep cellular maintenance. The protocol is designed to systematically lower the threshold until their nervous system receives a clear, repeatable signal: safe.`,
  };
}

function getFrequencyLabel(freq: string): string {
  const map: Record<string, string> = { daily: "Always", often: "Usually", sometimes: "Sometimes", rarely: "Rarely", never: "Never" };
  return map[freq] || "Never";
}

function getFrequencyColor(freq: string): string {
  const map: Record<string, string> = { daily: "#166534", often: "#166534", sometimes: "#92400e", rarely: "#92400e", never: "#a8a29e" };
  return map[freq] || "#a8a29e";
}

// ─── EMAIL GENERATION ─────────────────────────────────────────────────────────

function generateEmailHTML(dogData: any, results: any, directives: DirectivesPayload, selectedRituals: Record<string, string>, dogPhoto?: string | null, productKey?: string): string {
  const currentDate = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const name = dogData.name || "your companion";
  const totalRituals = FOUNDATIONS.reduce((sum, f) => sum + f.rituals.length, 0);

  // Protocol steps
  const protocolStepsHtml = directives.priorityShift.protocolSteps.map((step: any, i: number) => {
    const action = typeof step === "string" ? step : step.action || "";
    const reasoning = typeof step === "object" ? step.reasoning || "" : "";
    const outcome = typeof step === "object" ? step.outcome || "" : "";
    return `
      <tr>
        <td style="padding:20px 0;border-bottom:${i < directives.priorityShift.protocolSteps.length - 1 ? '1px solid #f5f5f4' : 'none'};">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="width:36px;vertical-align:top;">
                <span style="display:inline-block;width:26px;height:26px;background:#1c1917;border-radius:50%;text-align:center;line-height:26px;font-family:'SF Mono',Menlo,monospace;font-size:11px;color:#ffffff;font-weight:700;">${i + 1}</span>
              </td>
              <td style="padding-left:4px;">
                ${reasoning ? `<p style="font-size:12.5px;color:#78716c;line-height:1.7;margin:0 0 10px;font-style:italic;">${reasoning}</p>` : ''}
                <p style="font-size:14px;color:#1c1917;line-height:1.75;margin:0 0 10px;font-weight:500;">${action}</p>
                ${outcome ? `<p style="font-size:12.5px;color:#166534;line-height:1.6;margin:0;"><strong>Expected:</strong> ${outcome}</p>` : ''}
              </td>
            </tr>
          </table>
        </td>
      </tr>`;
  }).join("");

  // Secondary protocol (inline within main card)
  const secondaryInlineHtml = directives.secondaryPillar && directives.secondaryShift && directives.secondaryPillar.id !== directives.bottomPillar.id ? `
    <!-- Secondary Focus divider -->
    <tr><td style="padding:32px 32px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="border-top:1px solid #e7e5e4;"></td></tr></table>
    </td></tr>
    <tr><td style="padding:28px 32px 16px;">
      <p style="font-family:'SF Mono',Menlo,monospace;font-size:9px;text-transform:uppercase;letter-spacing:2.5px;color:#78716c;margin:0 0 12px;">Secondary Focus</p>
      <h3 style="font-size:20px;color:#1c1917;margin:0 0 4px;font-weight:400;">${directives.secondaryShift.protocolTitle}</h3>
      <p style="font-size:12px;color:#a8a29e;margin:0 0 16px;">Targeting ${directives.secondaryPillar.title} &middot; Currently at ${directives.secondaryPillar.score}%</p>
      <p style="font-size:14.5px;color:#44403c;line-height:1.8;margin:0 0 20px;">${directives.secondaryShift.compassionateWhat}</p>
      ${directives.secondaryShift.protocolSteps.slice(0, 3).map((step: any, i: number) => {
        const action = typeof step === "string" ? step : step.action || "";
        const outcome = typeof step === "object" ? step.outcome || "" : "";
        return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
          <tr>
            <td style="width:30px;vertical-align:top;"><span style="display:inline-block;width:22px;height:22px;background:#44403c;border-radius:50%;text-align:center;line-height:22px;font-family:'SF Mono',Menlo,monospace;font-size:10px;color:#fff;font-weight:600;">${i+1}</span></td>
            <td style="padding-left:6px;">
              <p style="font-size:13.5px;color:#1c1917;line-height:1.7;margin:0 0 4px;font-weight:500;">${action}</p>
              ${outcome ? `<p style="font-size:12px;color:#166534;line-height:1.5;margin:0;"><em>${outcome}</em></p>` : ''}
            </td>
          </tr>
        </table>`;
      }).join("")}
    </td></tr>
  ` : "";

  // Mirror content
  const mirror = getMirrorContent(results.score, name);

  // Pillar reference (moved to end, compact)
  const pillarReferenceHtml = FOUNDATIONS.map((f, i) => {
    const score = results.phaseScores[i];
    const narrative = getPillarNarrative(f.id, score, name);
    const isBottom = directives.bottomPillar.id === f.id;
    const isTop = directives.topPillar.id === f.id;
    const badge = isBottom ? '<span style="display:inline-block;background:#fef2f2;color:#991b1b;font-size:9px;padding:2px 6px;border-radius:3px;margin-left:6px;">PRIORITY</span>'
      : isTop ? '<span style="display:inline-block;background:#f0fdf4;color:#166534;font-size:9px;padding:2px 6px;border-radius:3px;margin-left:6px;">STRENGTH</span>' : '';

    const ritualRows = f.rituals.map((r) => {
      const freq = selectedRituals[r.id] || "never";
      const label = getFrequencyLabel(freq);
      const color = getFrequencyColor(freq);
      const dot = freq === "never" ? "\u25CB" : "\u25CF";
      return `<tr>
        <td style="padding:6px 10px;border-bottom:1px solid #fafaf9;font-size:12px;color:#44403c;"><span style="color:${color};margin-right:5px;">${dot}</span>${r.label}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #fafaf9;text-align:right;font-size:10px;font-family:'SF Mono',Menlo,monospace;color:${color};font-weight:600;">${label}</td>
      </tr>`;
    }).join("");

    const isLast = i === FOUNDATIONS.length - 1;

    return `
      <tr><td style="padding:${i === 0 ? '0' : '24px'} 32px 0;">
        ${i > 0 ? '<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="border-top:1px solid #f5f5f4;"></td></tr></table>' : ''}
      </td></tr>
      <tr><td style="padding:16px 32px ${isLast ? '28px' : '0'};">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td><h4 style="font-size:16px;color:#1c1917;margin:0;font-weight:400;">${f.title}${badge}</h4></td>
            <td style="text-align:right;font-family:'SF Mono',Menlo,monospace;font-size:18px;font-weight:600;color:${score >= 70 ? '#166534' : score >= 45 ? '#92400e' : '#991b1b'};">${score}<span style="font-size:11px;color:#d6d3d1;">/100</span></td>
          </tr>
        </table>
        <div style="width:100%;height:5px;background:#f5f5f4;border-radius:3px;margin:10px 0 12px;overflow:hidden;">
          <div style="width:${score}%;height:100%;background:${score >= 70 ? '#166534' : score >= 45 ? '#d97706' : '#dc2626'};border-radius:3px;"></div>
        </div>
        <p style="font-size:13.5px;color:#44403c;line-height:1.75;margin:0 0 14px;">${narrative}</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fafaf9;border-radius:6px;overflow:hidden;">
          ${ritualRows}
        </table>
      </td></tr>
    `;
  }).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name}'s Complete Dog Biology Blueprint™</title>
</head>
<body style="margin:0;padding:0;background-color:#f8f7f6;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8f7f6;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr><td style="padding:0 0 8px;text-align:center;">
            <p style="font-family:'SF Mono',Menlo,monospace;font-size:10px;text-transform:uppercase;letter-spacing:3px;color:#a8a29e;margin:0;">Paya Labs</p>
          </td></tr>
          <tr><td style="padding:0 0 32px;text-align:center;">
            <p style="font-size:11px;color:#d6d3d1;margin:0;">${currentDate}</p>
          </td></tr>

          <!-- Vitality Badge (Purple) -->
          <tr>
            <td>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#1C1433;border-radius:20px;overflow:hidden;">
                <tr><td style="padding:36px 32px 28px;">
                  <p style="text-align:center;font-family:'Courier New',monospace;font-size:9px;letter-spacing:3px;color:rgba(196,181,212,0.5);text-transform:uppercase;margin:0 0 4px;">DOG BIOLOGY BLUEPRINT™</p>
                  <p style="text-align:center;font-family:'Courier New',monospace;font-size:9px;letter-spacing:1.5px;color:rgba(196,181,212,0.25);margin:0 0 4px;">Created using The Paya Method™</p>
                  <p style="text-align:center;font-family:'Courier New',monospace;font-size:9px;letter-spacing:1.5px;color:rgba(196,181,212,0.25);margin:0 0 24px;">PL-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')}</p>

                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="width:80px;vertical-align:middle;">
                        ${dogPhoto
                          ? `<img src="${dogPhoto}" alt="${name}" style="width:72px;height:72px;border-radius:50%;object-fit:cover;border:1.5px solid rgba(196,181,212,0.2);" />`
                          : `<div style="width:72px;height:72px;border-radius:50%;border:1.5px solid rgba(196,181,212,0.2);background:rgba(196,181,212,0.06);text-align:center;line-height:72px;"><span style="font-size:28px;color:#C4B5D4;">&#x1F43E;</span></div>`
                        }
                      </td>
                      <td style="padding-left:16px;vertical-align:middle;">
                        <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:38px;font-weight:300;color:#F0EBF5;margin:0 0 4px;letter-spacing:-0.5px;">${name}</h1>
                        <p style="font-family:Georgia,'Times New Roman',serif;font-size:15px;font-style:italic;font-weight:300;color:#C4B5D4;margin:0;">${results.archetype.name}</p>
                        ${dogData.breed ? `<p style="font-family:'Courier New',monospace;font-size:9px;color:rgba(196,181,212,0.4);margin:6px 0 0;letter-spacing:0.5px;">${dogData.breed}${dogData.age ? ` &middot; ${dogData.age}y` : ''}</p>` : ''}
                      </td>
                    </tr>
                  </table>

                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
                    <tr>
                      <td style="width:130px;vertical-align:top;text-align:center;">
                        <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                          <tr><td style="width:110px;height:110px;border-radius:55px;border:2px solid rgba(196,181,212,0.2);text-align:center;vertical-align:middle;">
                            <span style="font-family:Georgia,'Times New Roman',serif;font-size:44px;font-weight:300;color:#F0EBF5;line-height:1;">${results.score}</span><br/>
                            <span style="font-family:'Courier New',monospace;font-size:11px;color:rgba(196,181,212,0.5);letter-spacing:1px;">/100</span>
                          </td></tr>
                        </table>
                        <p style="font-family:Georgia,'Times New Roman',serif;font-size:12px;font-style:italic;font-weight:300;color:#C4B5D4;margin:10px 0 0;text-align:center;">${results.score >= 80 ? 'Thriving' : results.score >= 65 ? 'On the Right Path' : results.score >= 45 ? 'Room to Grow' : 'Needs Attention'}</p>
                      </td>
                      <td style="vertical-align:bottom;padding-left:24px;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="height:120px;">
                          <tr>
                            ${FOUNDATIONS.map((f, i) => {
                              const s = results.phaseScores[i] || 50;
                              const barH = Math.max(12, Math.round((s / 100) * 100));
                              const barColor = s >= 70 ? '#F0EBF5' : s >= 45 ? 'rgba(240,235,245,0.6)' : 'rgba(240,235,245,0.22)';
                              return `<td style="vertical-align:bottom;text-align:center;padding:0 3px;"><div style="width:100%;height:${barH}px;background:${barColor};border-radius:2px 2px 0 0;"></div></td>`;
                            }).join('')}
                          </tr>
                          <tr>
                            ${FOUNDATIONS.map((f) => {
                              const abbr = f.title.split(' ').pop()!.substring(0, 3).toUpperCase();
                              return `<td style="text-align:center;padding-top:6px;"><span style="font-family:'Courier New',monospace;font-size:7px;color:rgba(196,181,212,0.4);letter-spacing:0.5px;">${abbr}</span></td>`;
                            }).join('')}
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td></tr>

                <tr><td style="padding:14px 32px;border-top:1px solid rgba(196,181,212,0.08);">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="font-family:'Courier New',monospace;font-size:9px;color:rgba(196,181,212,0.35);letter-spacing:1px;">Sync: ${results.packSync}%</td>
                      <td style="text-align:right;font-family:-apple-system,Arial,sans-serif;font-size:11px;letter-spacing:2.5px;color:#C4B5D4;font-weight:500;text-transform:uppercase;">PAYALABS.NET</td>
                    </tr>
                  </table>
                </td></tr>
              </table>
            </td>
          </tr>
          <tr><td style="height:32px;"></td></tr>

          <!-- ═══ MAIN CONTENT CARD ═══ -->
          <tr>
            <td style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.05);">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">

                <!-- Founder Note -->
                <tr><td style="padding:32px 32px 24px;">
                  <p style="font-family:'SF Mono',Menlo,monospace;font-size:9px;text-transform:uppercase;letter-spacing:2.5px;color:#a8a29e;margin:0 0 14px;">A Note from Cassie</p>
                  <p style="font-size:15px;color:#44403c;line-height:1.85;margin:0 0 12px;">I am so honored to be part of ${name}'s longevity journey. We sat with their data &mdash; all ${totalRituals} markers, every pattern, every signal their body is sending.</p>
                  <p style="font-size:15px;color:#44403c;line-height:1.85;margin:0 0 12px;">What follows is not a generic wellness plan. This is ${name}'s personal clinical blueprint &mdash; built from their specific scores across 7 Biology Markers, targeting the exact levers that will produce the most change.</p>
                  <p style="font-size:15px;color:#44403c;line-height:1.85;margin:0;">Read it slowly. Implement it one step at a time.</p>
                </td></tr>

                <!-- Divider -->
                <tr><td style="padding:0 32px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="border-top:1px solid #e7e5e4;"></td></tr></table>
                </td></tr>

                <!-- Archetype Analysis -->
                <tr><td style="padding:28px 32px 24px;">
                  <p style="font-family:'SF Mono',Menlo,monospace;font-size:9px;text-transform:uppercase;letter-spacing:2.5px;color:#78716c;margin:0 0 14px;">Your Archetype &mdash; ${results.archetype.name}</p>
                  <p style="font-size:15px;color:#44403c;line-height:1.85;margin:0;">${results.archetype.analysis || results.archetype.freeTeaser}</p>
                </td></tr>

                <!-- Divider -->
                <tr><td style="padding:0 32px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="border-top:1px solid #e7e5e4;"></td></tr></table>
                </td></tr>

                <!-- Priority Protocol -->
                <tr><td style="padding:28px 32px 20px;">
                  <p style="font-family:'SF Mono',Menlo,monospace;font-size:9px;text-transform:uppercase;letter-spacing:2.5px;color:#78716c;margin:0 0 12px;">Priority Protocol</p>
                  <h2 style="font-size:22px;color:#1c1917;margin:0 0 6px;font-weight:400;">${directives.priorityShift.protocolTitle}</h2>
                  <p style="font-size:12px;color:#a8a29e;margin:0;">Targeting ${directives.bottomPillar.title} &middot; Currently at ${directives.bottomPillar.score}%</p>
                </td></tr>
                <tr><td style="padding:0 32px 20px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fafaf9;border-radius:8px;">
                    <tr><td style="padding:18px 22px;border-left:3px solid #1c1917;">
                      <p style="font-family:'SF Mono',Menlo,monospace;font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#78716c;margin:0 0 8px;">The Biology</p>
                      <p style="font-size:14px;color:#44403c;line-height:1.8;margin:0;">${directives.priorityShift.biologicalWhy}</p>
                    </td></tr>
                  </table>
                </td></tr>
                <tr><td style="padding:0 32px 20px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fafaf9;border-radius:8px;">
                    <tr><td style="padding:18px 22px;border-left:3px solid #166534;">
                      <p style="font-family:'SF Mono',Menlo,monospace;font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#78716c;margin:0 0 8px;">What This Means for ${name}</p>
                      <p style="font-size:14px;color:#44403c;line-height:1.8;margin:0;">${directives.priorityShift.compassionateWhat}</p>
                    </td></tr>
                  </table>
                </td></tr>
                <tr><td style="padding:0 32px 28px;">
                  <p style="font-family:'SF Mono',Menlo,monospace;font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#78716c;margin:0 0 16px;">Exactly What to Do</p>
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    ${protocolStepsHtml}
                  </table>
                </td></tr>

                ${secondaryInlineHtml}

                <!-- Divider -->
                <tr><td style="padding:0 32px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="border-top:1px solid #e7e5e4;"></td></tr></table>
                </td></tr>

                <!-- The Mirror -->
                <tr><td style="padding:28px 32px 24px;">
                  <p style="font-family:'SF Mono',Menlo,monospace;font-size:9px;text-transform:uppercase;letter-spacing:2.5px;color:#78716c;margin:0 0 14px;">The Mirror</p>
                  ${dogData.reflection ? `<p style="font-size:15px;font-style:italic;color:#78716c;line-height:1.8;margin:0 0 20px;padding-left:18px;border-left:2px solid #e7e5e4;">&ldquo;${dogData.reflection}&rdquo;</p>` : ''}
                  <p style="font-family:'SF Mono',Menlo,monospace;font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#a8a29e;margin:0 0 6px;">Your Resonance Level</p>
                  <h3 style="font-size:20px;color:#1c1917;margin:0 0 16px;font-weight:400;">${mirror.tier}</h3>
                  <p style="font-size:14.5px;color:#44403c;line-height:1.8;margin:0 0 20px;">${mirror.text}</p>
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fafaf9;border-radius:8px;">
                    <tr><td style="padding:18px 22px;border-left:3px solid #78716c;">
                      <p style="font-family:'SF Mono',Menlo,monospace;font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#78716c;margin:0 0 8px;">The Human Bridge</p>
                      <p style="font-size:14px;color:#44403c;line-height:1.8;margin:0;">${mirror.humanBridge}</p>
                    </td></tr>
                  </table>
                </td></tr>

                <!-- Divider -->
                <tr><td style="padding:0 32px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="border-top:1px solid #e7e5e4;"></td></tr></table>
                </td></tr>

                <!-- Weekly Rhythm -->
                <tr><td style="padding:28px 32px 24px;">
                  <p style="font-family:'SF Mono',Menlo,monospace;font-size:9px;text-transform:uppercase;letter-spacing:2.5px;color:#78716c;margin:0 0 14px;">Your Weekly Rhythm</p>
                  <p style="font-size:14px;color:#44403c;line-height:1.8;margin:0 0 20px;">Consistency wins over intensity. ${name}'s biology responds to rhythm, not heroic effort.</p>
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr><td style="padding:14px 0;border-bottom:1px solid #f5f5f4;">
                      <p style="font-family:'SF Mono',Menlo,monospace;font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#166534;font-weight:700;margin:0 0 8px;">Daily &mdash; Non-Negotiables</p>
                      <p style="font-size:13.5px;color:#44403c;line-height:1.9;margin:0;">&bull; Priority protocol primary action<br/>&bull; Morning activation ritual (3-5 min)<br/>&bull; Structured meal timing<br/>&bull; Evening wind-down sequence</p>
                    </td></tr>
                    <tr><td style="padding:14px 0;border-bottom:1px solid #f5f5f4;">
                      <p style="font-family:'SF Mono',Menlo,monospace;font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#166534;font-weight:700;margin:0 0 8px;">Every Other Day</p>
                      <p style="font-size:13.5px;color:#44403c;line-height:1.9;margin:0;">&bull; Secondary protocol actions<br/>&bull; Cognitive enrichment (puzzle feeder or scent game)<br/>&bull; Body scan check (2 min)</p>
                    </td></tr>
                    <tr><td style="padding:14px 0;">
                      <p style="font-family:'SF Mono',Menlo,monospace;font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#166534;font-weight:700;margin:0 0 8px;">Weekly</p>
                      <p style="font-size:13.5px;color:#44403c;line-height:1.9;margin:0;">&bull; Novel environment exploration<br/>&bull; Bed &amp; environment refresh<br/>&bull; Progress check against markers below</p>
                    </td></tr>
                  </table>
                </td></tr>

                <!-- Divider -->
                <tr><td style="padding:0 32px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="border-top:1px solid #e7e5e4;"></td></tr></table>
                </td></tr>

                <!-- Progress Markers -->
                <tr><td style="padding:28px 32px 32px;">
                  <p style="font-family:'SF Mono',Menlo,monospace;font-size:9px;text-transform:uppercase;letter-spacing:2.5px;color:#78716c;margin:0 0 14px;">Progress Markers</p>
                  <p style="font-size:14px;color:#44403c;line-height:1.8;margin:0 0 20px;">Biology moves on its own timeline. These markers confirm you're on the right track.</p>

                  <p style="font-family:'SF Mono',Menlo,monospace;font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#1c1917;font-weight:700;margin:0 0 8px;">Days 1&ndash;7: Initial Response</p>
                  <p style="font-size:13px;color:#44403c;line-height:1.9;margin:0 0 18px;padding-bottom:14px;border-bottom:1px solid #f5f5f4;">&bull; Settling into sleep faster (within 5 min)<br/>&bull; More predictable appetite at meal times<br/>&bull; Subtle shift in morning energy &mdash; calmer, more present<br/>&bull; May initially resist new enrichment (this is normal)</p>

                  <p style="font-family:'SF Mono',Menlo,monospace;font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#1c1917;font-weight:700;margin:0 0 8px;">Days 8&ndash;14: System Calibration</p>
                  <p style="font-size:13px;color:#44403c;line-height:1.9;margin:0 0 18px;padding-bottom:14px;border-bottom:1px solid #f5f5f4;">&bull; Cortisol normalizing &mdash; consistent energy throughout the day<br/>&bull; Stool consistency improving<br/>&bull; Reduced paw licking, eye discharge, or skin irritation<br/>&bull; Visibly deeper sleep positions (full lateral recumbency)</p>

                  <p style="font-family:'SF Mono',Menlo,monospace;font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#1c1917;font-weight:700;margin:0 0 8px;">Days 15&ndash;30: Visible Transformation</p>
                  <p style="font-size:13px;color:#44403c;line-height:1.9;margin:0 0 20px;">&bull; Coat showing improved luster and texture<br/>&bull; Sustained engagement during enrichment<br/>&bull; Improved social confidence and reduced reactivity<br/>&bull; Morning stiffness reduced or eliminated<br/>&bull; Overall demeanor shift &mdash; &ldquo;they seem like themselves again&rdquo;</p>

                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fafaf9;border-radius:8px;">
                    <tr><td style="padding:14px 18px;">
                      <p style="font-size:12.5px;color:#44403c;line-height:1.7;margin:0;"><strong>Note:</strong> If you don't see initial markers by Day 10, don't adjust &mdash; increase consistency. Biology responds to repetition before intensity.</p>
                    </td></tr>
                  </table>
                </td></tr>

              </table>
            </td>
          </tr>
          <tr><td style="height:32px;"></td></tr>

          <!-- Protocol notice -->
          <tr>
            <td style="text-align:center;padding:32px 28px;background:#1c1917;border-radius:12px;">
              <p style="font-size:16px;color:#e7e5e4;line-height:1.8;margin:0 0 10px;font-weight:300;">Your 30-Day Protocol is being prepared.</p>
              <p style="font-family:'SF Mono',Menlo,monospace;font-size:10px;color:#a8a29e;margin:0;letter-spacing:1px;text-transform:uppercase;">Arriving in your inbox within 24 hours</p>
            </td>
          </tr>
          <tr><td style="height:32px;"></td></tr>

          <!-- ═══ REFERENCE: FULL PILLAR AUDIT ═══ -->
          <tr><td style="padding:0 0 16px;">
            <p style="font-family:'SF Mono',Menlo,monospace;font-size:9px;text-transform:uppercase;letter-spacing:2.5px;color:#a8a29e;margin:0;">Reference &mdash; Full ${totalRituals}-Marker Audit</p>
            <p style="font-size:12px;color:#a8a29e;margin:6px 0 0;">Bookmark this section. Return to it as you implement your protocol.</p>
          </td></tr>
          <tr>
            <td style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.05);">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${pillarReferenceHtml}
              </table>
            </td>
          </tr>
          <tr><td style="height:32px;"></td></tr>

          <!-- Footer -->
          <tr>
            <td style="text-align:center;padding:28px 0 0;border-top:1px solid #e7e5e4;">
              <p style="font-size:14px;font-style:italic;color:#57534e;line-height:1.8;margin:0 0 20px;max-width:440px;display:inline-block;">You already know how to love this dog. Now you have the map to love them with precision.</p>
              <p style="font-family:'SF Mono',Menlo,monospace;font-size:9px;text-transform:uppercase;letter-spacing:2.5px;color:#a8a29e;margin:0 0 12px;">Cassie &middot; Paya Labs</p>
              <p style="font-size:11px;color:#d6d3d1;margin:0;line-height:1.6;">For educational purposes. Always consult your veterinarian<br>before making changes to your dog's routine or nutrition.</p>
            </td>
          </tr>
          <tr><td style="height:40px;"></td></tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}
