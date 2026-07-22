/*
  # Email Sequence Queue System

  1. New Extensions
    - `pg_cron` — Job scheduler for PostgreSQL (fires every 15 minutes)
    - `pg_net` — Async HTTP requests from within Postgres

  2. New Tables
    - `email_sequence_queue`
      - `id` (uuid, primary key)
      - `customer_email` (text, not null) — recipient address
      - `customer_name` (text, not null) — recipient name
      - `dog_name` (text, not null) — the dog associated with the purchase
      - `product_key` (text, not null) — identifies which product was purchased (e.g., 'consultation', 'vitality_program')
      - `purchase_data` (jsonb, default '{}') — any additional context needed for email templates
      - `immediate_sent_at` (timestamptz) — when the first email was sent
      - `followup_due_at` (timestamptz, not null) — when the follow-up should fire (purchase time + 24h)
      - `followup_sent_at` (timestamptz) — when the follow-up was actually sent (null = not yet sent)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  3. Security
    - RLS enabled on `email_sequence_queue`
    - Only service_role (edge functions) can insert/read/update — no public or authenticated access
    - This table is internal infrastructure, not user-facing

  4. Cron Job
    - `process_email_followups` runs every 15 minutes
    - Calls the `send-followup-email` Edge Function via pg_net for each due row

  5. Important Notes
    - The cron job only processes rows where followup_due_at <= now() AND followup_sent_at IS NULL
    - Rows are marked with followup_sent_at immediately to prevent double-sends
    - The Edge Function handles actual email delivery via Resend
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Create the email sequence queue table
CREATE TABLE IF NOT EXISTS email_sequence_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_email text NOT NULL,
  customer_name text NOT NULL,
  dog_name text NOT NULL,
  product_key text NOT NULL,
  purchase_data jsonb NOT NULL DEFAULT '{}',
  immediate_sent_at timestamptz,
  followup_due_at timestamptz NOT NULL,
  followup_sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Index for the cron query: find unsent follow-ups that are due
CREATE INDEX IF NOT EXISTS idx_email_queue_followup_pending
  ON email_sequence_queue (followup_due_at)
  WHERE followup_sent_at IS NULL;

-- Enable RLS
ALTER TABLE email_sequence_queue ENABLE ROW LEVEL SECURITY;

-- No public or authenticated policies — only service_role can access this table.
-- Edge Functions using the service role key bypass RLS automatically.
-- We add an explicit policy for service_role for clarity.
CREATE POLICY "Service role full access"
  ON email_sequence_queue
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Schedule the cron job to run every 15 minutes
SELECT cron.schedule(
  'process_email_followups',
  '*/15 * * * *',
  $$
  SELECT net.http_post(
    url := current_setting('app.settings.supabase_url') || '/functions/v1/send-followup-email',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
    ),
    body := '{}'::jsonb
  );
  $$
);
