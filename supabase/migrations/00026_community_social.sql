-- Add social media and branding fields to communities
ALTER TABLE communities ADD COLUMN IF NOT EXISTS instagram text;
ALTER TABLE communities ADD COLUMN IF NOT EXISTS twitter text;
ALTER TABLE communities ADD COLUMN IF NOT EXISTS linkedin text;
ALTER TABLE communities ADD COLUMN IF NOT EXISTS github text;
ALTER TABLE communities ADD COLUMN IF NOT EXISTS discord text;
