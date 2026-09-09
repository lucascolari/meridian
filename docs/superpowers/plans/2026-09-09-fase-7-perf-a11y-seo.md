# MERIDIAN — Fase 7: Performance, A11y, SEO, Analytics + Deploy — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Cerrar el proyecto con la pasada de accesibilidad (skip-link, focus-trap, aria), SEO (JSON-LD de organización, imágenes Open Graph dinámicas), analytics (Vercel Analytics + Speed Insights, Sentry documentado), afinado de performance y preparación de deploy a Vercel (documentado, no ejecutado).

**Architecture:** Aditivo sobre lo existente. Un `<SkipLink>` y un focus-trap accesible en el menú fullscreen; JSON-LD de `Organization`/`WebSite` en el home; `opengraph-image.tsx` con `next/og` (`ImageResponse`) para OG social real; `@vercel/analytics` + `@vercel/speed-insights` montados en el layout (seguros, sin claves, solo activos en Vercel); Sentry como punto de integración documentado (SDK no instalado para no inflar el bundle del demo). Deploy: readiness + docs.

**Tech Stack:** Next.js 16, React 19, TS, next/og, @vercel/analytics, @vercel/speed-insights, Vitest.

## Global Constraints

- Ubicación `C:\dev\meridian`. NO mezclar con Gular.
- TS estricto, sin `any` sin justificar.
- **No deployar automáticamente** (es acción del usuario / publicación externa): solo dejar listo + documentado.
- Todo funciona sin claves; analytics solo reporta en Vercel.
- Motion respeta `prefers-reduced-motion`. A11y real: teclado, foco, contraste, aria.
- Sin rastros de autoría en código/copy. Commits terminan con línea en blanco + exactamente:
  `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`
- `npm run build/typecheck/test/lint` en verde al cerrar cada tarea.
- YAGNI.

---

### Task 1: Accesibilidad (skip-link + focus-trap + aria)

**Files:**
- Create: `src/components/a11y/SkipLink.tsx`
- Create: `src/components/a11y/skip-link.module.css`
- Modify: `src/app/layout.tsx` (montar `<SkipLink/>` como primer hijo del body; asegurar un `<main id="main">` landmark — o envolver `{children}` en un `<main id="main">`)
- Modify: `src/components/navigation/FullscreenMenu.tsx` (focus-trap real: Tab cicla dentro del overlay mientras está abierto)

**Interfaces:**
- Produces: `<SkipLink />` (link "Skip to content" visible al enfocar, salta a `#main`); menú fullscreen con foco atrapado (Tab/Shift+Tab ciclan entre los elementos enfocables del overlay), además del ya existente Escape/restore.

- [ ] **Step 1: `SkipLink.tsx` + CSS** — link a `#main`, oculto salvo `:focus-visible` (posicionado arriba-izq, alto z-index), tokens.
- [ ] **Step 2: Layout** — montar `<SkipLink/>` y garantizar `<main id="main">` alrededor de `{children}` (si no existe un landmark main, envolverlo). Verificar que las páginas no tengan doble `main`.
- [ ] **Step 3: Focus-trap en FullscreenMenu** — mientras `open`, capturar Tab: al llegar al último enfocable, Shift+Tab del primero va al último y Tab del último va al primero (query de enfocables dentro del overlay). Mantener Escape + restore de foco existentes. Respetar reduced-motion (sin cambios de animación).
- [ ] **Step 4: Verificar** — `npm run build && npm run typecheck && npm run lint`.
- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat: accesibilidad (skip-link, main landmark, focus-trap en menu)"`

---

### Task 2: SEO — JSON-LD + Open Graph images

**Files:**
- Create: `src/app/opengraph-image.tsx` (OG del home con `next/og`)
- Create: `src/components/seo/JsonLd.tsx` (helper para inyectar JSON-LD de forma segura)
- Modify: `src/app/page.tsx` (agregar JSON-LD `Organization` + `WebSite` del estudio)

**Interfaces:**
- Produces:
  - `opengraph-image.tsx` — `ImageResponse` 1200x630 con la marca MERIDIAN sobre fondo ink/gold (usa `getSiteSettings()` para nombre/tagline). `export const size`, `contentType`, `alt`.
  - `<JsonLd data={object} />` — server component que renderiza `<script type="application/ld+json">` con `JSON.stringify(data)` (escapado seguro).
  - Home con JSON-LD `Organization` (name, url, sameAs=social, description) + `WebSite`.

- [ ] **Step 1: `JsonLd.tsx`** — componente que serializa el objeto a `<script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(data).replace(/</g,'\\u003c')}} />`. Tipar `data` como `Record<string, unknown>`.
- [ ] **Step 2: `opengraph-image.tsx`** — con `next/og` `ImageResponse`, `size={{width:1200,height:630}}`, `contentType="image/png"`, render de MERIDIAN + tagline sobre ink con acento gold. `runtime` default. Usar `getSiteSettings()`.
- [ ] **Step 3: Home JSON-LD** — en `page.tsx`, insertar `<JsonLd data={organization} />` y `<JsonLd data={website} />` con datos de `getSiteSettings()` + `SITE_URL`.
- [ ] **Step 4: Verificar** — `npm run build` (debe generar `/opengraph-image`), `npm run typecheck`, `npm run lint`.
- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat: SEO (JSON-LD Organization/WebSite + opengraph-image dinamica)"`

---

### Task 3: Analytics + performance + deploy readiness

**Files:**
- Modify: `package.json` (deps `@vercel/analytics`, `@vercel/speed-insights`)
- Modify: `src/app/layout.tsx` (montar `<Analytics/>` + `<SpeedInsights/>`)
- Modify: `README.md` (secciones: Deploy a Vercel; Sentry como integración; performance notes)
- Modify (si aporta): `next.config.ts` (wire opcional del loader de Cloudinary como `images.loader` custom SOLO si no rompe Unsplash; si es riesgoso, dejar documentado y NO cambiar) — preferir NO tocar si hay duda.

**Interfaces:**
- Produces: analytics montado (no-op fuera de Vercel), Speed Insights montado; README con pasos de deploy (`vercel` / conectar repo) y activación de Sentry (instalar `@sentry/nextjs`, env `SENTRY_DSN`) como integración documentada.

- [ ] **Step 1: Instalar** — `npm install @vercel/analytics @vercel/speed-insights`.
- [ ] **Step 2: Montar** — en `src/app/layout.tsx`, agregar `<Analytics/>` (de `@vercel/analytics/next`) y `<SpeedInsights/>` (de `@vercel/speed-insights/next`) al final del body. Son seguros sin claves.
- [ ] **Step 3: README** — sección "Deploy a Vercel" (push del repo a GitHub + importar en Vercel, o `npx vercel`), "Analytics" (activo automáticamente en Vercel), "Sentry (opcional)" como integración documentada (no instalado por defecto para no inflar el bundle; pasos para activar). Notas de performance (dynamic import de WebGL, gating de capabilities, imágenes responsive, fuentes self-hosted).
- [ ] **Step 4: Verificar** — `npm run build && npm run typecheck && npm test && npm run lint`. Confirmar que el build sigue OK y no hay warnings nuevos.
- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat: analytics (Vercel) + docs de deploy y performance"`

---

### Task 4: Verificación final de proyecto

- [ ] **Step 1: Suite + build completos** — `npm run build && npm run typecheck && npm test && npm run lint` — todo verde. Revisar el output de build: rutas, tamaños de bundle razonables, WebGL en chunk separado.
- [ ] **Step 2: Smoke integral** — `npm run start` en background; `curl` a `/`, `/work`, `/work/the-arrival`, `/about`, `/contact`, `/opengraph-image`, `/sitemap.xml`, `/robots.txt` → todos 200; `/work/no-existe` → 404; `POST /api/contact` válido→200, inválido→400. Frenar server.
- [ ] **Step 3: Commit (si hubo fixes)** — `git add -A && git commit -m "test: verificacion final del proyecto"`

---

## Self-Review (writing-plans)

- **Cobertura del spec §22/§23/§24/analytics/deploy:** Task 1 (a11y: skip-link, landmark, focus-trap), Task 2 (SEO: JSON-LD + OG images), Task 3 (analytics Vercel + Speed Insights + deploy/Sentry docs + perf notes), Task 4 (verificación integral). Sentry SDK y el deploy real quedan como acciones/integración documentadas (anti-overload + boundary de publicación, declarado).
- **Placeholders:** interfaces concretas por tarea; validadas por build/browser. Sin lógica pura nueva que testear salvo la ya cubierta.
- **Consistencia:** `SkipLink`/`#main` (Task 1) coherentes con el layout; `JsonLd` (Task 2) reutilizable; `getSiteSettings`/`SITE_URL` reusados; analytics no rompen SSR.
