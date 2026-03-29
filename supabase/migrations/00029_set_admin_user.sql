-- Set first user as admin (for testing)
-- This migration updates the first user to have admin role
UPDATE public.user_profiles
SET role = 'admin'
WHERE id = (
  SELECT id FROM public.user_profiles
  ORDER BY created_at ASC
  LIMIT 1
);
