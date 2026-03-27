-- Communities table
CREATE TABLE communities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(200) NOT NULL UNIQUE,
  slug varchar(200) NOT NULL UNIQUE,
  description text,
  logo_url text,
  website text,
  status varchar(20) NOT NULL DEFAULT 'activo'
    CHECK (status IN ('activo', 'inactivo', 'solicitud')),
  created_by uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

-- Community members table
CREATE TABLE community_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role varchar(20) NOT NULL DEFAULT 'miembro'
    CHECK (role IN ('lider', 'admin', 'miembro')),
  invited_by uuid REFERENCES auth.users(id),
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (community_id, user_id)
);

-- Indexes
CREATE INDEX idx_community_members_community ON community_members(community_id);
CREATE INDEX idx_community_members_user ON community_members(user_id);
CREATE INDEX idx_communities_slug ON communities(slug);

-- Helper function to check community role (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_community_role(
  check_user_id uuid, check_community_id uuid, allowed_roles text[]
) RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM community_members
    WHERE user_id = check_user_id
      AND community_id = check_community_id
      AND role = ANY(allowed_roles)
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- RLS for communities
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "communities_select_all" ON communities
  FOR SELECT USING (true);

CREATE POLICY "communities_insert_authenticated" ON communities
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "communities_update_leader_or_admin" ON communities
  FOR UPDATE USING (
    created_by = auth.uid()
    OR public.has_community_role(auth.uid(), id, ARRAY['lider'])
    OR public.is_admin(auth.uid())
  );

CREATE POLICY "communities_delete_leader_or_admin" ON communities
  FOR DELETE USING (
    created_by = auth.uid()
    OR public.has_community_role(auth.uid(), id, ARRAY['lider'])
    OR public.is_admin(auth.uid())
  );

-- RLS for community_members
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "community_members_select_all" ON community_members
  FOR SELECT USING (true);

CREATE POLICY "community_members_insert_leader" ON community_members
  FOR INSERT WITH CHECK (
    -- Self-insert when creating community (user_id = auth.uid)
    user_id = auth.uid()
    -- Or leader/admin inviting
    OR public.has_community_role(auth.uid(), community_id, ARRAY['lider', 'admin'])
    OR public.is_admin(auth.uid())
  );

CREATE POLICY "community_members_update_leader" ON community_members
  FOR UPDATE USING (
    public.has_community_role(auth.uid(), community_id, ARRAY['lider'])
    OR public.is_admin(auth.uid())
  );

CREATE POLICY "community_members_delete_leader_or_self" ON community_members
  FOR DELETE USING (
    user_id = auth.uid()
    OR public.has_community_role(auth.uid(), community_id, ARRAY['lider'])
    OR public.is_admin(auth.uid())
  );
