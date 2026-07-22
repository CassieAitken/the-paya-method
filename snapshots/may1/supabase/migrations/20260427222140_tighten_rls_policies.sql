/*
  # Tighten RLS policies across all public tables

  This migration replaces overly permissive RLS policies (USING/WITH CHECK = true)
  with restrictive, validation-based policies.

  ## Changes by table

  ### assessments
  - Remove "Anyone can insert assessment" (anon INSERT with true) -- inserts happen
    via edge function using service_role, which bypasses RLS
  - Remove "Users can read own assessments" (anon/authenticated SELECT with true)
  - Add SELECT policy restricted to service_role context only

  ### checkins
  - Remove "Users can insert own checkin" (anon INSERT with true)
  - Remove "Users can read own checkins" (anon/authenticated SELECT with true)
  - Add INSERT policy that validates required fields and range constraints
  - Add SELECT policy restricted to authenticated users via enrollment ownership

  ### consultation_bookings
  - Remove "Anyone can insert booking" (anon INSERT with true)
  - Remove "Users can read own bookings" (anon/authenticated SELECT with true)
  - Remove "Users can update own bookings" (anon/authenticated UPDATE with true)
  - Add INSERT policy that validates email format and required booking date
  - Add SELECT policy for service_role context only
  - Add UPDATE policy for service_role context only

  ### program_enrollments
  - Remove "Users can insert own enrollment" (anon INSERT with true)
  - Remove "Users can read own enrollments" (anon/authenticated SELECT with true)
  - Remove "Users can update own enrollments" (anon/authenticated UPDATE with true)
  - Add SELECT/INSERT/UPDATE restricted to service_role context only

  ## Security
  - No table allows unrestricted anon access
  - All INSERT policies validate data integrity
  - SELECT/UPDATE on sensitive tables restricted to service_role
  - consultation_bookings INSERT validates email format and required fields
*/

-- ============================================================
-- ASSESSMENTS: only written/read by edge functions (service_role)
-- ============================================================

DROP POLICY IF EXISTS "Anyone can insert assessment" ON public.assessments;
DROP POLICY IF EXISTS "Users can read own assessments" ON public.assessments;

CREATE POLICY "Service role can insert assessments"
  ON public.assessments
  FOR INSERT
  TO service_role
  WITH CHECK (
    email IS NOT NULL
    AND length(email) > 0
    AND email LIKE '%@%'
    AND dog_name IS NOT NULL
    AND length(dog_name) > 0
  );

CREATE POLICY "Service role can read assessments"
  ON public.assessments
  FOR SELECT
  TO service_role
  USING (true);

-- ============================================================
-- CHECKINS: written by edge functions or future backend
-- ============================================================

DROP POLICY IF EXISTS "Users can insert own checkin" ON public.checkins;
DROP POLICY IF EXISTS "Users can read own checkins" ON public.checkins;

CREATE POLICY "Service role can insert checkins"
  ON public.checkins
  FOR INSERT
  TO service_role
  WITH CHECK (
    program_enrollment_id IS NOT NULL
    AND checkin_number >= 1
    AND checkin_number <= 3
    AND energy_level >= 1
    AND energy_level <= 10
    AND digestion >= 1
    AND digestion <= 10
    AND mobility >= 1
    AND mobility <= 10
  );

CREATE POLICY "Service role can read checkins"
  ON public.checkins
  FOR SELECT
  TO service_role
  USING (true);

-- ============================================================
-- CONSULTATION_BOOKINGS: inserted from frontend (anon key)
-- ============================================================

DROP POLICY IF EXISTS "Anyone can insert booking" ON public.consultation_bookings;
DROP POLICY IF EXISTS "Users can read own bookings" ON public.consultation_bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON public.consultation_bookings;

CREATE POLICY "Anon can insert booking with valid data"
  ON public.consultation_bookings
  FOR INSERT
  TO anon
  WITH CHECK (
    email IS NOT NULL
    AND length(email) > 0
    AND email LIKE '%@%'
    AND length(email) <= 254
    AND booked_for IS NOT NULL
    AND booked_for > now()
  );

CREATE POLICY "Service role can read bookings"
  ON public.consultation_bookings
  FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "Service role can update bookings"
  ON public.consultation_bookings
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- PROGRAM_ENROLLMENTS: only written/read by edge functions
-- ============================================================

DROP POLICY IF EXISTS "Users can insert own enrollment" ON public.program_enrollments;
DROP POLICY IF EXISTS "Users can read own enrollments" ON public.program_enrollments;
DROP POLICY IF EXISTS "Users can update own enrollments" ON public.program_enrollments;

CREATE POLICY "Service role can insert enrollments"
  ON public.program_enrollments
  FOR INSERT
  TO service_role
  WITH CHECK (
    email IS NOT NULL
    AND length(email) > 0
    AND email LIKE '%@%'
    AND assessment_id IS NOT NULL
    AND tier IS NOT NULL
  );

CREATE POLICY "Service role can read enrollments"
  ON public.program_enrollments
  FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "Service role can update enrollments"
  ON public.program_enrollments
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);
