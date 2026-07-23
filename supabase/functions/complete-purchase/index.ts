import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY not configured");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { pendingId, sessionId } = await req.json();
    if (!pendingId) throw new Error("Missing pendingId");

    // Fetch the pending purchase row
    const { data: pending, error: fetchError } = await supabase
      .from("pending_purchases")
      .select("*")
      .eq("id", pendingId)
      .maybeSingle();

    if (fetchError || !pending) {
      throw new Error(`Pending purchase not found: ${fetchError?.message}`);
    }

    if (pending.completed) {
      // Already processed — just return the purchase data so the frontend can proceed
      return new Response(
        JSON.stringify({ success: true, alreadyCompleted: true, purchaseData: pending.purchase_data }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify the Stripe session is actually paid
    if (sessionId) {
      const stripeRes = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
        headers: { "Authorization": `Bearer ${stripeKey}` },
      });

      if (!stripeRes.ok) {
        const err = await stripeRes.json();
        throw new Error(`Stripe verification failed: ${JSON.stringify(err)}`);
      }

      const session = await stripeRes.json();
      if (session.payment_status !== "paid") {
        throw new Error(`Payment not completed. Status: ${session.payment_status}`);
      }
    }

    // Mark as completed immediately to prevent double-processing
    const { error: updateError } = await supabase
      .from("pending_purchases")
      .update({
        completed: true,
        completed_at: new Date().toISOString(),
        stripe_session_id: sessionId || null,
      })
      .eq("id", pendingId)
      .eq("completed", false);

    if (updateError) {
      throw new Error(`Failed to mark complete: ${updateError.message}`);
    }

    const { dogData, results, directives, selectedRituals, dogPhoto, productKey } = pending.purchase_data;

    // Enroll in program / record assessment
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    let dogNumber: number | null = null;

    try {
      const enrollRes = await fetch(`${supabaseUrl}/functions/v1/enroll-vitality-program`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: dogData.ownerEmail,
          dogName: dogData.name,
          tier: productKey,
          vitalityScore: results.score,
          archetype: results.archetype.name,
          packSync: results.packSync,
          pillarScores: results.phaseScores,
          phaseData: { dogData, results, directives, selectedRituals },
        }),
      });
      const enrollData = await enrollRes.json();
      if (enrollData.dogNumber) dogNumber = enrollData.dogNumber;
    } catch (e) {
      console.error("enroll-vitality-program failed:", e);
    }

    // Send immediate Blueprint email
    EdgeRuntime.waitUntil(
      fetch(`${supabaseUrl}/functions/v1/send-results-pdf`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dogData, results, directives, selectedRituals, dogPhoto, productKey }),
      }).catch(console.error)
    );

    // Queue 24-hour follow-up (protocol included with all purchases)
    EdgeRuntime.waitUntil(
      fetch(`${supabaseUrl}/functions/v1/queue-followup-email`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerEmail: dogData.ownerEmail,
          customerName: dogData.ownerName,
          dogName: dogData.name,
          productKey,
          purchaseData: { score: results.score, archetype: results.archetype.name },
        }),
      }).catch(console.error)
    );

    return new Response(
      JSON.stringify({ success: true, purchaseData: pending.purchase_data, dogNumber }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
