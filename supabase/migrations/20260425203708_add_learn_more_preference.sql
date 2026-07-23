/*
  # Add Learn More Preference to Email Signups

  1. Modified Tables
    - `email_signups`
      - `learn_more` (boolean) - User consent to learn more about The Paya Method
      - `owner_name` (text, optional) - Name of the dog owner
      - `dog_name` (text, optional) - Name of the dog (for personalization)
      
  2. Purpose
    - Track which users are interested in learning more about The Paya Method
    - Store owner/dog names for personalization and follow-up communication
    - Optional fields for non-intrusive data capture
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'email_signups' AND column_name = 'learn_more'
  ) THEN
    ALTER TABLE email_signups ADD COLUMN learn_more boolean DEFAULT false;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'email_signups' AND column_name = 'owner_name'
  ) THEN
    ALTER TABLE email_signups ADD COLUMN owner_name text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'email_signups' AND column_name = 'dog_name'
  ) THEN
    ALTER TABLE email_signups ADD COLUMN dog_name text;
  END IF;
END $$;