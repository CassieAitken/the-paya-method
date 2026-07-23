import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RequestPayload {
  email: string;
  dogName: string;
  purchaseDate?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { email, dogName, purchaseDate }: RequestPayload = await req.json();

    if (!email || !dogName) {
      throw new Error("Missing required fields: email, dogName");
    }

    const currentDate = purchaseDate || new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 90);
    const expiryFormatted = expiryDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    const emailHtml = generateReceiptHTML(dogName, currentDate, expiryFormatted);

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "The Paya Method <cassie@send.payalabs.net>",
        reply_to: "payalabs01@gmail.com",
        to: [email],
        bcc: ["payalabs01@gmail.com"],
        subject: `Confirmation: Your Deep-Dive with Cassie & ${dogName}`,
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
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});

function generateReceiptHTML(dogName: string, purchaseDate: string, expiryDate: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Consultation Confirmation</title>
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

          <!-- Main Card -->
          <tr>
            <td style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.05);">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">

                <!-- Greeting -->
                <tr><td style="padding:36px 32px 24px;">
                  <p style="font-size:16px;color:#5C534E;line-height:1.85;margin:0 0 16px;">We are so excited to meet <strong>${dogName}</strong>. This confirms your consultation purchase on <strong>${purchaseDate}</strong>.</p>
                </td></tr>

                <!-- Divider -->
                <tr><td style="padding:0 32px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="border-top:1px solid #E8E2D9;"></td></tr></table>
                </td></tr>

                <!-- How to Schedule -->
                <tr><td style="padding:28px 32px 24px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#4B1D5C;border-radius:10px;">
                    <tr><td style="padding:28px 24px;text-align:center;">
                      <p style="font-family:'Inter',Helvetica,sans-serif;font-size:9px;text-transform:uppercase;letter-spacing:2.5px;color:#9AB8C4;margin:0 0 14px;">How to Schedule Your Session</p>
                      <p style="font-size:16px;line-height:1.8;color:#E4D9E8;margin:0 0 14px;font-weight:300;">Reply to this email with <strong style="color:#FDFBF7;">3 preferred dates and times</strong> that work for you.</p>
                      <p style="font-size:14px;line-height:1.7;color:#C9B9CE;margin:0;">I will personally get back to you within 24 hours to lock in our time.</p>
                    </td></tr>
                  </table>
                </td></tr>

                <!-- Divider -->
                <tr><td style="padding:0 32px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="border-top:1px solid #E8E2D9;"></td></tr></table>
                </td></tr>

                <!-- Session Details -->
                <tr><td style="padding:24px 32px 32px;">
                  <p style="font-family:'Inter',Helvetica,sans-serif;font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#0A4682;margin:0 0 14px;">Session Details</p>
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F8F5EE;border-radius:8px;">
                    <tr><td style="padding:18px 20px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding:6px 0;font-size:13px;color:#0A4682;">Type</td>
                          <td style="padding:6px 0;text-align:right;font-size:13px;color:#4B1D5C;font-weight:600;">Practitioner Deep-Dive</td>
                        </tr>
                        <tr>
                          <td style="padding:6px 0;font-size:13px;color:#0A4682;">Purchased</td>
                          <td style="padding:6px 0;text-align:right;font-size:13px;color:#4B1D5C;">${purchaseDate}</td>
                        </tr>
                        <tr>
                          <td style="padding:6px 0;font-size:13px;color:#0A4682;">Valid Until</td>
                          <td style="padding:6px 0;text-align:right;font-size:13px;color:#4B1D5C;">${expiryDate}</td>
                        </tr>
                      </table>
                    </td></tr>
                  </table>
                  <p style="font-size:12px;color:#0A4682;font-style:italic;line-height:1.7;margin:14px 0 0;">This session is valid for 90 days from purchase.</p>
                </td></tr>

                <!-- Divider -->
                <tr><td style="padding:0 32px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="border-top:1px solid #E8E2D9;"></td></tr></table>
                </td></tr>

                <!-- Sign-off -->
                <tr><td style="padding:24px 32px 32px;">
                  <p style="font-size:15px;font-style:italic;color:#5C534E;line-height:1.8;margin:0 0 16px;">Looking forward to navigating ${dogName}'s unique biological profile together.</p>
                  <p style="font-family:'Inter',Helvetica,sans-serif;font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#8A7F72;margin:0;">Cassie &middot; The Paya Method</p>
                </td></tr>

              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="text-align:center;padding:28px 0 0;">
              <p style="font-family:'Inter',Helvetica,sans-serif;font-size:8px;text-transform:uppercase;letter-spacing:2px;color:#8A7F72;margin:0;">payalabs.net</p>
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
