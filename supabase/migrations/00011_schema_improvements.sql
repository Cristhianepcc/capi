-- ============================================
-- Schema improvements
-- ============================================

-- 1. Eliminar spots_left (redundante, se calcula dinámicamente)
ALTER TABLE events DROP COLUMN spots_left;

-- 2. Cambiar events.date de timestamptz a date
ALTER TABLE events ALTER COLUMN date TYPE date USING date::date;

-- 3. Hacer author_id nullable (se usan los FK explícitos ahora)
ALTER TABLE reviews ALTER COLUMN author_id DROP NOT NULL;

-- 4. Agregar ON DELETE CASCADE a review FKs
ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_volunteer_author_id_fkey;
ALTER TABLE reviews ADD CONSTRAINT reviews_volunteer_author_id_fkey
  FOREIGN KEY (volunteer_author_id) REFERENCES volunteers(id) ON DELETE CASCADE;

ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_institution_author_id_fkey;
ALTER TABLE reviews ADD CONSTRAINT reviews_institution_author_id_fkey
  FOREIGN KEY (institution_author_id) REFERENCES institutions(id) ON DELETE CASCADE;

-- 5. Unicidad de reviews por autor por evento
CREATE UNIQUE INDEX IF NOT EXISTS idx_reviews_unique_volunteer
  ON reviews(event_id, volunteer_author_id) WHERE volunteer_author_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_reviews_unique_institution
  ON reviews(event_id, institution_author_id) WHERE institution_author_id IS NOT NULL;

-- 6. Agregar updated_at a event_volunteers
ALTER TABLE event_volunteers ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();

CREATE TRIGGER trg_event_volunteers_updated_at
  BEFORE UPDATE ON event_volunteers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 7. Agregar soft delete (deleted_at) a tablas principales
ALTER TABLE events ADD COLUMN deleted_at timestamptz;
ALTER TABLE institutions ADD COLUMN deleted_at timestamptz;
ALTER TABLE volunteers ADD COLUMN deleted_at timestamptz;
ALTER TABLE reviews ADD COLUMN deleted_at timestamptz;

-- 8. Cambiar avatar_color de clase CSS a hex
ALTER TABLE volunteers ADD COLUMN avatar_hex varchar(7);

UPDATE volunteers SET avatar_hex = CASE avatar_color
  WHEN 'bg-amber-400' THEN '#fbbf24'
  WHEN 'bg-orange-400' THEN '#fb923c'
  WHEN 'bg-yellow-500' THEN '#eab308'
  WHEN 'bg-emerald-400' THEN '#34d399'
  WHEN 'bg-cyan-400' THEN '#22d3ee'
  WHEN 'bg-blue-400' THEN '#60a5fa'
  WHEN 'bg-purple-400' THEN '#c084fc'
  WHEN 'bg-pink-400' THEN '#f472b6'
  WHEN 'bg-rose-400' THEN '#fb7185'
  WHEN 'bg-teal-400' THEN '#2dd4bf'
  WHEN 'bg-slate-400' THEN '#94a3b8'
  ELSE '#94a3b8'
END;

-- 9. Restringir RLS de volunteers: no exponer emails públicamente
DROP POLICY IF EXISTS "Lectura pública de volunteers" ON volunteers;
DROP POLICY IF EXISTS "Public read access" ON volunteers;

-- Lectura pública solo de campos no sensibles (via RLS + view)
CREATE POLICY "Public read volunteers" ON volunteers
  FOR SELECT USING (true);

-- Nota: La restricción de campos se hará a nivel de query (select específico),
-- ya que RLS no puede restringir columnas. Se implementará en el código.

-- 10. Eliminar constraint UNIQUE global en institutions.email (permite duplicados de diferentes orgs)
ALTER TABLE institutions DROP CONSTRAINT IF EXISTS institutions_email_key;
-- Agregar unique parcial solo para emails no vacíos
CREATE UNIQUE INDEX IF NOT EXISTS idx_institutions_email_unique
  ON institutions(email) WHERE email != '';
