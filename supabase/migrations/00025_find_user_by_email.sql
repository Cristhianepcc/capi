-- Función para buscar un usuario por email en auth.users
-- Usa SECURITY DEFINER para acceder a auth.users desde el cliente anon
CREATE OR REPLACE FUNCTION find_user_id_by_email(lookup_email text)
RETURNS uuid AS $$
  SELECT id FROM auth.users WHERE email = lookup_email LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;
