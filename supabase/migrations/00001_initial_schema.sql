-- ============================================
-- Capi — Esquema inicial de base de datos
-- ============================================

-- -----------------------------------------------
-- 1. INSTITUTIONS
-- -----------------------------------------------
create table institutions (
  id uuid primary key default gen_random_uuid(),
  name varchar(200) not null,
  type varchar(50) not null check (type in ('colegio', 'universidad', 'centro_comunitario', 'ong', 'centro_educativo')),
  city varchar(100) not null,
  contact varchar(150) not null,
  email varchar(150) not null unique,
  status varchar(20) not null default 'solicitud' check (status in ('activo', 'inactivo', 'solicitud')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------
-- 2. EVENTS
-- -----------------------------------------------
create table events (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references institutions(id) on delete cascade,
  title varchar(200) not null,
  slug varchar(200) not null unique,
  description text not null,
  about text,
  date timestamptz not null,
  location varchar(150) not null,
  full_location varchar(300),
  type varchar(50) not null check (type in ('taller', 'conferencia', 'charla', 'programa', 'evento_stem', 'voluntariado_educativo')),
  status varchar(20) not null default 'borrador' check (status in ('activo', 'borrador', 'finalizado')),
  image_url text,
  volunteers_needed integer not null default 0,
  students_goal integer not null default 0,
  spots_left integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_events_institution on events(institution_id);
create index idx_events_status on events(status);
create index idx_events_slug on events(slug);

-- -----------------------------------------------
-- 3. AGENDA ITEMS
-- -----------------------------------------------
create table agenda_items (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  time varchar(50) not null,
  title varchar(200) not null,
  description text,
  sort_order integer not null default 0
);

create index idx_agenda_items_event on agenda_items(event_id);

-- -----------------------------------------------
-- 4. SPONSORS
-- -----------------------------------------------
create table sponsors (
  id uuid primary key default gen_random_uuid(),
  name varchar(150) not null unique,
  logo_url text,
  website text
);

-- -----------------------------------------------
-- 5. EVENT_SPONSORS (pivote)
-- -----------------------------------------------
create table event_sponsors (
  event_id uuid not null references events(id) on delete cascade,
  sponsor_id uuid not null references sponsors(id) on delete cascade,
  primary key (event_id, sponsor_id)
);

-- -----------------------------------------------
-- 6. VOLUNTEERS
-- -----------------------------------------------
create table volunteers (
  id uuid primary key default gen_random_uuid(),
  name varchar(150) not null,
  email varchar(150) not null unique,
  avatar_color varchar(30) not null default 'bg-slate-400',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------
-- 7. EVENT_VOLUNTEERS (pivote)
-- -----------------------------------------------
create table event_volunteers (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  volunteer_id uuid not null references volunteers(id) on delete cascade,
  role varchar(50) not null check (role in ('instructor', 'facilitador', 'mentor', 'asistente', 'coordinador', 'moderador')),
  status varchar(20) not null default 'pendiente' check (status in ('pendiente', 'aprobado', 'rechazado')),
  hours integer not null default 0,
  joined_at timestamptz not null default now(),
  unique (event_id, volunteer_id)
);

create index idx_event_volunteers_event on event_volunteers(event_id);
create index idx_event_volunteers_volunteer on event_volunteers(volunteer_id);

-- -----------------------------------------------
-- 8. REVIEWS
-- -----------------------------------------------
create table reviews (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  author_id uuid not null,
  author_type varchar(20) not null check (author_type in ('voluntario', 'institucion')),
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamptz not null default now()
);

create index idx_reviews_event on reviews(event_id);

-- -----------------------------------------------
-- 9. FUNCIONES AUXILIARES
-- -----------------------------------------------

-- Actualizar updated_at automáticamente
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_institutions_updated_at
  before update on institutions
  for each row execute function update_updated_at();

create trigger trg_events_updated_at
  before update on events
  for each row execute function update_updated_at();

create trigger trg_volunteers_updated_at
  before update on volunteers
  for each row execute function update_updated_at();

-- -----------------------------------------------
-- 10. ROW LEVEL SECURITY (políticas básicas)
-- -----------------------------------------------

alter table institutions enable row level security;
alter table events enable row level security;
alter table volunteers enable row level security;
alter table event_volunteers enable row level security;
alter table reviews enable row level security;
alter table agenda_items enable row level security;
alter table sponsors enable row level security;
alter table event_sponsors enable row level security;

-- Lectura pública para todos (ajustar cuando haya auth)
create policy "Lectura pública de institutions" on institutions for select using (true);
create policy "Lectura pública de events" on events for select using (true);
create policy "Lectura pública de volunteers" on volunteers for select using (true);
create policy "Lectura pública de event_volunteers" on event_volunteers for select using (true);
create policy "Lectura pública de reviews" on reviews for select using (true);
create policy "Lectura pública de agenda_items" on agenda_items for select using (true);
create policy "Lectura pública de sponsors" on sponsors for select using (true);
create policy "Lectura pública de event_sponsors" on event_sponsors for select using (true);
