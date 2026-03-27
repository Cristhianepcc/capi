-- RLS policies for event_collaborators (table created in 00016)

-- Anyone authenticated can read collaborators for events they own, collaborate on, or are admin
CREATE POLICY "Read collaborators" ON event_collaborators
  FOR SELECT USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM events WHERE events.id = event_collaborators.event_id AND events.created_by = auth.uid())
    OR EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Only event owner or admin can insert collaborators
CREATE POLICY "Insert collaborators" ON event_collaborators
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM events WHERE events.id = event_collaborators.event_id AND events.created_by = auth.uid())
    OR EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Only event owner or admin can delete collaborators
CREATE POLICY "Delete collaborators" ON event_collaborators
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM events WHERE events.id = event_collaborators.event_id AND events.created_by = auth.uid())
    OR EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );
