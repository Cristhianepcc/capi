# Capi — Pendientes de Backend, APIs y Rutas

Fecha: 2026-03-27

---

## 1. MIGRACIONES NO APLICADAS (CRÍTICO)

Las siguientes migraciones existen en `supabase/migrations/` pero **no han sido aplicadas** a la base de datos:

| Migración | Qué crea | Prioridad |
|-----------|----------|-----------|
| `00028_registration_fields.sql` | Tabla `event_registration_fields`, columna `extra_data` en `event_volunteers` | CRÍTICA |
| `00029_set_admin_user.sql` | Marca primer usuario como admin (testing) | BAJA |
| `00030_granular_permissions.sql` | Tablas `community_permissions`, `community_roles`, `community_role_permissions`; RPCs `has_permission()`, `get_user_permissions()` | CRÍTICA |
| `00031_migrate_roles.sql` | Migra datos de roles fijos a granulares, elimina columna `role` antigua | CRÍTICA |

**Orden de aplicación obligatorio:** 00028 → 00029 → 00030 → 00031

Sin estas migraciones:
- El formulario de inscripción dinámico no funciona (`event_registration_fields` no existe)
- El sistema de permisos granulares no funciona (`community_roles`, `community_role_permissions` no existen)
- Las RPCs `has_permission()` y `get_user_permissions()` no existen

---

## 2. PÁGINA FALTANTE EN DASHBOARD

| Ruta | Descripción | Prioridad |
|------|-------------|-----------|
| `/dashboard/events/[slug]/page.tsx` | Vista previa/detalle de evento (especialmente borradores) | ALTA |

**Qué debe mostrar:**
- Información del evento (título, fecha, ubicación, descripción)
- Estado actual (borrador/activo/finalizado)
- Acciones: editar, publicar, eliminar
- Estadísticas de inscripciones y voluntarios
- Lista de voluntarios registrados
- Acceso al constructor de formularios

---

## 3. ARCHIVOS UNTRACKED (FEATURES INCOMPLETAS)

Estas features están implementadas en código pero **no están commiteadas**:

### 3.1 Constructor de Formularios de Inscripción
- `app/dashboard/events/FormBuilderModal.tsx`
- `app/dashboard/events/FormField.tsx`
- **Estado:** Componentes completos, necesitan integrarse en la página de edición/creación de eventos
- **Backend:** `updateEventRegistrationFields()` en `lib/actions/events.ts` ya existe
- **Depende de:** Migración 00028

### 3.2 Gestión de Roles por Comunidad
- `app/dashboard/communities/[slug]/roles/page.tsx`
- `app/dashboard/communities/[slug]/roles/RolesClient.tsx`
- **Estado:** Completo (crear, editar, eliminar roles con permisos granulares)
- **Backend:** `createRole()`, `updateRole()`, `deleteRole()` en `lib/actions/communities.ts` ya existen
- **Depende de:** Migraciones 00030 y 00031

### 3.3 Gestión de Permisos (Admin)
- `app/dashboard/permissions/page.tsx`
- `app/dashboard/permissions/PermissionsClient.tsx`
- **Estado:** Implementado
- **Depende de:** Migraciones 00030 y 00031

### 3.4 Formulario de Inscripción Dinámica
- `app/events/[id]/inscripcion/page.tsx`
- `app/events/[id]/inscripcion/InscriptionForm.tsx`
- **Estado:** Completo (campos dinámicos, validación, envío)
- **Depende de:** Migración 00028

---

## 4. FUNCIONES RPC DE SUPABASE

### Implementadas (en migraciones aplicadas)
| Función | Migración | Uso |
|---------|-----------|-----|
| `find_user_id_by_email()` | 00025 | Invitar miembros a comunidades |

### Pendientes (en migraciones NO aplicadas)
| Función | Migración | Uso |
|---------|-----------|-----|
| `has_permission(user_id, community_id, permission_key)` | 00030 | RLS policies de autorización |
| `get_user_permissions(user_id, community_id)` | 00030 | Query de permisos en `lib/queries.ts` |

---

## 5. SERVER ACTIONS — ESTADO

Todas las server actions están **implementadas y completas**:

| Archivo | Funciones | Estado |
|---------|-----------|--------|
| `lib/actions/auth.ts` | `loginWithPassword`, `registerUser` | OK |
| `lib/actions/events.ts` | `createEvent`, `updateEvent`, `deleteEvent`, `updateEventStatus`, `updateEventRegistrationFields` | OK |
| `lib/actions/signup.ts` | `signupVolunteer` (con extra_data para campos dinámicos) | OK |
| `lib/actions/volunteers.ts` | `updateVolunteerStatus`, `updateVolunteerRole`, `updateVolunteerHours` | OK |
| `lib/actions/volunteerSelf.ts` | `cancelApplication` | OK |
| `lib/actions/communities.ts` | `createCommunity`, `updateCommunity`, `inviteMember`, `removeMember`, `changeMemberRole`, `leaveCommunity`, `approveCommunityRequest`, `rejectCommunityRequest`, `createRole`, `updateRole`, `deleteRole` | OK |
| `lib/actions/institutions.ts` | `createInstitution`, `updateInstitution`, `deleteInstitution`, `updateInstitutionStatus`, `linkInstitutionUser` | OK |
| `lib/actions/reviews.ts` | `createReview`, `deleteReview` | OK |
| `lib/actions/users.ts` | `changeUserRole`, `getAllUsers` | OK |

---

## 6. QUERIES — ESTADO

Todas las queries están **implementadas y completas** en `lib/queries.ts`. No hay queries faltantes.

---

## 7. API REST

No se utilizan rutas `/api/`. Todo el backend usa **Server Actions de Next.js**, lo cual es correcto y no requiere endpoints REST adicionales.

---

## 8. INTEGRACIONES PENDIENTES

| Qué | Dónde integrar | Descripción | Prioridad |
|-----|----------------|-------------|-----------|
| FormBuilderModal | `/dashboard/events/[slug]/edit/page.tsx` y `/dashboard/events/new/page.tsx` | Botón "Configurar Formulario de Inscripción" que abra el modal | MEDIA |
| Badge de estado | `components/EventCard.tsx` | Mostrar si el evento está activo/finalizado/borrador | BAJA |
| Notificaciones por email | No implementado | Notificar al voluntario cuando su postulación es aprobada/rechazada | BAJA |
| Exportar datos | No implementado | Exportar lista de voluntarios a CSV/Excel | BAJA |

---

## 9. ACCIONES INMEDIATAS

### Paso 1: Aplicar migraciones (CRÍTICO)
```bash
supabase db reset   # O aplicar una por una
```

### Paso 2: Commitear archivos untracked (ALTO)
```
app/dashboard/communities/[slug]/roles/
app/dashboard/events/FormBuilderModal.tsx
app/dashboard/events/FormField.tsx
app/dashboard/permissions/
app/events/[id]/inscripcion/
supabase/migrations/00028_registration_fields.sql
supabase/migrations/00029_set_admin_user.sql
supabase/migrations/00030_granular_permissions.sql
supabase/migrations/00031_migrate_roles.sql
```

### Paso 3: Crear página faltante (ALTO)
```
app/dashboard/events/[slug]/page.tsx
```

### Paso 4: Integrar FormBuilder en edición de eventos (MEDIO)

---

## 10. RESUMEN

| Categoría | Total | Completo | Pendiente |
|-----------|-------|----------|-----------|
| Migraciones | 31 | 27 | 4 |
| Server Actions | 9 archivos | 9 | 0 |
| Queries | 20+ funciones | 20+ | 0 |
| Páginas dashboard | 15 | 14 | 1 |
| Páginas públicas | 8 | 8 | 0 |
| RPCs Supabase | 3 | 1 | 2 |
| API REST | 0 | N/A | N/A |

**Backend: ~95% completo.** Lo pendiente es aplicar migraciones y crear 1 página de dashboard.
