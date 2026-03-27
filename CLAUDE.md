# Capi — Convenciones del Proyecto


Para nombrar sigue estas nomenclaturas

## Nomenclatura de archivos y directorios

### Directorios
- Usar **kebab-case**: `my-folder/`, `event-details/`

### Componentes React (.tsx)
- Usar **PascalCase**: `EventCard.tsx`, `SidebarNav.tsx`, `VolunteerTable.tsx`

### Páginas y Layouts (App Router de Next.js)
- Siempre `page.tsx` y `layout.tsx` (convención obligatoria de Next.js)

### Utilidades, hooks y librerías (.ts)
- Usar **camelCase**: `data.ts`, `useVolunteers.ts`, `formatDate.ts`

### Estilos (.css)
- Usar **kebab-case**: `globals.css`, `dashboard-layout.css`

### Archivos de configuración
- Mantener el nombre por defecto de cada herramienta: `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`

## Nomenclatura de código

### Variables y funciones
- Usar **camelCase**: `eventList`, `handleSubmit`, `getVolunteers()`

### Componentes y tipos/interfaces
- Usar **PascalCase**: `EventCard`, `VolunteerStatus`, `InstitutionType`

### Constantes globales
- Usar **UPPER_SNAKE_CASE**: `API_URL`, `MAX_VOLUNTEERS`, `DEFAULT_PAGE_SIZE`

### Props de componentes
- Usar **PascalCase** con sufijo `Props`: `EventCardProps`, `SidebarNavProps`
