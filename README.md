# MERIDIAN

Creative studio demo site. Cinematic, multi-page, WebGL-selective.

## Dev
- `npm run dev` — local dev server
- `npm run build` — production build
- `npm test` — unit tests (Vitest)
- `npm run typecheck` — TypeScript
- `npm run lint` — ESLint

## Arquitectura
Ver `docs/superpowers/specs/2026-09-08-meridian-web-design.md`.
Contenido desacoplado en `src/lib/content` (seed local en `src/content`, listo para Sanity).

## Deploy a Vercel

El sitio corre sin variables de entorno — el seed local de contenido y las
fuentes self-hosted alcanzan para una demo completa.

1. **Vía GitHub** — pushear el repo a GitHub e importarlo en
   [vercel.com/new](https://vercel.com/new). El framework se detecta
   automáticamente como Next.js; no hace falta configurar nada más.
2. **Vía CLI** — desde la raíz del proyecto:
   ```
   npx vercel        # preview deploy
   npx vercel --prod # deploy a producción
   ```

Para pasar a un dominio real más adelante: actualizar `SITE_URL` en
`src/lib/config.ts` (usado como `metadataBase` y en `robots.ts`/`sitemap.ts`
para generar URLs absolutas).

## Analytics

[Vercel Analytics](https://vercel.com/analytics) y
[Speed Insights](https://vercel.com/docs/speed-insights) están montados en
`src/app/layout.tsx` (`<Analytics />` / `<SpeedInsights />`). Son no-op fuera
de Vercel y no requieren claves: al desplegar en Vercel se activan solos y
los datos aparecen en el dashboard del proyecto.

## Sentry (opcional)

No viene instalado por defecto para no inflar el bundle — queda documentado
como punto de integración listo para activar cuando haga falta monitoreo de
errores en producción:

1. `npm install @sentry/nextjs`
2. `npx @sentry/wizard@latest -i nextjs` (genera los archivos de config e
   instrumentación).
3. Setear la variable de entorno `SENTRY_DSN` (y las que pida el wizard) en
   Vercel o `.env.local`.

## Performance

- **WebGL selectivo** — se carga con `dynamic import` y sólo si el
  dispositivo pasa el gating de capacidades (se cae a fallback estático en
  mobile, hardware de gama baja o `prefers-reduced-motion`).
- **Imágenes responsive** — `next/image` con tamaños/`sizes` ajustados por
  breakpoint.
- **Fuentes self-hosted** — sin requests a Google Fonts ni CDNs externos.
- **Animaciones** — sólo `transform`/`opacity` (compositor-friendly, sin
  reflow/repaint costoso).

## CMS (Sanity) — cómo activar

Por defecto el sitio corre sin Sanity: `src/lib/content` sirve el seed local
tipado (`src/content/*`) de forma síncrona y cero variables de entorno hacen
falta. La capa de Sanity (`src/lib/sanity/`, `sanity/schemas/`) está lista
pero dormida hasta que se configure un proyecto.

1. **Variables de entorno** — en `.env.local`:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=tu-project-id
   NEXT_PUBLIC_SANITY_DATASET=production
   ```
   Con `NEXT_PUBLIC_SANITY_PROJECT_ID` seteado, `getSanityClient()`
   (`src/lib/sanity/client.ts`) devuelve un cliente real en vez de `null`.
2. **Schemas** — viven en `sanity/schemas/` (uno por tipo: `project`,
   `service`, `siteSettings`, `page`, `media`, `award`, `teamMember`,
   `client`), como objetos planos tipados (`name`/`type`/`fields`, sin
   importar nada del paquete `sanity`) para no traer el Studio al bundle de
   la app. `sanity/schemas/index.ts` los agrupa en `schemaTypes`.
3. **Queries tipadas** — `src/lib/sanity/queries.ts` expone GROQ
   (`allProjectsQuery`, `projectBySlugQuery`, `servicesQuery`,
   `siteSettingsQuery`) y fetchers async (`fetchProjects`, `fetchProject`,
   `fetchServices`, `fetchSiteSettings`) que mapean al mismo shape de
   `@/types`. Son el path de activación: no se llaman por defecto (ver el
   comentario en `src/lib/content/index.ts`).
4. **Studio** — no está incluido en esta app (se mantiene afuera a
   propósito para no instalar el paquete pesado `sanity`). Para correrlo:
   - opción rápida: `npx sanity@latest init` en una carpeta aparte,
     apuntando al mismo `projectId`/dataset, y copiar `sanity/schemas/` ahí; o
   - agregar la dependencia `sanity` a este repo y crear un
     `sanity.config.ts` que importe `schemaTypes` desde `./sanity/schemas`
     (más una ruta `/studio` si se quiere embeberlo).
