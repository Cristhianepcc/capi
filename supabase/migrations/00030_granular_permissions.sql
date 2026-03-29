-- Granular permissions system for community roles
-- Replaces fixed roles (lider, admin, miembro) with flexible role + permission system

-- ==== 1. Create permissions table (system catalog - read-only) ====
CREATE TABLE community_permissions (
  key varchar(100) PRIMARY KEY,
  label text NOT NULL,
  description text
);

-- Insert system permissions (fixed, not editable)
INSERT INTO community_permissions (key, label, description) VALUES
  ('manage_community', 'Editar comunidad', 'Puede editar nombre, logo, descripción y redes sociales'),
  ('create_events', 'Crear eventos', 'Puede crear eventos en la comunidad'),
  ('edit_events', 'Editar eventos', 'Puede editar eventos de la comunidad'),
  ('delete_events', 'Eliminar eventos', 'Puede eliminar eventos de la comunidad'),
  ('manage_members', 'Gestionar miembros', 'Puede invitar, remover y cambiar roles'),
  ('manage_volunteers', 'Gestionar voluntarios', 'Puede aprobar/rechazar voluntarios en eventos');

-- ==== 2. Create community roles table ====
CREATE TABLE community_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  name varchar(100) NOT NULL,
  description text,
  is_owner boolean NOT NULL DEFAULT false, -- Protected: only one owner per community
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (community_id, name)
);

CREATE INDEX idx_community_roles_community ON community_roles(community_id);

-- ==== 3. Create role permissions mapping ====
CREATE TABLE community_role_permissions (
  role_id uuid NOT NULL REFERENCES community_roles(id) ON DELETE CASCADE,
  permission_key varchar(100) NOT NULL REFERENCES community_permissions(key) ON DELETE RESTRICT,
  PRIMARY KEY (role_id, permission_key)
);

CREATE INDEX idx_community_role_permissions_role ON community_role_permissions(role_id);

-- ==== 4. Add community_role_id to community_members (temporary NULL, will be populated in next migration) ====
ALTER TABLE community_members ADD COLUMN community_role_id uuid REFERENCES community_roles(id);

-- ==== 5. SQL function to check permissions (replaces has_community_role) ====
CREATE OR REPLACE FUNCTION public.has_permission(
  check_user_id uuid,
  check_community_id uuid,
  permission varchar(100)
) RETURNS boolean AS $$
BEGIN
  -- Check if user is system admin (has full access)
  IF public.is_admin(check_user_id) THEN
    RETURN true;
  END IF;

  -- Check if user has the permission in this community via their role
  RETURN EXISTS (
    SELECT 1
    FROM community_members cm
    JOIN community_role_permissions crp ON crp.role_id = cm.community_role_id
    WHERE cm.user_id = check_user_id
      AND cm.community_id = check_community_id
      AND crp.permission_key = permission
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ==== 6. Helper to get all permissions for a user in a community ====
CREATE OR REPLACE FUNCTION public.get_user_permissions(
  check_user_id uuid,
  check_community_id uuid
) RETURNS SETOF varchar(100) AS $$
BEGIN
  -- System admin has all permissions
  IF public.is_admin(check_user_id) THEN
    RETURN QUERY SELECT key FROM community_permissions;
  ELSE
    -- Return user's actual permissions
    RETURN QUERY
    SELECT DISTINCT crp.permission_key
    FROM community_members cm
    JOIN community_role_permissions crp ON crp.role_id = cm.community_role_id
    WHERE cm.user_id = check_user_id
      AND cm.community_id = check_community_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==== 7. Update community_members RLS policies to use new permission system ====
-- Drop old policies that use the deprecated role column
DROP POLICY IF EXISTS "community_members_insert_leader" ON community_members;
DROP POLICY IF EXISTS "community_members_update_leader" ON community_members;
DROP POLICY IF EXISTS "community_members_delete_leader_or_self" ON community_members;

-- New policies using the permission system
-- SELECT: everyone can view members (public)
CREATE POLICY "community_members_select_all" ON community_members
  FOR SELECT USING (true);

-- INSERT: self-insert OR user with manage_members permission OR system admin
CREATE POLICY "community_members_insert_authorized" ON community_members
  FOR INSERT WITH CHECK (
    user_id = auth.uid()  -- Self-invite
    OR public.has_permission(auth.uid(), community_id, 'manage_members')
    OR public.is_admin(auth.uid())
  );

-- UPDATE: user with manage_members permission OR system admin
CREATE POLICY "community_members_update_authorized" ON community_members
  FOR UPDATE USING (
    public.has_permission(auth.uid(), community_id, 'manage_members')
    OR public.is_admin(auth.uid())
  );

-- DELETE: self-delete OR user with manage_members permission OR system admin
CREATE POLICY "community_members_delete_authorized" ON community_members
  FOR DELETE USING (
    user_id = auth.uid()  -- Self-delete (leave community)
    OR public.has_permission(auth.uid(), community_id, 'manage_members')
    OR public.is_admin(auth.uid())
  );

-- ==== 8. Update communities RLS policies to use new permission system ====
-- Drop old policies
DROP POLICY IF EXISTS "communities_update_leader_or_admin" ON communities;
DROP POLICY IF EXISTS "communities_delete_leader_or_admin" ON communities;

-- New policies: use manage_community permission
CREATE POLICY "communities_update_authorized" ON communities
  FOR UPDATE USING (
    created_by = auth.uid()
    OR public.has_permission(auth.uid(), id, 'manage_community')
    OR public.is_admin(auth.uid())
  );

CREATE POLICY "communities_delete_authorized" ON communities
  FOR DELETE USING (
    created_by = auth.uid()
    OR public.has_permission(auth.uid(), id, 'manage_community')
    OR public.is_admin(auth.uid())
  );

-- ==== 9. Enable RLS on new tables ====
ALTER TABLE community_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_role_permissions ENABLE ROW LEVEL SECURITY;

-- Policies for community_permissions (always readable)
CREATE POLICY "permissions_select_all" ON community_permissions
  FOR SELECT USING (true);

-- Policies for community_roles (readable if member, writable by maintainer)
CREATE POLICY "roles_select_all" ON community_roles
  FOR SELECT USING (true);

-- Policies for community_role_permissions (readable if member, writable if has manage_members)
CREATE POLICY "role_permissions_select_all" ON community_role_permissions
  FOR SELECT USING (true);
