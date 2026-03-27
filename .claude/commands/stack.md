---
name: stack-detector
description: Analiza un proyecto y detecta su tech stack completo (lenguajes, frameworks, bases de datos, herramientas, infraestructura).
disable-model-invocation: false
context: fork
allowed-tools: Read, Grep, Glob, Bash
---

# Stack Detector

Eres un experto en arquitectura de software. Tu trabajo es analizar un proyecto y reportar exactamente qué tecnologías usa.

## Tarea

$ARGUMENTS

Si no se especifica una ruta, analiza el directorio de trabajo actual.

## Proceso

### 1. Detectar lenguajes y gestores de paquetes

```
Busca estos archivos clave:
- package.json → Node.js / JavaScript / TypeScript
- tsconfig.json → TypeScript
- requirements.txt / setup.py / pyproject.toml / Pipfile → Python
- go.mod → Go
- Cargo.toml → Rust
- pom.xml / build.gradle / build.gradle.kts → Java / Kotlin (JVM)
- Gemfile → Ruby
- composer.json → PHP
- pubspec.yaml → Dart / Flutter
- *.csproj / *.sln → C# / .NET
- mix.exs → Elixir
- deno.json / deno.jsonc → Deno
- bun.lockb → Bun
- Package.swift → Swift
```

### 2. Detectar frameworks

```
Frontend:
- next.config.* → Next.js (verificar versión y si usa App Router o Pages Router)
- nuxt.config.* → Nuxt.js
- vite.config.* → Vite
- angular.json → Angular
- svelte.config.* → SvelteKit / Svelte
- astro.config.* → Astro
- remix.config.* → Remix
- gatsby-config.* → Gatsby
- Grep: "react" en package.json → React
- Grep: "vue" en package.json → Vue
- Grep: "solid-js" en package.json → SolidJS
- Grep: "qwik" en package.json → Qwik

Backend:
- Grep: "express" en package.json → Express
- Grep: "fastify" en package.json → Fastify
- Grep: "nestjs" en package.json → NestJS
- Grep: "hono" en package.json → Hono
- Grep: "django" en requirements/pyproject → Django
- Grep: "flask" en requirements/pyproject → Flask
- Grep: "fastapi" en requirements/pyproject → FastAPI
- Grep: "rails" en Gemfile → Ruby on Rails
- Grep: "laravel" en composer.json → Laravel
- Grep: "spring" en pom.xml/build.gradle → Spring Boot
- Grep: "phoenix" en mix.exs → Phoenix
- Grep: "gin" o "fiber" o "echo" en go.mod → Go web frameworks
- Grep: "actix" o "axum" o "rocket" en Cargo.toml → Rust web frameworks

Mobile:
- Grep: "react-native" en package.json → React Native
- Grep: "expo" en package.json → Expo
- Grep: "flutter" en pubspec.yaml → Flutter
- android/ + ios/ directorios → nativo o cross-platform
- Grep: "@capacitor" o "cordova" → Capacitor / Cordova
```

### 3. Detectar bases de datos y BaaS

```
- Grep: "supabase" → Supabase
- Grep: "firebase" → Firebase
- Grep: "prisma" → Prisma ORM (leer schema.prisma para detectar DB)
- Grep: "drizzle" → Drizzle ORM
- Grep: "typeorm" → TypeORM
- Grep: "sequelize" → Sequelize
- Grep: "mongoose" o "mongodb" → MongoDB
- Grep: "pg" o "postgres" → PostgreSQL
- Grep: "mysql2" o "mysql" → MySQL
- Grep: "redis" o "ioredis" → Redis
- Grep: "sqlite" o "better-sqlite3" o "sql.js" → SQLite
- Grep: "dynamodb" → DynamoDB
- Glob: supabase/migrations/*.sql → migraciones Supabase
- Glob: prisma/schema.prisma → schema Prisma
- Glob: drizzle/*.ts → schema Drizzle
```

### 4. Detectar UI y estilos

```
- Grep: "tailwindcss" → Tailwind CSS
- Glob: tailwind.config.* → confirmar Tailwind
- Grep: "shadcn" o "@radix-ui" → shadcn/ui
- Grep: "@mui" o "@material-ui" → Material UI
- Grep: "@chakra-ui" → Chakra UI
- Grep: "@mantine" → Mantine
- Grep: "antd" o "ant-design" → Ant Design
- Grep: "styled-components" → Styled Components
- Grep: "@emotion" → Emotion
- Grep: "sass" o "node-sass" → Sass/SCSS
- Grep: "bootstrap" → Bootstrap
```

### 5. Detectar estado y data fetching

```
- Grep: "zustand" → Zustand
- Grep: "jotai" → Jotai
- Grep: "redux" o "@reduxjs/toolkit" → Redux
- Grep: "recoil" → Recoil
- Grep: "mobx" → MobX
- Grep: "@tanstack/react-query" o "react-query" → TanStack Query
- Grep: "swr" → SWR
- Grep: "trpc" o "@trpc" → tRPC
- Grep: "graphql" o "@apollo" o "urql" → GraphQL
```

### 6. Detectar testing

```
- Grep: "vitest" → Vitest
- Grep: "jest" → Jest
- Grep: "playwright" → Playwright
- Grep: "cypress" → Cypress
- Grep: "testing-library" → Testing Library
- Grep: "pytest" → pytest
- Grep: "unittest" → unittest (Python)
- Grep: "rspec" → RSpec
- Grep: "phpunit" → PHPUnit
```

### 7. Detectar infraestructura y deploy

```
- Glob: Dockerfile, docker-compose.* → Docker
- Glob: .github/workflows/*.yml → GitHub Actions
- Glob: .gitlab-ci.yml → GitLab CI
- Glob: vercel.json → Vercel
- Glob: netlify.toml → Netlify
- Glob: fly.toml → Fly.io
- Glob: railway.toml o railway.json → Railway
- Glob: render.yaml → Render
- Glob: serverless.yml → Serverless Framework
- Glob: terraform/**/*.tf → Terraform
- Glob: pulumi.* → Pulumi
- Glob: k8s/ o kubernetes/ → Kubernetes
- Glob: .aws/ o samconfig.toml → AWS SAM
- Grep: "@aws-cdk" → AWS CDK
```

### 8. Detectar herramientas de desarrollo

```
- Glob: .eslintrc.* o eslint.config.* → ESLint
- Glob: .prettierrc* o prettier.config.* → Prettier
- Glob: biome.json → Biome
- Glob: .husky/ → Husky (git hooks)
- Grep: "lint-staged" → lint-staged
- Grep: "commitlint" → Commitlint
- Glob: turbo.json → Turborepo
- Glob: nx.json → Nx
- Glob: pnpm-workspace.yaml o lerna.json → Monorepo
- Glob: .changeset/ → Changesets
```

### 9. Detectar autenticación y auth

```
- Grep: "next-auth" o "@auth" → NextAuth.js / Auth.js
- Grep: "clerk" o "@clerk" → Clerk
- Grep: "auth0" → Auth0
- Grep: "passport" → Passport.js
- Grep: "lucia" → Lucia Auth
- Grep: "supabase.*auth" → Supabase Auth
- Grep: "firebase.*auth" → Firebase Auth
- Grep: "keycloak" → Keycloak
```

## Salida esperada

Presenta el resultado en este formato:

### Tipo de proyecto
- **Categoría**: Web App / API / Mobile App / Full-stack / Monorepo / CLI / Librería / otro
- **Arquitectura**: SPA / SSR / SSG / Híbrido / Microservicios / Serverless / otro

### Stack principal

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Lenguaje | ... | ... |
| Framework frontend | ... | ... |
| Framework backend | ... | ... |
| Base de datos | ... | ... |
| ORM | ... | ... |
| UI / Estilos | ... | ... |
| Estado | ... | ... |
| Auth | ... | ... |

### Herramientas de desarrollo
- **Testing**: ...
- **Linting**: ...
- **CI/CD**: ...
- **Deploy**: ...
- **Monorepo**: ... (si aplica)

### Dependencias destacadas
Lista de dependencias que no encajan en las categorías anteriores pero son relevantes (ej: date-fns, zod, i18n, analytics, etc.)

### Resumen en una línea
> Ej: "Full-stack TypeScript app con Next.js 14 (App Router), Supabase, Tailwind + shadcn, desplegado en Vercel"

## Reglas

- NO modifiques ningún archivo. Solo lee y analiza.
- Si no se detecta un archivo clave, NO asumas que la tecnología está presente.
- Reporta versiones exactas cuando estén disponibles en archivos de dependencias.
- Si el directorio está vacío o no es un proyecto, repórtalo claramente.
- Sé conciso. No expliques qué es cada tecnología, solo repórtala.
