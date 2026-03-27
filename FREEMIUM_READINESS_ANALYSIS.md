# 📋 Análisis: ¿Está Capi Listo para Freemium?

**Fecha:** Marzo 2026
**Proyecto:** Capi MVP
**Análisis de:** Tech Stack, Base de Datos, Funcionalidades

---

## 🎯 Resumen Ejecutivo

### Estado Actual

```
READINESS PARA FREEMIUM: 60% ✅ (Buena base, pero falta monetización)

✅ YA TIENE:
├─ Base de datos bien estructurada
├─ Autenticación implementada
├─ Crear/gestionar eventos
├─ Gestión de voluntarios
├─ Sistema de comunidades
├─ Análisis básicos
└─ TypeScript + Supabase (buena arquitectura)

❌ LE FALTA:
├─ Sistema de planes/suscripciones
├─ Control de límites por plan
├─ Pasarela de pagos (Stripe)
├─ Sistema de facturación
├─ Reportes avanzados (para Pro)
├─ API para integraciones
└─ Analytics para negocio
```

---

## ✅ Lo Que YA FUNCIONA Para Freemium

### 1. Autenticación ✅

```typescript
// ✅ Ya existe
├─ Supabase Auth implementado
├─ Login/Signup funcional
├─ Protección de rutas
├─ Roles de usuario (admin, lider, miembro)
└─ RLS (Row Level Security) en BD
```

**Archivo:** `lib/auth.ts`, `lib/authorization.ts`

```
Status: ✅ LISTO PARA FREEMIUM
└─ Puedes identificar si usuario es free o pro
```

---

### 2. Crear y Gestionar Eventos ✅

```typescript
// ✅ Ya existe
├─ createEvent() → Crear eventos
├─ updateEvent() → Editar eventos
├─ deleteEvent() → Eliminar eventos
├─ queryEvents() → Listar eventos
└─ Soporte para roles en eventos
```

**Archivo:** `lib/actions/events.ts`

```
Status: ✅ LISTO PARA FREEMIUM
└─ Funciona 100% para plan free
└─ Puedes limitar a X eventos por plan
```

---

### 3. Gestión de Voluntarios ✅

```typescript
// ✅ Ya existe
├─ Registrar voluntarios
├─ Asignar a eventos
├─ Tracking de estado (pendiente, aprobado, rechazado)
├─ Horas de voluntariado
└─ Ratings y reviews
```

**Archivo:** `lib/actions/volunteers.ts`

```
Status: ✅ LISTO PARA FREEMIUM
└─ Sistema completo de voluntarios
└─ Puedes limitar capacidad por plan
```

---

### 4. Sistema de Comunidades ✅

```typescript
// ✅ Ya existe
├─ Crear comunidades
├─ Asignar miembros
├─ Roles dentro de comunidades (lider, miembro, admin)
└─ Eventos por comunidad
```

**Archivo:** `lib/actions/communities.ts`

```
Status: ✅ LISTO PARA FREEMIUM
└─ Multi-community por usuario
└─ Control de permisos implementado
```

---

### 5. Analytics Básicos ✅

```typescript
// ✅ Ya existe
├─ getStats() → Estadísticas generales
├─ Voluntarios por evento
├─ Eventos totales
├─ Estudiantes impactados
└─ Dashboard con KPIs
```

**Archivo:** `lib/queries.ts` (getStats)

```
Status: ✅ LISTO PARA FREEMIUM
└─ Ya hay analytics básicos
└─ Puedes extender para reportes Pro
```

---

### 6. Base de Datos Bien Estructurada ✅

```sql
-- ✅ Tablas implementadas:
├─ users + auth.users
├─ institutions
├─ events
├─ event_volunteers (pivote)
├─ volunteers
├─ communities
├─ community_members
├─ reviews
├─ agenda_items
└─ sponsors
```

**Status:**
```
✅ SCHEMA es flexible
✅ Puedes agregar tablas de subscription fácil
✅ RLS ya está implementado (seguridad)
```

---

## ❌ Lo Que FALTA Para Freemium Completo

### 1. Sistema de Planes y Suscripciones ❌

**Lo que se necesita:**

```sql
-- CREAR TABLA: subscription_plans
CREATE TABLE subscription_plans (
  id uuid PRIMARY KEY,
  name VARCHAR(50),           -- 'free', 'pro', 'enterprise'
  price DECIMAL,              -- $0, $29, $99
  features JSONB,             -- Features por plan
  created_at TIMESTAMPTZ
);

-- CREAR TABLA: user_subscriptions
CREATE TABLE user_subscriptions (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users,
  plan_id uuid REFERENCES subscription_plans,
  status VARCHAR(20),         -- 'active', 'canceled', 'expired'
  started_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  payment_method VARCHAR(20), -- 'stripe', 'manual'
  stripe_customer_id VARCHAR(100),
  stripe_subscription_id VARCHAR(100),
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);

-- CREAR TABLA: organization_subscriptions
CREATE TABLE organization_subscriptions (
  id uuid PRIMARY KEY,
  organization_id uuid,       -- ONG ID
  plan_id uuid REFERENCES subscription_plans,
  status VARCHAR(20),
  started_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  stripe_customer_id VARCHAR(100),
  created_at TIMESTAMPTZ
);
```

**Impacto:**
```
❌ NO EXISTE
└─ Tienes que agregar tablas
└─ Tiempo: 2-3 horas (schema SQL + migrations)
```

---

### 2. Pasarela de Pagos (Stripe) ❌

**Lo que se necesita:**

```typescript
// Instalar Stripe
npm install stripe @stripe/stripe-js

// Crear cliente de Stripe
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Implementar endpoints:
├─ POST /api/stripe/checkout        (crear sesión checkout)
├─ POST /api/stripe/webhook          (webhook de Stripe)
├─ GET /api/stripe/customer          (obtener cliente)
└─ POST /api/stripe/cancel-sub       (cancelar suscripción)

// Implementar en UI:
├─ Pricing page (mostrar planes)
├─ Checkout form
├─ Billing portal
└─ Receipt/invoice
```

**Impacto:**
```
❌ NO EXISTE
└─ Tiempo: 8-12 horas (integración + testing)
└─ Complejidad: ALTA (PCI compliance, webhooks, etc.)
```

---

### 3. Control de Límites por Plan ❌

**Lo que se necesita:**

```typescript
// Crear middleware de límites
export async function checkPlanLimits(
  userId: string,
  feature: 'events' | 'volunteers' | 'reports' | 'api'
) {
  const subscription = await getUserSubscription(userId);
  const plan = PLAN_CONFIG[subscription.plan];

  // Verificar límite
  if (userUsage[feature] >= plan.limits[feature]) {
    throw new Error('Plan limit exceeded');
  }
}

// Donde PLAN_CONFIG es:
const PLAN_CONFIG = {
  free: {
    events: Infinity,              // Ilimitado
    volunteers: Infinity,          // Ilimitado
    reports: { basic: true },      // Solo reportes básicos
    api: false,
    support: 'community'
  },
  pro: {
    events: Infinity,
    volunteers: Infinity,
    reports: { basic: true, advanced: true },
    api: false,
    support: 'email'
  },
  enterprise: {
    events: Infinity,
    volunteers: Infinity,
    reports: { basic: true, advanced: true, custom: true },
    api: true,
    support: 'dedicated'
  }
};

// Implementar en acciones:
export async function createEvent(data) {
  await checkPlanLimits(user.id, 'events');  // ← Agregar verificación
  // ... resto del código
}
```

**Impacto:**
```
❌ NO EXISTE (parcialmente)
└─ Tiempo: 4-6 horas
└─ Necesita:
   ├─ Actualizar eventos action
   ├─ Actualizar volunteers action
   ├─ Middleware de checks
   └─ Testing
```

---

### 4. Reportes Avanzados para Plan Pro ❌

**Lo que se necesita:**

```typescript
// Endpoints nuevos:
export async function getAdvancedAnalytics(organizationId: string) {
  return {
    // Basic (Free)
    totalVolunteers: number,
    totalEvents: number,

    // Advanced (Pro)
    volunteerRetention: percentage,    // % que vuelve
    volunteerDemographics: breakdown,  // Edad, género, ubicación
    eventROI: number,                  // $ impacto social
    trendAnalysis: trend[],            // Tendencias
    reportExport: {
      csv: true,
      pdf: true,
      excel: true
    },

    // Custom (Enterprise)
    customReports: true,
    dataWarehouse: true,
    api: true
  };
}

// UI Components:
├─ BasicAnalytics (Free)
├─ AdvancedAnalytics (Pro)
├─ CustomReports (Enterprise)
└─ ExportOptions (Pro+)
```

**Impacto:**
```
❌ NO EXISTE
└─ Tiempo: 12-16 horas
└─ Requiere:
   ├─ Queries SQL complejas
   ├─ UI charts (usar Chart.js o Recharts)
   ├─ Report generation (pdf/csv)
   └─ Caching de analytics
```

---

### 5. Facturación y Facturas ❌

**Lo que se necesita:**

```typescript
// Tabla: invoices
CREATE TABLE invoices (
  id uuid PRIMARY KEY,
  organization_id uuid,
  stripe_invoice_id VARCHAR(100),
  amount DECIMAL,
  currency VARCHAR(3),
  status VARCHAR(20),           -- 'paid', 'pending', 'failed'
  invoice_number VARCHAR(20),   -- INV-2026-001
  pdf_url TEXT,
  issued_at TIMESTAMPTZ,
  due_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ
);

// Endpoints:
├─ GET /api/invoices            (listar facturas)
├─ GET /api/invoices/:id        (descargar PDF)
├─ POST /api/invoices/retry     (reintentar pago)
└─ GET /api/invoices/:id/pdf    (generar PDF)

// Usar librería: jsPDF or html2pdf
npm install jspdf html2canvas
```

**Impacto:**
```
❌ NO EXISTE
└─ Tiempo: 6-8 horas
└─ Requiere:
   ├─ Tabla en BD
   ├─ Integración Stripe
   ├─ Generación de PDF
   └─ Email de facturas
```

---

### 6. Integración de APIs (Para Enterprise) ❌

**Lo que se necesita:**

```typescript
// Endpoints públicos de API:
export async function createApiKey(organizationId: string) {
  return {
    apiKey: generateSecureKey(),
    createdAt: now(),
    expiresAt: inOneYear()
  };
}

// Endpoints API:
GET    /api/v1/events
POST   /api/v1/events
GET    /api/v1/events/:id
PUT    /api/v1/events/:id
DELETE /api/v1/events/:id

GET    /api/v1/volunteers
POST   /api/v1/volunteers/:eventId
GET    /api/v1/volunteers/:id

// Auth:
header('Authorization: Bearer API_KEY')

// Rate limiting:
1000 requests/hora para Free (si lo permitimos)
10,000 requests/hora para Pro
Unlimited para Enterprise
```

**Impacto:**
```
❌ NO EXISTE
└─ Tiempo: 16-20 horas
└─ Requiere:
   ├─ API routes structure
   ├─ Rate limiting middleware
   ├─ API key management
   ├─ Documentation (OpenAPI/Swagger)
   └─ API test suite
```

---

## 📊 Tabla de Implementación

### ¿Cuánto Trabajo Falta?

```
FEATURE                      TIEMPO   COMPLEJIDAD   CRÍTICO?
────────────────────────────────────────────────────────────
1. Tablas de Suscripción     2h       BAJA          🔴 SÍ
2. Pasarela Stripe           10h      ALTA          🔴 SÍ
3. Límites por Plan          5h       MEDIA         🟡 IMPORTANTE
4. Reportes Avanzados        14h      MEDIA         🟡 IMPORTANTE
5. Facturación               7h       MEDIA         🟡 IMPORTANTE
6. API (Enterprise)          18h      ALTA          🟢 NO URGENTE

TOTAL: ~56 horas = ~7 días de trabajo
TOTAL CRÍTICO: ~17 horas = 2-3 días
```

---

## 🚀 Plan de Implementación

### Fase 1: MVP Freemium (Crítico) - 3 días

```
DÍA 1: Estructura de Suscripciones
├─ Crear tablas SQL (2 horas)
├─ Crear migrations (1 hora)
├─ Implementar checks de plan (2 horas)
└─ Testing básico (1 hora)

DÍA 2: Stripe Integration
├─ Setup cuenta Stripe (1 hora)
├─ Crear checkout endpoint (3 horas)
├─ Webhook handler (2 horas)
├─ Actualizar subscription en BD (2 horas)
└─ Testing (2 horas)

DÍA 3: UI y Control de Límites
├─ Pricing page (3 horas)
├─ Checkout flow (3 horas)
├─ Aplicar límites en acciones (2 horas)
└─ Testing E2E (2 horas)

RESULTADO: ✅ Freemium funcional (sin reportes avanzados)
```

---

### Fase 2: Pro Features (Importante) - 4 días

```
DÍA 4-5: Reportes Avanzados
├─ Queries SQL avanzadas (4 horas)
├─ Charts/Visualización (4 horas)
├─ UI de reportes (4 horas)
└─ Export CSV/PDF (4 horas)

DÍA 6: Facturación
├─ Tabla invoices (2 horas)
├─ PDF generation (3 horas)
├─ Billing portal UI (3 horas)
└─ Email de facturas (2 horas)

DÍA 7: Polish y Testing
├─ Bugs fixes (4 horas)
├─ Testing completo (4 horas)
└─ Documentación (2 horas)

RESULTADO: ✅ Pro plan con reportes + facturación
```

---

### Fase 3: Enterprise (Futuro) - 3 días

```
DÍA 8-10: API Pública
├─ Estructura API routes (3 horas)
├─ Endpoints core (8 horas)
├─ Rate limiting (3 horas)
├─ Documentación Swagger (4 horas)
└─ Testing suite (4 horas)

RESULTADO: ✅ Enterprise con API
```

---

## 📝 Checklist Técnico: ¿Qué Hacer Ahora?

### ✅ Paso 1: Preparar Schema de BD (Ahora)

```bash
# Crear migration para suscripciones
supabase migration create add_subscriptions

# Contenido:
-- subscription_plans
-- user_subscriptions (para individuos)
-- organization_subscriptions (para ONGs/empresas)
-- plan_features
-- usage_tracking
```

### ✅ Paso 2: Instalar Dependencias

```bash
npm install stripe @stripe/stripe-js jspdf html2canvas
```

### ✅ Paso 3: Crear Variables de Entorno

```
.env.local:
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### ✅ Paso 4: Crear API Routes Stripe

```typescript
// app/api/stripe/checkout/route.ts
// app/api/stripe/webhook/route.ts
// app/api/stripe/portal/route.ts
```

### ✅ Paso 5: Actualizar Acciones

```typescript
// lib/actions/events.ts
// Agregar: await checkPlanLimits(user.id, 'events')

// lib/actions/reports.ts (nueva)
// Reportes avanzados por plan
```

### ✅ Paso 6: Crear Pricing Page

```typescript
// app/pricing/page.tsx
// Mostrar planes free/pro/enterprise
```

---

## 🎯 Recomendación Final

### Para Lanzar Freemium MVP (Marzo 2026)

**Enfoque Mínimo Viable:**

```
✅ IMPLEMENTAR AHORA (Semana 1):
├─ Tablas de suscripciones
├─ Stripe checkout básico
├─ Pricing page simple
├─ Límite de eventos/voluntarios por plan
└─ Webhook de Stripe

❌ DEJAR PARA DESPUÉS (Semana 3-4):
├─ Reportes avanzados (Pro)
├─ Facturación detallada
├─ API pública
└─ Billing portal Stripe
```

**Por qué:**
```
1. Necesitas validar si usuarios pagan
2. No necesitas reportes avanzados para eso
3. Puedes agregar después
4. Stripe checkout es suficiente para MVP
```

---

## 📈 Estimación de Esfuerzo

### Timeline Realista

```
SEMANA 1 (17 horas):
├─ Lunes: Schema + Stripe setup
├─ Martes: Checkout implementado
├─ Miércoles: Límites funcionales
├─ Jueves: Testing
└─ Viernes: Lanzar MVP

SEMANA 2: Validación + bugs

SEMANA 3-4: Pro features (si métricas son buenas)
```

---

## ✨ Conclusión

### Estado Actual

```
FREEMIUM READINESS: 60% ✅

✅ TODO FUNCIONA:
└─ Crear eventos, voluntarios, comunidades
└─ Autenticación, autorización
└─ Analytics básicos
└─ Base de datos solid

❌ FALTA:
└─ Sistema de pagos (2-3 días)
└─ Control de límites (1-2 días)
└─ Pro features (future)

VEREDICTO:
Puedes lanzar MVP freemium en 2-3 semanas
La base técnica es SÓLIDA
```

---

**Documento preparado:** Marzo 2026
**Para:** Equipo Capi
**Próximo paso:** Crear schema de suscripciones

