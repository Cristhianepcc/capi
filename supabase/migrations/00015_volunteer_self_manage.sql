-- Allow volunteers to update their own event_volunteer records
CREATE POLICY "Volunteer self update" ON event_volunteers
  FOR UPDATE USING (
    auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM volunteers
      WHERE volunteers.id = event_volunteers.volunteer_id
      AND volunteers.user_id = auth.uid()
    )
  );

-- Allow volunteers to delete their own pending applications
CREATE POLICY "Volunteer self delete" ON event_volunteers
  FOR DELETE USING (
    auth.uid() IS NOT NULL
    AND status = 'pendiente'
    AND EXISTS (
      SELECT 1 FROM volunteers
      WHERE volunteers.id = event_volunteers.volunteer_id
      AND volunteers.user_id = auth.uid()
    )
  );
