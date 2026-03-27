-- Enable RLS on all tables
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE agenda_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;

-- SELECT: anyone can read (public data)
CREATE POLICY "Public read access" ON events FOR SELECT USING (true);
CREATE POLICY "Public read access" ON institutions FOR SELECT USING (true);
CREATE POLICY "Public read access" ON volunteers FOR SELECT USING (true);
CREATE POLICY "Public read access" ON event_volunteers FOR SELECT USING (true);
CREATE POLICY "Public read access" ON reviews FOR SELECT USING (true);
CREATE POLICY "Public read access" ON agenda_items FOR SELECT USING (true);
CREATE POLICY "Public read access" ON event_sponsors FOR SELECT USING (true);
CREATE POLICY "Public read access" ON sponsors FOR SELECT USING (true);

-- INSERT/UPDATE/DELETE: only authenticated users
CREATE POLICY "Auth insert" ON events FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Auth update" ON events FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Auth delete" ON events FOR DELETE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Auth insert" ON institutions FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Auth update" ON institutions FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Auth delete" ON institutions FOR DELETE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Auth insert" ON volunteers FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Auth update" ON volunteers FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Auth delete" ON volunteers FOR DELETE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Auth insert" ON event_volunteers FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Auth update" ON event_volunteers FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Auth delete" ON event_volunteers FOR DELETE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Auth insert" ON reviews FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Auth update" ON reviews FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Auth delete" ON reviews FOR DELETE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Auth insert" ON agenda_items FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Auth update" ON agenda_items FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Auth delete" ON agenda_items FOR DELETE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Auth insert" ON event_sponsors FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Auth update" ON event_sponsors FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Auth delete" ON event_sponsors FOR DELETE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Auth insert" ON sponsors FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Auth update" ON sponsors FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Auth delete" ON sponsors FOR DELETE USING (auth.uid() IS NOT NULL);
