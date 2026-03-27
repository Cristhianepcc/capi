-- ============================================
-- Migración: Optimizaciones de rendimiento
-- ============================================

-- 1. Eliminar idx_events_slug duplicado (ya existe UNIQUE constraint)
drop index if exists idx_events_slug;

-- 2. Crear index en reviews.author_id (CRITICAL)
create index idx_reviews_author on reviews(author_id);

-- 3. Crear index parcial para eventos activos (HIGH)
create index idx_events_active on events(date) where status = 'activo';

-- 4. Crear index parcial para horas aprobadas en event_volunteers (HIGH)
create index idx_event_volunteers_approved_hours 
  on event_volunteers(hours) where status = 'aprobado';
