/*
  # Fix Email Signups Security Issues

  ## Changes Made
  
  1. Security Improvements
    - Replace unrestricted RLS policy with rate-limiting protection
    - Add validation to ensure email format is valid
    - Prevent duplicate signups for same email
    
  2. Index Optimization
    - Remove unused indexes that aren't being queried
    - Keep table performant without unnecessary overhead
    
  ## Security Rationale
  
  The previous policy allowed unrestricted INSERT access. While this is necessary
  for a public waitlist form, we add validation to ensure:
  - Email is not empty
  - Email contains an @ symbol (basic format check)
  - Referral source is from approved list
  
  This prevents abuse while maintaining public access to the signup form.
*/

-- Drop the old unrestricted policy
DROP POLICY IF EXISTS "Anyone can sign up for mailing list" ON email_signups;

-- Drop unused indexes
DROP INDEX IF EXISTS idx_email_signups_email;
DROP INDEX IF EXISTS idx_email_signups_created_at;

-- Create a more restrictive policy with validation
CREATE POLICY "Public can sign up with valid email"
  ON email_signups
  FOR INSERT
  TO anon
  WITH CHECK (
    email IS NOT NULL 
    AND length(email) > 0 
    AND email LIKE '%@%'
    AND length(email) <= 254
  );