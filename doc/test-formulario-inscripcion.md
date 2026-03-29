# 🧪 Prueba Manual: Formulario de Inscripción con Campos Configurables

**Fecha:** 2026-03-22
**Objetivo:** Verificar que el formulario de inscripción de voluntarios con campos dinámicos funciona correctamente de punta a punta.

---

## ✅ Pre-requisitos

- [ ] Servidor local corriendo: `npm run dev` en `http://localhost:3000`
- [ ] Supabase Studio accesible: `supabase studio`
- [ ] Usuario autenticado en el dashboard
- [ ] Base de datos migrada: `supabase db push` ✓

---

## 📋 Caso de Prueba 1: Crear Evento con Campos Personalizados

### Paso 1.1: Navegar al formulario de creación

1. Ve a `http://localhost:3000/dashboard/events/new`
2. **Resultado esperado:** Se abre el formulario de creación de eventos

### Paso 1.2: Llenar secciones básicas

Completa los siguientes campos:

| Campo | Valor |
|-------|-------|
| **Sección 1: Información General** |
| Nombre del evento | "Taller de Programación Python" |
| Tipo | "Taller" |
| Fecha | "2026-04-15" (cualquier fecha futura) |
| Ubicación | "Calle Principal 123" |
| Dirección completa | "Calle Principal 123, Lima, Perú" |
| **Sección 2: Detalles del Evento** |
| Descripción corta | "Un taller intensivo sobre programación en Python" |
| Imagen | (opcional - déjalo en blanco) |
| **Sección 3: Voluntarios y Alcance** |
| Roles | Agregar 2 roles:<br/> - "Instructor" (2 cupos)<br/> - "Asistente" (3 cupos) |
| Objetivo de estudiantes | "50" |
| **Sección 4: Institución y Sponsors** |
| Institución | "Universidad Nacional de Ingeniería" |
| Sponsors | "Google, Microsoft" |
| **Sección 5: Descripción Detallada** |
| Sobre el evento | "En este taller aprenderás las bases de Python, incluyendo variables, funciones, listas y diccionarios. Perfecto para principiantes." |
| **Sección 6: Agenda** |
| Actividad 1 | Hora: "09:00", Título: "Bienvenida", Desc: "Presentación del taller" |
| Actividad 2 | Hora: "09:30", Título: "Variables y Tipos", Desc: "Fundamentos" |
| Actividad 3 | Hora: "11:00", Título: "Break" |

**Resultado esperado:** Todos los campos se completan sin errores

### Paso 1.3: Configurar campos de inscripción (SECCIÓN 7)

1. Scroll hasta "Sección 7: Campos de Inscripción"
2. Click en "+ Agregar campo personalizado"

**Campo 1 - Disponibilidad:**
- Nombre del campo: `¿Cuál es tu disponibilidad?`
- Tipo: `Seleccionar`
- Requerido: `✓` (activado)
- Placeholder: `Elige tu horario preferido`
- Opciones: `Mañana,Tarde,Noche`

**Resultado esperado:**
- Se genera automáticamente `field_key` = "cual_es_tu_disponibilidad"
- El campo aparece en la lista

3. Click nuevamente "+ Agregar campo personalizado"

**Campo 2 - Experiencia previa:**
- Nombre del campo: `¿Tienes experiencia previa con Python?`
- Tipo: `Checkbox`
- Requerido: `☐` (NO activado)
- Placeholder: `He programado en Python antes`

**Resultado esperado:**
- Se genera automáticamente `field_key` = "tienes_experiencia_previa_con_python"
- El campo aparece en la lista

4. Click nuevamente "+ Agregar campo personalizado"

**Campo 3 - Motivación:**
- Nombre del campo: `¿Por qué quieres participar?`
- Tipo: `Párrafo`
- Requerido: `✓` (activado)
- Placeholder: `Cuéntanos tu motivación...`

**Resultado esperado:**
- Los 3 campos están visibles en la sección 7

### Paso 1.4: Guardar el evento

1. Scroll al final del formulario
2. Click en botón "Publicar Evento"

**Resultado esperado:**
- Toast verde: "Evento creado exitosamente"
- Redirección a `/dashboard/events` después de 1.5 segundos
- El evento aparece en la lista

**Nota:** Copia el **slug del evento** que aparece en la URL o en el título. Ej: `"taller-de-programacion-python-xxxxx"`

---

## 📊 Paso 2: Verificar Datos en Supabase

### Paso 2.1: Abrir Supabase Studio

```bash
supabase studio
```

O accede a https://app.supabase.com (si usas cloud)

### Paso 2.2: Verificar tabla `event_registration_fields`

1. En la navegación izquierda, ve a **SQL Editor**
2. Ejecuta la siguiente query:

```sql
SELECT * FROM event_registration_fields
WHERE field_label LIKE '%disponibilidad%'
   OR field_label LIKE '%experiencia%'
   OR field_label LIKE '%Por qué%'
ORDER BY sort_order ASC;
```

**Resultado esperado:** 3 rows con:

| Campo | Valor esperado |
|-------|-----------------|
| field_label | "¿Cuál es tu disponibilidad?" |
| field_key | "cual_es_tu_disponibilidad" |
| field_type | "select" |
| required | true |
| options_json | `["Mañana", "Tarde", "Noche"]` |
| sort_order | 0 |

Y 2 rows más con los otros campos.

**Verifica también:**
- Campo 2: `field_type` = "checkbox", `required` = false
- Campo 3: `field_type` = "textarea", `required` = true

---

## 🎯 Caso de Prueba 2: Inscribir Voluntario con Campos Dinámicos

### Paso 2.1: Navegar a la página de inscripción

1. Ve a `http://localhost:3000/events/{slug}/inscripcion`
   - Reemplaza `{slug}` con el slug del evento (ej: `taller-de-programacion-python-abc123`)

**Resultado esperado:**
- Encabezado morado: "Inscripción de Voluntario"
- Título del evento: "Taller de Programación Python"
- Fecha y ubicación del evento

### Paso 2.2: Verificar que se renderizan todos los campos

Scroll y verifica que existan estos campos en el formulario:

1. ✅ **Nombre Completo** (input text, requerido)
2. ✅ **Email** (input email, requerido)
3. ✅ **Rol Preferido** (select con opciones: Instructor, Asistente)
4. ✅ **¿Cuál es tu disponibilidad?** (select con opciones: Mañana, Tarde, Noche)
5. ✅ **¿Tienes experiencia previa con Python?** (checkbox)
6. ✅ **¿Por qué quieres participar?** (textarea)

### Paso 2.3: Probar validación - Envío vacío

1. Click en "Enviar Inscripción" sin llenar nada
2. **Resultado esperado:** Mensaje de error: "El nombre debe tener al menos 2 caracteres"

### Paso 2.4: Probar validación - Campo requerido faltante

1. Completa:
   - Nombre: "Carlos López"
   - Email: "carlos@example.com"
   - Rol: "Instructor"
   - Disponibilidad: "Mañana"
   - Experiencia: (deja sin marcar)
   - Motivación: (DEJA VACÍO)

2. Click en "Enviar Inscripción"
3. **Resultado esperado:** Mensaje de error: `El campo "¿Por qué quieres participar?" es obligatorio`

### Paso 2.5: Completar el formulario correctamente

Completa todos los campos:

| Campo | Valor |
|-------|-------|
| Nombre Completo | "María González Rodríguez" |
| Email | "maria.gonzalez@email.com" |
| Rol Preferido | "Instructor" |
| ¿Cuál es tu disponibilidad? | "Tarde" |
| ¿Tienes experiencia previa? | ✓ (marcado) |
| ¿Por qué quieres participar? | "Me interesa enseñar Python y contribuir con mi experiencia de 5 años en desarrollo" |

### Paso 2.6: Enviar el formulario

1. Click en "Enviar Inscripción"
2. **Resultado esperado:**
   - El formulario desaparece
   - Se muestra pantalla verde con:
     - Icono ✓ verde
     - Título: "¡Inscripción Completada!"
     - Mensaje: "Tu solicitud ha sido registrada correctamente..."
   - Toast verde: "¡Inscripción completada exitosamente!"

---

## 🔍 Caso de Prueba 3: Verificar Datos Guardados en BD

### Paso 3.1: Verificar en tabla `event_volunteers`

En Supabase Studio, ejecuta:

```sql
SELECT
  ev.id,
  ev.event_id,
  v.name,
  v.email,
  ev.role,
  ev.status,
  ev.extra_data,
  ev.joined_at
FROM event_volunteers ev
JOIN volunteers v ON ev.volunteer_id = v.id
WHERE v.email = 'maria.gonzalez@email.com'
ORDER BY ev.joined_at DESC
LIMIT 1;
```

**Resultado esperado:** 1 row con:

| Campo | Valor esperado |
|-------|-----------------|
| name | "María González Rodríguez" |
| email | "maria.gonzalez@email.com" |
| role | "Instructor" |
| status | "pendiente" |
| extra_data | Ver paso 3.2 |
| joined_at | Fecha/hora actual |

### Paso 3.2: Verificar contenido de `extra_data`

El contenido de `extra_data` debe ser un JSON con las 3 respuestas:

```json
{
  "cual_es_tu_disponibilidad": "Tarde",
  "tienes_experiencia_previa_con_python": "true",
  "por_que_quieres_participar": "Me interesa enseñar Python y contribuir con mi experiencia de 5 años en desarrollo"
}
```

**Resultado esperado:**
- ✅ Las 3 claves corresponden a los `field_key` configurados
- ✅ Los valores coinciden con lo que escribiste en el formulario
- ✅ El checkbox aparece como string "true" (no boolean)

---

## ✏️ Caso de Prueba 4: Editar Evento y Verificar Pre-carga

### Paso 4.1: Navegar a editar evento

1. Ve a `http://localhost:3000/dashboard/events`
2. Encuentra el evento "Taller de Programación Python"
3. Click en el evento → botón "Editar"

**Resultado esperado:** Se abre el formulario de edición

### Paso 4.2: Verificar que se pre-cargan los campos

1. Scroll a "Sección 7: Campos de Inscripción"
2. **Resultado esperado:** Los 3 campos aparecen:
   - ✅ Campo 1: "¿Cuál es tu disponibilidad?" (tipo select, requerido)
   - ✅ Campo 2: "¿Tienes experiencia previa con Python?" (tipo checkbox, NO requerido)
   - ✅ Campo 3: "¿Por qué quieres participar?" (tipo párrafo, requerido)

### Paso 4.3: Modificar un campo

1. En el Campo 1, cambia el nombre a: "¿En qué horario estás disponible?"
2. **Resultado esperado:** El `field_key` se actualiza automáticamente a "en_que_horario_estas_disponible"

### Paso 4.4: Agregar un nuevo campo

1. Click "+ Agregar campo personalizado"
2. Nombre: "¿Qué nivel tienes en Python?"
3. Tipo: "Seleccionar"
4. Requerido: ✓
5. Opciones: "Principiante,Intermedio,Avanzado"

**Resultado esperado:** El campo aparece en la lista (sería el 4o campo)

### Paso 4.5: Guardar cambios

1. Click "Guardar Cambios"
2. **Resultado esperado:**
   - Toast verde: "Evento actualizado exitosamente"
   - Redirección a `/dashboard/events`

### Paso 4.6: Verificar cambios en BD

En Supabase Studio, ejecuta:

```sql
SELECT field_label, field_key, field_type, required, options_json
FROM event_registration_fields
WHERE field_label LIKE '%disponible%'
   OR field_label LIKE '%Python%'
ORDER BY sort_order ASC;
```

**Resultado esperado:**
- Campo 1: `field_label` = "¿En qué horario estás disponible?" (actualizado)
- Campo 4: `field_label` = "¿Qué nivel tienes en Python?" (nuevo)
- Los anteriores campos 2 y 3 siguen intactos

---

## 🐛 Caso de Prueba 5: Intentar Inscribirse en Evento NO Activo

### Paso 5.1: Cambiar estado del evento a "borrador"

1. En `/dashboard/events`, encuentra el evento
2. Click en el evento → "Cambiar estado a Borrador" (si existe este botón)
   - O edita el evento y cambia el estado antes de guardar

### Paso 5.2: Intentar acceder a la página de inscripción

1. Ve a `http://localhost:3000/events/{slug}/inscripcion`
2. **Resultado esperado:**
   - Redirección automática a `/events/{slug}` (página de detalles)
   - Se muestra el evento pero SIN el formulario de inscripción

---

## 📋 Checklist Final

Marca todos los items que funcionaron correctamente:

### Creación de Evento
- [ ] Formulario completo con 7 secciones
- [ ] Los 3 campos se agregan sin errores
- [ ] El evento se guarda exitosamente
- [ ] Se obtiene un slug único

### Base de Datos
- [ ] Tabla `event_registration_fields` contiene 3 rows
- [ ] `field_key` se genera automáticamente desde `field_label`
- [ ] `options_json` es un array válido para campos select
- [ ] Tabla `event_volunteers` tiene columna `extra_data`

### Página de Inscripción
- [ ] La página carga correctamente en `/events/{slug}/inscripcion`
- [ ] Se renderizan los 3 campos personalizados + campos base
- [ ] La validación funciona para campos requeridos
- [ ] El formulario rechaza email inválido
- [ ] Se muestra pantalla verde al enviar exitosamente

### Datos Guardados
- [ ] `extra_data` contiene JSON con las respuestas correctas
- [ ] Los valores en `extra_data` coinciden exactamente
- [ ] El campo checkbox se guarda como "true" o ""
- [ ] Status del volunteer es "pendiente"

### Edición de Evento
- [ ] Los campos pre-se cargan al editar
- [ ] Se pueden modificar los campos existentes
- [ ] Se pueden agregar nuevos campos
- [ ] Los cambios se guardan correctamente en BD

### Edge Cases
- [ ] Evento no activo redirige correctamente
- [ ] Validación de campos requeridos funciona en servidor
- [ ] Toast de error muestra el mensaje correcto

---

## 📸 Capturas de Pantalla Esperadas

1. **Sección 7 - Campos de Inscripción**
   - Mostrar 3 campos listos para configurar
   - Cada campo con su tipo, requerido, opciones, placeholder

2. **Página /inscripcion**
   - Encabezado con nombre del evento
   - 6 inputs visibles (nombre, email, rol + 3 personalizados)
   - Botón naranja "Enviar Inscripción"

3. **Pantalla de éxito**
   - Icono checkmark verde
   - Mensaje de confirmación
   - Toast verde en esquina inferior

4. **Supabase Studio**
   - Tabla con los 3 campos configurados
   - Row en event_volunteers con extra_data JSON

---

## ⚠️ Problemas Comunes y Soluciones

| Problema | Causa | Solución |
|----------|-------|----------|
| Tabla `event_registration_fields` no existe | Migración no aplicada | `supabase db push` |
| Campos no se guardan | Error en Server Action | Ver console del servidor |
| `extra_data` es null | extraData no pasado | Revisar InscriptionForm.tsx |
| Validación no funciona | Error en validate() | Verificar lógica en signup.ts |
| Campo select sin opciones | options_json vacío | Llenar "Opciones" separadas por coma |

---

**Si todos los items del checklist están ✅, la implementación está correcta.**

¿Necesitas ayuda con alguno de estos pasos? 🚀
