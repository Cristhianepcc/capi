# Plan: Completar el proyecto Capi

## Contexto

Capi es un MVP de solo lectura: tiene 8 tablas con seed data, UI pulida para listar/ver datos, pero las mutaciones son falsas (`setState` local o `setTimeout`). Le falta autenticación, persistencia de escrituras, flujos de signup público, y polish de UI (responsive, loading states, toasts).

**Nota:** Los índices de rendimiento (Fase 4 original) ya existen en `supabase/migrations/00003_performance_indexes.sql`.

---

## Fase 0: Autenticación con Supabase

### 0.1 Instalar `@supabase/ssr`
```bash
npm install @supabase/ssr
```

### 0.2 Refactorizar `lib/supabase.ts` → dos archivos

**`lib/supabase/client.ts`** — cliente navegador
- `createBrowserClient<Database>(url, anonKey)` de `@supabase/ssr`

**`lib/supabase/server.ts`** — cliente servidor con cookies
- `createServerClient<Database>(url, anonKey, { cookies })` de `@supabase/ssr`
- Usa `cookies()` de `next/headers` para get/set/remove
- Exporta función `createSupabaseServer()` que retorna el cliente

### 0.3 Actualizar `lib/queries.ts`
- Cambiar `import { supabase } from "./supabase"` → `import { createSupabaseServer } from "./supabase/server"`
- En cada función, obtener cliente con `const supabase = await createSupabaseServer()`

### 0.4 Crear `middleware.ts` (raíz del proyecto)
- Importar `createServerClient` de `@supabase/ssr`
- Refrescar sesión en cada request
- Si ruta es `/dashboard/*` y no hay sesión → redirect a `/login`
- Matcher: `["/((?!_next/static|_next/image|favicon.ico).*)"]`

### 0.5 Páginas de auth

**`app/login/page.tsx`**
- Formulario email + password
- Llama `supabase.auth.signInWithPassword()`
- En éxito → `router.push("/dashboard")`
- Link a `/register`
- Estilo consistente con el diseño existente (fondo `#f8f7f5`, tarjeta blanca, botón `#f49d25`)

**`app/register/page.tsx`**
- Formulario email + password + confirmar password
- Llama `supabase.auth.signUp()`
- Mensaje de confirmación post-registro
- Link a `/login`

### 0.6 Migración RLS `supabase/migrations/00004_auth_rls_policies.sql`
- INSERT/UPDATE/DELETE en: `events`, `institutions`, `volunteers`, `event_volunteers`, `reviews`, `agenda_items`, `event_sponsors`
- Condición: `auth.uid() IS NOT NULL`

### Archivos
| Acción | Archivo |
|--------|---------|
| Crear | `lib/supabase/client.ts` |
| Crear | `lib/supabase/server.ts` |
| Eliminar | `lib/supabase.ts` |
| Modificar | `lib/queries.ts` (imports) |
| Crear | `middleware.ts` |
| Crear | `app/login/page.tsx` |
| Crear | `app/register/page.tsx` |
| Crear | `supabase/migrations/00004_auth_rls_policies.sql` |

### Verificación
- `/dashboard` sin auth → redirige a `/login`
- Login → redirige a `/dashboard`
- Páginas públicas (`/`, `/events`, `/events/[id]`) siguen funcionando

---

## Fase 1: Server Actions (persistencia real)

### 1.1 Crear `lib/validations.ts`
- Extraer `eventSchema` de `app/dashboard/events/new/page.tsx` (líneas 8-20)
- Agregar schemas para volunteer status update, institution status, review

### 1.2 Server actions

**`lib/actions/events.ts`**
- `createEvent(formData)` — genera slug de título, inserta en `events`, busca/crea sponsors, inserta en `event_sponsors`
- `updateEvent(id, formData)` — actualiza evento y relaciones
- `deleteEvent(id)` — elimina evento (cascada por FK)
- `updateEventStatus(id, status)` — cambia status
- Todas usan `revalidatePath("/dashboard/events")`

**`lib/actions/volunteers.ts`**
- `updateVolunteerStatus(eventVolunteerId, status)` — UPDATE en `event_volunteers`
- `updateVolunteerRole(eventVolunteerId, role)` — UPDATE role
- `updateVolunteerHours(eventVolunteerId, hours)` — UPDATE hours
- Todas usan `revalidatePath("/dashboard/volunteers")`

**`lib/actions/institutions.ts`**
- `updateInstitutionStatus(id, status)` — UPDATE en `institutions`
- `revalidatePath("/dashboard/institutions")`

**`lib/actions/reviews.ts`**
- `createReview(data)` — INSERT en `reviews`
- `deleteReview(id)` — DELETE de `reviews`

### 1.3 Conectar UI existente

**`app/dashboard/events/new/page.tsx`**
- `handleSubmit` actualmente hace `setTimeout(() => router.push(...), 2000)` (línea 59)
- Reemplazar por llamada a `createEvent` server action
- Mover schema a `lib/validations.ts`, importar desde ahí
- Pasar `status: "borrador"` o `"activo"` según botón presionado

**`app/dashboard/events/page.tsx`** (server component)
- Los botones editar/eliminar (líneas 139-150) son `<button>` sin handler
- Extraer fila de acciones a `app/dashboard/events/EventActions.tsx` (client component)
- `EventActions` llama `deleteEvent` con confirmación

**`app/dashboard/volunteers/VolunteersClient.tsx`**
- `approve`/`reject` (líneas 43-46) solo hacen `setList(prev => prev.map(...))`
- Reemplazar por: llamar server action → `router.refresh()` para recargar datos del servidor
- Agregar handlers para "Asignar rol" y actualizar horas

**`app/dashboard/institutions/InstitutionsClient.tsx`**
- `approve` (línea 58-59) solo hace `setList`
- Reemplazar por: llamar `updateInstitutionStatus` → `router.refresh()`
- Agregar handler para "Rechazar" (actualmente sin `onClick`)

### Archivos
| Acción | Archivo |
|--------|---------|
| Crear | `lib/validations.ts` |
| Crear | `lib/actions/events.ts` |
| Crear | `lib/actions/volunteers.ts` |
| Crear | `lib/actions/institutions.ts` |
| Crear | `lib/actions/reviews.ts` |
| Crear | `app/dashboard/events/EventActions.tsx` |
| Modificar | `app/dashboard/events/new/page.tsx` |
| Modificar | `app/dashboard/events/page.tsx` |
| Modificar | `app/dashboard/volunteers/VolunteersClient.tsx` |
| Modificar | `app/dashboard/institutions/InstitutionsClient.tsx` |

### Verificación
- Crear evento → aparece en lista y en Supabase
- Eliminar evento → desaparece (persiste tras recarga)
- Aprobar voluntario → recargar, estado persiste
- Aceptar institución → persiste tras recarga

---

## Fase 2: UI faltante y polish

### 2.1 Página de editar evento
- Crear `components/EventForm.tsx` — extraer el formulario de `events/new/page.tsx` (líneas 76-273), parametrizar con `mode: "create" | "edit"` y `defaultValues`
- Refactorizar `events/new/page.tsx` para usar `<EventForm mode="create" />`
- Crear `app/dashboard/events/[slug]/edit/page.tsx` — carga evento existente, pasa a `<EventForm mode="edit" defaultValues={...} />`

### 2.2 Loading skeletons
Crear `loading.tsx` en:
- `app/dashboard/loading.tsx`
- `app/dashboard/events/loading.tsx`
- `app/dashboard/volunteers/loading.tsx`
- `app/dashboard/institutions/loading.tsx`

Patrón: tarjetas skeleton con `animate-pulse`, misma estructura que las stats cards + tabla.

### 2.3 Error boundaries
Crear `error.tsx` en:
- `app/dashboard/error.tsx`
- `app/events/error.tsx`

Patrón: `"use client"`, botón de reintentar con `reset()`.

### 2.4 Navbar responsive
`components/Navbar.tsx` — actualmente el nav tiene `hidden lg:flex` (línea 14) y no hay hamburguesa móvil.
- Agregar botón hamburguesa visible en `< lg`
- State `menuOpen` con panel overlay para links móviles

### 2.5 Sidebar responsive
`app/dashboard/layout.tsx` — sidebar es `w-64 flex-shrink-0` siempre visible (línea 8).
- Convertir a client component (o extraer sidebar a client component)
- En `< lg`: sidebar oculto por defecto, botón hamburguesa en header
- Overlay con backdrop para cerrar

### 2.6 Toasts de notificación
- `components/Toast.tsx` — componente de toast con auto-dismiss
- `lib/useToast.ts` — hook con context provider para mostrar toasts
- Integrar en layout raíz
- Llamar tras cada mutación exitosa/fallida

### Archivos
| Acción | Archivo |
|--------|---------|
| Crear | `components/EventForm.tsx` |
| Crear | `app/dashboard/events/[slug]/edit/page.tsx` |
| Crear | 4× `loading.tsx` |
| Crear | 2× `error.tsx` |
| Crear | `components/Toast.tsx` |
| Crear | `lib/useToast.ts` |
| Modificar | `app/dashboard/events/new/page.tsx` (usar EventForm) |
| Modificar | `components/Navbar.tsx` (hamburguesa) |
| Modificar | `app/dashboard/layout.tsx` (sidebar responsive) |

### Verificación
- Editar evento existente → cambios persisten
- Resize a móvil → sidebar colapsa, navbar muestra hamburguesa
- Skeletons aparecen durante carga
- Toasts aparecen al crear/editar/eliminar

---

## Fase 3: Flujo público de registro de voluntarios

### 3.1 Formulario de signup
- `app/events/[id]/VolunteerSignupForm.tsx` — client component con nombre, email, rol preferido (selector con los 6 roles del enum)
- Estilo consistente con la página de detalle del evento

### 3.2 Server action
- `lib/actions/signup.ts`:
  1. Busca voluntario por email en `volunteers`
  2. Si no existe → INSERT en `volunteers` (nombre, email, color aleatorio)
  3. INSERT en `event_volunteers` con `status: 'pendiente'`
  4. `revalidatePath` del evento y del dashboard

### 3.3 Migración RLS para signup anónimo
- `supabase/migrations/00005_public_signup_policy.sql`
- Política INSERT anónima en `volunteers` (solo columnas: name, email, avatar_color)
- Política INSERT anónima en `event_volunteers` (solo con status `'pendiente'`)

### 3.4 Integrar en página de detalle
- `app/events/[id]/page.tsx` — agregar `<VolunteerSignupForm eventId={...} />` debajo de la sección de stats

### Archivos
| Acción | Archivo |
|--------|---------|
| Crear | `app/events/[id]/VolunteerSignupForm.tsx` |
| Crear | `lib/actions/signup.ts` |
| Crear | `supabase/migrations/00005_public_signup_policy.sql` |
| Modificar | `app/events/[id]/page.tsx` |

### Verificación
- Visitar evento → llenar formulario → submit → mensaje de éxito
- En Supabase: nuevo volunteer y event_volunteer creados
- En dashboard: voluntario aparece como pendiente

---

## Fase 4: Optimizaciones de BD

> Los índices de performance ya están en `00003_performance_indexes.sql`. Solo falta:

### 4.1 Computar `spots_left` dinámicamente
En `lib/queries.ts` `getEvents()`: calcular `spotsLeft` como `volunteers_needed - count(approved event_volunteers)` en vez de usar `e.spots_left` del campo almacenado (evita desincronización).

### 4.2 Optimizar `getStats()`
Actualmente hace 5 queries secuenciales (líneas 177-190 de `queries.ts`).
- Opción A: ejecutar en paralelo con `Promise.all()`
- Opción B: crear función RPC `get_dashboard_stats()` en migración `00006_rpc_stats.sql`

### Archivos
| Acción | Archivo |
|--------|---------|
| Modificar | `lib/queries.ts` |
| Crear (opcional) | `supabase/migrations/00006_rpc_stats.sql` |

---

## Orden de ejecución

```
Fase 0 (Auth)           ←  primero, todo depende de esto
    ↓
Fase 1 (Server Actions) ←  funcionalidad core
    ↓
  ┌──────┬──────┬──────┐
  ↓      ↓      ↓      ↓
Fase 2  Fase 3  Fase 4
(UI)  (Signup) (Perf)   ←  paralelas entre sí
```
