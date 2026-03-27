---
  CRITICAL — Problemas de rendimiento

  1. reviews.author_id sin index ni foreign key

  reviews.author_id se usa en queries con .in("id", volunteerIds) pero no tiene index. Además, no es una FK real
  — apunta a volunteers o institutions dependiendo de author_type. Esto es un anti-patrón (polymorphic FK) que
  impide integridad referencial.

  -- Falta:
  create index idx_reviews_author on reviews(author_id);

  Mejor solución a largo plazo: separar en dos columnas nullable con FK explícitas:
  volunteer_author_id uuid references volunteers(id),
  institution_author_id uuid references institutions(id),
  check (num_nonnulls(volunteer_author_id, institution_author_id) = 1)

  2. getInstitutions() hace N+1 / doble query innecesaria

  En lib/queries.ts:109-146, primero trae todas las instituciones y luego todos los eventos para calcular conteos
   manualmente en JS. Esto debería resolverse con un solo query usando un JOIN o una subquery en la base de
  datos.

  3. getReviews() hace 4 queries separadas

  En lib/queries.ts:148-206, trae reviews, luego volunteers, institutions y events por separado. Podría ser un
  solo query con JOINs.

  4. getStats() hace 4 queries paralelas

  En lib/queries.ts:208-232, trae datos de 4 tablas. Podría consolidarse en una sola función SQL (RPC) en la base
   de datos.

  ---
  HIGH — Indexes faltantes o mejorables

  5. idx_events_slug es redundante

  events.slug ya tiene un constraint UNIQUE (línea 28), que crea un index implícito. El index en línea 45 es
  duplicado.

  -- Eliminar:
  drop index idx_events_slug;

  6. Index parcial para eventos activos

  La mayoría de queries filtran por status = 'activo'. Un index parcial sería más eficiente:

  create index idx_events_active on events(date)
    where status = 'activo';

  7. event_volunteers — falta index compuesto para queries frecuentes

  getStats() filtra por status = 'aprobado' y selecciona hours. Un index parcial ayudaría:

  create index idx_event_volunteers_approved_hours
    on event_volunteers(hours) where status = 'aprobado';

  ---
  MEDIUM — Schema design

  8. varchar con CHECK vs enum type

  Usas varchar + CHECK para status, type, role, etc. Esto funciona, pero cada CHECK se evalúa en cada
  INSERT/UPDATE. Si los valores son estables, un enum nativo de Postgres es más eficiente y legible:

  create type event_status as enum ('activo', 'borrador', 'finalizado');

  9. spots_left es dato derivado no sincronizado

  events.spots_left es redundante — podría calcularse como volunteers_needed - COUNT(approved volunteers). Al ser
   un campo manual, puede desincronizarse. Considera un generated column o calcularlo en la query.

  10. agenda_items.time es varchar, no temporal

  Almacenar horarios como varchar(50) (ej: '09:00 AM', 'Día 1 - 09:00 AM') impide ordenar cronológicamente y
  hacer cálculos. Considera usar time o timestamptz.

  ---
  LOW — Seguridad (RLS)

  11. RLS abierto a todo

  Todas las políticas son using (true) — lectura pública sin restricción. Esto es aceptable para un MVP, pero no
  hay políticas de INSERT/UPDATE/DELETE, lo que significa que los datos no se pueden modificar vía la API de
  Supabase (las operaciones de escritura serán bloqueadas por RLS). Cuando agregues auth, necesitarás políticas
  de escritura.

  ---
  Resumen de acciones recomendadas

  ┌───────────┬─────────────────────────────────────────────────────────────────┬────────────────────────────┐
  │ Prioridad │                             Acción                              │          Impacto           │
  ├───────────┼─────────────────────────────────────────────────────────────────┼────────────────────────────┤
  │ 1         │ Agregar index a reviews.author_id                               │ Evitar seq scan            │
  ├───────────┼─────────────────────────────────────────────────────────────────┼────────────────────────────┤
  │ 2         │ Eliminar idx_events_slug duplicado                              │ Reducir overhead de        │
  │           │                                                                 │ escritura                  │
  ├───────────┼─────────────────────────────────────────────────────────────────┼────────────────────────────┤
  │ 3         │ Agregar index parcial en events(date) WHERE status='activo'     │ Queries de listado más     │
  │           │                                                                 │ rápidos                    │
  ├───────────┼─────────────────────────────────────────────────────────────────┼────────────────────────────┤
  │ 4         │ Agregar index parcial en event_volunteers(hours) WHERE          │ getStats() más rápido      │
  │           │ status='aprobado'                                               │                            │
  ├───────────┼─────────────────────────────────────────────────────────────────┼────────────────────────────┤
  │ 5         │ Consolidar queries en getInstitutions() y getReviews()          │ Reducir roundtrips a DB    │
  ├───────────┼─────────────────────────────────────────────────────────────────┼────────────────────────────┤
  │ 6         │ Refactorizar author_id polimórfico en reviews                   │ Integridad referencial     │
  └───────────┴─────────────────────────────────────────────────────────────────┴────────────────────────────┘

  Quieres que implemente alguna de estas mejoras?