# Seed Data — Datos de desarrollo

Referencia completa de los datos creados por `supabase/seed.sql`.

## Cuentas de usuario

| Email | Password | Nombre | Rol sistema | Comunidades |
|---|---|---|---|---|
| `admin@capi.test` | `Test1234!` | Admin Capi | **admin** | Capi Perú (líder) |
| `pedro@capi.test` | `Test1234!` | Pedro Salinas | user | Capi Perú (admin), STEM Lima (líder) |
| `lucia@capi.test` | `Test1234!` | Lucía Romero | user | Capi Perú (admin), Edu. Rural Cusco (líder) |
| `camila@capi.test` | `Test1234!` | Camila Vargas | user | Capi Perú (miembro), STEM Lima (miembro) |

## Comunidades

| Comunidad | Estado | Creador | Miembros |
|---|---|---|---|
| Capi Perú | activo | Admin Capi | 4 (1 líder, 2 admins, 1 miembro) |
| STEM Lima | activo | Pedro Salinas | 2 (1 líder, 1 miembro) |
| Educación Rural Cusco | solicitud | Lucía Romero | 1 (1 líder) |

## Eventos (8)

| Evento | Comunidad | Creado por | Estado | Fecha | Tipo |
|---|---|---|---|---|---|
| Taller de Programación Web Básica | Capi Perú | Pedro | finalizado | 2025-02-15 | taller |
| Taller STEM para Niños | Capi Perú | Pedro | activo | 2025-04-24 | taller |
| Cumbre de Liderazgo Juvenil 2025 | Capi Perú | Pedro | activo | 2025-05-10 | conferencia |
| Mentoría STEM en Colegios Públicos | STEM Lima | Pedro | activo | 2025-05-22 | voluntariado_educativo |
| Formación Digital para Adultos Mayores | Capi Perú | Lucía | activo | 2025-06-12 | programa |
| Charla: Medio Ambiente y Acción Local | Edu. Rural Cusco | Lucía | borrador | 2025-07-18 | charla |
| Hackathon de Impacto Social | STEM Lima | Pedro | borrador | 2025-08-06 | evento_stem |
| Feria de Ciencias Rurales | Edu. Rural Cusco | Lucía | activo | 2025-09-20 | evento_stem |

## Instituciones (11)

| Institución | Tipo | Ciudad | Estado | Representante |
|---|---|---|---|---|
| Tech Academy SF | centro_educativo | San Francisco | activo | — |
| Universidad Nacional | universidad | Lima | activo | Pedro Salinas |
| Centro Comunitario Norte | centro_comunitario | Lima | activo | — |
| ONG EcoVida | ong | Cusco | activo | Lucía Romero |
| Colegio Nacional San Marcos | colegio | Lima | activo | — |
| Universidad de Ingeniería | universidad | Lima | activo | — |
| Colegio María Auxiliadora | colegio | Cusco | solicitud | — |
| PUCP — Pontificia Universidad | universidad | Lima | activo | — |
| IE Gran Unidad Escolar | colegio | Arequipa | solicitud | — |
| Academia Pre-Universitaria Trilce | centro_educativo | Lima | inactivo | — |
| ONG Futuro Digital | ong | Trujillo | activo | — |

## Voluntarios standalone (10, sin cuenta auth)

| Nombre | Email | Color |
|---|---|---|
| María García | maria@email.com | amber |
| Carlos Quispe | carlos@email.com | blue |
| Ana Torres | ana@email.com | purple |
| Luis Mendoza | luis@email.com | emerald |
| Rosa Huanca | rosa@email.com | rose |
| Diego Paredes | diego@email.com | sky |
| Fernanda Ríos | fernanda@email.com | orange |
| Jorge Huamán | jorge@email.com | teal |
| Sofía Castillo | sofia@email.com | pink |
| Raúl Espinoza | raul@email.com | indigo |

## Inscripciones a eventos (20)

| Evento | Voluntario | Rol | Estado | Horas |
|---|---|---|---|---|
| Taller STEM | María García | Instructor | aprobado | 8 |
| Taller STEM | Luis Mendoza | Mentor | aprobado | 8 |
| Taller STEM | Sofía Castillo | Coordinador | aprobado | 4 |
| Taller STEM | Diego Paredes | Asistente | pendiente | 0 |
| Taller STEM | **Camila Vargas** | Asistente | aprobado | 4 |
| Cumbre Liderazgo | Carlos Quispe | Facilitador | aprobado | 6 |
| Cumbre Liderazgo | Fernanda Ríos | Moderador | aprobado | 5 |
| Cumbre Liderazgo | Raúl Espinoza | Asistente | pendiente | 0 |
| Formación Digital | Ana Torres | Instructor | aprobado | 4 |
| Formación Digital | Rosa Huanca | Asistente | pendiente | 0 |
| Mentoría STEM | María García | Mentor | aprobado | 0 |
| Mentoría STEM | Jorge Huamán | Instructor | aprobado | 0 |
| Mentoría STEM | Rosa Huanca | Coordinador | pendiente | 0 |
| Taller Prog. Web | Carlos Quispe | Instructor | aprobado | 7 |
| Taller Prog. Web | Ana Torres | Asistente | aprobado | 7 |
| Taller Prog. Web | Luis Mendoza | Instructor | aprobado | 7 |
| Taller Prog. Web | Diego Paredes | Asistente | aprobado | 7 |
| Taller Prog. Web | **Camila Vargas** | Asistente | aprobado | 7 |
| Feria Ciencias | Fernanda Ríos | Instructor | aprobado | 0 |
| Feria Ciencias | Jorge Huamán | Facilitador | pendiente | 0 |

## Reseñas (4, evento finalizado)

| Evento | Autor | Tipo | Rating | Comentario |
|---|---|---|---|---|
| Taller Prog. Web | Carlos Quispe | voluntario | 5/5 | Excelente experiencia... |
| Taller Prog. Web | Ana Torres | voluntario | 4/5 | Muy bien organizado... |
| Taller Prog. Web | PUCP | institución | 5/5 | Los voluntarios fueron puntuales... |
| Taller Prog. Web | Luis Mendoza | voluntario | 5/5 | Me encantó ver la cara de los chicos... |

## Sponsors (9)

Google, Microsoft, Cisco, Banco Nacional, Fundación Educativa, Claro, Entel, Intel, SAP
