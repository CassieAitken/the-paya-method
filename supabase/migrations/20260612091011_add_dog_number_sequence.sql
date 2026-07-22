-- Add sequential dog number to assessments
CREATE SEQUENCE IF NOT EXISTS dog_number_seq START WITH 7;
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS dog_number integer UNIQUE DEFAULT nextval('dog_number_seq');

-- Backfill existing rows
UPDATE assessments SET dog_number = sub.rn
FROM (SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) AS rn FROM assessments) sub
WHERE assessments.id = sub.id AND assessments.dog_number IS NULL;
