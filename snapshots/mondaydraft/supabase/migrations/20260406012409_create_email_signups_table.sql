/*
  # Create Email Signups Table

  1. New Tables
    - `email_signups`
      - `id` (uuid, primary key) - Unique identifier for each signup
      - `email` (text, unique, not null) - Email address of the subscriber
      - `created_at` (timestamptz) - Timestamp when the signup occurred
      - `referral_source` (text) - Optional field to track where signup came from
      
  2. Security
    - Enable RLS on `email_signups` table
    - Add policy for inserting new signups (public access for form submission)
    - No read policies - only admins should view the list
    
  3. Indexes
    - Index on email for faster lookups
    - Index on created_at for sorting by date
*/

CREATE TABLE IF NOT EXISTS email_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  referral_source text DEFAULT 'landing_page'
);

ALTER TABLE email_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can sign up for mailing list"
  ON email_signups
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_email_signups_email ON email_signups(email);
CREATE INDEX IF NOT EXISTS idx_email_signups_created_at ON email_signups(created_at DESC);
