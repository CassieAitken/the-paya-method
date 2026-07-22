import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface EnrollmentPayload {
  email: string;
  dogName: string;
  tier: 'basic' | 'program';
  vitalityScore: number;
  archetype: string;
  packSync: number;
  pillarScores: number[];
  phaseData: any;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const payload: EnrollmentPayload = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase credentials not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Create assessment record
    const { data: assessment, error: assessmentError } = await supabase
      .from("assessments")
      .insert({
        email: payload.email,
        dog_name: payload.dogName,
        vitality_score: payload.vitalityScore,
        archetype: payload.archetype,
        pack_sync: payload.packSync,
        pillar_scores: payload.pillarScores,
        phase_data: payload.phaseData,
      })
      .select("id")
      .maybeSingle();

    if (assessmentError || !assessment) {
      throw new Error(`Failed to create assessment: ${assessmentError?.message}`);
    }

    // Create program enrollment if tier is 'program'
    if (payload.tier === 'program') {
      const now = new Date();
      const day30 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      const day60 = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
      const day90 = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

      const { error: enrollmentError } = await supabase
        .from("program_enrollments")
        .insert({
          assessment_id: assessment.id,
          email: payload.email,
          tier: 'program',
          checkin_1_scheduled: day30.toISOString(),
          checkin_2_scheduled: day60.toISOString(),
          checkin_3_scheduled: day90.toISOString(),
        });

      if (enrollmentError) {
        throw new Error(`Failed to enroll in program: ${enrollmentError.message}`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        assessmentId: assessment.id,
        tier: payload.tier,
        message: payload.tier === 'program'
          ? 'Successfully enrolled in 3-month vitality program'
          : 'Assessment recorded successfully'
      }),
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
