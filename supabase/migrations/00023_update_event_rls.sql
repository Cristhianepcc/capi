-- Update event RLS policies to use has_community_role

-- Drop old event policies that reference organizador role
DROP POLICY IF EXISTS "events_update_owner_or_admin" ON events;
DROP POLICY IF EXISTS "events_delete_owner_or_admin" ON events;
DROP POLICY IF EXISTS "events_update_policy" ON events;
DROP POLICY IF EXISTS "events_delete_policy" ON events;

-- Events: update allowed for community lider/admin, event creator, or system admin
CREATE POLICY "events_update_community" ON events
  FOR UPDATE USING (
    created_by = auth.uid()
    OR public.is_admin(auth.uid())
    OR (community_id IS NOT NULL AND public.has_community_role(auth.uid(), community_id, ARRAY['lider', 'admin']))
  );

-- Events: delete allowed for community lider, event creator, or system admin
CREATE POLICY "events_delete_community" ON events
  FOR DELETE USING (
    created_by = auth.uid()
    OR public.is_admin(auth.uid())
    OR (community_id IS NOT NULL AND public.has_community_role(auth.uid(), community_id, ARRAY['lider']))
  );

-- Update event_volunteers policies
DROP POLICY IF EXISTS "event_volunteers_manage_owner_or_admin" ON event_volunteers;
DROP POLICY IF EXISTS "event_volunteers_update_policy" ON event_volunteers;
DROP POLICY IF EXISTS "event_volunteers_delete_policy" ON event_volunteers;

CREATE POLICY "event_volunteers_manage_community" ON event_volunteers
  FOR UPDATE USING (
    public.is_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM events e
      WHERE e.id = event_volunteers.event_id
        AND (
          e.created_by = auth.uid()
          OR (e.community_id IS NOT NULL AND public.has_community_role(auth.uid(), e.community_id, ARRAY['lider', 'admin']))
        )
    )
  );

CREATE POLICY "event_volunteers_delete_community" ON event_volunteers
  FOR DELETE USING (
    public.is_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM events e
      WHERE e.id = event_volunteers.event_id
        AND (
          e.created_by = auth.uid()
          OR (e.community_id IS NOT NULL AND public.has_community_role(auth.uid(), e.community_id, ARRAY['lider', 'admin']))
        )
    )
  );
