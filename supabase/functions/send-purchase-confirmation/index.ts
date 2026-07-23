import "jsr:@supabase/functions-js/edge-runtime.d.ts";

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
    const { customerEmail, customerName, dogName, productKey, dogNumber } = await req.json();

    if (!customerEmail || !dogName || !productKey) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) throw new Error("RESEND_API_KEY not configured");

    const dogNum = dogNumber ? String(dogNumber).padStart(3, '0') : '001';
    const pPoss = 'their';

    const emailHtml = generateConfirmationEmail(dogName, dogNum, pPoss);

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "The Paya Method <cassie@send.payalabs.net>",
        reply_to: "payalabs01@gmail.com",
        to: [customerEmail],
        bcc: ["payalabs01@gmail.com"],
        subject: `${dogName}'s Vitality Badge is here — Dog #${dogNum}`,
        html: emailHtml,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json();
      throw new Error(`Email send failed: ${JSON.stringify(errorData)}`);
    }

    const emailData = await emailResponse.json();

    return new Response(
      JSON.stringify({ success: true, data: emailData }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function generateConfirmationEmail(dogName: string, dogNum: string, pPoss: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${dogName}'s Vitality Badge</title>
</head>
<body style="margin:0;padding:0;background-color:#FDFBF7;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FDFBF7;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr><td style="padding:0 0 32px;text-align:center;">
            <p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:19px;font-weight:500;color:#2A2421;margin:0;">The Paya Method</p>
          </td></tr>

          <!-- Badge Intro Copy -->
          <tr>
            <td style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #E8E2D9;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="padding:36px 32px 24px;">
                  <p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:24px;color:#4B1D5C;line-height:1.4;margin:0 0 20px;font-weight:500;">
                    Meet Dog #${dogNum}.
                  </p>
                  <p style="font-size:15px;color:#5C534E;line-height:1.85;margin:0 0 16px;">
                    ${dogName}'s Dog Biology Blueprint™ is complete &mdash; ${pPoss} blueprint is below. ${dogName}'s badge is yours to keep, and to share.
                  </p>
                  <p style="font-size:15px;color:#5C534E;line-height:1.85;margin:0 0 16px;">
                    If you post it, tag <strong>@oldhippiedogmom</strong> so we can welcome ${dogName} properly.
                  </p>
                  <p style="font-size:14px;color:#4B1D5C;line-height:1.85;margin:0;font-style:italic;font-family:'Cormorant Garamond',Georgia,serif;">
                    &mdash; Love Them Longer
                  </p>
                </td></tr>

                <!-- Divider -->
                <tr><td style="padding:0 32px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="border-top:1px solid #E8E2D9;"></td></tr></table>
                </td></tr>

                <tr><td style="padding:24px 32px 28px;">
                  <p style="font-family:'Inter',Helvetica,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#0A4682;font-weight:600;margin:0 0 12px;">While You Wait</p>
                  <p style="font-size:15px;color:#5C534E;line-height:1.85;margin:0 0 16px;">Your 30-day action guide for <strong>${dogName}</strong> is being prepared. It will arrive in your inbox within 24 hours.</p>
                  <p style="font-size:15px;color:#5C534E;line-height:1.85;margin:0 0 16px;">Keep your Blueprint open &mdash; find your two lowest Biology Markers. Those are your priority markers for the next 30 days.</p>
                  <p style="font-size:15px;color:#5C534E;line-height:1.85;margin:0 0 24px;">We've got you. And we've got ${dogName}.</p>
                  <p style="font-family:'Inter',Helvetica,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#0A4682;font-weight:600;margin:0;">Cassie &middot; The Paya Method</p>
                </td></tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="text-align:center;padding:28px 0 0;">
              <p style="font-size:11px;color:#8A7F72;margin:0;line-height:1.6;font-style:italic;">For educational purposes. Always consult your veterinarian<br>before making changes to your dog's routine or nutrition.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
