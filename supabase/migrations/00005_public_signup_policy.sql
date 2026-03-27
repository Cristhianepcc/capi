-- Allow anonymous users to insert volunteers (signup)
CREATE POLICY "Anon insert volunteers" ON volunteers
  FOR INSERT
  WITH CHECK (true);

-- Allow anonymous users to insert event_volunteers with status 'pendiente'
CREATE POLICY "Anon insert event_volunteers" ON event_volunteers
  FOR INSERT
  WITH CHECK (status = 'pendiente');
