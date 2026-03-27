-- ============================================
-- Capi — Datos iniciales (solo para desarrollo)
-- ============================================
-- Password para TODAS las cuentas de prueba: Test1234!

-- -----------------------------------------------
-- AUTH USERS  (contraseña: Test1234!)
-- El trigger handle_new_user() crea automáticamente:
--   • user_profiles (role según raw_user_meta_data)
--   • volunteers (vinculado por user_id)
-- -----------------------------------------------
INSERT INTO auth.users (
  instance_id, id, aud, role, email,
  encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, confirmation_token, is_super_admin,
  email_change, email_change_token_new, email_change_token_current,
  email_change_confirm_status, phone_change, phone_change_token,
  recovery_token, reauthentication_token, is_sso_user, is_anonymous
) VALUES
  -- Admin
  ('00000000-0000-0000-0000-000000000000',
   'f0000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated',
   'admin@capi.test',
   crypt('Test1234!', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}',
   '{"full_name":"Admin Capi","role":"admin"}',
   now(), now(), '', false,
   '', '', '', 0, '', '', '', '', false, false),
  -- Organizador 1
  ('00000000-0000-0000-0000-000000000000',
   'f0000000-0000-0000-0000-000000000002', 'authenticated', 'authenticated',
   'pedro@capi.test',
   crypt('Test1234!', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}',
   '{"full_name":"Pedro Salinas"}',
   now(), now(), '', false,
   '', '', '', 0, '', '', '', '', false, false),
  -- Organizador 2
  ('00000000-0000-0000-0000-000000000000',
   'f0000000-0000-0000-0000-000000000003', 'authenticated', 'authenticated',
   'lucia@capi.test',
   crypt('Test1234!', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}',
   '{"full_name":"Lucía Romero"}',
   now(), now(), '', false,
   '', '', '', 0, '', '', '', '', false, false),
  -- Voluntario regular
  ('00000000-0000-0000-0000-000000000000',
   'f0000000-0000-0000-0000-000000000004', 'authenticated', 'authenticated',
   'camila@capi.test',
   crypt('Test1234!', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}',
   '{"full_name":"Camila Vargas"}',
   now(), now(), '', false,
   '', '', '', 0, '', '', '', '', false, false)
ON CONFLICT (id) DO NOTHING;

-- Identities (requeridas por Supabase Auth para login con email)
INSERT INTO auth.identities (
  id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES
  (gen_random_uuid(), 'f0000000-0000-0000-0000-000000000001', 'admin@capi.test',
   jsonb_build_object('sub', 'f0000000-0000-0000-0000-000000000001', 'email', 'admin@capi.test'),
   'email', now(), now(), now()),
  (gen_random_uuid(), 'f0000000-0000-0000-0000-000000000002', 'pedro@capi.test',
   jsonb_build_object('sub', 'f0000000-0000-0000-0000-000000000002', 'email', 'pedro@capi.test'),
   'email', now(), now(), now()),
  (gen_random_uuid(), 'f0000000-0000-0000-0000-000000000003', 'lucia@capi.test',
   jsonb_build_object('sub', 'f0000000-0000-0000-0000-000000000003', 'email', 'lucia@capi.test'),
   'email', now(), now(), now()),
  (gen_random_uuid(), 'f0000000-0000-0000-0000-000000000004', 'camila@capi.test',
   jsonb_build_object('sub', 'f0000000-0000-0000-0000-000000000004', 'email', 'camila@capi.test'),
   'email', now(), now(), now())
ON CONFLICT DO NOTHING;

-- -----------------------------------------------
-- COMMUNITIES
-- -----------------------------------------------
INSERT INTO communities (id, name, slug, description, website, instagram, status, created_by, created_at) VALUES
  ('e1000000-0000-0000-0000-000000000001',
   'Capi Perú', 'capi-peru',
   'Comunidad principal de voluntariado educativo en Perú. Conectamos profesionales con estudiantes que necesitan mentoría.',
   'https://capi.pe', '@capiperu', 'activo',
   'f0000000-0000-0000-0000-000000000001', '2023-01-15'),
  ('e1000000-0000-0000-0000-000000000002',
   'STEM Lima', 'stem-lima',
   'Red de voluntarios STEM en Lima. Talleres de robótica, programación y ciencias en colegios públicos.',
   NULL, '@stemlima', 'activo',
   'f0000000-0000-0000-0000-000000000002', '2023-06-01'),
  ('e1000000-0000-0000-0000-000000000003',
   'Educación Rural Cusco', 'educacion-rural-cusco',
   'Llevamos talleres educativos a comunidades rurales de Cusco.',
   NULL, NULL, 'solicitud',
   'f0000000-0000-0000-0000-000000000003', '2024-01-10')
ON CONFLICT DO NOTHING;

-- -----------------------------------------------
-- COMMUNITY MEMBERS
-- -----------------------------------------------
INSERT INTO community_members (community_id, user_id, community_role_id, invited_by, joined_at)
SELECT
  cm.community_id, cm.user_id,
  (SELECT id FROM community_roles cr WHERE cr.community_id = cm.community_id AND cr.name = cm.role_name),
  cm.invited_by, cm.joined_at
FROM (
  -- Capi Perú: admin es líder, pedro y lucía son colaboradores, camila es miembro
  SELECT 'e1000000-0000-0000-0000-000000000001'::uuid as community_id, 'f0000000-0000-0000-0000-000000000001'::uuid as user_id, 'Líder' as role_name, NULL::uuid as invited_by, '2023-01-15'::timestamp as joined_at
  UNION ALL
  SELECT 'e1000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000002', 'Colaborador', 'f0000000-0000-0000-0000-000000000001', '2023-02-01'
  UNION ALL
  SELECT 'e1000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000003', 'Colaborador', 'f0000000-0000-0000-0000-000000000001', '2023-03-01'
  UNION ALL
  SELECT 'e1000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000004', 'Miembro', 'f0000000-0000-0000-0000-000000000002', '2024-05-10'
  UNION ALL
  -- STEM Lima: pedro es líder, camila es miembro
  SELECT 'e1000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000002', 'Líder', NULL, '2023-06-01'
  UNION ALL
  SELECT 'e1000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000004', 'Miembro', 'f0000000-0000-0000-0000-000000000002', '2024-06-15'
  UNION ALL
  -- Educación Rural Cusco: lucía es líder
  SELECT 'e1000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000003', 'Líder', NULL, '2024-01-10'
) cm
ON CONFLICT DO NOTHING;

-- -----------------------------------------------
-- INSTITUTIONS
-- -----------------------------------------------
INSERT INTO institutions (id, name, type, city, contact, email, status, contact_user_id, created_at) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Tech Academy SF', 'centro_educativo', 'San Francisco', 'Director SF', 'contact@techacademy.com', 'activo', NULL, '2023-03-01'),
  ('a1000000-0000-0000-0000-000000000002', 'Universidad Nacional', 'universidad', 'Lima', 'Dr. Rector', 'info@uni.edu.pe', 'activo', 'f0000000-0000-0000-0000-000000000002', '2023-01-01'),
  ('a1000000-0000-0000-0000-000000000003', 'Centro Comunitario Norte', 'centro_comunitario', 'Lima', 'Ana Flores', 'ccnorte@org.pe', 'activo', NULL, '2023-06-01'),
  ('a1000000-0000-0000-0000-000000000004', 'ONG EcoVida', 'ong', 'Cusco', 'Luis Verde', 'ecovida@org.pe', 'activo', 'f0000000-0000-0000-0000-000000000003', '2023-02-01'),
  ('a1000000-0000-0000-0000-000000000005', 'Colegio Nacional San Marcos', 'colegio', 'Lima', 'Prof. Ramírez', 'smarcos@edu.pe', 'activo', NULL, '2023-03-01'),
  ('a1000000-0000-0000-0000-000000000006', 'Universidad de Ingeniería', 'universidad', 'Lima', 'Dr. Castillo', 'uni@uni.edu.pe', 'activo', NULL, '2023-01-01'),
  ('a1000000-0000-0000-0000-000000000007', 'Colegio María Auxiliadora', 'colegio', 'Cusco', 'Hna. Patricia', 'maria.aux@edu.pe', 'solicitud', NULL, now()),
  ('a1000000-0000-0000-0000-000000000008', 'PUCP — Pontificia Universidad', 'universidad', 'Lima', 'Mg. Herrera', 'pucp@pucp.edu.pe', 'activo', NULL, '2022-11-01'),
  ('a1000000-0000-0000-0000-000000000009', 'IE Gran Unidad Escolar', 'colegio', 'Arequipa', 'Prof. Salas', 'gue@edu.pe', 'solicitud', NULL, now()),
  ('a1000000-0000-0000-0000-000000000010', 'Academia Pre-Universitaria Trilce', 'centro_educativo', 'Lima', 'Lic. Vega', 'trilce@trilce.pe', 'inactivo', NULL, '2023-08-01'),
  ('a1000000-0000-0000-0000-000000000011', 'ONG Futuro Digital', 'ong', 'Trujillo', 'Carlos Nieto', 'ong@futurodi.pe', 'activo', NULL, '2023-02-01')
ON CONFLICT DO NOTHING;

-- -----------------------------------------------
-- EVENTS (vinculados a usuarios y comunidades)
-- -----------------------------------------------
INSERT INTO events (id, institution_id, community_id, created_by, title, slug, description, about, date, location, full_location, type, status, image_url, volunteers_needed, students_goal) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001',
   'e1000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000002',
   'Taller STEM para Niños', 'stem-workshop-kids',
   'Empoderando a la próxima generación de innovadores con experiencias prácticas en robótica, programación básica e ingeniería creativa.',
   'Este taller ofrece a niños de primaria experiencias prácticas en programación básica, robótica y principios de ingeniería.',
   '2025-04-24', 'Centro de Innovación Tech', '450 Innovation Way, Suite 200, San Francisco, CA 94103',
   'taller', 'activo', 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80', 50, 200),

  ('b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000002',
   'e1000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000002',
   'Cumbre de Liderazgo Juvenil 2025', 'liderazgo-juvenil',
   'Empoderando a la próxima generación de líderes para resolver desafíos locales mediante la innovación y la acción comunitaria.',
   'La Cumbre de Liderazgo Juvenil reúne a jóvenes de toda la región para desarrollar habilidades de liderazgo.',
   '2025-05-10', 'Municipalidad', 'Av. Principal 1200, Sala de Conferencias, Lima',
   'conferencia', 'activo', 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80', 30, 150),

  ('b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000003',
   'e1000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000003',
   'Formación Digital para Adultos Mayores', 'formacion-digital',
   'Reduciendo la brecha digital enseñando herramientas básicas de internet, videollamadas y seguridad en línea.',
   'Programa de alfabetización digital diseñado específicamente para adultos mayores.',
   '2025-06-12', 'Centro Comunitario Norte', 'Jr. Los Cedros 450, Lima',
   'programa', 'activo', 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800&q=80', 20, 60),

  ('b1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000004',
   'e1000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000003',
   'Charla: Medio Ambiente y Acción Local', 'charla-medio-ambiente',
   'Aprende cómo reducir tu huella de carbono y vivir de manera más sostenible.',
   'Una charla abierta a la comunidad para entender el impacto del cambio climático.',
   '2025-07-18', 'Biblioteca Municipal', 'Av. Cultura 300, Sala Principal, Cusco',
   'charla', 'borrador', 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=800&q=80', 10, 100),

  ('b1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000005',
   'e1000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000002',
   'Mentoría STEM en Colegios Públicos', 'mentoria-stem-colegios',
   'Voluntarios profesionales en STEM visitan colegios públicos para inspirar a estudiantes.',
   'Programa que conecta a profesionales de STEM con estudiantes de colegios públicos.',
   '2025-05-22', 'Colegio Nacional San Marcos', 'Jr. Universitaria 1500, Lima',
   'voluntariado_educativo', 'activo', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80', 40, 300),

  ('b1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000006',
   'e1000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000002',
   'Hackathon de Impacto Social', 'hackathon-social',
   '48 horas para desarrollar soluciones tecnológicas a problemas reales de nuestra comunidad.',
   'Un hackathon enfocado en crear soluciones tecnológicas para problemas sociales locales.',
   '2025-08-06', 'Hub de Innovación', 'Av. Universitaria 800, Lima',
   'evento_stem', 'borrador', 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80', 15, 120),

  -- Evento finalizado (para probar reseñas)
  ('b1000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000008',
   'e1000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000002',
   'Taller de Programación Web Básica', 'taller-programacion-web',
   'Introducción práctica a HTML, CSS y JavaScript para estudiantes sin experiencia previa.',
   'Un taller de un día completo donde los participantes construyen su primera página web desde cero.',
   '2025-02-15', 'PUCP — Lab de Cómputo', 'Av. Universitaria 1801, San Miguel, Lima',
   'taller', 'finalizado', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80', 25, 80),

  -- Evento futuro en Cusco
  ('b1000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000004',
   'e1000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000003',
   'Feria de Ciencias Rurales', 'feria-ciencias-rurales',
   'Llevamos la ciencia a comunidades rurales con experimentos interactivos y demostraciones.',
   'Una feria itinerante que visita escuelas rurales para despertar el interés científico en los estudiantes.',
   '2025-09-20', 'Plaza de Armas Chinchero', 'Plaza de Armas s/n, Chinchero, Cusco',
   'evento_stem', 'activo', 'https://images.unsplash.com/photo-1564429238961-bf8de4b4f24b?w=800&q=80', 35, 250)
ON CONFLICT DO NOTHING;

-- -----------------------------------------------
-- EVENT ROLES (roles configurados por evento)
-- -----------------------------------------------
INSERT INTO event_roles (event_id, name, slots, sort_order) VALUES
  -- Taller STEM para Niños
  ('b1000000-0000-0000-0000-000000000001', 'Instructor', 5, 1),
  ('b1000000-0000-0000-0000-000000000001', 'Mentor', 3, 2),
  ('b1000000-0000-0000-0000-000000000001', 'Asistente', 5, 3),
  ('b1000000-0000-0000-0000-000000000001', 'Coordinador', 2, 4),
  -- Cumbre de Liderazgo
  ('b1000000-0000-0000-0000-000000000002', 'Facilitador', 4, 1),
  ('b1000000-0000-0000-0000-000000000002', 'Moderador', 3, 2),
  ('b1000000-0000-0000-0000-000000000002', 'Asistente', 5, 3),
  -- Formación Digital
  ('b1000000-0000-0000-0000-000000000003', 'Instructor', 3, 1),
  ('b1000000-0000-0000-0000-000000000003', 'Asistente', 4, 2),
  -- Mentoría STEM
  ('b1000000-0000-0000-0000-000000000005', 'Instructor', 8, 1),
  ('b1000000-0000-0000-0000-000000000005', 'Mentor', 6, 2),
  ('b1000000-0000-0000-0000-000000000005', 'Coordinador', 3, 3),
  ('b1000000-0000-0000-0000-000000000005', 'Asistente', 5, 4),
  -- Hackathon
  ('b1000000-0000-0000-0000-000000000006', 'Mentor', 5, 1),
  ('b1000000-0000-0000-0000-000000000006', 'Coordinador', 2, 2),
  ('b1000000-0000-0000-0000-000000000006', 'Moderador', 3, 3),
  -- Taller Programación Web (finalizado)
  ('b1000000-0000-0000-0000-000000000007', 'Instructor', 4, 1),
  ('b1000000-0000-0000-0000-000000000007', 'Asistente', 6, 2),
  -- Feria Ciencias Rurales
  ('b1000000-0000-0000-0000-000000000008', 'Instructor', 6, 1),
  ('b1000000-0000-0000-0000-000000000008', 'Facilitador', 4, 2),
  ('b1000000-0000-0000-0000-000000000008', 'Asistente', 8, 3)
ON CONFLICT DO NOTHING;

-- -----------------------------------------------
-- AGENDA ITEMS
-- -----------------------------------------------
INSERT INTO agenda_items (event_id, time, title, description, sort_order) VALUES
  -- Taller STEM para Niños
  ('b1000000-0000-0000-0000-000000000001', '09:00 AM', 'Orientación de Voluntarios', 'Distribución de materiales y asignación de roles.', 1),
  ('b1000000-0000-0000-0000-000000000001', '10:00 AM', 'Introducción a la Lógica', 'Presentación sobre cómo piensan las computadoras.', 2),
  ('b1000000-0000-0000-0000-000000000001', '11:30 AM', 'Robótica Práctica', 'Ensamblaje y programación básica de movimiento.', 3),
  ('b1000000-0000-0000-0000-000000000001', '01:00 PM', 'Demo Final y Premios', 'Los equipos presentan sus proyectos.', 4),
  -- Cumbre de Liderazgo
  ('b1000000-0000-0000-0000-000000000002', '08:30 AM', 'Registro y bienvenida', 'Check-in de participantes y voluntarios.', 1),
  ('b1000000-0000-0000-0000-000000000002', '09:00 AM', 'Panel de Líderes', 'Charla con líderes comunitarios locales.', 2),
  ('b1000000-0000-0000-0000-000000000002', '11:00 AM', 'Talleres grupales', 'Sesiones de trabajo por temáticas.', 3),
  ('b1000000-0000-0000-0000-000000000002', '02:00 PM', 'Presentaciones finales', 'Cada grupo presenta sus propuestas.', 4),
  -- Formación Digital
  ('b1000000-0000-0000-0000-000000000003', '10:00 AM', 'Uso del smartphone', 'Cómo hacer llamadas, mensajes y fotos.', 1),
  ('b1000000-0000-0000-0000-000000000003', '11:30 AM', 'Internet y navegación segura', 'Cómo buscar información y evitar estafas.', 2),
  ('b1000000-0000-0000-0000-000000000003', '01:00 PM', 'Videollamadas', 'Práctica con Zoom y WhatsApp Video.', 3),
  -- Mentoría STEM
  ('b1000000-0000-0000-0000-000000000005', '08:00 AM', 'Llegada al colegio', 'Coordinación con directivos y bienvenida.', 1),
  ('b1000000-0000-0000-0000-000000000005', '09:00 AM', 'Charla motivacional', '¿Qué es STEM y por qué importa?', 2),
  ('b1000000-0000-0000-0000-000000000005', '10:30 AM', 'Sesiones de mentoría', 'Grupos pequeños con mentores por área.', 3),
  ('b1000000-0000-0000-0000-000000000005', '12:00 PM', 'Cierre y fotos grupales', 'Entrega de certificados y despedida.', 4),
  -- Taller Programación Web (finalizado)
  ('b1000000-0000-0000-0000-000000000007', '09:00 AM', 'Introducción a HTML', 'Estructura básica de una página web.', 1),
  ('b1000000-0000-0000-0000-000000000007', '10:30 AM', 'Estilos con CSS', 'Colores, fuentes y diseño responsivo.', 2),
  ('b1000000-0000-0000-0000-000000000007', '12:00 PM', 'Almuerzo', 'Pausa para almorzar y networking.', 3),
  ('b1000000-0000-0000-0000-000000000007', '01:00 PM', 'JavaScript básico', 'Interactividad y lógica de programación.', 4),
  ('b1000000-0000-0000-0000-000000000007', '03:00 PM', 'Proyecto final', 'Cada estudiante publica su página web.', 5),
  -- Feria Ciencias Rurales
  ('b1000000-0000-0000-0000-000000000008', '08:00 AM', 'Montaje de stands', 'Preparación de estaciones de experimentos.', 1),
  ('b1000000-0000-0000-0000-000000000008', '09:30 AM', 'Apertura de la feria', 'Bienvenida a estudiantes y comunidad.', 2),
  ('b1000000-0000-0000-0000-000000000008', '10:00 AM', 'Experimentos interactivos', 'Rotación libre por las estaciones.', 3),
  ('b1000000-0000-0000-0000-000000000008', '12:30 PM', 'Show de ciencia', 'Demostración en vivo de experimentos llamativos.', 4),
  ('b1000000-0000-0000-0000-000000000008', '01:30 PM', 'Premiación y cierre', 'Reconocimiento a participantes destacados.', 5)
ON CONFLICT DO NOTHING;

-- -----------------------------------------------
-- SPONSORS
-- -----------------------------------------------
INSERT INTO sponsors (id, name) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Google'),
  ('c1000000-0000-0000-0000-000000000002', 'Microsoft'),
  ('c1000000-0000-0000-0000-000000000003', 'Cisco'),
  ('c1000000-0000-0000-0000-000000000004', 'Banco Nacional'),
  ('c1000000-0000-0000-0000-000000000005', 'Fundación Educativa'),
  ('c1000000-0000-0000-0000-000000000006', 'Claro'),
  ('c1000000-0000-0000-0000-000000000007', 'Entel'),
  ('c1000000-0000-0000-0000-000000000010', 'Intel'),
  ('c1000000-0000-0000-0000-000000000011', 'SAP')
ON CONFLICT DO NOTHING;

-- -----------------------------------------------
-- EVENT_SPONSORS
-- -----------------------------------------------
INSERT INTO event_sponsors (event_id, sponsor_id) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001'),
  ('b1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000002'),
  ('b1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000003'),
  ('b1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000004'),
  ('b1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000005'),
  ('b1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000006'),
  ('b1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000007'),
  ('b1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000010'),
  ('b1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000011'),
  ('b1000000-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000001'),
  ('b1000000-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000010'),
  ('b1000000-0000-0000-0000-000000000008', 'c1000000-0000-0000-0000-000000000005'),
  ('b1000000-0000-0000-0000-000000000008', 'c1000000-0000-0000-0000-000000000004')
ON CONFLICT DO NOTHING;

-- -----------------------------------------------
-- VOLUNTEERS (standalone, sin cuenta auth)
-- El trigger ya creó volunteers para los 4 auth users.
-- Estos son voluntarios que se registraron sin cuenta.
-- -----------------------------------------------
INSERT INTO volunteers (id, name, email, avatar_color, avatar_hex) VALUES
  ('d1000000-0000-0000-0000-000000000001', 'María García', 'maria@email.com', 'bg-amber-400', '#fbbf24'),
  ('d1000000-0000-0000-0000-000000000002', 'Carlos Quispe', 'carlos@email.com', 'bg-blue-400', '#60a5fa'),
  ('d1000000-0000-0000-0000-000000000003', 'Ana Torres', 'ana@email.com', 'bg-purple-400', '#c084fc'),
  ('d1000000-0000-0000-0000-000000000004', 'Luis Mendoza', 'luis@email.com', 'bg-emerald-400', '#34d399'),
  ('d1000000-0000-0000-0000-000000000005', 'Rosa Huanca', 'rosa@email.com', 'bg-rose-400', '#fb7185'),
  ('d1000000-0000-0000-0000-000000000006', 'Diego Paredes', 'diego@email.com', 'bg-sky-400', '#38bdf8'),
  ('d1000000-0000-0000-0000-000000000007', 'Fernanda Ríos', 'fernanda@email.com', 'bg-orange-400', '#fb923c'),
  ('d1000000-0000-0000-0000-000000000008', 'Jorge Huamán', 'jorge@email.com', 'bg-teal-400', '#2dd4bf'),
  ('d1000000-0000-0000-0000-000000000009', 'Sofía Castillo', 'sofia@email.com', 'bg-pink-400', '#f472b6'),
  ('d1000000-0000-0000-0000-000000000010', 'Raúl Espinoza', 'raul@email.com', 'bg-indigo-400', '#818cf8')
ON CONFLICT DO NOTHING;

-- -----------------------------------------------
-- EVENT_VOLUNTEERS
-- Se usa el volunteer_id del trigger para los auth users.
-- Primero obtenemos los IDs de volunteers creados por el trigger.
-- -----------------------------------------------
-- Voluntarios standalone en eventos
INSERT INTO event_volunteers (event_id, volunteer_id, role, status, hours, joined_at) VALUES
  -- Taller STEM para Niños (activo, 4 voluntarios)
  ('b1000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001', 'Instructor', 'aprobado', 8, '2025-03-15'),
  ('b1000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000004', 'Mentor', 'aprobado', 8, '2025-03-16'),
  ('b1000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000006', 'Asistente', 'pendiente', 0, '2025-03-20'),
  ('b1000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000009', 'Coordinador', 'aprobado', 4, '2025-03-18'),
  -- Cumbre de Liderazgo (activo, 3 voluntarios)
  ('b1000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000002', 'Facilitador', 'aprobado', 6, '2025-04-01'),
  ('b1000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000007', 'Moderador', 'aprobado', 5, '2025-04-03'),
  ('b1000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000010', 'Asistente', 'pendiente', 0, '2025-04-10'),
  -- Formación Digital (activo, 2 voluntarios)
  ('b1000000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000003', 'Instructor', 'aprobado', 4, '2025-05-01'),
  ('b1000000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000005', 'Asistente', 'pendiente', 0, '2025-05-05'),
  -- Mentoría STEM (activo, 3 voluntarios)
  ('b1000000-0000-0000-0000-000000000005', 'd1000000-0000-0000-0000-000000000001', 'Mentor', 'aprobado', 0, '2025-04-20'),
  ('b1000000-0000-0000-0000-000000000005', 'd1000000-0000-0000-0000-000000000008', 'Instructor', 'aprobado', 0, '2025-04-22'),
  ('b1000000-0000-0000-0000-000000000005', 'd1000000-0000-0000-0000-000000000005', 'Coordinador', 'pendiente', 0, '2025-04-25'),
  -- Taller Programación Web — finalizado (4 voluntarios con horas)
  ('b1000000-0000-0000-0000-000000000007', 'd1000000-0000-0000-0000-000000000002', 'Instructor', 'aprobado', 7, '2025-01-20'),
  ('b1000000-0000-0000-0000-000000000007', 'd1000000-0000-0000-0000-000000000003', 'Asistente', 'aprobado', 7, '2025-01-22'),
  ('b1000000-0000-0000-0000-000000000007', 'd1000000-0000-0000-0000-000000000004', 'Instructor', 'aprobado', 7, '2025-01-23'),
  ('b1000000-0000-0000-0000-000000000007', 'd1000000-0000-0000-0000-000000000006', 'Asistente', 'aprobado', 7, '2025-01-25'),
  -- Feria Ciencias Rurales (activo, 2 voluntarios)
  ('b1000000-0000-0000-0000-000000000008', 'd1000000-0000-0000-0000-000000000007', 'Instructor', 'aprobado', 0, '2025-08-01'),
  ('b1000000-0000-0000-0000-000000000008', 'd1000000-0000-0000-0000-000000000008', 'Facilitador', 'pendiente', 0, '2025-08-10')
ON CONFLICT DO NOTHING;

-- Vincular a Camila (auth user) como voluntaria en un evento
-- Su volunteer record fue creado por el trigger, lo buscamos por user_id
INSERT INTO event_volunteers (event_id, volunteer_id, role, status, hours, joined_at)
SELECT 'b1000000-0000-0000-0000-000000000001', v.id, 'Asistente', 'aprobado', 4, '2025-03-19'
FROM volunteers v WHERE v.user_id = 'f0000000-0000-0000-0000-000000000004'
ON CONFLICT DO NOTHING;

INSERT INTO event_volunteers (event_id, volunteer_id, role, status, hours, joined_at)
SELECT 'b1000000-0000-0000-0000-000000000007', v.id, 'Asistente', 'aprobado', 7, '2025-01-24'
FROM volunteers v WHERE v.user_id = 'f0000000-0000-0000-0000-000000000004'
ON CONFLICT DO NOTHING;

-- -----------------------------------------------
-- REVIEWS (solo en evento finalizado)
-- -----------------------------------------------
INSERT INTO reviews (event_id, author_id, author_type, volunteer_author_id, institution_author_id, rating, comment, created_at) VALUES
  -- Reseñas del Taller de Programación Web (finalizado)
  ('b1000000-0000-0000-0000-000000000007', 'd1000000-0000-0000-0000-000000000002', 'voluntario',
   'd1000000-0000-0000-0000-000000000002', NULL, 5,
   'Excelente experiencia. Los estudiantes aprendieron mucho y terminaron con su propia página web publicada.', '2025-02-16'),
  ('b1000000-0000-0000-0000-000000000007', 'd1000000-0000-0000-0000-000000000003', 'voluntario',
   'd1000000-0000-0000-0000-000000000003', NULL, 4,
   'Muy bien organizado. Sugiero más tiempo para la parte de JavaScript, los estudiantes querían seguir practicando.', '2025-02-17'),
  ('b1000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000008', 'institucion',
   NULL, 'a1000000-0000-0000-0000-000000000008', 5,
   'Los voluntarios fueron puntuales, preparados y muy pacientes con los estudiantes. Queremos repetir el evento.', '2025-02-18'),
  ('b1000000-0000-0000-0000-000000000007', 'd1000000-0000-0000-0000-000000000004', 'voluntario',
   'd1000000-0000-0000-0000-000000000004', NULL, 5,
   'Me encantó ver la cara de los chicos cuando su página web aparecía en el navegador. Totalmente motivador.', '2025-02-16')
ON CONFLICT DO NOTHING;
