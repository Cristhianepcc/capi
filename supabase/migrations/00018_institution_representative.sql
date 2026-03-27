-- contact_user_id and index already created in 00016

-- Allow institution representative to update their institution
DROP POLICY IF EXISTS "Owners or admin manage institutions" ON institutions;
CREATE POLICY "Owners or admin or rep manage institutions" ON institutions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM events WHERE events.institution_id = institutions.id AND events.created_by = auth.uid()
    )
    OR institutions.contact_user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );
