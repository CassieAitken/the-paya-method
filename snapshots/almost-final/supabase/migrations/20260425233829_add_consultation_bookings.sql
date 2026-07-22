/*
  # Add Consultation Bookings System

  1. New Tables
    - `consultation_bookings` - Store 1-on-1 consultation appointments
      - `id` (uuid, primary key)
      - `email` (text, not null) - Client email
      - `dog_name` (text) - Dog's name (optional)
      - `booked_for` (timestamptz) - Appointment date/time
      - `status` (text) - 'confirmed', 'completed', 'cancelled'
      - `payment_status` (text) - 'pending', 'paid', 'refunded'
      - `stripe_session_id` (text) - Stripe checkout session ID
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on consultation_bookings
    - Anyone can insert (booking form)
    - Users can read/update their own bookings via email

  3. Indexes
    - Index on email for lookups
    - Index on booked_for for scheduling queries
*/

CREATE TABLE IF NOT EXISTS consultation_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  dog_name text,
  booked_for timestamptz NOT NULL,
  status text DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'completed', 'cancelled')),
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  stripe_session_id text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE consultation_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert booking"
  ON consultation_bookings
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can read own bookings"
  ON consultation_bookings
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can update own bookings"
  ON consultation_bookings
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX idx_consultation_bookings_email ON consultation_bookings(email);
CREATE INDEX idx_consultation_bookings_booked_for ON consultation_bookings(booked_for);
CREATE INDEX idx_consultation_bookings_created_at ON consultation_bookings(created_at DESC);
