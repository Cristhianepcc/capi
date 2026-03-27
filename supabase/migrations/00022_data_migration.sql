-- Data migration: create default community and migrate existing data

-- 1. Create default community for existing organizers
DO $$
DECLARE
  default_community_id uuid;
  first_admin uuid;
BEGIN
  -- Find the first admin to be the creator
  SELECT id INTO first_admin FROM user_profiles WHERE role = 'admin' LIMIT 1;

  -- If no admin, use the first user
  IF first_admin IS NULL THEN
    SELECT id INTO first_admin FROM user_profiles LIMIT 1;
  END IF;

  -- Only proceed if there are users
  IF first_admin IS NOT NULL THEN
    -- Create default community
    INSERT INTO communities (name, slug, description, status, created_by)
    VALUES (
      'Organizadores Capi',
      'organizadores-capi',
      'Comunidad por defecto para organizadores existentes',
      'activo',
      first_admin
    )
    RETURNING id INTO default_community_id;

    -- 2. Insert existing admin as lider
    INSERT INTO community_members (community_id, user_id, role)
    VALUES (default_community_id, first_admin, 'lider')
    ON CONFLICT DO NOTHING;

    -- 3. Insert former organizers as lider (they had the old 'organizador' role,
    --    but we already converted them to 'user' in the previous migration.
    --    We can identify them by checking who created events)
    INSERT INTO community_members (community_id, user_id, role)
    SELECT DISTINCT default_community_id, e.created_by, 'lider'
    FROM events e
    WHERE e.created_by IS NOT NULL
      AND e.created_by != first_admin
    ON CONFLICT DO NOTHING;

    -- 4. Assign community_id to all existing events
    UPDATE events SET community_id = default_community_id
    WHERE community_id IS NULL;
  END IF;
END $$;
