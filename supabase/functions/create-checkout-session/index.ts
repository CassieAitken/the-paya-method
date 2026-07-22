import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const PRICES: Record<string, { amount: number; name: string }> = {
  vitality_blueprint: { amount: 4900, name: "The Dog Biology Blueprint™" },
  blueprint_in_motion: { amount: 1900, name: "The 30-Day Protocol" },
  complete_vitality_system: { amount: 3900, name: "The Complete Vitality System" },
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

    const { productKey, dogData, results, directives, selectedRituals, dogPhoto } = await req.json();

    const price = PRICES[productKey];
    if (!price) throw new Error(`Unknown product key: ${productKey}`);

    // Persist pre-checkout state so we can recover it after Stripe redirect
    const { data: pending, error: insertError } = await supabase
      .from("pending_purchases")
      .insert({
        product_key: productKey,
        email: dogData.ownerEmail,
        dog_name: dogData.name,
        purchase_data: { dogData, results, directives, selectedRituals, dogPhoto, productKey },
      })
      .select("id")
      .maybeSingle();

    if (insertError || !pending) {
      throw new Error(`Failed to save pending purchase: ${insertError?.message}`);
    }

    const origin = req.headers.get("origin") || "https://payalabs.net";

    const PAYMENT_LINKS: Record<string, string> = {
      vitality_blueprint: "https://buy.stripe.com/dRm9AU9ef5nG9Wj5Hy6wE00",
    };

    const paymentLink = PAYMENT_LINKS[productKey];

    if (paymentLink) {
      const url = `${paymentLink}?client_reference_id=${pending.id}&prefilled_email=${encodeURIComponent(dogData.ownerEmail)}`;
      return new Response(
        JSON.stringify({ url, sessionId: null }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const successUrl = `${origin}?stripe_success=1&pending_id=${pending.id}&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}?stripe_cancel=1`;

    const stripeBody = new URLSearchParams({
      "payment_method_types[]": "card",
      "mode": "payment",
      "line_items[0][price_data][currency]": "usd",
      "line_items[0][price_data][product_data][name]": price.name,
      "line_items[0][price_data][product_data][description]": `${dogData.name}'s personalized Dog Biology Blueprint™`,
      "line_items[0][price_data][unit_amount]": String(price.amount),
      "line_items[0][quantity]": "1",
      "customer_email": dogData.ownerEmail,
      "client_reference_id": pending.id,
      "success_url": successUrl,
      "cancel_url": cancelUrl,
      "metadata[pending_id]": pending.id,
      "metadata[product_key]": productKey,
      "metadata[dog_name]": dogData.name,
      "metadata[owner_email]": dogData.ownerEmail,
    });

    const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: stripeBody.toString(),
    });

    if (!stripeRes.ok) {
      const err = await stripeRes.json();
      throw new Error(`Stripe error: ${JSON.stringify(err)}`);
    }

    const session = await stripeRes.json();

    return new Response(
      JSON.stringify({ url: session.url, sessionId: session.id }),
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
