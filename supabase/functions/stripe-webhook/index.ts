import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

// Stripe sends webhooks as raw POST with a Stripe-Signature header.
// JWT verification must be disabled for this function.

Deno.serve(async (req: Request) => {
  try {
    if (req.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!webhookSecret) throw new Error("STRIPE_WEBHOOK_SECRET not configured");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY not configured");

    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return new Response("Missing Stripe-Signature header", { status: 400 });
    }

    const rawBody = await req.text();

    // Verify Stripe webhook signature (HMAC-SHA256)
    const isValid = await verifyStripeSignature(rawBody, signature, webhookSecret);
    if (!isValid) {
      return new Response("Invalid signature", { status: 400 });
    }

    const event = JSON.parse(rawBody);

    // Only handle checkout.session.completed
    if (event.type !== "checkout.session.completed") {
      return new Response(JSON.stringify({ received: true }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const session = event.data.object;

    // Only process paid sessions
    if (session.payment_status !== "paid") {
      return new Response(JSON.stringify({ received: true, skipped: "not paid" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const pendingId = session.metadata?.pending_id || session.client_reference_id;
    if (!pendingId) {
      console.error("Webhook: no pending_id in session metadata or client_reference_id", session.id);
      return new Response(JSON.stringify({ received: true, skipped: "no pending_id" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Fetch the pending purchase
    const { data: pending, error: fetchError } = await supabase
      .from("pending_purchases")
      .select("*")
      .eq("id", pendingId)
      .maybeSingle();

    if (fetchError || !pending) {
      console.error("Webhook: pending purchase not found", pendingId, fetchError?.message);
      // Return 200 so Stripe doesn't retry endlessly for a genuinely missing row
      return new Response(JSON.stringify({ received: true, skipped: "not found" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    if (pending.completed) {
      // Already processed (e.g. by the frontend redirect path) — idempotent, no-op
      return new Response(JSON.stringify({ received: true, alreadyCompleted: true }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Mark as completed atomically — only updates if still false, preventing race with frontend
    const { error: updateError } = await supabase
      .from("pending_purchases")
      .update({
        completed: true,
        completed_at: new Date().toISOString(),
        stripe_session_id: session.id,
      })
      .eq("id", pendingId)
      .eq("completed", false);

    if (updateError) {
      throw new Error(`Failed to mark complete: ${updateError.message}`);
    }

    const { dogData, results, directives, selectedRituals, dogPhoto, productKey } =
      pending.purchase_data;

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Enroll in program
    await fetch(`${supabaseUrl}/functions/v1/enroll-vitality-program`, {
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
    }).catch((e) => console.error("enroll-vitality-program failed:", e));

    // Send Blueprint email
    EdgeRuntime.waitUntil(
      fetch(`${supabaseUrl}/functions/v1/send-results-pdf`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dogData, results, directives, selectedRituals, dogPhoto, productKey }),
      }).catch((e) => console.error("send-results-pdf failed:", e))
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
      }).catch((e) => console.error("queue-followup-email failed:", e))
    );

    console.log("Webhook: completed purchase", pendingId, productKey);

    return new Response(JSON.stringify({ received: true, processed: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook error:", error);
    // Return 500 so Stripe retries
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});

// Verify Stripe webhook signature using Web Crypto API (no external deps needed)
async function verifyStripeSignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    // Parse t= and v1= from the signature header
    const parts = Object.fromEntries(
      signature.split(",").map((p) => p.split("=") as [string, string])
    );
    const timestamp = parts["t"];
    const expectedSig = parts["v1"];
    if (!timestamp || !expectedSig) return false;

    // Signed payload is "timestamp.rawBody"
    const signedPayload = `${timestamp}.${payload}`;

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const sigBytes = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(signedPayload)
    );

    const computed = Array.from(new Uint8Array(sigBytes))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return computed === expectedSig;
  } catch {
    return false;
  }
}
