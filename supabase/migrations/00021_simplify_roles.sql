-- Simplify user_profiles roles: only 'admin' and 'user'
-- Must drop constraint FIRST, then update data, then add new constraint
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_role_check;

UPDATE user_profiles SET role = 'user' WHERE role IN ('organizador', 'voluntario');

ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_role_check
  CHECK (role IN ('admin', 'user'));

-- Update handle_new_user trigger to default to 'user'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  assigned_role text := 'user';
  user_name text;
BEGIN
  -- System admin override
  IF NEW.raw_user_meta_data ->> 'role' = 'admin' THEN
    assigned_role := 'admin';
  END IF;

  user_name := COALESCE(
    NEW.raw_user_meta_data ->> 'full_name',
    split_part(NEW.email, '@', 1)
  );

  INSERT INTO public.user_profiles (id, role, full_name)
  VALUES (NEW.id, assigned_role, user_name);

  -- Auto-create volunteer record for all users
  INSERT INTO public.volunteers (name, email, user_id)
  VALUES (user_name, NEW.email, NEW.id)
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
