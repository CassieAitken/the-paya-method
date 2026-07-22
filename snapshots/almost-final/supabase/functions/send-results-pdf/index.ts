import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

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
    archetype: {
      name: string;
      analysis: string;
    };
    packSync: number;
    phaseScores: number[];
  };
  directives: Array<{
    label: string;
    actionText: string;
    phaseTitle: string;
    weeklyPlan?: string[];
  }>;
  selectedRituals: Record<string, string>;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { dogData, results, directives }: RequestPayload = await req.json();

    const emailHtml = generateEmailHTML(dogData, results, directives);

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
        from: "Cassie at PayaLabs <hello@send.payalabs.net>",
        reply_to: "payalabs01@gmail.com",
        to: [dogData.ownerEmail],
        bcc: ["payalabs01@gmail.com"],
        subject: `The Vitality Blueprint for ${dogData.name}: The Path Starts Here`,
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

function generateEmailHTML(dogData: any, results: any, directives: any[]): string {
  const foundations = [
    { label: "The Internal Battery", endpointDesc: "The fuel that powers everything else" },
    { label: "The Restorative Cycle", endpointDesc: "Deep quiet for deep healing" },
    { label: "The Biological Shield", endpointDesc: "Every chemical you remove matters" },
    { label: "The Pack Bond", endpointDesc: "Your calm is their medicine" },
    { label: "Ancestral Cognition", endpointDesc: "Activating the Instinctual Mind" },
    { label: "Biomechanical Flow", endpointDesc: "The Dialogue of Motion" },
    { label: "Physiological Harmony", endpointDesc: "Reading the Biological Map" }
  ];

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${dogData.name}'s Vitality Blueprint</title>
  <style>
    body {
      font-family: Georgia, serif;
      line-height: 1.6;
      color: #292524;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
      background-color: #F9F7F4;
    }
    .header {
      text-align: center;
      padding: 40px 0;
      border-bottom: 2px solid #d6d3d1;
      margin-bottom: 40px;
    }
    .logo {
      font-size: 32px;
      font-weight: bold;
      color: #44403c;
      margin-bottom: 20px;
    }
    .archetype {
      font-size: 48px;
      color: #1c1917;
      margin: 20px 0;
    }
    .score-box {
      background: white;
      border: 1px solid #d6d3d1;
      padding: 30px;
      text-align: center;
      margin: 30px 0;
    }
    .score {
      font-size: 72px;
      color: #1c1917;
      font-weight: 300;
    }
    .analysis {
      background: #ffffff;
      padding: 30px;
      margin: 30px 0;
      border-left: 3px solid #78716c;
      font-size: 16px;
      line-height: 1.75;
    }
    .pillar {
      background: white;
      padding: 20px;
      margin: 20px 0;
      border: 1px solid #d6d3d1;
    }
    .pillar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      font-weight: bold;
      color: #44403c;
    }
    .progress-bar {
      width: 100%;
      height: 8px;
      background: #e7e5e4;
      border-radius: 4px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      background: #57534e;
    }
    .directive {
      background: white;
      padding: 25px;
      margin: 20px 0;
      border: 1px solid #d6d3d1;
    }
    .directive-number {
      display: inline-block;
      width: 32px;
      height: 32px;
      background: #f5f5f4;
      border-radius: 50%;
      text-align: center;
      line-height: 32px;
      font-weight: bold;
      margin-right: 12px;
    }
    .footer {
      text-align: center;
      padding: 40px 0;
      margin-top: 60px;
      border-top: 2px solid #d6d3d1;
      font-size: 14px;
      color: #78716c;
    }
    h2 {
      font-size: 32px;
      color: #292524;
      margin: 40px 0 20px;
      border-bottom: 1px solid #e7e5e4;
      padding-bottom: 15px;
    }
    h3 {
      font-size: 24px;
      color: #44403c;
      margin: 20px 0 10px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">PayaLabs</div>
    <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #78716c; margin-bottom: 24px;">The Vitality Blueprint</p>
    <h1 class="archetype">${results.archetype.name}</h1>
    <p style="font-size: 18px; color: #57534e;">${dogData.name}'s Roadmap to Peak Vitality</p>
  </div>

  <p style="font-size: 17px; line-height: 1.85; color: #44403c; text-align: center; max-width: 600px; margin: 0 auto 40px; padding: 0 20px;">
    We've finalized the analysis. Here is the roadmap we built to help <strong>${dogData.name}</strong> maintain peak vitality and long-term spark.
  </p>

  <div class="score-box">
    <div class="score">${results.score}<span style="font-size: 36px; color: #a8a29e;">/100</span></div>
    <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #57534e; margin: 10px 0 0;">Vitality Index</p>
  </div>

  <div style="background: white; border: 1px solid #d6d3d1; padding: 20px 30px; margin: 20px 0; display: flex; justify-content: space-between; align-items: center;">
    <div>
      <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #78716c; margin: 0 0 5px;">Human-Dog Sync</p>
      <p style="font-size: 36px; color: #1c1917; font-weight: 300; margin: 0;">${results.packSync}%</p>
    </div>
    <div style="flex: 1; max-width: 200px; margin-left: 30px;">
      <div style="width: 100%; height: 8px; background: #e7e5e4; border-radius: 4px; overflow: hidden;">
        <div style="height: 100%; background: #57534e; width: ${results.packSync}%; border-radius: 4px;"></div>
      </div>
    </div>
  </div>

  <div class="analysis">
    <h3>Our Read</h3>
    <p>${results.archetype.analysis}</p>
  </div>

  <h2>The Seven Pillars</h2>
  ${foundations.map((f, i) => `
    <div class="pillar">
      <div class="pillar-header">
        <span>${f.label}</span>
        <span>${results.phaseScores[i]}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${results.phaseScores[i]}%"></div>
      </div>
      <p style="font-size: 13px; color: #78716c; margin-top: 10px;">${f.endpointDesc}</p>
    </div>
  `).join('')}

  <h2>Your 30-Day Protocol</h2>
  <p style="font-size: 16px; color: #57534e; margin-bottom: 30px;">
    We isolated the <strong>${directives.length} highest-leverage directives</strong> for ${dogData.name}'s profile. Ordered by biological impact. Start at the top. Work down.
  </p>

  ${directives.map((d, i) => `
    <div class="directive">
      <div style="display: flex; align-items: start; gap: 15px;">
        <span class="directive-number">${String(i + 1).padStart(2, '0')}</span>
        <div style="flex: 1;">
          <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #78716c; margin: 0 0 5px;">
            ${d.phaseTitle.split('—')[0]}
          </p>
          <h3 style="margin: 0 0 10px;">${d.label}</h3>
          <div style="background: #1c1917; color: #ffffff; padding: 18px; border-radius: 6px; margin: 0 0 15px;">
            <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #a8a29e; margin: 0 0 8px;">Our Directive</p>
            <p style="color: #ffffff; font-size: 14px; margin: 0; line-height: 1.7;">${d.actionText}</p>
          </div>
          ${d.weeklyPlan && d.weeklyPlan.length > 0 ? `
          <div style="border: 1px solid #e7e5e4; border-radius: 6px; overflow: hidden; margin: 0 0 15px;">
            <div style="background: #f5f5f4; padding: 12px 18px; border-bottom: 1px solid #e7e5e4;">
              <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #78716c; margin: 0; font-weight: 600;">Your 4-Week Path</p>
            </div>
            ${d.weeklyPlan.map((week: string, wi: number) => `
            <div style="padding: 14px 18px; border-bottom: ${wi < 3 ? '1px solid #f5f5f4' : 'none'};">
              <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: #a8a29e; margin: 0 0 6px; font-weight: 600;">Week ${wi + 1}</p>
              <p style="color: #57534e; font-size: 13px; margin: 0; line-height: 1.7;">${week}</p>
            </div>
            `).join('')}
          </div>
          ` : ''}
        </div>
      </div>
    </div>
  `).join('')}

  <div class="analysis">
    <h3>The Mirror</h3>
    <p style="border-left: 2px solid #a8a29e; padding-left: 20px; font-style: italic; color: #57534e; margin-bottom: 20px;">
      "${dogData.reflection || 'I notice changes in my dog based on my daily energy and routine.'}"
    </p>
    <p>
      <strong>You are the single most powerful variable in ${dogData.name}'s biology.</strong> Your baseline stress dictates ${dogData.name}'s ability to enter parasympathetic repair. When you manage your own cortisol, you lower ${dogData.name}'s systemic inflammation — biologically authorizing them to heal.
    </p>
  </div>

  <div style="text-align: center; padding: 50px 20px 30px; margin-top: 50px; border-top: 2px solid #d6d3d1;">
    <p style="font-size: 18px; font-style: italic; color: #44403c; max-width: 500px; margin: 0 auto 30px; line-height: 1.8;">
      You already know how to love this dog. Now you have the map to love them with <strong>precision</strong>.
    </p>
    <p style="font-size: 12px; color: #a8a29e; margin-bottom: 8px;">We've got you. And we've got ${dogData.name}.</p>
    <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #a8a29e;">PayaLabs | 2026</p>
  </div>

  <div class="footer">
    <p style="font-style: italic; max-width: 700px; margin-left: auto; margin-right: auto; line-height: 1.8;">
      For educational purposes. Always consult your veterinarian before making significant changes to your dog's routine or nutrition.
    </p>
  </div>
</body>
</html>
  `.trim();
}
