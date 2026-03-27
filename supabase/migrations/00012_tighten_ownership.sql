-- ============================================
-- Tighten RLS: ownership-based policies
-- ============================================

-- 1. event_volunteers: UPDATE/DELETE only if user owns the associated event
DROP POLICY IF EXISTS "Auth update" ON event_volunteers;
DROP POLICY IF EXISTS "Auth delete" ON event_volunteers;

CREATE POLICY "Owner update event_volunteers" ON event_volunteers
  FOR UPDATE USING (
    auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_volunteers.event_id
      AND events.created_by = auth.uid()
    )
  );

CREATE POLICY "Owner delete event_volunteers" ON event_volunteers
  FOR DELETE USING (
    auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_volunteers.event_id
      AND events.created_by = auth.uid()
    )
  );

-- 2. institutions: UPDATE/DELETE only if user created an event referencing this institution
DROP POLICY IF EXISTS "Auth update" ON institutions;
DROP POLICY IF EXISTS "Auth delete" ON institutions;

CREATE POLICY "Owner update institutions" ON institutions
  FOR UPDATE USING (
    auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM events
      WHERE events.institution_id = institutions.id
      AND events.created_by = auth.uid()
    )
  );

CREATE POLICY "Owner delete institutions" ON institutions
  FOR DELETE USING (
    auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM events
      WHERE events.institution_id = institutions.id
      AND events.created_by = auth.uid()
    )
  );

-- 3. reviews: DELETE only if user is event owner or review author
DROP POLICY IF EXISTS "Auth delete" ON reviews;

CREATE POLICY "Owner delete reviews" ON reviews
  FOR DELETE USING (
    auth.uid() IS NOT NULL
    AND (
      -- User owns the event
      EXISTS (
        SELECT 1 FROM events
        WHERE events.id = reviews.event_id
        AND events.created_by = auth.uid()
      )
      OR
      -- User is the review author (volunteer email matches auth email)
      EXISTS (
        SELECT 1 FROM volunteers
        WHERE volunteers.id = reviews.volunteer_author_id
        AND volunteers.email = (SELECT email FROM auth.users WHERE id = auth.uid())
      )
    )
  );
