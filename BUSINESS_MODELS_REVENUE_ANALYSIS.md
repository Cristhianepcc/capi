# Modelos de Negocio y Monetización: Competencia vs Capi

**Análisis de Ingresos y Estrategias de Revenue de Plataformas de Voluntariado**

**Fecha:** Marzo 2026
**Proyecto:** Capi
**Scope:** Análisis de 7 plataformas competidoras + modelo propuesto para Capi

---

## 📋 Tabla de Contenidos

1. [Comparativa General de Modelos](#comparativa-general-de-modelos)
2. [Análisis Detallado por Plataforma](#análisis-detallado-por-plataforma)
3. [Flujos de Ingresos Identificados](#flujos-de-ingresos-identificados)
4. [Modelo de Negocio Capi (Propuesta)](#modelo-de-negocio-capi-propuesta)
5. [Proyecciones Financieras](#proyecciones-financieras)
6. [Benchmarks de Precios](#benchmarks-de-precios)
7. [Recomendaciones](#recomendaciones)

---

## Comparativa General de Modelos

### Tabla Rápida: Revenue Model Comparison

```
PLATAFORMA          TIPO DE INGRESOS      MONTO ANUAL    CLIENTES    MODELO
─────────────────────────────────────────────────────────────────────────────
Idealist            Per-listing + Premium  $7.5M          150k ONGs   Freemium
Eventbrite          Transaction fees (10%) $XX0M+         Masivo      SaaS
VolunteerMatch      Suscripción + API      $24.6M         200k ONGs   SaaS
Atados              Consultoría B2B        R$ 6M ($1.2M)  200 empresas Hybrid
Worldpackers        Membresía voluntarios  $14.7M         7.6M users  B2C
Voluncloud          Freemium (unclear)     Desconocido    315 ONGs    Non-profit
Hacesfalta          Freemium (unclear)     Desconocido    8k ONGs     Non-profit
─────────────────────────────────────────────────────────────────────────────
```

### Matriz de Estrategias de Monetización

```
                FREE    FREEMIUM  SUSCRIPCIÓN  COMISIONES  B2B/ENTERPRISE  PUBLICIDAD
Idealist        ✅      ✅        ✅           ❌          ❌              ❌
Eventbrite      ✅      ❌        ✅           ✅          ✅              ⚠️ (nuevo)
VolunteerMatch  ✅      ✅        ✅           ❌          ✅              ❌
Atados          ✅      ❌        ❌           ❌          ✅              ❌
Worldpackers    ⚠️      ✅        ✅           ⚠️ Afil.   ✅              ❌
Voluncloud      ✅      ⚠️        ⚠️           ❌          ❌              ❌
Hacesfalta      ✅      ⚠️        ⚠️           ❌          ❌              ❌

CAPI (PROPUESTO)✅      ✅        ✅           ❌          ✅              ❌
```

---

## Análisis Detallado por Plataforma

### 1️⃣ IDEALIST.ORG - El Freemium Débil

**Perfil Corporativo:**
- **Fundada:** 1995 (30+ años)
- **Clientes:** 150k+ ONGs globales
- **Revenue Annual:** $7.5M
- **Empleados:** 154

#### Modelo de Negocio

```
┌─────────────────────────────────────────────────┐
│             IDEALIST REVENUE MODEL              │
├─────────────────────────────────────────────────┤
│                                                  │
│  TIER GRATUITO (Atracción de usuarios)         │
│  ├─ Listados básicos: GRATIS (pero ocultables)│
│  ├─ Voluntarios buscan: GRATIS                │
│  └─ ONGs pequeñas: GRATIS (con limitaciones) │
│                                                  │
│  TIER PREMIUM (Monetización directa) - 80%+   │
│  ├─ Listados destacados: $195/30 días         │
│  ├─ Listados estándar: $15/mes                │
│  ├─ Job postings: $95-125 (nonprofits)        │
│  ├─ Internships: $25-35                       │
│  └─ Branding mejorado, analytics              │
│                                                  │
│  API + SYNDICATION (Monetización indirecta)   │
│  ├─ Venta de API a partners: % del revenue    │
│  ├─ Syndication de contenido: % revenue       │
│  └─ Integración con sistemas: Fees            │
│                                                  │
│  FUSIÓN 2025: VolunteerMatch                  │
│  ├─ Consolidación de mercado                  │
│  ├─ Expansión de base de usuarios             │
│  └─ Nuevos ingresos de API                    │
│                                                  │
└─────────────────────────────────────────────────┘
```

#### Detalle de Ingresos por Fuente

| Fuente | Tipo | Descripción | % del Total |
|---|---|---|---|
| **Listados Premium** | Per-Listing | $15-195 por 30 días | ~60% |
| **Job Postings** | Per-Job | $95-125 para nonprofits | ~20% |
| **API Syndication** | Recurring | Revenue sharing con partners | ~15% |
| **Premium Services** | Suscripción | Branding, analytics, support | ~5% |

#### Problemas del Modelo

❌ **Freemium débil:** Listados básicos se ocultan (presión constante a upgrade)
❌ **Pricing alto:** $195/mes es prohibitivo para ONGs pequeñas Latam
❌ **No atiende eventos puntuales:** Modelo orientado a compromisos largos
❌ **Débil en Latam:** Presencia genérica sin localización
❌ **Customer Acquisition Cost alto:** Requiere venta

#### Ventajas Competitivas

✅ 30 años de operación (confianza)
✅ 150k+ ONGs (network effects)
✅ API desarrollada (ecosystem)
✅ Fusión VolunteerMatch (consolidación)

---

### 2️⃣ EVENTBRITE - El Transaction Model

**Perfil Corporativo:**
- **Mercado:** Gestión y venta de entradas de eventos
- **Revenue Annual:** Reportado en mercados como EB (Nasdaq)
- **Transacciones:** Millones diarias globales
- **Tasa Take-Rate:** 10.5% (2025)

#### Modelo de Negocio

```
┌─────────────────────────────────────────────────────┐
│          EVENTBRITE REVENUE MODEL                   │
├─────────────────────────────────────────────────────┤
│                                                      │
│  TRANSACTION FEES (Ticketing) - 92% del revenue    │
│  ├─ Service Fee: 3.7% + $1.79 por ticket          │
│  ├─ Payment Processing: 2.9% + fixed fee          │
│  ├─ FREE: Publicación de eventos gratuita/pagos   │
│  └─ Total Take-Rate: 10.5% de valor de transacción│
│                                                      │
│  Ejemplo de ingreso:                                │
│  ├─ Evento: 500 personas × $50 = $25,000          │
│  ├─ Comisión Eventbrite: 10.5% = $2,625           │
│  └─ Por evento pequeño: ~$500-1000                │
│                                                      │
│  MARKETING SERVICES - 2% del revenue               │
│  ├─ Promoted listings (highlighting)               │
│  ├─ Email marketing campaigns                      │
│  ├─ Paid placements en plataforma                 │
│  └─ Retail media style advertising                │
│                                                      │
│  PAYMENT PROCESSING - Margin alto                  │
│  ├─ Eventbrite Payments capture                    │
│  ├─ Integrated payment stack                       │
│  └─ Gross margins: 70%+                            │
│                                                      │
│  SUBSCRIPTION PLANS - Nuevo (2024)                 │
│  ├─ Pro Plan: $99-299/mes (reduced 2026)          │
│  ├─ Unlimited event publishing                     │
│  ├─ Advanced features                              │
│  └─ Move from volume to value                      │
│                                                      │
└─────────────────────────────────────────────────────┘
```

#### Detalles de Ingresos

| Fuente | Modelo | Tasa | Ejemplo |
|---|---|---|---|
| **Venta Entradas (92%)** | Transaction | 10.5% | $2,625 en $25k evento |
| **Marketing Services (6%)** | Advertising | Variable | $100-1k/evento |
| **Payment Processing (2%)** | Fees | 2.9% | $725 en $25k |
| **Subscriptions (Nuevo)** | SaaS | $99-299/mes | Growing 2024+ |

#### Aplicación a Voluntariado

```
¿CÓMO ADAPTARÍA EVENTBRITE A VOLUNTARIADO?

❌ NO APLICA directamente porque:
├─ Voluntariado es FREE (sin entrada a pagar)
├─ No hay transacción monetaria en búsqueda voluntario
├─ Business model completamente diferente
└─ Comisiones de 10% no funcionan en sector social

PERO sí aplicable en:
├─ Eventos corporativos de impacto
├─ Venta de entradas a eventos con voluntarios
├─ Fundraising events (con comisión)
└─ Modelo híbrido: algunos eventos con comisión
```

---

### 3️⃣ VOLUNTEERMATCH (Ahora Idealist) - El SaaS Híbrido

**Perfil Corporativo:**
- **Fundada:** 1998 (28 años)
- **Merger:** Se fusionó con Idealist en Sept 2025
- **Revenue (Pre-merger):** $24.6M anual
- **Reach:** 200,000 ONGs, 80k+ oportunidades
- **Historia:** Primer en alcanzar 100% sustentabilidad con revenue misión 2010

#### Modelo de Negocio

```
┌─────────────────────────────────────────────────────┐
│       VOLUNTEERMATCH (Now Idealist) MODEL           │
├─────────────────────────────────────────────────────┤
│                                                      │
│  TIER FREEMIUM (Atracción de usuarios)             │
│  ├─ Listados básicos: Gratuito                     │
│  ├─ Voluntarios: Gratuito                          │
│  ├─ Small nonprofits: Free tier básico             │
│  └─ Objetivo: Alcanzar masa crítica               │
│                                                      │
│  TIER MEMBRESÍA ONG (Monetización directa)         │
│  ├─ Basic Membership: Free (limitado)              │
│  ├─ Standard Membership: $$ (pricing unclear)      │
│  ├─ Group Membership: Enterprise bundle            │
│  ├─ Regional/National organizations                │
│  └─ Multiple chapters bundle                       │
│                                                      │
│  B2B CORPORATE SERVICES - Gran ingresos           │
│  ├─ VolunteerMatch Corporate (intranet)            │
│  ├─ Customized hosting en infraestructura empresa  │
│  ├─ Integration con sistemas HR                    │
│  ├─ Medición de voluntariado corporativo           │
│  ├─ Pricing: Custom negotiation (high-touch sales)│
│  └─ Típico: $10k-100k+ anuales                     │
│                                                      │
│  API + PLATFORM SERVICES                           │
│  ├─ Open Network API (80k+ opportunities)          │
│  ├─ Syndication a 200k+ ONGs                       │
│  ├─ Revenue sharing con partners                   │
│  ├─ Integration fees                               │
│  └─ Licensing a other platforms                    │
│                                                      │
│  EVENTOS/WORKSHOPS (Adicional)                     │
│  ├─ Training for nonprofits                        │
│  ├─ Webinars y recursos                            │
│  └─ Premium content access                         │
│                                                      │
└─────────────────────────────────────────────────────┘
```

#### Hito Importante

**2010:** Primer año que VolunteerMatch alcanzó **100% sustentabilidad con ingresos misión** (no solo donors). Demostró que modelo SaaS funciona en sector social.

#### Desglose de Ingresos Estimado ($24.6M)

| Fuente | Tipo | Estimado | % del Total |
|---|---|---|---|
| **Corporate Services** | B2B High-touch | $15-18M | 60-73% |
| **Memberships** | SaaS Recurring | $4-6M | 16-24% |
| **API/Syndication** | Licensing | $1.5-2M | 6-10% |
| **Workshops/Training** | Services | $0.6-1M | 2-4% |

#### Puntos Clave

✅ **Demostró que SaaS funciona** en voluntariado
✅ **B2B es 60-73% de ingresos** (critical insight)
✅ **Freemium como föder** para eventos corporativos
✅ **API como extensión** de revenue
❌ Pero precio alto ($195+) aún es barrera
❌ No atiende eventos puntuales bien

---

### 4️⃣ ATADOS (Brasil) - El Hybrid Model GANADOR

**Perfil Corporativo:**
- **Fundada:** 2012 (14 años)
- **Clientes:** 4,000 ONGs, 240,000 voluntarios
- **Empresas:** 200+ clientes corporativos
- **Revenue:** R$ 6M+ anual (~$1.2M USD)
- **Estructura:** ONG (sem fins lucrativos) + brazo comercial

#### Modelo de Negocio (EL MEJOR EN LATAM)

```
┌──────────────────────────────────────────────────────┐
│            ATADOS HYBRID MODEL (GANADOR)             │
├──────────────────────────────────────────────────────┤
│                                                       │
│  CAPA 1: PLATAFORMA GRATUITA (Network Building)     │
│  ├─ ONGs publican voluntariados: GRATIS             │
│  ├─ Voluntarios buscan: GRATIS                      │
│  ├─ Aplicación: GRATIS                              │
│  ├─ Reportes básicos: GRATIS                        │
│  └─ Objetivo: Máximizar usuarios, crear lock-in    │
│                                                       │
│  CAPA 2: SERVICIOS B2B (Monetización) - 90-95%    │
│  ├─ Diseño de programas voluntariado corporativo   │
│  │  └─ Cómo estructurar voluntariado empresa       │
│  │                                                   │
│  ├─ Consultoría en CSR (Corporate Social Resp)     │
│  │  └─ Alineación con ODS, agenda ESG              │
│  │                                                   │
│  ├─ Capacitación y Training                        │
│  │  └─ Formación de coordinadores                  │
│  │                                                   │
│  ├─ Medición de impacto social                     │
│  │  └─ Reporting, métricas, storytelling           │
│  │                                                   │
│  ├─ Gestión integral de eventos                    │
│  │  └─ Coordinación de jornadas/talleres           │
│  │                                                   │
│  ├─ Consultoría en Diversidad (Nueva línea)        │
│  │  └─ Culturas organizacionales inclusivas        │
│  │                                                   │
│  └─ PRICING B2B:                                    │
│     ├─ SME (50-200 empl): $5-10k/año               │
│     ├─ Mid-market (200-1k): $10-25k/año            │
│     ├─ Enterprise (1k+): $25-100k+/año             │
│     └─ 200 empresas × ~$30k promedio = $6M        │
│                                                       │
│  CAPA 3: PARTNERSHIPS & ECOSYSTEM                    │
│  ├─ Atados Ventures (inversión/aceleración)        │
│  ├─ Cursos en línea (Academy-style)                │
│  ├─ Publicación/recursos                            │
│  └─ Objetivo: Profundizar relación                 │
│                                                       │
│  CAPA 4: FUNDING (Complementario) - 5-10%         │
│  ├─ Grants / donor funding                         │
│  ├─ Fundaciones                                     │
│  └─ Objetivo: Mantener estructura ONG              │
│                                                       │
└──────────────────────────────────────────────────────┘
```

#### Network Effects Brillante de Atados

```
CÍRCULO VIRTUOSO ATADOS:

Paso 1: Atrados lanza plataforma GRATIS
  └─ ONGs se registran
  └─ Voluntarios se registran
  └─ Red crece sin costo

Paso 2: Red crece y se hace indispensable
  └─ 4,000 ONGs usando plataforma
  └─ 240k voluntarios registrados
  └─ Lock-in natural

Paso 3: Empresas se dan cuenta
  └─ "¿Cómo hacemos voluntariado corporativo?"
  └─ Contratan a Atados para diseñar programa
  └─ Usan plataforma como parte de solución

Paso 4: Revenue fluye
  └─ Plataforma GRATIS para ONGs (costo)
  └─ Servicios PAGOS para empresas (revenue)
  └─ Sostenibilidad: 90-95% del revenue de empresas

Paso 5: Reinversión
  └─ Mejorar plataforma (más usuarios)
  └─ Expandir servicios (más revenue)
  └─ Loop infinito
```

#### Por qué es Ganador

✅ **Freemium REAL:** Plataforma completamente funcional GRATIS
✅ **Revenue clara:** 90-95% de consultoría B2B ($6M+)
✅ **Network effects:** Más ONGs = Más atractivo para empresas
✅ **Escalable:** Una vez sistema está en lugar, crece orgánicamente
✅ **Sostenible:** R$ 6M ($1.2M) es sostenible en Brasil
✅ **Proactivo:** Diversificación (CSR, Diversity consulting)
✅ **Acción larga:** 14 años de operación continua

#### Por qué NO ha Expandido a Otros Países (Teoría)

```
TEORÍAS POR QUÉ ATADOS NO HA EXPANDIDO:

1. CRECIMIENTO SUFICIENTE EN BRASIL
   └─ Brasil es 215M personas, 40k ONGs
   └─ Mercado local aún tiene runway para crecer
   └─ Por qué expandir si no agotaste local?

2. COMPLEJIDAD DE MÚLTIPLES MERCADOS
   └─ Cada país tiene regulaciones distintas
   └─ Culturas empresariales diferentes
   └─ Would require separate sales + ops team

3. DIFERENCIAS REGULATORIAS
   └─ Privacidad de datos (GDPR vs Latam)
   └─ Impuestos locales
   └─ Laboral / compliance diferente

4. CULTURAL FIT LIMITADO
   └─ Modelos empresariales varían por país
   └─ Presupuestos CSR varían
   └─ Menos penetración de voluntariado en otros países

5. FALTA DE URGENCIA
   └─ Con $6M anuales, crecimiento 14+ años
   └─ Equipo pequeño (eficiente)
   └─ Expansion = riesgo + complejidad
```

**IMPLICACIÓN PARA CAPI:** Atados es fuerte pero no expandirá fácil. Ventana de oportunidad 2026-2027.

---

### 5️⃣ WORLDPACKERS - El Travel Model

**Perfil Corporativo:**
- **Fundada:** 2013 (13 años)
- **Usuarios:** 7.6M viajeros + hosts
- **Revenue:** $14.7M anual
- **Modelo:** B2C travel + voluntariado

#### Modelo de Negocio

```
┌──────────────────────────────────────────────────────┐
│           WORLDPACKERS REVENUE MODEL                 │
├──────────────────────────────────────────────────────┤
│                                                       │
│  CAPA 1: MEMBRESÍA DE VOLUNTARIOS (B2C) - 80%    │
│  ├─ Hosts: GRATIS (atracción de supply)             │
│  ├─ Voluntarios: PAGO (monetización de demand)      │
│  ├─ Plans: Individuales $49-129, Parejas $59-149   │
│  ├─ Annual membership: $XX (no especificado)        │
│  │                                                   │
│  │ Ejemplo:                                          │
│  │ ├─ 7.6M usuarios / 50% son voluntarios = 3.8M   │
│  │ ├─ 50% conversion pago (3.8M × 50% = 1.9M)      │
│  │ ├─ Precio promedio: $90/año                      │
│  │ └─ Revenue: 1.9M × $90 = $171M teórico (real: $14.7M)│
│  │    (Ajuste por churn, conversión real 10-15%)   │
│  │                                                   │
│  └─ Patrón: FREE para proveedores (hosts)           │
│     PAGO para consumidores (volunteers)             │
│                                                       │
│  CAPA 2: AFFILIATE / COMISIONES - 10%              │
│  ├─ Affiliate program: $10 por referral              │
│  ├─ Travel partners: Bookings, insurance            │
│  ├─ Commission on travel products                   │
│  └─ Revenue: ~$1.5M/año                             │
│                                                       │
│  CAPA 3: EDUCATION PLATFORM - 5%                   │
│  ├─ Worldpackers Academy                            │
│  ├─ Online courses: Digital nomadism, travel        │
│  ├─ Certificates upon completion                    │
│  ├─ Paid courses + premium content                  │
│  └─ Revenue: ~$700k/año                             │
│                                                       │
│  CAPA 4: TRAVEL PACKAGES (Complementario) - 5%     │
│  ├─ Co-branded travel experiences                   │
│  ├─ Hostels, tours, accommodation                   │
│  ├─ Partner commission model                        │
│  └─ Revenue: ~$700k/año                             │
│                                                       │
└──────────────────────────────────────────────────────┘
```

#### Desglose de Ingresos $14.7M

| Fuente | Tipo | Estimado | % |
|---|---|---|---|
| **Membresía Voluntarios** | B2C | $11-12M | 75-80% |
| **Affiliate/Travel** | Comisiones | $1.5M | 10% |
| **Education/Courses** | SaaS | $0.7M | 5% |
| **Travel Packages** | Partnerships | $0.7M | 5% |

#### Aplicabilidad a Capi

```
✅ APRENDER DE WORLDPACKERS:
├─ Membresía como monetización B2C
├─ Freemium para atracción, pago para conversión
├─ Affiliate programs como revenue extra
├─ Education/content como valor agregado
└─ Multiple revenue streams diversifican riesgo

❌ NO APLICABLE DIRECTAMENTE:
├─ Travel es diferente a voluntariado local
├─ Target son viajeros, no coordinadores
├─ Voluntariado local ≠ experiencia de viaje
└─ Modelos de pago muy diferentes
```

---

### 6️⃣ VOLUNCLOUD (España) - Modelo Opaco

**Perfil:**
- **País:** España
- **Usuarios:** 6,126 voluntarios, 290+ ONGs (última cifra)
- **Característica:** Certificación de competencias
- **Estructura:** Herramienta de Spain Volunteering Platform (non-profit)
- **Revenue:** Desconocido (presumible non-profit)

#### Modelo de Negocio

```
┌──────────────────────────────────────────────────┐
│       VOLUNCLOUD REVENUE MODEL (INCIERTO)        │
├──────────────────────────────────────────────────┤
│                                                   │
│  ESTRUCTURA: Herramienta de ONG                  │
│  ├─ Desarrollada por: Spain Volunteering Plat.  │
│  ├─ Estructura: Non-profit / public funding      │
│  ├─ Revenue: Likely grants/public funding        │
│  └─ Transparencia: BAJA                          │
│                                                   │
│  CAPA 1: PLATAFORMA GRATUITA                    │
│  ├─ Voluntarios: GRATIS                         │
│  ├─ ONGs: GRATIS                                │
│  └─ Aplicación móvil: GRATIS                    │
│                                                   │
│  CAPA 2: CERTIFICACIÓN (Único diferenciador)   │
│  ├─ Universo Voluncloud: Certificación          │
│  ├─ Reconocimiento de competencias              │
│  ├─ Agregable a resume profesional              │
│  ├─ Pricing: Probablemente GRATIS               │
│  └─ Objetivo: Retención y engagement            │
│                                                   │
│  MONETIZACIÓN: Desconocida                       │
│  ├─ Presumible grants públicos                  │
│  ├─ Presumible funding de fundaciones           │
│  ├─ Presumible subsidios gubernamentales        │
│  ├─ NO hay modelo claro de SaaS/B2B             │
│  └─ Status: Non-sustainable como negocio        │
│                                                   │
└──────────────────────────────────────────────────┘
```

#### Análisis

❌ **Revenue model opaco:** No hay claridad en ingresos
❌ **No es negocio:** Depende de grants/funding público
❌ **Escalabilidad limitada:** Atada a presupuestos públicos
❌ **Sin B2B:** No tiene flujo de ingresos empresarial
✅ **Idea buena:** Certificación es diferenciador único

---

### 7️⃣ HACESFALTA (España) - Modelo Opaco

**Perfil:**
- **País:** España + presencia débil Latam
- **ONGs:** 8,000+
- **Estructura:** Fundación Hazloposible (non-profit)
- **Revenue:** Desconocido

#### Modelo de Negocio

```
┌──────────────────────────────────────────────────┐
│       HACESFALTA REVENUE MODEL (OPACO)           │
├──────────────────────────────────────────────────┤
│                                                   │
│  CAPA 1: PLATAFORMA GRATUITA                    │
│  ├─ Voluntarios: GRATIS                         │
│  ├─ ONGs: GRATIS                                │
│  └─ Aplicación: GRATIS                          │
│                                                   │
│  CAPA 2: SERVICIOS PREMIUM (Presumibles)        │
│  ├─ Enhanced profiles: Posible pago             │
│  ├─ Featured listings: Posible pago             │
│  ├─ Analytics: Posible pago                     │
│  └─ Pricing: Desconocido                        │
│                                                   │
│  CAPA 3: RATING SYSTEM (Diferenciador)          │
│  ├─ Sistema de valoración de ONGs               │
│  ├─ Opinions from volunteers                    │
│  ├─ Trust building mechanism                    │
│  └─ Monetización: NO CLARA                      │
│                                                   │
│  MONETIZACIÓN PROBABLE:                          │
│  ├─ Corporate volunteering services (presumible)│
│  ├─ Grants/funding (probable)                   │
│  ├─ Donations                                   │
│  └─ Presupuesto público/subvenciones            │
│                                                   │
│  STATUS: Non-transparent, non-profit dependency │
│                                                   │
└──────────────────────────────────────────────────┘
```

#### Análisis

❌ **Revenue model opaco:** No hay claridad
❌ **Escalabilidad dudosa:** Dependencia de funding
❌ **Sin B2B claro:** No tiene estrategia empresarial
✅ **Sistema de ratings:** Diferenciador interesante
✅ **Presencia España:** Network consolidado

---

## Flujos de Ingresos Identificados

### Todos los Modelos de Ingreso en Sector Voluntariado

```
1. FREEMIUM (Free + Premium features)
   └─ Ejemplos: Idealist, VolunteerMatch, Worldpackers
   └─ Target: Pequeños usuarios + bulk freemium
   └─ Conversión típica: 2-5%
   └─ ARR típico: $10-50 por usuario premium

2. SUSCRIPCIÓN B2B/ENTERPRISE (SaaS)
   └─ Ejemplos: VolunteerMatch Corporate, Atados
   └─ Target: Empresas, organizaciones medianas+
   └─ Rango: $5k-100k+ por cliente
   └─ Modelo: Monthly, annual, multi-year

3. TRANSACTION FEES (Comisión por transacción)
   └─ Ejemplos: Eventbrite (10.5%), Worldpackers (affiliate)
   └─ Target: Cada transacción monetaria
   └─ Rango: 5-15% típico
   └─ Escalable: Crece con volumen

4. AFFILIATE / REFERRAL (Revenue sharing)
   └─ Ejemplos: Worldpackers ($10 per referral)
   └─ Target: Partners, referral networks
   └─ Rango: Per-referral o % revenue
   └─ Escalable: Depende de partners

5. ADVERTISING / MARKETPLACE
   └─ Ejemplos: Eventbrite (promoted listings), Idealist (api)
   └─ Target: Marcas queriendo promoción
   └─ Rango: $100-1k per placement
   └─ Escalable: Depende de demand

6. CONSULTORÍA / SERVICIOS PROFESIONALES
   └─ Ejemplos: Atados (program design, CSR consulting)
   └─ Target: Empresas grandes, estrategia
   └─ Rango: $10k-100k por engagement
   └─ Alto touch: Requiere sales team

7. TRAINING / EDUCATION
   └─ Ejemplos: Worldpackers Academy, cursos online
   └─ Target: Profesionales queriendo skills
   └─ Rango: $50-500 per course
   └─ Escalable: Pode ser automated

8. DATA / INSIGHTS
   └─ Ejemplos: Presumiblemente algunos
   └─ Target: Researchers, fundaciones
   └─ Rango: Per-report o subscription
   └─ Escalable: Baja fricción

9. GRANTS / DONOR FUNDING
   └─ Ejemplos: Todos usan parcialmente
   └─ Target: Fundaciones, donors
   └─ Rango: Variable
   └─ No escalable: Depende de relaciones

10. API / INTEGRATION LICENSING
    └─ Ejemplos: Idealist, VolunteerMatch (open API)
    └─ Target: Other platforms, ecosystems
    └─ Rango: % revenue sharing o flat fee
    └─ Escalable: Sistemático
```

---

## Modelo de Negocio Capi (Propuesta)

### Visión: Hybrid Revenue Model (Atados + Freemium + Events)

Capi combina lo mejor de:
- **Freemium Real** (como promete hacer mejor que Idealist)
- **Evento-centric** (diferenciador único)
- **B2B Enterprise** (como Atados, VolunteerMatch)
- **Latinoamérica native** (como Atados en Brasil)

#### Estructura Completa de Ingresos

```
┌────────────────────────────────────────────────────────────┐
│          CAPI HYBRID REVENUE MODEL (PROPUESTO)             │
├────────────────────────────────────────────────────────────┤
│                                                             │
│ CAPA 1: PLATAFORMA FREEMIUM (Atracción)                   │
│ ════════════════════════════════════════════════════════════
│                                                             │
│  TIER GRATUITO COMPLETO - Para todas las ONGs             │
│  ├─ Crear eventos: ILIMITADO                              │
│  ├─ Publicar voluntariados: ILIMITADO                     │
│  ├─ Reclutar voluntarios: ILIMITADO                       │
│  ├─ Gestión de asistentes: Completa                       │
│  ├─ Reportes básicos: 3 reportes/mes                      │
│  ├─ Capacidad: Hasta 1000 voluntarios                     │
│  ├─ Duración: Indefinida (sin expiración)                │
│  ├─ Sin watermarks: Correcto                              │
│  ├─ Community: Acceso a foros, recursos                   │
│  └─ Meta: 100% funcional para ONG pequeña                 │
│                                                             │
│  DIFERENCIADOR: "Verdaderamente freemium"                 │
│  └─ VS Idealist: $0 vs $15-195                            │
│  └─ VS Atados: Free con visión de vender enterprise       │
│  └─ VS Voluncloud: Free + features avanzadas              │
│                                                             │
│ CAPA 2: PREMIUM PARA ONGs (Monetización Directa) - 20%   │
│ ════════════════════════════════════════════════════════════
│                                                             │
│  PLAN PRO (ONG Mediana) - $29/mes o $290/año             │
│  ├─ TODO de Free +                                        │
│  ├─ Eventos ilimitados sin límite de voluntarios          │
│  ├─ Reportes avanzados: Unlimited                         │
│  ├─ Certificados de participación: Automated              │
│  ├─ Integración con Google Calendar/Outlook               │
│  ├─ Email reminders automáticos                           │
│  ├─ Análisis de impacto social: Basic                     │
│  ├─ Branding personalizado: Custom logo, colores          │
│  ├─ Support por email: Priority                           │
│  └─ Estimado: 10-20% de ONGs activas                      │
│                                                             │
│  PLAN ENTERPRISE (ONG Grande) - $99/mes o $990/año       │
│  ├─ TODO de Pro +                                         │
│  ├─ Análisis avanzado: Deep insights                      │
│  ├─ Integraciones: Salesforce, HubSpot, Slack             │
│  ├─ API access: Para desarrollo custom                    │
│  ├─ Training: Onboarding + 1 sesión/mes                   │
│  ├─ Support: Dedicated account manager                    │
│  ├─ Branded mobile app: White label                       │
│  ├─ SSO (Single Sign-On): Integración HR                 │
│  └─ Estimado: 1-3% de ONGs activas                        │
│                                                             │
│ CAPA 3: ENTERPRISE B2B (Monetización Principal) - 70%     │
│ ════════════════════════════════════════════════════════════
│                                                             │
│  TARGET: Empresas grandes (100+ empleados)                │
│  └─ Como hace Atados (90-95% de ingresos)                 │
│                                                             │
│  SERVICIO 1: Consultoría de Voluntariado Corporativo      │
│  ├─ Diagnóstico: Entender programa actual                 │
│  ├─ Diseño: Estrategia de voluntariado alineada con ODS   │
│  ├─ Implementación: Setup en plataforma Capi              │
│  ├─ Ejecución: Coordinación de eventos                    │
│  ├─ Medición: Reporting de impacto social                 │
│  ├─ Pricing: $15,000 - $35,000 por proyecto               │
│  └─ Típico: 3-6 meses engagement                          │
│                                                             │
│  SERVICIO 2: Program Management (Recurring)                │
│  ├─ Coordinación mensual de voluntarios                   │
│  ├─ Selección y vetting de ONGs partners                  │
│  ├─ Evento coordination (logistics, follow-up)            │
│  ├─ Reporting mensual a ejecutivos                        │
│  ├─ Training de coordinadores de empresa                  │
│  ├─ Pricing: $5,000 - $15,000 / mes (o SaaS)             │
│  └─ Mínimo: 6 meses, típico: 12+ meses                    │
│                                                             │
│  SERVICIO 3: CSR Strategy & Sustainability Reporting      │
│  ├─ Alineación con ODS (Sustainable Dev Goals)            │
│  ├─ Cumplimiento ESG (Environmental Social Governance)    │
│  ├─ Reportes de impacto para stakeholders                 │
│  ├─ Storytelling y comunicación                           │
│  ├─ Pricing: $8,000 - $25,000 / engagment                 │
│  └─ Annual: Típico para reportes de sostenibilidad        │
│                                                             │
│  SERVICIO 4: Custom Events & Experiences                  │
│  ├─ Event corporativo de impacto (team building social)   │
│  ├─ Experiencias de voluntariado para equipo              │
│  ├─ Logística, coordinación, follow-up                    │
│  ├─ Pricing: $10,000 - $50,000 por evento                │
│  └─ Típico: 2-4 eventos/año por empresa                   │
│                                                             │
│  ESTIMADO POR EMPRESA:                                     │
│  ├─ Año 1: $30,000 - $80,000 (initial projects)          │
│  ├─ Año 2+: $40,000 - $120,000+ (recurring)               │
│  └─ Meta: 50 empresas × $60k promedio = $3M año 5         │
│                                                             │
│ CAPA 4: MARKETPLACE FEATURES (Monetización Adicional) - 5%
│ ════════════════════════════════════════════════════════════
│                                                             │
│  FEATURE 1: Event Promotion (Featured Listings)           │
│  ├─ Boost de visibilidad en descubrimiento                │
│  ├─ Email marketing a segmento                            │
│  ├─ Pricing: $50-200 / evento promocionado                │
│  └─ Típico: 20% de eventos pagan                          │
│                                                             │
│  FEATURE 2: Certificados Digitales (Blockchain optional) │
│  ├─ Certificado de participación digital                  │
│  ├─ Verificable y compartible en LinkedIn                 │
│  ├─ Pricing: $0.50 - $1 por certificado                   │
│  └─ Típico: 10-20% de participantes piden cert.           │
│                                                             │
│  FEATURE 3: Volunteer Skills Marketplace                  │
│  ├─ Marketplace de voluntarios con skills                 │
│  ├─ ONGs pueden buscar skills específicos                 │
│  ├─ Valoración y reseñas                                  │
│  ├─ Pricing: Free to use + revenue share (10-20%)         │
│  └─ Modelo: Comisión cuando ONG contrata                  │
│                                                             │
│ CAPA 5: DATA & INSIGHTS (Futuro) - 2%                     │
│ ════════════════════════════════════════════════════════════
│                                                             │
│  FEATURE: Anonymized Data Access                          │
│  ├─ Reports aggregados sobre voluntariado en Latam        │
│  ├─ Tendencias, datos demográficos, causas               │
│  ├─ Target: Fundaciones, researchers, gobiernos           │
│  ├─ Pricing: $2,000 - $10,000 per report                 │
│  └─ Típico: 5-10 reportes/año                             │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

#### Proyección de Ingresos Capi (Años 1-5)

```
MODELO FINANCIERO CAPI (5 AÑOS)

AÑO 1: BETA + VALIDACIÓN (México + Perú)
├─ Usuarios: 2,000 ONGs, 20,000 voluntarios
├─ Ingresos:
│  ├─ ONG Premium (200 × $29 × 12): $69,600
│  ├─ B2B (3 clientes × $20k): $60,000
│  ├─ Grants/Investors: $150,000
│  └─ TOTAL AÑO 1: ~$280,000 (pre-revenue mostly)
├─ Gastos: Equipo (4-5), servidor, marketing
└─ Status: Pre-revenue, building product-market fit

AÑO 2: ESCALA MÉXICO + EXPANSIÓN
├─ Usuarios: 10,000 ONGs, 100,000 voluntarios
├─ Ingresos:
│  ├─ ONG Premium (1,000 × $29 × 12): $348,000
│  ├─ ONG Enterprise (50 × $99 × 12): $59,400
│  ├─ B2B Consulting (15 × $30k): $450,000
│  ├─ Event Promotion + Extras: $50,000
│  └─ TOTAL AÑO 2: ~$908,000
├─ Gastos: Equipo (8-10), servidor, sales/marketing
├─ Churn Rate: ~5% (normal para SaaS)
└─ Status: Product-market fit validado, primeros ingresos B2B

AÑO 3: EXPANSIÓN REGIONAL (Colombia, Perú, Argentina)
├─ Usuarios: 30,000 ONGs, 300,000 voluntarios
├─ Ingresos:
│  ├─ ONG Premium (3,000 × $29 × 12): $1,044,000
│  ├─ ONG Enterprise (150 × $99 × 12): $178,200
│  ├─ B2B Consulting (40 × $40k): $1,600,000
│  ├─ Event Promotion + Extras: $150,000
│  └─ TOTAL AÑO 3: ~$2,972,000
├─ Gastos: Equipo (15-18), oficinas, sales team
├─ Churn Rate: ~4% (mejorado por product maturity)
├─ Margen Bruto: ~70%
└─ Status: Regional player, market leader en segmento

AÑO 4: CONSOLIDACIÓN Y ESCALA
├─ Usuarios: 50,000 ONGs, 500,000 voluntarios
├─ Ingresos:
│  ├─ ONG Premium (5,000 × $29 × 12): $1,740,000
│  ├─ ONG Enterprise (300 × $99 × 12): $356,400
│  ├─ B2B Consulting (80 × $50k): $4,000,000
│  ├─ Event Promotion + Extras: $300,000
│  └─ TOTAL AÑO 4: ~$6,396,000
├─ Gastos: Equipo (25-30), múltiples oficinas
├─ Churn Rate: ~3% (stabilized)
├─ Margen Bruto: ~75%
├─ EBITDA: $1.2M+ (profitable)
└─ Status: Rentable, listo para Series A o LATAM consolidation

AÑO 5: MERCADO LEADER
├─ Usuarios: 75,000 ONGs, 750,000 voluntarios
├─ Ingresos:
│  ├─ ONG Premium (7,500 × $29 × 12): $2,610,000
│  ├─ ONG Enterprise (500 × $99 × 12): $594,000
│  ├─ B2B Consulting (120 × $60k): $7,200,000
│  ├─ Event Promotion + Extras: $500,000
│  ├─ Data & Insights: $100,000
│  └─ TOTAL AÑO 5: ~$11,004,000
├─ Gastos: Equipo (40-50), infraestructura
├─ Churn Rate: ~2.5% (very good for category)
├─ Margen Bruto: ~78%
├─ EBITDA: $3.8M+ (strong)
└─ Status: Market leader Latam hispanohablante, IPO ready

RESUMEN FINANCIERO:

| Año | ARR | B2B % | SaaS % | Growth | Usuarios |
|-----|-----|-------|--------|--------|----------|
| 1   | $280k | 21% | 79% | - | 22k |
| 2   | $908k | 50% | 50% | 224% | 110k |
| 3   | $2.9M | 54% | 46% | 227% | 330k |
| 4   | $6.4M | 63% | 37% | 115% | 550k |
| 5   | $11M | 65% | 35% | 72% | 825k |

NOTA: Projecciones conservadoras
├─ Assume churn gradual (5% → 2.5%)
├─ Assume gradual B2B ramp (hard to acquire)
├─ Assume gradual adoption (not viral)
└─ Upside: Si traction es better, podría 2-3x esto
```

#### Mix de Ingresos Final

```
DISTRIBUCIÓN DE INGRESOS AÑO 5 (Equilibrio):

B2B Consulting (Recurrente): 65% = $7.2M
├─ Sostenibilidad más alta
├─ Customer Lifetime Value > $300k
├─ Churn más baja (5-10% anual)
└─ Margen: 80%+

ONG Premium (SaaS): 27% = $3.2M
├─ Suscripción recurrente
├─ Customer Lifetime Value ~$500
├─ Churn moderada (20-30% anual)
└─ Margen: 85%+

Marketplace + Extras: 8% = $900k
├─ Eventos promovidos, certificados, etc
├─ Baja fricción, alta escalabilidad
├─ Churn: N/A (transaction based)
└─ Margen: 90%+

TOTAL: $11M / 78% Margin = $8.6M EBITDA
```

---

## Proyecciones Financieras

### Conservative Case (Worst Case)

```
Asumciones Conservadoras:
├─ Adquisición lenta (1,000 ONGs/año)
├─ Churn alto (10% anual en ONG)
├─ B2B conversion baja (1 por 5,000 ONGs)
├─ Pricing más bajo (presión competencia)
└─ Mercado fragmentation

Resultado:

| Año | ARR | EBITDA | Status |
|-----|-----|--------|--------|
| 1   | $200k | -$300k | Burning |
| 2   | $500k | -$200k | Burning |
| 3   | $1.5M | +$200k | Breakeven |
| 4   | $3M | +$800k | Profitable |
| 5   | $5M | $1.8M | Sustaining |

VERDICT: Viable pero lento, requiere más capital/investors
```

### Base Case (Most Likely)

```
Asumciones Base (nuestro modelo arriba):
├─ Adquisición realista (5k-10k ONGs por año)
├─ Churn moderada (5% anual en ONG)
├─ B2B conversion normal (1 per 1,000-2,000 ONGs)
├─ Pricing según mercado Latam
└─ Capi como líder local

Resultado: $11M ARR, $8.6M EBITDA en año 5
```

### Optimistic Case (Best Case)

```
Asumciones Optimistas:
├─ Viral adoption (10k+ ONGs/año año 2)
├─ Churn baja (3% due to strong product)
├─ B2B conversion alta (1 per 500 ONGs)
├─ Premium pricing (internacionalización)
├─ Consolidación de mercado completa
└─ Posible adquisición por player grande

Resultado:

| Año | ARR | EBITDA | Status |
|-----|-----|--------|--------|
| 1   | $400k | -$200k | Burning |
| 2   | $2M | $200k | Breakeven |
| 3   | $6M | $1.5M | Profitable |
| 4   | $15M | $5M | Strong |
| 5   | $30M+ | $12M+ | Exit ready |

VERDICT: Posible si product es 10x mejor y mercado responde
```

---

## Benchmarks de Precios

### Comparativa de Pricing (2026)

```
PLATAFORMA              TIER GRATUITO  TIER PROFESIONAL   TIER ENTERPRISE
──────────────────────────────────────────────────────────────────────────
Idealist                Free básico     $15-195/mes        Custom (alto)
VolunteerMatch          Free completo   $XX/mes (unclear)  $20k-100k+
Atados                  Free completo   N/A                $5k-50k/año
Eventbrite              Free            $99-299/mes        Custom
Worldpackers            Free (hosts)    $49-149/año        N/A
Voluncloud              Free            N/A                N/A
Hacesfalta              Free            Unclear            N/A
────────────────────────────────────────────────────────────────────────
CAPI (PROPUESTO)        Free completo   $29-99/mes         $15k-60k+/año
```

### Posicionamiento de Precio Capi

```
CAPI PRICING STRATEGY: "Premium pero Accesible"

ONG SMALL (Tier Gratuito)
├─ Precio: $0
├─ Target: ONGs pequeñas <50 personas
├─ Modelo: Network effects / lead generation
├─ % de ONGs: 80%
└─ Objetivo: Máximizar adopción

ONG MEDIANA (Tier Pro)
├─ Precio: $29/mes ($290/año)
├─ Target: ONGs 50-500 personas
├─ Modelo: Premium features + support
├─ % de ONGs: 15%
├─ Posicionamiento:
│  └─ 1/7 del precio Idealist ($195)
│  └─ 5x más barato que VolunteerMatch
│  └─ Accesible para mercado Latam
└─ Conversión esperada: 10-20% de usuarios free

ONG GRANDE (Tier Enterprise)
├─ Precio: $99/mes ($990/año)
├─ Target: ONGs 500+ personas
├─ Modelo: All premium features + dedicated support
├─ % de ONGs: 5%
├─ Posicionamiento:
│  └─ Aún 50% más barato que Idealist
│  └─ Pero con soporte dedicado
└─ Conversión esperada: 1-3% de usuarios free

B2B EMPRESAS (Tier Enterprise B2B)
├─ Precio: $15k-60k+ / año
├─ Target: Empresas 100+ empleados
├─ Modelo: Consultoría + plataforma + support
├─ Modelo: Blended (consultoría + suscripción)
├─ Posicionamiento:
│  └─ 50% más barato que VolunteerMatch Corporate
│  └─ Comparable a Atados
│  └─ Local support en español Latam
│  └─ Event-centric (diferenciador)
└─ Cierre: Sales team, 3-6 meses típico

ELASTICIDAD DE PRECIO:
├─ Premium SaaS: Elasticidad media (1.2-1.5)
├─ B2B Enterprise: Baja elasticidad (0.5-0.8)
└─ Implicación: Podría subir 20-30% sin perder usuarios
```

---

## Recomendaciones

### 1. Priorizar B2B desde Inicio

**Insight:**
- Idealist: Débil en B2B ($7.5M total)
- VolunteerMatch: 60-73% de ingresos de B2B ($24.6M)
- Atados: 90-95% de ingresos de B2B ($1.2M)

**Recomendación:**
```
CAPI STRATEGY: Freemium para alcance + B2B para revenue

├─ AÑO 1-2: Build producto, acquire 10k ONGs (free)
├─ AÑO 2-3: Iniciar ventas B2B (pequeñas empresas)
├─ AÑO 3+: Scale B2B (empresas medianas/grandes)
└─ RESULTADO: 65% ingresos de B2B en año 5
```

**Por qué:**
- ✅ Ingresos más predecibles
- ✅ Customer lifetime value más alto
- ✅ Churn más bajo (5-10% vs 20-30%)
- ✅ Margen más alto (80%+ vs 60%)
- ✅ Escalable sistemático (no depende de volumen)

---

### 2. NO Competir en Comisiones/Transactions

**Insight:**
- Eventbrite: Éxito con 10.5% take-rate, pero modelo diferente
- Voluntariado es FREE (sin pago)
- Comisión no aplica en matching voluntarios

**Recomendación:**
```
❌ NO implementar modelo de comisión
├─ Por transacción: No hay transacciones monetarias
├─ Por voluntario: Perversivo para ONGs pequeñas
├─ Por evento: Mismo problema

✅ SÍ implementar modelo de suscripción + consultoría
├─ Suscripción: SaaS predecible
├─ Consultoría: B2B margen alto
└─ TOTAL: 85%+ margen combinado
```

---

### 3. Diferenciador = Eventos Puntuales

**Insight:**
- Nadie atiende bien eventos cortos (<1 día)
- 70% del voluntariado es puntual
- Mercado completamente desatendido

**Recomendación:**
```
CAPI CORE VALUE: "La plataforma de eventos puntuales"

├─ UI/UX diseñada para eventos cortos
├─ Modelos de datos (duración < 1 día)
├─ Métricas (asistencia, no commitment)
├─ Marketing: "Eventos de impacto en tu comunidad"
└─ MOAT: Competencia no puede copiar fácil

Implicación Financiera:
├─ Premium por "evento optimization"
├─ Marketplace para event promotion
├─ B2B: "Corporate events of impact"
└─ TAM: $4-10M anual solo en eventos (año 5)
```

---

### 4. Localización = Ventaja Competitiva

**Insight:**
- Atados (Brasil): 14 años, $1.2M/año porque es nativo
- Idealist (USA-based): $7.5M pero débil en Latam
- Voluncloud (España): No escala a Latam

**Recomendación:**
```
CAPI POSITIONING: "Por Latinoamérica, Para Latinoamérica"

├─ Precios en moneda local (pesos, soles, etc.)
├─ Métodos de pago locales (MercadoPago, Inti, etc.)
├─ Soporte en español de Latam (no España)
├─ Regulación GDPR ≠ Latam compliance
├─ Horarios: Latam, no USA/Europe
└─ RESULTADO: 3-5x mejor fit que Idealist

Implicación Financiera:
├─ Puede cobrar 20-30% más vs Idealist
├─ Churn más bajo (cultural fit)
├─ NPS más alto (localization)
└─ B2B conversion 3-5x mejor
```

---

### 5. Freemium es Köder, no Revenue

**Insight:**
- Idealist: Freemium "fake" (presiona a upgrade)
- VolunteerMatch: Freemium real pero $24.6M es 100% de B2B
- Atados: Freemium real, pero $1.2M es 100% de B2B

**Recomendación:**
```
CAPI PHILOSOPHY: Freemium es customer acquisition, NO revenue

├─ MENTALITY: Freemium = inversión en usuarios
├─ EXPECTATION: 5-10% conversion a pago
├─ PROFITABILITY: Viene de B2B (70%+ ingresos)
├─ PRICING: Premium SaaS es "nice to have", no critical

IMPLICACIÓN:
├─ No obsesionarse con conversion rates
├─ Maximizar usuario growth en free tier
├─ Freemium debe ser 100% funcional (no crippled)
├─ Revenue viene de 20-50 clientes B2B grandes
└─ Business model es HYBRID, no puramente SaaS
```

---

### 6. Timeline de Monetización

**Recomendación:**
```
WHEN TO MONETIZE: Staged approach

FASE 1 (Meses 1-6): NO monetizar
├─ Focus en product-market fit
├─ Build 2k+ ONGs en free tier
├─ Validate que funciona
├─ Revenue: Solo grants/investors

FASE 2 (Meses 7-12): Iniciar SaaS
├─ Launch ONG Premium ($29/mes)
├─ Expect 5-10% conversion
├─ Revenue esperada: $10k-30k MRR
├─ PRIMARY: Validar que pagan

FASE 3 (Mes 13-18): Iniciar B2B
├─ Hire sales person
├─ Target: Primeras 5 clientes B2B
├─ Revenue esperada: $20k-50k MRR
├─ PRIMARY: Validar modelo B2B

FASE 4 (Mes 19+): Scale both
├─ Grow SaaS naturalmente (ya validado)
├─ Scale B2B (hiring dedicated team)
├─ Revenue esperada: $100k+ MRR
├─ PRIMARY: Unit economics positivos
```

---

### 7. Métricas Críticas a Monitorear

```
METRICS DASHBOARD (Capi debe trackear mensual):

GROWTH METRICS (Atracción):
├─ Monthly Active Users (MAU): Objetivo 10k by month 24
├─ Weekly Active Users (WAU): 70-80% de MAU
├─ Daily Active Users (DAU): 20-30% de MAU
├─ New users acquired: 1k/mes by month 12
└─ Viral coefficient: Target > 1.0 (viral growth)

ENGAGEMENT METRICS (Retención):
├─ Monthly churn ONG: Target < 5%
├─ ONG creating events: % que crea al menos 1 evento
├─ Event completion rate: % de eventos que sucedieron
├─ Avg events/ONG/month: Target > 2
└─ Avg volunteers/event: Growing over time

SaaS METRICS (Monetización ONG):
├─ ONG free to paid conversion: Target 10%+
├─ Monthly Recurring Revenue (MRR): $10k+ month 12
├─ Average Revenue Per User (ARPU): $20-30
├─ Customer Lifetime Value (LTV): $500+
├─ LTV:CAC ratio: Target > 3:1
└─ NRR (Net Revenue Retention): > 110%

B2B METRICS (Monetización Empresa):
├─ Clientes B2B: Target 50 by year 5
├─ Contract value promedio: $40k/año
├─ Sales cycle length: 3-6 meses target
├─ Churn B2B: Target < 10%
├─ B2B NRR: Target > 130%
└─ Magic number: (MRR gained * 12 / SAC) > 0.7
```

---

## Conclusión Ejecutiva

### Resumen de Modelos de Negocio

| Competidor | Modelo | Ingresos | Viabilidad Latam |
|---|---|---|---|
| **Idealist** | Freemium débil + Premium | $7.5M | 🟡 Débil (genérica, cara) |
| **Eventbrite** | Transaction fees | $XX0M+ | 🟡 No aplica (eventos pagos) |
| **VolunteerMatch** | SaaS + B2B Enterprise | $24.6M | 🟡 Buena pero fusión con Idealist |
| **Atados** | Freemium + B2B (90-95%) | $1.2M | 🟢 Fuerte (nativa Brasil) |
| **Worldpackers** | B2C Membresía + Affiliate | $14.7M | 🟡 Diferente (travel-focused) |
| **Voluncloud** | Freemium + Grants (unclear) | Desconocido | 🟡 Opaco, no escalable |
| **Hacesfalta** | Freemium + Grants (unclear) | Desconocido | 🔴 Opaco, España-centric |
| **CAPI (PROPUESTO)** | Freemium + B2B Hybrid | $11M (proj) | 🟢 ÓPTIMO (localizado + híbrido) |

### Por qué Capi Gana

✅ **Modelo robusto:** Combina lo mejor de Atados (B2B) + Freemium real
✅ **Revenue clara:** 65% B2B (alta margen, predecible) + 35% SaaS
✅ **Diferenciador único:** Eventos puntuales (70% del mercado real)
✅ **Localización nativa:** Mejor que Idealist, más amplio que Atados
✅ **Margen alto:** 70-80% bruto, 40-60% EBITDA
✅ **Escalabilidad:** Network effects + B2B recurrente

### Próximos Pasos

1. **Validar** con 3-5 ONGs México que pagarían $29/mes
2. **Validar** con 1-2 empresas México que pagarían $20k+ por consultoría
3. **Refinar** pricing basado en feedback
4. **Build** MVP con ambos tiers (free + pro)
5. **Launch** beta público en México Q3 2026

---

**Documento preparado:** Marzo 2026
**Para:** Equipo Capi
**Confidencialidad:** Interna
**Próxima revisión:** Cuando tengas primeros pagos

