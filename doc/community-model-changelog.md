# Modelo basado en Comunidades — Changelog

## Contexto

El modelo anterior de Capi tenia roles globales (`admin`, `organizador`, `voluntario`) asignados directamente en `user_profiles`. Esto limitaba la flexibilidad: un usuario solo podia tener un rol en toda la plataforma.

**Nuevo modelo:** La autoridad de organizar eventos viene de la **comunidad**, no del usuario. Todos los usuarios son iguales (`admin` o `user` a nivel sistema) y pueden pertenecer a multiples comunidades con distintos roles (`lider`, `admin`, `miembro`).

```
Usuario (todos iguales, pueden ser voluntarios)
  └── pertenece a 0+ comunidades con rol:
       ├── lider    → gestiona comunidad, invita, crea eventos
       ├── admin    → crea eventos, gestiona voluntarios
       └── miembro  → colabora en eventos asignados

Evento = organizado por Comunidad + realizado en Institucion
```

---

## Fase 1 — Schema de base de datos

### Migraciones creadas

| Archivo | Descripcion |
|---------|-------------|
| `supabase/migrations/00019_communities.sql` | Tablas `communities` y `community_members`, funcion helper `has_community_role()`, politicas RLS |
| `supabase/migrations/00020_events_community.sql` | Columna `community_id` en `events` con indice |
| `supabase/migrations/00021_simplify_roles.sql` | Roles simplificados a `admin` \| `user`, trigger `handle_new_user()` actualizado |
| `supabase/migrations/00022_data_migration.sql` | Comunidad default "Organizadores Capi", migracion de organizadores existentes como lideres, asignacion de `community_id` a eventos existentes |
| `supabase/migrations/00023_update_event_rls.sql` | Politicas RLS de `events` y `event_volunteers` actualizadas para usar `has_community_role()` |
| `supabase/migrations/00024_drop_collaborators.sql` | Eliminacion de tabla `event_collaborators` y politicas dependientes |
| `supabase/migrations/00025_find_user_by_email.sql` | Funcion RPC para buscar usuarios por email (invitaciones) |
| `supabase/migrations/00026_community_social.sql` | Campos de redes sociales: `instagram`, `twitter`, `linkedin`, `github`, `discord` |

### Cambios en tipos

**`types/database.ts`:**
- Agregadas tablas `communities` y `community_members`
- `events.Row` ahora incluye `community_id: string | null`
- `user_profiles.Row.role` cambiado de `"admin" | "organizador" | "voluntario"` a `"admin" | "user"`
- Eliminada tabla `event_collaborators`
- Agregados tipos de conveniencia `Community` y `CommunityMember`
- Eliminado tipo `EventCollaborator`
- Campos sociales en `communities`: `instagram`, `twitter`, `linkedin`, `github`, `discord`

---

## Fase 2 — Backend (autorizacion, actions, queries)

### `lib/authorization.ts` — Reescrito

Todas las funciones ya no reciben `role` como parametro. La autorizacion se basa en membership de comunidad.

| Funcion | Descripcion |
|---------|-------------|
| `requireAuth()` | Retorna usuario + perfil con `role: "admin" \| "user"` |
| `isSystemAdmin(userId)` | Consulta `user_profiles.role === "admin"` |
| `canManageEvent(userId, eventId)` | System admin OR created_by OR lider/admin en comunidad del evento |
| `canDeleteEvent(userId, eventId)` | System admin OR created_by OR lider en comunidad del evento |
| `canManageInstitution(userId, institutionId)` | System admin OR contact_user_id OR tiene eventos en esa institucion |
| `canManageEventVolunteer(userId, eventVolunteerId)` | Via evento → via comunidad |
| `canManageCommunity(userId, communityId)` | System admin OR lider |
| `canCreateEventInCommunity(userId, communityId)` | System admin OR lider/admin |
| `hasCommunityRole(userId, communityId, allowedRoles)` | Verifica membership con roles especificos |

### `lib/actions/communities.ts` — Nuevo

| Funcion | Descripcion |
|---------|-------------|
| `createCommunity(data)` | Crea comunidad + inserta creador como lider. Acepta logo, redes sociales |
| `updateCommunity(communityId, data)` | Solo lider o system admin. Actualiza todos los campos incluyendo redes |
| `inviteMember(communityId, email, role)` | Lider invita cualquier rol, admin invita miembros. Usa RPC `find_user_id_by_email` |
| `removeMember(communityId, userId)` | Solo lider |
| `changeMemberRole(communityId, userId, newRole)` | Solo lider |
| `leaveCommunity(communityId)` | Cualquier miembro (lider debe transferir primero) |

### `lib/actions/events.ts` — Modificado

- `createEvent()` ahora requiere `communityId` como parametro obligatorio
- Valida que el usuario sea lider/admin en esa comunidad via `canCreateEventInCommunity()`
- `updateEvent()`, `deleteEvent()`, `updateEventStatus()` usan autorizacion sin parametro `role`

### `lib/actions/auth.ts` — Modificado

- `registerUser()` ya no recibe parametro `role` — todos se registran como `'user'`

### `lib/actions/volunteers.ts` — Modificado

- Todas las funciones usan `canManageEventVolunteer(userId, id)` sin parametro `role`

### `lib/actions/institutions.ts` — Modificado

- `canManageInstitution(userId, id)` sin parametro `role`

### `lib/actions/reviews.ts` — Modificado

- `deleteReview()` usa `profile.role === "admin"` directamente para system admin

### `lib/actions/users.ts` — Modificado

- `changeUserRole()` solo alterna entre `"admin"` y `"user"`

### `lib/queries.ts` — Modificado

| Funcion | Cambio |
|---------|--------|
| `getEvents(includeAll, communityId?)` | Filtra por `community_id`. Trae nombre de comunidad via query separada (resiliente) |
| `getVolunteersWithEvents(communityId?)` | Filtra por eventos de la comunidad |
| `getPendingApplications(communityId?)` | Filtra por eventos de la comunidad |
| `getStats(communityId?)` | Stats globales o scoped a comunidad |
| `getInstitutions(communityId?)` | Filtra instituciones usadas por eventos de la comunidad |
| `getReviews(communityId?)` | Filtra resenas de eventos de la comunidad |
| `getEventBySlug(slug)` | Trae `communityName` y `communitySlug` |
| `getUserCommunities(userId)` | **Nueva.** Retorna comunidades del usuario con rol |
| `getCommunityMembers(communityId)` | **Nueva.** Lista miembros con nombre y rol |
| `getCommunityBySlug(slug)` | **Nueva.** Incluye campos sociales |
| `getPublicCommunities()` | **Nueva.** Lista publica con conteo de miembros y eventos |
| `getCommunityEvents(communityId)` | **Nueva.** Wrapper de getEvents |

---

## Fase 3 — Contexto y estado

### `lib/communityContext.tsx` — Nuevo (reemplaza `roleContext.tsx`)

```tsx
interface CommunityContextValue {
  isSystemAdmin: boolean;
  fullName: string | null;
  communities: Array<{
    id: string; name: string; slug: string;
    role: "lider" | "admin" | "miembro";
  }>;
  activeCommunity: { id: string; name: string; slug: string; role: string } | null;
}
```

### `app/dashboard/layout.tsx` — Modificado

- Fetch comunidades del usuario con `getUserCommunities()`
- Lee comunidad activa desde cookie `capi-community`
- Provee `<CommunityProvider>` en vez de `<RoleProvider>`

### Persistencia de comunidad activa

Cookie `capi-community` con el `communityId`. Server components la leen con `cookies()`, client components la actualizan via `document.cookie`.

---

## Fase 4 — UI

### Paginas publicas nuevas

| Ruta | Descripcion |
|------|-------------|
| `/communities` | Listado publico de comunidades con miembros y eventos |
| `/communities/[slug]` | Perfil de comunidad: hero con logo, descripcion, redes sociales, stats, eventos proximos y anteriores, CTA |

### Paginas del dashboard nuevas

| Ruta | Descripcion |
|------|-------------|
| `/dashboard/communities` | Lista de comunidades del usuario |
| `/dashboard/communities/new` | Formulario: nombre, descripcion, logo (upload), website, Instagram, X, LinkedIn, GitHub, Discord |
| `/dashboard/communities/[slug]` | Detalle de comunidad con stats, miembros, website |
| `/dashboard/communities/[slug]/members` | Gestion de miembros: invitar por email, cambiar rol, remover |

### Componentes nuevos

| Componente | Descripcion |
|-----------|-------------|
| `CommunitySwitcher.tsx` | Dropdown en sidebar para cambiar comunidad activa. Muestra "Vista personal" + lista de comunidades con rol |

### Componentes modificados

| Componente | Cambio |
|-----------|--------|
| `SidebarNav.tsx` | Nav dinamico segun comunidad activa y rol. Sin comunidad: Mis Eventos, Mi Perfil, Mis Comunidades. Con comunidad: Dashboard, Eventos, Voluntarios, etc segun rol |
| `DashboardSidebar.tsx` | Incluye `CommunitySwitcher`, muestra nombre de comunidad, "Crear Evento" solo para lider/admin |
| `EventCard.tsx` | Muestra "Organizado por [Comunidad]" como link a `/communities/[slug]`. Marcado como `"use client"` |
| `EventForm.tsx` | Selector de comunidad para crear eventos (filtra donde es lider/admin) |
| `Navbar.tsx` | Link "Comunidades" en nav desktop y mobile. Eliminado link "Como funciona" |
| `Footer.tsx` | Link "Comunidades" en seccion Plataforma |

### Paginas modificadas

| Pagina | Cambio |
|--------|--------|
| `app/page.tsx` (landing) | Seccion "Nuestras Comunidades" con cards. Eliminadas secciones redundantes "Como funciona" y "Roles" |
| `app/register/page.tsx` | Eliminado toggle de rol. Todos se registran igual. Texto: "Crea tu cuenta en Capi" |
| `app/login/page.tsx` | Texto cambiado de "consola de organizador" a "panel de control" |
| `app/dashboard/page.tsx` | Dos modos: vista personal (mis eventos como voluntario + crear/unirse a comunidad) y vista de comunidad (dashboard con stats, pendientes, eventos) |
| `app/dashboard/events/page.tsx` | Filtrado por comunidad activa via cookie |
| `app/dashboard/volunteers/page.tsx` | Filtrado por comunidad activa via cookie |
| `app/dashboard/institutions/page.tsx` | Filtrado por comunidad activa (muestra instituciones de eventos de esa comunidad) |
| `app/dashboard/analytics/page.tsx` | Filtrado por comunidad activa |
| `app/dashboard/reviews/page.tsx` | Filtrado por comunidad activa |
| `app/dashboard/my-events/page.tsx` | Eliminado check de rol `voluntario` — accesible para todos |
| `app/dashboard/profile/page.tsx` | Eliminado check de rol `voluntario` |
| `app/dashboard/users/UsersClient.tsx` | Solo roles `admin` \| `user` en selector |
| `app/events/[id]/page.tsx` | Muestra "Organizado por [Comunidad]" como link |
| `proxy.ts` | Solo bloquea `/dashboard/users` para no-admins. Eliminado bloqueo por rol global |

---

## Fase 5 — Limpieza

### Archivos eliminados

| Archivo | Razon |
|---------|-------|
| `lib/roleContext.tsx` | Reemplazado por `communityContext.tsx`, ya no era importado |
| `lib/actions/collaborators.ts` | Reemplazado por `community_members` |
| `app/dashboard/events/[slug]/edit/CollaboratorsSection.tsx` | Dependia de collaborators |
| `app/dashboard/my-institution/page.tsx` | Basado en modelo viejo de usuario vinculado a institucion |
| `app/dashboard/my-institution/InstitutionDashboardClient.tsx` | Idem |

### Referencias eliminadas

- `"organizador"` y `"voluntario"` como roles de sistema — ya no existen en el codigo de la app
- `event_collaborators` — tabla y todas las referencias eliminadas
- `useRole()` / `RoleProvider` — reemplazados por `useCommunity()` / `CommunityProvider`

> Nota: `"voluntario"` e `"institucion"` siguen existiendo como `author_type` en resenas — estos son tipos de autor de resena, no roles de usuario.

---

## Modelo de datos final

### `communities`

| Columna | Tipo | Descripcion |
|---------|------|-------------|
| `id` | uuid PK | |
| `name` | varchar(200) UNIQUE | Nombre de la comunidad |
| `slug` | varchar(200) UNIQUE | URL-friendly |
| `description` | text | Descripcion larga |
| `logo_url` | text | URL del logo |
| `website` | text | Sitio web |
| `instagram` | text | Handle de Instagram |
| `twitter` | text | Handle de X/Twitter |
| `linkedin` | text | URL de LinkedIn |
| `github` | text | Usuario/org de GitHub |
| `discord` | text | Link de invitacion Discord |
| `status` | varchar(20) | `activo` \| `inactivo` \| `solicitud` |
| `created_by` | uuid FK → auth.users | Creador |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |
| `deleted_at` | timestamptz | Soft delete |

### `community_members`

| Columna | Tipo | Descripcion |
|---------|------|-------------|
| `id` | uuid PK | |
| `community_id` | uuid FK → communities | |
| `user_id` | uuid FK → auth.users | |
| `role` | varchar(20) | `lider` \| `admin` \| `miembro` |
| `invited_by` | uuid FK → auth.users | Quien invito |
| `joined_at` | timestamptz | |
| UNIQUE | (community_id, user_id) | Un usuario por comunidad |

### `user_profiles` (simplificado)

| Columna | Tipo | Valores |
|---------|------|---------|
| `role` | varchar | `admin` \| `user` (antes: `admin` \| `organizador` \| `voluntario`) |

### `events` (campo agregado)

| Columna | Tipo | Descripcion |
|---------|------|-------------|
| `community_id` | uuid FK → communities | Comunidad organizadora |

---

## Flujo de usuario

1. **Registro**: Todos se registran como `user`. Se crea perfil + registro de voluntario automaticamente.
2. **Sin comunidad**: Vista personal con "Mis Eventos" (voluntariados), "Mi Perfil", "Mis Comunidades". Puede crear una comunidad.
3. **Crear comunidad**: Se convierte en `lider`. Puede invitar miembros, crear eventos.
4. **Community switcher**: En el sidebar, dropdown para cambiar entre comunidades y vista personal.
5. **Con comunidad activa**: Dashboard de la comunidad con metricas, eventos, voluntarios, instituciones — todo filtrado por esa comunidad.
6. **Crear evento**: Requiere comunidad activa o seleccionar una comunidad donde sea lider/admin.
7. **Paginas publicas**: `/communities` lista todas las comunidades. `/communities/[slug]` muestra perfil con logo, redes, eventos proximos/anteriores.
