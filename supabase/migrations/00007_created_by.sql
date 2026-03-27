-- Add created_by column to events for ownership verification
ALTER TABLE events ADD COLUMN created_by uuid REFERENCES auth.users(id);

-- Update RLS policies for events to enforce ownership on UPDATE/DELETE
DROP POLICY IF EXISTS "Auth update" ON events;
DROP POLICY IF EXISTS "Auth delete" ON events;

CREATE POLICY "Owner update" ON events FOR UPDATE
  USING (auth.uid() IS NOT NULL AND (created_by IS NULL OR created_by = auth.uid()));

CREATE POLICY "Owner delete" ON events FOR DELETE
  USING (auth.uid() IS NOT NULL AND (created_by IS NULL OR created_by = auth.uid()));
