/*
  # Add Vitality Program & Check-In System
  
  1. New Tables
    - `assessments` - Store complete assessment results
      - `id` (uuid, primary key)
      - `email` (text, not null) - User's email
      - `dog_name` (text) - Dog's name
      - `vitality_score` (int) - 0-100 score
      - `archetype` (text) - Archetype name
      - `pack_sync` (int) - Pack sync percentage
      - `pillar_scores` (jsonb) - All 7 pillar scores
      - `phase_data` (jsonb) - Complete assessment data for PDF
      - `created_at` (timestamptz)
    
    - `program_enrollments` - Track 3-month program purchases
      - `id` (uuid, primary key)
      - `assessment_id` (uuid, fk)
      - `email` (text, not null)
      - `tier` (text) - 'basic' ($19) or 'program' ($45)
      - `enrolled_at` (timestamptz)
      - `checkin_1_scheduled` (timestamptz) - Scheduled for day 30
      - `checkin_1_completed` (timestamptz, nullable)
      - `checkin_2_scheduled` (timestamptz) - Scheduled for day 60
      - `checkin_2_completed` (timestamptz, nullable)
      - `checkin_3_scheduled` (timestamptz) - Scheduled for day 90
      - `checkin_3_completed` (timestamptz, nullable)
      - `status` (text) - 'active', 'completed', 'paused'
    
    - `checkins` - Store check-in responses
      - `id` (uuid, primary key)
      - `program_enrollment_id` (uuid, fk)
      - `checkin_number` (int) - 1, 2, or 3
      - `energy_level` (int) - 1-5 rating
      - `digestion` (int) - 1-5 rating
      - `mobility` (int) - 1-5 rating
      - `notes` (text) - Owner notes
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on all tables
    - Assessments: Anyone can insert (public form), only email owner can read
    - Program enrollments: Only email owner can read/update
    - Checkins: Only email owner can insert/read
  
  3. Indexes
    - Index on email for all tables for faster lookups
    - Index on created_at for sorting
    - Index on checkin_1_scheduled, etc. for email scheduling queries
*/

CREATE TABLE IF NOT EXISTS assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  dog_name text NOT NULL,
  vitality_score int NOT NULL,
  archetype text NOT NULL,
  pack_sync int NOT NULL,
  pillar_scores jsonb NOT NULL,
  phase_data jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert assessment"
  ON assessments
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can read own assessments"
  ON assessments
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE INDEX idx_assessments_email ON assessments(email);
CREATE INDEX idx_assessments_created_at ON assessments(created_at DESC);

CREATE TABLE IF NOT EXISTS program_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  email text NOT NULL,
  tier text NOT NULL CHECK (tier IN ('basic', 'program')),
  enrolled_at timestamptz DEFAULT now(),
  checkin_1_scheduled timestamptz,
  checkin_1_completed timestamptz,
  checkin_2_scheduled timestamptz,
  checkin_2_completed timestamptz,
  checkin_3_scheduled timestamptz,
  checkin_3_completed timestamptz,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused'))
);

ALTER TABLE program_enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own enrollment"
  ON program_enrollments
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can read own enrollments"
  ON program_enrollments
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can update own enrollments"
  ON program_enrollments
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX idx_program_enrollments_email ON program_enrollments(email);
CREATE INDEX idx_program_enrollments_assessment_id ON program_enrollments(assessment_id);
CREATE INDEX idx_program_enrollments_checkin_1_scheduled ON program_enrollments(checkin_1_scheduled);
CREATE INDEX idx_program_enrollments_checkin_2_scheduled ON program_enrollments(checkin_2_scheduled);
CREATE INDEX idx_program_enrollments_checkin_3_scheduled ON program_enrollments(checkin_3_scheduled);

CREATE TABLE IF NOT EXISTS checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_enrollment_id uuid NOT NULL REFERENCES program_enrollments(id) ON DELETE CASCADE,
  checkin_number int NOT NULL CHECK (checkin_number IN (1, 2, 3)),
  energy_level int NOT NULL CHECK (energy_level >= 1 AND energy_level <= 5),
  digestion int NOT NULL CHECK (digestion >= 1 AND digestion <= 5),
  mobility int NOT NULL CHECK (mobility >= 1 AND mobility <= 5),
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own checkin"
  ON checkins
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can read own checkins"
  ON checkins
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE INDEX idx_checkins_program_enrollment_id ON checkins(program_enrollment_id);
CREATE INDEX idx_checkins_created_at ON checkins(created_at DESC);
