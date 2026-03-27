-- -----------------------------------------------
-- event_roles: roles configurables por evento
-- -----------------------------------------------
CREATE TABLE event_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name varchar(100) NOT NULL,
  slots integer NOT NULL DEFAULT 1 CHECK (slots >= 1),
  sort_order integer NOT NULL DEFAULT 0
);

CREATE INDEX idx_event_roles_event ON event_roles(event_id);

ALTER TABLE event_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública de event_roles"
  ON event_roles FOR SELECT USING (true);

CREATE POLICY "Gestión de event_roles por creador"
  ON event_roles FOR ALL USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_roles.event_id
        AND events.created_by = auth.uid()
    )
  );

-- Permitir insert anónimo de event_roles (para signup público al crear eventos)
CREATE POLICY "Insert event_roles autenticado"
  ON event_roles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_roles.event_id
        AND events.created_by = auth.uid()
    )
  );

-- -----------------------------------------------
-- Quitar CHECK constraint fijo de event_volunteers.role
-- para permitir nombres de rol personalizados
-- -----------------------------------------------
ALTER TABLE event_volunteers DROP CONSTRAINT IF EXISTS event_volunteers_role_check;

-- Capitalizar valores existentes de roles para usar como display name
UPDATE event_volunteers SET role = initcap(role);

-- -----------------------------------------------
-- Poblar event_roles para eventos existentes
-- -----------------------------------------------
INSERT INTO event_roles (event_id, name, slots, sort_order)
SELECT
  e.id,
  r.name,
  GREATEST(1, e.volunteers_needed / 6),
  r.sort_order
FROM events e
CROSS JOIN (
  VALUES
    ('Instructor', 0),
    ('Facilitador', 1),
    ('Mentor', 2),
    ('Asistente', 3),
    ('Coordinador', 4),
    ('Moderador', 5)
) AS r(name, sort_order)
WHERE e.deleted_at IS NULL;
