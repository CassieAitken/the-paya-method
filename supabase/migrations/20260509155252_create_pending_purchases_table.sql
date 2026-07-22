/*
  # Create pending_purchases table

  1. New Tables
    - `pending_purchases`
      - `id` (uuid, primary key) - referenced by Stripe session metadata
      - `product_key` (text) - which product was purchased
      - `email` (text) - customer email
      - `dog_name` (text) - dog's name
      - `purchase_data` (jsonb) - full session state to restore after redirect
      - `completed` (boolean) - whether purchase was finalized
      - `completed_at` (timestamptz) - when it was finalized
      - `stripe_session_id` (text) - Stripe checkout session ID
      - `created_at` (timestamptz) - when row was created

  2. Security
    - Enable RLS on `pending_purchases` table
    - Add policy for service role access only (edge functions use service role key)
*/

CREATE TABLE IF NOT EXISTS pending_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_key text NOT NULL,
  email text NOT NULL,
  dog_name text NOT NULL,
  purchase_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  stripe_session_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE pending_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage pending purchases"
  ON pending_purchases
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
