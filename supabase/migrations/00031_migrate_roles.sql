-- Data migration: Migrate from fixed roles (role column) to granular permission system
-- This migration must run AFTER 00030_granular_permissions.sql

-- ==== 1. Create default roles for each existing community ====
INSERT INTO community_roles (community_id, name, description, is_owner, created_at)
SELECT
  id,
  'Líder',
  'Fundador/a de la comunidad con control total',
  true,
  created_at
FROM communities
WHERE status IN ('activo', 'solicitud')
ON CONFLICT DO NOTHING;

INSERT INTO community_roles (community_id, name, description, is_owner, created_at)
SELECT
  id,
  'Colaborador',
  'Puede crear, editar eventos y gestionar voluntarios',
  false,
  created_at
FROM communities
WHERE status IN ('activo', 'solicitud')
ON CONFLICT DO NOTHING;

INSERT INTO community_roles (community_id, name, description, is_owner, created_at)
SELECT
  id,
  'Miembro',
  'Miembro regular de la comunidad (solo lectura)',
  false,
  created_at
FROM communities
WHERE status IN ('activo', 'solicitud')
ON CONFLICT DO NOTHING;

-- ==== 2. Assign permissions to Líder role (all permissions) ====
INSERT INTO community_role_permissions (role_id, permission_key)
SELECT cr.id, cp.key
FROM community_roles cr
CROSS JOIN community_permissions cp
WHERE cr.name = 'Líder'
  AND cr.is_owner = true
ON CONFLICT DO NOTHING;

-- ==== 3. Assign permissions to Colaborador role (limited) ====
INSERT INTO community_role_permissions (role_id, permission_key)
SELECT cr.id, cp.key
FROM community_roles cr
CROSS JOIN community_permissions cp
WHERE cr.name = 'Colaborador'
  AND cp.key IN ('create_events', 'edit_events', 'manage_volunteers')
ON CONFLICT DO NOTHING;

-- ==== 4. Assign NO permissions to Miembro role (read-only) ====
-- Miembro has no explicit INSERT into community_role_permissions
-- (this is by design - they have no permissions)

-- ==== 5. Migrate community_members data: role -> community_role_id ====
-- For each member, set their community_role_id based on their current role
UPDATE community_members cm
SET community_role_id = cr.id
FROM community_roles cr
WHERE cm.community_id = cr.community_id
  AND ((cm.role = 'lider' AND cr.name = 'Líder')
       OR (cm.role = 'admin' AND cr.name = 'Colaborador')
       OR (cm.role = 'miembro' AND cr.name = 'Miembro'));

-- ==== 6. Verify migration succeeded (all members should have a role_id now) ====
-- If this fails, the next statement will catch constraint violations
-- Check: SELECT user_id, community_id, role, community_role_id FROM community_members WHERE community_role_id IS NULL;

-- ==== 7. Make community_role_id NOT NULL (now that all rows are populated) ====
ALTER TABLE community_members
ALTER COLUMN community_role_id SET NOT NULL;

-- ==== 8. Drop old role column ====
ALTER TABLE community_members DROP COLUMN role;
