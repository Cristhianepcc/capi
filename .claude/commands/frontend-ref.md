Eres un experto en frontend de Capi. Antes de generar cualquier interfaz nueva, lee y aplica esta referencia completa del frontend existente para garantizar consistencia visual y estructural.

---

# REFERENCIA FRONTEND — CAPI

## 1. Stack Tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| Next.js (App Router) | 16.x | Framework principal |
| React | 19.x | UI library |
| TypeScript | strict | Tipado |
| Tailwind CSS | v4 | Estilos (utility-first) |
| Zod | v4 | Validación de schemas |
| React Hook Form | v7 | Formularios |
| @tanstack/react-query | v5 | Data fetching (preparado) |

---

## 2. Sistema de Diseño

### Colores

```
Primary:          #f49d25 (naranja/gold)
Primary light:    #f49d25/10, /20, /30 (opacidades para backgrounds y bordes)
Primary shadow:   shadow-[#f49d25]/20

Background light: #f8f7f5
Background dark:  #221a10
Text primary:     text-slate-900
Text secondary:   text-slate-500, text-slate-600
Text muted:       text-slate-400
Borders:          border-slate-100, border-slate-200, border-[#f49d25]/10

Status colors:
  - Éxito:    emerald (bg-emerald-50, text-emerald-700, bg-emerald-500)
  - Alerta:   amber (bg-amber-50, text-amber-700)
  - Error:    red/rose (bg-red-50, text-red-700, text-rose-600)
  - Info:     blue (bg-blue-50, text-blue-700)
  - Neutral:  slate (bg-slate-50, text-slate-600)
Accent secundarios: purple, orange, yellow, teal, cyan (usados en avatares y badges)
```

### Tipografía

- **Font family:** Lexend (Google Fonts), pesos 300–900
- **Variable CSS:** `--font-lexend` con `font-sans` en body
- **Tamaños frecuentes:** `text-xs`, `text-sm`, `text-base`, `text-xl`, `text-2xl`, `text-4xl`, `text-5xl`
- **Pesos:** `font-medium`, `font-semibold`, `font-bold`, `font-extrabold`

### Iconos

- **Google Material Symbols Outlined** (NO Material Icons clásicos)
- Uso: `<span className="material-symbols-outlined">icon_name</span>`
- Tamaños: `text-sm`, `text-base`, `text-xl`, `text-2xl`, `text-3xl`
- Relleno: `style={{ fontVariationSettings: "'FILL' 1" }}` para íconos llenos
- Cargados via stylesheet en `app/layout.tsx` `<head>`

### Border Radius

```
rounded-lg    → 0.5rem   (botones secundarios, inputs, badges internos)
rounded-xl    → 0.75rem  (cards, contenedores)
rounded-2xl   → 1rem     (cards prominentes, EventCard)
rounded-full  → 9999px   (avatares, badges, pills)
```

### Sombras

```
shadow-sm                     → cards sutiles
shadow-lg shadow-[#f49d25]/20 → botones primarios y CTAs
shadow-2xl                    → hover en cards
```

### Transiciones

```
transition-all       → botones, cards (general)
transition-colors    → links, hovers simples
transition-transform → scale en hover
duration-500         → animaciones largas (zoom imágenes)
```

---

## 3. Patrones de Componentes UI

### Botón Primario
```tsx
<button className="bg-[#f49d25] text-white rounded-lg px-5 py-2.5 text-sm font-bold shadow-lg shadow-[#f49d25]/20 hover:brightness-105 active:scale-95 transition-all">
  Acción
</button>
```

### Botón Secundario (pill/outline)
```tsx
<button className="px-4 py-2 rounded-full border border-slate-200 text-sm font-medium hover:border-[#f49d25] hover:text-[#f49d25] transition-colors">
  Filtro
</button>
```

### Botón Ghost / Terciario
```tsx
<button className="rounded-lg bg-[#f49d25]/10 px-4 py-2 text-sm font-bold text-[#f49d25] hover:bg-[#f49d25]/20 transition-all">
  Dashboard
</button>
```

### Botón Icon
```tsx
<button className="size-10 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:text-[#f49d25] transition-colors">
  <span className="material-symbols-outlined">notifications</span>
</button>
```

### Card Base
```tsx
<div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
  {/* contenido */}
</div>
```

### Card Interactiva (con hover)
```tsx
<div className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:-translate-y-2 hover:shadow-2xl border border-slate-100">
  {/* contenido */}
</div>
```

### Badge / Status Pill
```tsx
<span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
  Activo
</span>
```

### Input de búsqueda
```tsx
<div className="relative w-full">
  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
  <input
    className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f49d25]/50"
    placeholder="Buscar..."
    type="text"
  />
</div>
```

### Input de formulario
```tsx
<input className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#f49d25]/50 focus:border-[#f49d25]" />
```

### Select de formulario
```tsx
<select className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#f49d25]/50 focus:border-[#f49d25]">
  <option>Opción</option>
</select>
```

### Avatar con iniciales
```tsx
<div className="size-10 rounded-full bg-[#f49d25]/20 flex items-center justify-center text-[#f49d25] font-bold text-sm border border-[#f49d25]/30">
  AR
</div>
```

### Rating Stars
```tsx
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          className={`material-symbols-outlined text-base ${s <= rating ? "text-[#f49d25]" : "text-slate-200"}`}
          style={{ fontVariationSettings: s <= rating ? "'FILL' 1" : "'FILL' 0" }}
        >
          star
        </span>
      ))}
    </div>
  );
}
```

### Stat/Metric Card
```tsx
<div className="bg-white rounded-xl border border-slate-200 p-6">
  <div className="flex items-center gap-3 mb-2">
    <div className="size-10 rounded-lg bg-[#f49d25]/10 flex items-center justify-center text-[#f49d25]">
      <span className="material-symbols-outlined">group</span>
    </div>
    <p className="text-sm text-slate-500">Voluntarios</p>
  </div>
  <p className="text-3xl font-extrabold text-slate-900">1,234</p>
</div>
```

### Progress Bar
```tsx
<div className="w-full bg-slate-100 rounded-full h-2">
  <div className="bg-[#f49d25] h-2 rounded-full" style={{ width: "75%" }} />
</div>
```

---

## 4. Layouts

### Página Pública (landing, eventos)
```
Navbar (sticky top, backdrop-blur, max-w-7xl)
  └─ Main content (max-w-7xl, px-6 lg:px-10)
Footer (border-t, multi-column grid)
```

### Dashboard (admin)
```
Flex h-screen overflow-hidden bg-[#f8f7f5]
  ├─ Sidebar (w-64, bg-white, border-r)
  │    ├─ Logo + Branding
  │    ├─ SidebarNav (nav items con iconos)
  │    ├─ CTA "Crear Evento"
  │    └─ User profile card
  └─ Main area (flex-1)
       ├─ Header (sticky, backdrop-blur, search + actions)
       └─ Content (flex-1, overflow-y-auto, p-8)
```

### Contenido de Página Dashboard
```tsx
<div className="p-8 space-y-8">
  {/* Header de página */}
  <div className="flex items-center justify-between">
    <div>
      <h2 className="text-2xl font-bold text-slate-900">Título</h2>
      <p className="text-slate-500 mt-1">Descripción breve</p>
    </div>
    {/* Acciones opcionales */}
  </div>

  {/* Filtros opcionales */}
  <div className="flex items-center gap-3 flex-wrap">
    {/* Pills de filtro */}
  </div>

  {/* Contenido: grid de cards o tabla */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {/* Items */}
  </div>
</div>
```

---

## 5. Arquitectura de Archivos

```
app/
  layout.tsx              → Root layout (font, metadata, Material Symbols)
  page.tsx                → Landing page pública
  globals.css             → Theme Tailwind (@theme), body styles, Material Symbols
  events/
    page.tsx              → Lista pública de eventos ("use client" con filtros)
    [id]/page.tsx         → Detalle de evento (server component, generateStaticParams)
  dashboard/
    layout.tsx            → Layout sidebar + header
    page.tsx              → Overview/resumen
    events/page.tsx       → Gestión de eventos (tabla)
    events/new/page.tsx   → Formulario crear evento ("use client", Zod)
    volunteers/page.tsx   → Gestión voluntarios (tabla con filtros)
    institutions/page.tsx → Gestión instituciones (cards)
    analytics/page.tsx    → Métricas e impacto
    reviews/page.tsx      → Reseñas y ratings

components/
  EventCard.tsx           → Card de evento reutilizable
  Navbar.tsx              → Header público (sticky, links, CTAs)
  Footer.tsx              → Footer multi-columna
  SidebarNav.tsx          → Navegación sidebar dashboard ("use client")

lib/
  data.ts                 → Datos mock (events, volunteers, institutions, reviews, stats)
```

---

## 6. Convenciones de Código

### Componentes
- **Server Components por defecto.** Solo usar `"use client"` cuando haya interactividad (useState, usePathname, event handlers).
- **Props:** Interface con PascalCase exportada en el mismo archivo. Sufijo `Props` si es un tipo de props.
- **Export default** para todos los componentes.
- **Imports:** `next/link` para Link, `next/image` para Image, `next/navigation` para hooks de routing.

### Estado
- `useState` para estado local.
- Actualizaciones inmutables con spread: `setList(prev => prev.map(...))`
- Filtrado client-side con `.filter()` sobre arrays
- No hay state management global (no Context, no Zustand, no Redux)

### Formularios
- Validación con schema **Zod** definido al inicio del componente
- Tracking de errores por campo con `Record<string, string>`
- Feedback de éxito con estado boolean + redirección

### Datos Mock
- Exportados como arrays/objetos nombrados desde `lib/data.ts`
- Campos con tipos Spanish-friendly: `status: "aprobado" | "pendiente" | "rechazado"`
- Imágenes desde `images.unsplash.com` (configurado en next.config.ts)

### Navegación
- `Link` de `next/link` para toda navegación interna
- `usePathname()` para detectar ruta activa
- Active state: comparación exacta o `startsWith` según el caso

### Responsive
- **Mobile-first:** clases base para mobile, breakpoints para desktop
- Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` (o lg:grid-cols-4)
- Ocultar en mobile: `hidden sm:flex` o `hidden lg:flex`
- Container: `max-w-7xl mx-auto px-6 lg:px-10`

---

## 7. Reglas al Generar Nuevas Interfaces

1. **Usar SOLO Tailwind CSS** — No CSS modules, no styled-components, no clases CSS custom (excepto las de globals.css).
2. **Color primario siempre como `#f49d25`** directo en clases (ej: `bg-[#f49d25]`, `text-[#f49d25]`), o con opacidades.
3. **Iconos SOLO de Material Symbols Outlined** — Nunca Heroicons, Lucide, ni SVGs inline.
4. **Respetar las convenciones de naming** de CLAUDE.md: PascalCase componentes, camelCase funciones/variables, kebab-case carpetas.
5. **Server Component por defecto.** Solo agregar `"use client"` si es estrictamente necesario.
6. **Páginas dashboard** deben seguir la estructura: header con título + descripción, filtros opcionales, contenido en grid o tabla.
7. **Páginas públicas** deben incluir `<Navbar />` y `<Footer />`.
8. **Nuevos componentes reutilizables** van en `/components/` con PascalCase.
9. **Nuevos datos mock** van en `lib/data.ts` como exports nombrados.
10. **Nuevas rutas dashboard** van dentro de `app/dashboard/nombre-seccion/page.tsx`.
11. **Nuevas rutas públicas** van en `app/nombre-seccion/page.tsx`.
12. **Formularios** usan Zod para validación. Inputs con clases estándar del proyecto.
13. **No inventar colores** fuera de la paleta definida. Usar slate para grises, emerald/amber/red para status.
14. **Border radius consistente:** `rounded-lg` para inputs/botones, `rounded-xl` para cards, `rounded-2xl` para cards destacadas, `rounded-full` para avatares y pills.
15. **Imágenes** con `next/image` y props `fill` + `sizes` cuando sea responsive.

---

## 8. Checklist Pre-Entrega

Antes de entregar cualquier interfaz nueva, verificar:

- [ ] ¿Usa el color `#f49d25` como primary y NO otro color de acento?
- [ ] ¿Los iconos son `material-symbols-outlined` y no otra librería?
- [ ] ¿La tipografía hereda de Lexend via `font-sans`?
- [ ] ¿Los border-radius siguen la escala del proyecto?
- [ ] ¿La página es responsive (mobile-first con breakpoints)?
- [ ] ¿Server Component por defecto, `"use client"` solo si necesario?
- [ ] ¿Archivos nombrados según convención (PascalCase componentes, kebab-case carpetas)?
- [ ] ¿El layout es consistente con las páginas existentes (padding, max-width, spacing)?
- [ ] ¿Los estados (hover, focus, active) son consistentes con los patrones existentes?
- [ ] ¿No se introdujeron dependencias nuevas innecesarias?
