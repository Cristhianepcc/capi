# Deploy a Producción — Capi MVP

## Requisitos

- Cuenta en [Vercel](https://vercel.com)
- Proyecto en [Supabase](https://supabase.com)
- Supabase CLI instalado (`npm i -g supabase`)

## 1. Configurar Supabase Hosted

1. Crear un nuevo proyecto en supabase.com
2. Vincular el proyecto local:
   ```bash
   supabase link --project-ref <project-ref>
   ```
3. Correr migraciones:
   ```bash
   supabase db push --linked
   ```
4. Configurar Auth:
   - Habilitar email provider en Authentication > Providers
   - Agregar redirect URLs: `https://<tu-dominio>/dashboard`, `https://<tu-dominio>/login`
   - (Opcional) Configurar SMTP personalizado en Authentication > SMTP Settings
5. Crear bucket de storage:
   - Ir a Storage > Create bucket
   - Nombre: `event-images`
   - Public bucket: **sí**

## 2. Deploy a Vercel

1. Conectar el repositorio de GitHub en Vercel
2. Configurar environment variables en Vercel > Settings > Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL` — URL del proyecto Supabase (ej: `https://abc123.supabase.co`)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Anon key del proyecto Supabase
3. Deploy — Vercel auto-detecta Next.js, no requiere `vercel.json`
4. (Opcional) Configurar dominio personalizado en Vercel > Settings > Domains

## 3. Verificación post-deploy

- [ ] Registrar un nuevo usuario
- [ ] Crear un evento completo (con imagen, agenda, sponsors)
- [ ] Inscribir voluntario desde la página pública
- [ ] Aprobar voluntario desde el dashboard
- [ ] Dejar reseña en evento finalizado
- [ ] Verificar que imágenes de Supabase Storage cargan correctamente
