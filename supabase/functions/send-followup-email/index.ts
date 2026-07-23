import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface QueueRow {
  id: string;
  customer_email: string;
  customer_name: string;
  dog_name: string;
  product_key: string;
  purchase_data: Record<string, unknown>;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data: dueEmails, error: fetchError } = await supabase
      .from("email_sequence_queue")
      .select("id, customer_email, customer_name, dog_name, product_key, purchase_data")
      .is("followup_sent_at", null)
      .lte("followup_due_at", new Date().toISOString())
      .limit(50);

    if (fetchError) {
      throw new Error(`Failed to fetch queue: ${fetchError.message}`);
    }

    if (!dueEmails || dueEmails.length === 0) {
      return new Response(
        JSON.stringify({ success: true, processed: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let processed = 0;
    const errors: string[] = [];

    for (const row of dueEmails as QueueRow[]) {
      try {
        // Mark as sent immediately to prevent double-processing
        const { error: updateError } = await supabase
          .from("email_sequence_queue")
          .update({ followup_sent_at: new Date().toISOString(), updated_at: new Date().toISOString() })
          .eq("id", row.id)
          .is("followup_sent_at", null);

        if (updateError) {
          errors.push(`Row ${row.id}: failed to mark as sent`);
          continue;
        }

        const emailHtml = generateFollowupEmail(row);

        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "The Paya Method <cassie@send.payalabs.net>",
            reply_to: "payalabs01@gmail.com",
            to: [row.customer_email],
            bcc: ["payalabs01@gmail.com"],
            subject: getFollowupSubject(row.product_key, row.dog_name),
            html: emailHtml,
          }),
        });

        if (!emailResponse.ok) {
          const errorData = await emailResponse.json();
          errors.push(`Row ${row.id}: Resend error - ${JSON.stringify(errorData)}`);
          // Revert the sent marker so it retries next cycle
          await supabase
            .from("email_sequence_queue")
            .update({ followup_sent_at: null, updated_at: new Date().toISOString() })
            .eq("id", row.id);
          continue;
        }

        processed++;
      } catch (rowError) {
        errors.push(`Row ${row.id}: ${rowError instanceof Error ? rowError.message : "Unknown error"}`);
      }
    }

    return new Response(
      JSON.stringify({ success: true, processed, total: dueEmails.length, errors }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

function getFollowupSubject(_productKey: string, dogName: string): string {
  return `${dogName}'s 30-Day Protocol is Ready`;
}

function generateFollowupEmail(row: QueueRow): string {
  const { dog_name, customer_name } = row;
  const ownerName = customer_name || "there";

  const p = (text: string) => `<p style="font-size:15px;color:#5C534E;line-height:1.85;margin:0 0 16px;">${text}</p>`;
  const pItalic = (text: string) => `<p style="font-size:13px;color:#0A4682;line-height:1.8;margin:0;font-style:italic;padding-left:14px;border-left:2px solid #E8E2D9;">${text}</p>`;
  const weekHeader = (weekNum: number, title: string, theme: string) => `
    <tr><td style="height:32px;"></td></tr>
    <tr>
      <td style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.05);">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:32px 32px 0;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:44px;vertical-align:top;">
                    <span style="display:block;width:44px;font-family:'Cormorant Garamond',Georgia,serif;font-size:34px;color:#C9C4B8;line-height:1;">${weekNum}</span>
                  </td>
                  <td style="vertical-align:top;padding-top:4px;">
                    <h2 style="font-size:20px;color:#2A2421;margin:0 0 4px;font-weight:400;">${title}</h2>
                    <p style="font-family:'Inter',Helvetica,sans-serif;font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#0A4682;margin:0 0 18px;">Theme: ${theme}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`;
  const weekFooter = `
          <tr><td style="padding:0 32px 32px;"></td></tr>
        </table>
      </td>
    </tr>`;
  const dayEntry = (day: number, title: string, pillar: string, body: string, thisWeek: string) => `
          <tr>
            <td style="padding:0 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="border-top:1px solid #E8E2D9;"></td></tr></table>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 0;">
              <h3 style="font-size:16px;color:#2A2421;margin:0 0 3px;font-weight:500;"><span style="color:#0A4682;font-weight:700;">Day ${day}</span> &mdash; ${title}</h3>
              <p style="font-family:'Inter',Helvetica,sans-serif;font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#8A7F72;margin:0 0 14px;">${pillar}</p>
              ${p(body)}
              ${pItalic("This week: " + thisWeek)}
            </td>
          </tr>`;
  let dayCounter = 0;
  const glanceWeek = (weekLabel: string, weekTheme: string, dayTitles: string[], isLast = false) => {
    const startDay = dayCounter + 1;
    dayCounter += dayTitles.length;
    const rows = dayTitles.map((t, i) => `
                <tr>
                  <td style="padding:3px 0;width:36px;font-family:'Inter',Helvetica,sans-serif;font-size:11px;color:#0A4682;vertical-align:top;">Day ${startDay + i}</td>
                  <td style="padding:3px 0;font-size:13px;color:#2A2421;vertical-align:top;">${t}</td>
                </tr>`).join('');
    return `
                <tr>
                  <td style="padding:${isLast ? '0 32px 28px' : '0 32px 20px'};">
                    <p style="font-family:'Inter',Helvetica,sans-serif;font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#4B1D5C;font-weight:600;margin:0 0 8px;">${weekLabel} &mdash; ${weekTheme}</p>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}
                    </table>
                  </td>
                </tr>`;
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${dog_name}'s 30-Day Protocol</title>
</head>
<body style="margin:0;padding:0;background-color:#FDFBF7;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FDFBF7;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr><td style="padding:0 0 32px;text-align:center;">
            <p style="font-family:'Inter',Helvetica,sans-serif;font-size:10px;text-transform:uppercase;letter-spacing:3px;color:#8A7F72;margin:0;">The Paya Method</p>
          </td></tr>

          <!-- Intro + Before You Begin (one card) -->
          <tr>
            <td style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.05);">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:36px 32px 24px;">
                    <h1 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:28px;color:#4B1D5C;margin:0 0 24px;font-weight:500;">${dog_name}'s 30-Day Protocol</h1>

                    ${p(`Thirty days is not arbitrary. It's the window where two things happen simultaneously &mdash; and both have to happen for this to work.`)}
                    ${p(`In ${dog_name}'s body, cellular patterns are shifting. Cortisol baselines are resetting. Neural pathways are consolidating around new rhythms. The body is learning to trust what's coming next. That trust is what unlocks deep repair.`)}
                    ${p(`But here's what most protocols miss: ${dog_name} cannot do this alone. Their nervous system is wired to yours. Which means the second thing that has to happen over these 30 days is <em>you</em> &mdash; your rhythms, your consistency, your calm. When you change, they change. That's not metaphor. That's the biology this protocol is built on.`)}
                    ${p(`What you'll notice by day 30: a dog who moves more freely, sleeps more deeply, and looks at you with steadier eyes. And if you're paying attention &mdash; a version of yourself who is a little more present too.`)}
                    <p style="font-size:15px;color:#5C534E;line-height:1.85;margin:0;">&mdash; Cassie</p>
                  </td>
                </tr>

                <!-- Divider -->
                <tr><td style="padding:0 32px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="border-top:1px solid #E8E2D9;"></td></tr></table>
                </td></tr>

                <!-- Before You Begin -->
                <tr>
                  <td style="padding:24px 32px 32px;">
                    <p style="font-family:'Inter',Helvetica,sans-serif;font-size:9px;text-transform:uppercase;letter-spacing:2.5px;color:#0A4682;margin:0 0 16px;">Before You Begin</p>

                    ${p(`Open your Dog Biology Blueprint™ and find your two lowest marker scores. Write them somewhere you'll see them every day for the next 30 days.`)}

                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F8F5EE;border-radius:8px;margin:0 0 20px;">
                      <tr>
                        <td style="padding:18px 22px;">
                          <p style="font-size:14px;color:#5C534E;line-height:2.2;margin:0;">My priority marker 1: _______________</p>
                          <p style="font-size:14px;color:#5C534E;line-height:2.2;margin:0;">My priority marker 2: _______________</p>
                        </td>
                      </tr>
                    </table>

                    ${p(`Every time you see those markers referenced in your protocol &mdash; treat those days as non-negotiable. Everything matters. Those days are <em>essential</em>.`)}
                    ${p(`We encourage you to keep a simple journal alongside this protocol &mdash; even just a few words each day. The notes you take on Day 4 will mean everything on Day 28.`)}
                    <p style="font-size:15px;color:#5C534E;line-height:1.85;margin:0;">We've got you. And we've got ${dog_name}.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ==================== MONTH AT A GLANCE ==================== -->
          <tr><td style="height:32px;"></td></tr>
          <tr>
            <td style="background:#ffffff;border:1px solid #E8E2D9;border-left:3px solid #4B1D5C;border-radius:4px;overflow:hidden;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:28px 32px 8px;">
                    <p style="font-family:'Inter',Helvetica,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#0A4682;font-weight:600;margin:0 0 4px;">Month at a Glance</p>
                    <p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:19px;color:#2A2421;font-style:italic;margin:0 0 20px;">The whole shape of the next 30 days, before you begin.</p>
                  </td>
                </tr>
                ${glanceWeek("Week 1", "Build the Foundation", ["Set the Feeding Clock", "Audit the Floor", "Create the Sleep Sanctuary", "The Body Scan", "Introduce the Fasting Window", "The Sniff Walk", "Week 1 Check-In"])}
                ${glanceWeek("Week 2", "Activate the Body", ["Morning Sunlight Ritual", "Watch Them Move", "Natural Ground Day", "Free Running Time", "Introduce a New Movement", "The Hydration Check", "Week 2 Check-In"])}
                ${glanceWeek("Week 3", "Deepen the Bond", ["The Undivided 15", "Manage Your Own Cortisol", "Touch for No Reason", "The Long Gaze", "The Homecoming Reset", "Do One Thing Together", "Week 3 Check-In"])}
                ${glanceWeek("Week 4", "Lock It In", ["Rotate the Protein", "Audit the Grooming Products", "Create a Quiet Retreat", "The Nose Game", "Review the Sleep", "Write Their Progress", "The Coat and Eye Check", "Celebrate the Bond", "Reassess"], true)}
              </table>
            </td>
          </tr>

          <!-- ==================== WEEK 1 ==================== -->
          ${weekHeader(1, "WEEK 1 &mdash; Build the Foundation", "Rhythm and Environment")}
          <tr>
            <td style="padding:0 32px 8px;">
              ${p(`The first thing ${dog_name}'s biology needs is predictability. Before anything else can shift &mdash; sleep, energy, inflammation &mdash; the nervous system needs to feel safe. Safety comes from rhythm. This week is about establishing the anchors.`)}
            </td>
          </tr>
          ${dayEntry(1, "Set the Feeding Clock", "The Internal Battery",
            `Pick exact mealtimes and commit to them for the next 30 days. Same time morning and evening, within 15 minutes every day. This single act begins resetting ${dog_name}'s cortisol curve and signals to their body that the world is predictable and safe.`,
            `Choose your two mealtimes right now and set a phone reminder for each.`)}
          ${dayEntry(2, "Audit the Floor", "The Biological Shield",
            `Get down to ${dog_name}'s level &mdash; literally. Look at what they're breathing and walking on every day. Identify one chemical product (floor cleaner, air freshener, pest spray) you can swap for a natural alternative this week. Vinegar and water cleans floors beautifully.`,
            `Make one swap. Just one.`)}
          ${dayEntry(3, "Create the Sleep Sanctuary", "The Restorative Cycle",
            `Evaluate where ${dog_name} sleeps. Is it dark enough? Quiet enough? Supportive enough for their size? Make one improvement today &mdash; a blanket, a moved bed, a covered crate, a blackout curtain. Deep sleep is where vitality is rebuilt every single night.`,
            `Make one improvement to their sleep space today.`)}
          ${dayEntry(4, "The Body Scan", "Physiological Harmony",
            `Run your hands slowly over ${dog_name}'s entire body. Feel for heat, tension, asymmetry, or any spot they flinch from. You're not diagnosing &mdash; you're establishing your baseline. Write down what you notice. This is your Day 1 reference point.`,
            `Write down three things you noticed. Keep this note.`)}
          ${dayEntry(5, "Introduce the Fasting Window", "The Internal Battery",
            `Ensure at least 10-12 hours between their last meal of the day and first meal of the next. This gives the gut time to rest and repair. The microbiome does its best work in that window. No late night treats tonight.`,
            `Move the last meal earlier if needed to create the window.`)}
          ${dayEntry(6, "The Sniff Walk", "Ancestral Cognition",
            `Today's walk has no destination and no pace. Let ${dog_name} lead entirely &mdash; following their nose wherever it takes them. No pulling them away from interesting spots. No rushing. This is not exercise. This is nervous system medicine.`,
            `Let them stop as many times as they want. Follow their nose.`)}
          ${dayEntry(7, "Week 1 Check-In", "All Markers",
            `Look back at your Day 4 body scan notes. Has anything shifted? How is ${dog_name} sleeping? Are they approaching meals with more calm? Write down three things you noticed this week. This is your data &mdash; and your motivation.`,
            `Write your three observations. You are already changing things.`)}
          ${weekFooter}

          <!-- ==================== WEEK 2 ==================== -->
          ${weekHeader(2, "WEEK 2 &mdash; Activate the Body", "Movement and Physical Vitality")}
          <tr>
            <td style="padding:0 32px 8px;">
              ${p(`With rhythm established, ${dog_name}'s body is now ready to move. This week focuses on the quality of physical life &mdash; not how much they move, but how well. Fluid, free, joyful movement is one of the strongest longevity signals we measure.`)}
            </td>
          </tr>
          ${dayEntry(8, "Morning Sunlight Ritual", "The Biological Shield",
            `Within the first hour of waking, get ${dog_name} outside for 10-15 minutes of unfiltered natural light. This resets their circadian rhythm and begins calibrating every hormonal system in their body for the day ahead. Through a window doesn't count &mdash; they need to be outside.`,
            `Make this the first thing you do together every morning.`)}
          ${dayEntry(9, "Watch Them Move", "Biomechanical Flow",
            `Today observe ${dog_name} moving &mdash; getting up from rest, walking, climbing stairs. Watch for hesitation, stiffness, or compensation. Not to worry &mdash; to know. Awareness is the first act of advocacy. Write down what you see.`,
            `This is your movement baseline. Keep this note.`)}
          ${dayEntry(10, "Natural Ground Day", "Biomechanical Flow",
            `Make sure today's walk happens entirely on natural surfaces &mdash; grass, dirt, or sand. Concrete is hard on joints, paws, and the nervous system. Natural ground asks the body to balance, adapt, and engage in ways pavement never does.`,
            `Find your nearest patch of natural ground and make it a regular stop.`)}
          ${dayEntry(11, "Free Running Time", "Biomechanical Flow",
            `Find a safe space today where ${dog_name} can move entirely off leash at their own pace and intensity. Watch what they choose &mdash; a dog who runs in circles is different from one who trots and sniffs. Both are telling you something. Let them choose.`,
            `Even 10 minutes of true free movement counts.`)}
          ${dayEntry(12, "Introduce a New Movement", "Ancestral Cognition",
            `Teach ${dog_name} one new physical skill today &mdash; even something tiny. Step over a log. Walk across a different texture. Balance on a slight incline. New movement challenges create new neural pathways. This is brain and body working together.`,
            `Find one new thing to navigate on your walk.`)}
          ${dayEntry(13, "The Hydration Check", "Physiological Harmony",
            `Gently pinch the skin between ${dog_name}'s shoulder blades. Does it snap back immediately? If it's slow, increase water intake today. Add a splash of bone broth to their water bowl to encourage drinking. Also wash the water bowl today with soap and hot water.`,
            `Check the skin snap every day this week.`)}
          ${dayEntry(14, "Week 2 Check-In", "All Markers",
            `Compare movement to your Day 9 observations. Any difference in how ${dog_name} gets up? How they walk? How long it takes to settle after exercise? Write it down. You are becoming fluent in ${dog_name}'s body language.`,
            `Note any changes &mdash; even tiny ones count.`)}
          ${weekFooter}

          <!-- ==================== WEEK 3 ==================== -->
          ${weekHeader(3, "WEEK 3 &mdash; Deepen the Bond", "Connection and the Human-Dog Sync")}
          <tr>
            <td style="padding:0 32px 8px;">
              ${p(`This is the week most protocols skip entirely. But ${dog_name}'s biology cannot reach its ceiling without this. The quality of your presence &mdash; not the quantity of your time &mdash; is the most powerful vitality input in this entire protocol.`)}
            </td>
          </tr>
          ${dayEntry(15, "The Undivided 15", "The Pack Bond",
            `Set a timer for 15 minutes. Phone face down, screens off, no mental to-do list. Just you and ${dog_name} in the same space. You don't have to do anything. Just be there. Fully. Notice what they do when they feel you arrive completely.`,
            `Do this every day. Same time if possible.`)}
          ${dayEntry(16, "Manage Your Own Cortisol", "The Pack Bond",
            `Today notice your own stress &mdash; when it spikes, what triggers it, how ${dog_name} responds in those moments. You don't have to fix it today. Just see it. Awareness of your own nervous system is the first step to protecting theirs.`,
            `Notice three moments when your stress changed ${dog_name}'s behavior.`)}
          ${dayEntry(17, "Touch for No Reason", "The Pack Bond",
            `Throughout today, reach out and touch ${dog_name} with no agenda. Not as a reward, not before a walk, not after a command. Just because you love them. Random loving touch lowers cortisol in both of you measurably. Do it at least five times today.`,
            `Touch them for no reason every single day.`)}
          ${dayEntry(18, "The Long Gaze", "The Pack Bond",
            `Find a quiet moment today and share unhurried eye contact with ${dog_name}. Soft eyes, relaxed face, no agenda. This releases oxytocin in both human and dog &mdash; the same bonding hormone released between mothers and newborns. This is ancient biology at work.`,
            `Find one long gaze moment every day.`)}
          ${dayEntry(19, "The Homecoming Reset", "The Pack Bond",
            `Today when you come home, change how you greet ${dog_name}. Let the excitement settle before engaging &mdash; calm energy meeting calm energy. Set your things down first. Breathe. Then offer calm, grounded attention. Notice how quickly they mirror you when you arrive grounded instead of rushed.`,
            `Practice this every time you come home.`)}
          ${dayEntry(20, "Do One Thing Together", "The Pack Bond",
            `Choose one activity today that asks you both to be present &mdash; a training session, a new walk route, a game that requires communication between you. Shared focus deepens the neurological bond measurably.`,
            `One shared intentional activity. It doesn't have to be long.`)}
          ${dayEntry(21, "Week 3 Check-In", "All Markers",
            `How is ${dog_name}'s emotional steadiness this week compared to week 1? Are they settling faster after stress? Seeking you out more? Sleeping more deeply? These are signs the Human-Dog Sync is strengthening. Write down what you see.`,
            `Three observations. You are halfway through something real.`)}
          ${weekFooter}

          <!-- ==================== WEEK 4 ==================== -->
          ${weekHeader(4, "WEEK 4 &mdash; Lock It In", "Making Vitality Permanent")}
          <tr>
            <td style="padding:0 32px 8px;">
              ${p(`The biology has shifted. The rhythms are established. The bond is deeper. This final week is about making everything you've built into a permanent operating system &mdash; for both of you.`)}
            </td>
          </tr>
          ${dayEntry(22, "Rotate the Protein", "The Internal Battery",
            `If ${dog_name} has been eating the same protein for more than a month, introduce a new one today &mdash; even as a small addition. Beef, fish, chicken, lamb &mdash; rotating proteins builds a more resilient microbiome and reduces food sensitivity over time.`,
            `Even a small amount of a new protein counts.`)}
          ${dayEntry(23, "Audit the Grooming Products", "The Biological Shield",
            `Check ${dog_name}'s shampoo, conditioner, and any topical products for synthetic fragrances, sulfates, and harsh detergents. Swap one product for a cleaner alternative. Their skin absorbs everything &mdash; what goes on them goes in them.`,
            `Read one label. Make one swap if needed.`)}
          ${dayEntry(24, "Create a Quiet Retreat", "The Biological Shield",
            `Make sure ${dog_name} has one dedicated space in the home that is genuinely theirs &mdash; quiet, undisturbed, always available. A crate with the door open, a tucked away bed, a corner with their blanket. Every dog needs a place to decompress that is entirely safe.`,
            `If it doesn't exist, create it today.`)}
          ${dayEntry(25, "The Nose Game", "Ancestral Cognition",
            `Hide 5 small treats around one room and let ${dog_name} find them using only their nose. Watch the focus, the joy, the satisfaction when they succeed. Mental stimulation of this kind is as restorative as physical exercise &mdash; and it keeps the brain young.`,
            `Do this three times. Watch their face.`)}
          ${dayEntry(26, "Review the Sleep", "The Restorative Cycle",
            `Is ${dog_name} sleeping through the night? Showing signs of deep dreamy sleep &mdash; soft vocalisations, running paws? Waking easily and moving without stiffness? Sleep quality at day 26 compared to day 1 is one of your most reliable vitality indicators.`,
            `Compare sleep now to week 1. What has changed?`)}
          ${dayEntry(27, "Write Their Progress", "All Markers",
            `Take out your notes from Days 4, 7, 14, and 21. Read them in sequence. You have been watching a biological transformation in real time. Write a short paragraph about what has changed. This is your proof &mdash; and your motivation to continue.`,
            `Read your notes in order. You'll be surprised.`)}
          ${dayEntry(28, "The Coat and Eye Check", "Physiological Harmony",
            `Look closely at ${dog_name}'s coat and eyes today compared to day 1. Brighter eyes, softer coat, less shedding &mdash; these are the visible signs of internal systems coming into balance. Take a photo. This is what 28 days of precision looks like.`,
            `Take a photo. Compare it to day 1.`)}
          ${dayEntry(29, "Celebrate the Bond", "All Markers",
            `Do something today that is purely for joy &mdash; yours and ${dog_name}'s. A new trail, a beach, a visit to a dog friend. No agenda. No protocol. Just the two of you, fully alive together. This is what all of it is for.`,
            `Go somewhere new together. Just for the joy of it.`)}
          ${dayEntry(30, "Reassess", "All Markers",
            `You've completed the protocol. Now go back to payalabs.net and retake the assessment. Compare your new scores to your original Blueprint. The markers that were lowest on day 1 &mdash; look at them now. This is ${dog_name}'s biology, rewritten. One home at a time.`,
            `Retake the assessment at payalabs.net and see what changed.`)}
          ${weekFooter}

          <!-- ==================== WHAT COMES NEXT ==================== -->
          <tr><td style="height:32px;"></td></tr>
          <tr>
            <td style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.05);">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:32px 32px;">
                    <p style="font-family:'Inter',Helvetica,sans-serif;font-size:9px;text-transform:uppercase;letter-spacing:2.5px;color:#0A4682;margin:0 0 16px;">What Comes Next</p>
                    ${p(`Thirty days ago you started paying attention in a new way. Don't stop now.`)}
                    ${p(`Most owners reassess every 6 months &mdash; as ${dog_name} moves through life stages, seasons, and changes. Each Blueprint will look different. Each one will show you something new.`)}
                    ${p(`${dog_name}'s vitality is not a destination. It's a conversation &mdash; one you now know how to have.`)}
                    <p style="font-size:15px;color:#5C534E;line-height:1.85;margin:24px 0 0;"><strong>We've got you. And we've got ${dog_name}.</strong></p>
                    <p style="font-size:15px;color:#5C534E;line-height:1.85;margin:12px 0 0;">&mdash; Cassie</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr><td style="height:32px;"></td></tr>
          <tr>
            <td style="text-align:center;padding:24px 0 0;border-top:1px solid #E8E2D9;">
              <p style="font-family:'Inter',Helvetica,sans-serif;font-size:9px;text-transform:uppercase;letter-spacing:2.5px;color:#8A7F72;margin:0 0 12px;">Cassie &middot; The Paya Method</p>
              <p style="font-size:11px;color:#8A7F72;margin:0;line-height:1.6;font-style:italic;">
                For educational purposes. Always consult your veterinarian<br>before making significant changes to your dog's care.
              </p>
            </td>
          </tr>

          <tr><td style="height:40px;"></td></tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
