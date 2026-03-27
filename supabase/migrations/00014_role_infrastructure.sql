-- Vincular volunteers con auth.users
ALTER TABLE volunteers ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_volunteers_user_id ON volunteers(user_id) WHERE user_id IS NOT NULL;

-- Vincular volunteers existentes por email
UPDATE volunteers v SET user_id = au.id
FROM auth.users au WHERE v.email = au.email AND v.user_id IS NULL;

-- Proteger user_profiles.role de auto-modificación
DROP POLICY IF EXISTS "Users update own profile" ON user_profiles;
CREATE POLICY "Users update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (
    role = (SELECT up.role FROM user_profiles up WHERE up.id = auth.uid())
    OR EXISTS (SELECT 1 FROM user_profiles up WHERE up.id = auth.uid() AND up.role = 'admin')
  );

-- Actualizar trigger para soportar rol en metadata de registro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, role, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'organizador'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'organizador') = 'voluntario' THEN
    INSERT INTO public.volunteers (name, email, user_id, avatar_color, avatar_hex)
    VALUES (
      COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
      NEW.email, NEW.id, 'bg-amber-400', '#fbbf24'
    )
    ON CONFLICT (email) DO UPDATE SET user_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
