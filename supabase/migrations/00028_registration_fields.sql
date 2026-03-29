-- Tabla de campos configurables por evento
CREATE TABLE event_registration_fields (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id      uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  field_key     varchar(100) NOT NULL,
  field_label   varchar(200) NOT NULL,
  field_type    varchar(20) NOT NULL DEFAULT 'text'
                  CHECK (field_type IN ('text','email','phone','textarea','select','checkbox')),
  required      boolean NOT NULL DEFAULT false,
  placeholder   varchar(300),
  options_json  jsonb,
  sort_order    integer NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_id, field_key)
);

CREATE INDEX idx_registration_fields_event
  ON event_registration_fields(event_id, sort_order);

-- Columna para guardar respuestas de campos custom
ALTER TABLE event_volunteers
  ADD COLUMN IF NOT EXISTS extra_data jsonb;

-- RLS
ALTER TABLE event_registration_fields ENABLE ROW LEVEL SECURITY;

-- Lectura pública (formulario de inscripción anónimo necesita cargar los campos)
CREATE POLICY "reg_fields_select_all" ON event_registration_fields
  FOR SELECT USING (true);

-- Solo organizadores del evento pueden insertar, actualizar, eliminar campos
CREATE POLICY "reg_fields_manage" ON event_registration_fields
  FOR ALL USING (
    auth.uid() IS NOT NULL AND EXISTS (
      SELECT 1 FROM events e
      WHERE e.id = event_registration_fields.event_id
      AND (e.created_by = auth.uid() OR public.is_admin(auth.uid()))
    )
  );
