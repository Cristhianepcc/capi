-- ============================================
-- Create event_collaborators table first
-- (needed by policies below)
-- ============================================
CREATE TABLE IF NOT EXISTS event_collaborators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  permission_level text NOT NULL DEFAULT 'editor'
    CHECK (permission_level IN ('editor', 'viewer')),
  invited_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_event_collaborators_event ON event_collaborators(event_id);
CREATE INDEX IF NOT EXISTS idx_event_collaborators_user ON event_collaborators(user_id);

ALTER TABLE event_collaborators ENABLE ROW LEVEL SECURITY;

-- Add contact_user_id to institutions (needed by policies below)
ALTER TABLE institutions ADD COLUMN IF NOT EXISTS contact_user_id uuid REFERENCES auth.users(id);
CREATE INDEX IF NOT EXISTS idx_institutions_contact_user ON institutions(contact_user_id);

-- ============================================
-- Helper function: check admin without RLS recursion
-- ============================================
CREATE OR REPLACE FUNCTION public.is_admin(check_user_id uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles WHERE id = check_user_id AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================
-- Admin bypass: events UPDATE/DELETE
-- ============================================
DROP POLICY IF EXISTS "Owners update own events" ON events;
CREATE POLICY "Owners or admin update events" ON events
  FOR UPDATE USING (
    auth.uid() = created_by
    OR public.is_admin(auth.uid())
    OR EXISTS (SELECT 1 FROM event_collaborators WHERE event_id = events.id AND user_id = auth.uid() AND permission_level = 'editor')
  );

DROP POLICY IF EXISTS "Owners delete own events" ON events;
CREATE POLICY "Owners or admin delete events" ON events
  FOR DELETE USING (
    auth.uid() = created_by
    OR public.is_admin(auth.uid())
  );

-- Admin bypass: event_volunteers UPDATE/DELETE
DROP POLICY IF EXISTS "Event owners manage volunteers" ON event_volunteers;
CREATE POLICY "Event owners or admin manage volunteers" ON event_volunteers
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM events WHERE events.id = event_volunteers.event_id AND events.created_by = auth.uid()
    )
    OR public.is_admin(auth.uid())
    OR EXISTS (SELECT 1 FROM event_collaborators WHERE event_id = event_volunteers.event_id AND user_id = auth.uid() AND permission_level = 'editor')
    OR EXISTS (SELECT 1 FROM volunteers WHERE volunteers.id = event_volunteers.volunteer_id AND volunteers.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Event owners delete volunteers" ON event_volunteers;
CREATE POLICY "Event owners or admin delete volunteers" ON event_volunteers
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM events WHERE events.id = event_volunteers.event_id AND events.created_by = auth.uid()
    )
    OR public.is_admin(auth.uid())
    OR (
      event_volunteers.status = 'pendiente'
      AND EXISTS (SELECT 1 FROM volunteers WHERE volunteers.id = event_volunteers.volunteer_id AND volunteers.user_id = auth.uid())
    )
  );

-- Admin bypass: institutions
DROP POLICY IF EXISTS "Authenticated users manage institutions" ON institutions;
CREATE POLICY "Owners or admin manage institutions" ON institutions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM events WHERE events.institution_id = institutions.id AND events.created_by = auth.uid()
    )
    OR institutions.contact_user_id = auth.uid()
    OR public.is_admin(auth.uid())
  );

-- Admin bypass: reviews DELETE
DROP POLICY IF EXISTS "Review authors or event owners delete reviews" ON reviews;
CREATE POLICY "Review authors or event owners or admin delete reviews" ON reviews
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM events WHERE events.id = reviews.event_id AND events.created_by = auth.uid())
    OR EXISTS (SELECT 1 FROM volunteers WHERE volunteers.id = reviews.volunteer_author_id AND volunteers.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
    OR public.is_admin(auth.uid())
  );

-- Admin can read all user_profiles (uses is_admin to avoid recursion)
DROP POLICY IF EXISTS "Users read own profile" ON user_profiles;
CREATE POLICY "Users or admin read profiles" ON user_profiles
  FOR SELECT USING (
    auth.uid() = id
    OR public.is_admin(auth.uid())
  );

-- Protect role self-modification
DROP POLICY IF EXISTS "Users update own profile" ON user_profiles;
CREATE POLICY "Users update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (
    role = (SELECT up.role FROM user_profiles up WHERE up.id = auth.uid())
    OR public.is_admin(auth.uid())
  );

-- Admin can update any profile (for role changes)
CREATE POLICY "Admin update any profile" ON user_profiles
  FOR UPDATE USING (
    public.is_admin(auth.uid())
  );
