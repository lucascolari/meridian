# MERIDIAN — Fase 6: Media pipeline + CMS (cableado, dormido) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Dejar el pipeline de media y el CMS listos y desacoplados: un loader de imágenes Cloudinary env-gated (passthrough por defecto), un componente de video lazy (IntersectionObserver) preparado para Mux, y la capa Sanity (cliente + schemas + queries tipadas) que activa con solo pegar credenciales — todo sin dependencias de pago ni peso muerto en el bundle, y sin romper la app actual (el contenido sigue leyéndose del seed local por defecto).

**Architecture:** Cloudinary se implementa como custom loader puro de `next/image`, activado por env; sin env, devuelve la URL original (Unsplash sigue andando). El video es un `<MediaVideo>` que carga/reproduce solo al entrar en viewport; el swap a Mux es un punto de integración documentado. Sanity: `@sanity/client` (liviano) + definiciones de schema + queries GROQ tipadas que devuelven los tipos de dominio; un adaptador documentado permite que `lib/content` lea de Sanity cuando `SANITY_PROJECT_ID` está presente. El Studio pesado NO se instala (se documenta cómo levantarlo aparte) para no inflar el bundle de un demo que no puede usarlo.

**Tech Stack:** Next.js 16, React 19, TS, @sanity/client, Vitest.

## Global Constraints

- Ubicación `C:\dev\meridian`. NO mezclar con Gular.
- TS estricto, sin `any` sin justificar.
- **Cero dependencias de pago requeridas para correr**: todo funciona sin ninguna API key (defaults seguros).
- No inflar el bundle con paquetes que no se usan en el demo (no instalar el paquete `sanity`/Studio; `@mux/mux-player-react` solo si se carga dinámicamente y hay playbackId — en el demo no hay, así que se documenta el punto de integración en vez de instalarlo).
- Motion (si aplica) respeta `prefers-reduced-motion`.
- Sin rastros de autoría en código/copy. Commits terminan con línea en blanco + exactamente:
  `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`
- `npm run build/typecheck/test/lint` en verde al cerrar cada tarea.
- YAGNI.

---

### Task 1: Loader de Cloudinary (env-gated, TDD) + video lazy

**Files:**
- Create: `src/lib/cloudinary/loader.ts`
- Test: `src/lib/cloudinary/loader.test.ts`
- Create: `src/components/media/MediaVideo.tsx`
- Create: `src/components/media/media-video.module.css`
- Modify: `.env.example` (documentar `NEXT_PUBLIC_CLOUDINARY_CLOUD`, `NEXT_PUBLIC_MUX_PLAYBACK_ID` opcionales) — crear si no existe.

**Interfaces:**
- Produces:
  - `cloudinaryLoader({ src, width, quality }: { src: string; width: number; quality?: number }): string` — si `process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD` está seteado y `src` NO es ya una URL absoluta de otro host, construye una URL de transformación de Cloudinary (`f_auto,q_auto,w_<width>`); si no, devuelve `src` tal cual (passthrough). Pura y testeable (leyendo `process.env`).
  - `<MediaVideo src poster? className? >` (`"use client"`): un `<video muted loop playsInline preload="none">` que empieza a cargar/reproducir solo cuando entra al viewport (IntersectionObserver) y pausa al salir; respeta `prefers-reduced-motion` (no autoplay: muestra el poster y controles). Punto de integración Mux documentado en un comentario.

- [ ] **Step 1: Test del loader** `src/lib/cloudinary/loader.test.ts`:
```ts
import { describe, it, expect, afterEach } from "vitest";
import { cloudinaryLoader } from "./loader";

const ORIGINAL = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD;
afterEach(() => { process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD = ORIGINAL; });

describe("cloudinaryLoader", () => {
  it("sin cloud configurado, passthrough del src", () => {
    delete process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD;
    expect(cloudinaryLoader({ src: "https://images.unsplash.com/x.jpg", width: 800 }))
      .toBe("https://images.unsplash.com/x.jpg");
  });
  it("con cloud configurado, arma URL de transformacion con width y quality", () => {
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD = "meridian";
    const url = cloudinaryLoader({ src: "/hero.jpg", width: 1200, quality: 70 });
    expect(url).toContain("res.cloudinary.com/meridian");
    expect(url).toContain("w_1200");
    expect(url).toContain("q_70");
  });
});
```

- [ ] **Step 2: Correr y verificar que falla** — `npm test -- loader` → FAIL.

- [ ] **Step 3: Implementar `loader.ts`**:
```ts
interface LoaderArgs {
  src: string;
  width: number;
  quality?: number;
}

export function cloudinaryLoader({ src, width, quality }: LoaderArgs): string {
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD;
  if (!cloud) return src;
  const q = quality ?? 75;
  const transforms = `f_auto,q_${q},w_${width}`;
  const encoded = encodeURIComponent(src);
  return `https://res.cloudinary.com/${cloud}/image/fetch/${transforms}/${encoded}`;
}
```

- [ ] **Step 4: Correr y verificar que pasa** — `npm test -- loader` → PASS.

- [ ] **Step 5: `MediaVideo.tsx`** — implementar el componente lazy con IntersectionObserver (play al entrar, pause al salir, cleanup del observer), `preload="none"`, poster; bajo `prefers-reduced-motion` no autoplay (muestra controles). Comentario `// TODO(integración Mux): reemplazar <video> por <MuxPlayer playbackId=...> cargado dinámicamente cuando haya playbackId.` CSS module simple (aspect-ratio, object-fit cover).

- [ ] **Step 6: `.env.example`** — documentar variables opcionales (Cloudinary, Mux, Sanity — esta última se completa en Task 2).

- [ ] **Step 7: Verificar** — `npm test`, `npm run typecheck`, `npm run build`, `npm run lint`.

- [ ] **Step 8: Commit** — `git add -A && git commit -m "feat: loader Cloudinary env-gated (test) + video lazy (Mux-ready)"`

---

### Task 2: Capa Sanity (cliente + schemas + queries tipadas, dormida)

**Files:**
- Modify: `package.json` (dep `@sanity/client`)
- Create: `src/lib/sanity/client.ts`
- Create: `src/lib/sanity/queries.ts`
- Create: `sanity/schemas/index.ts`
- Create: `sanity/schemas/project.ts`, `service.ts`, `siteSettings.ts`, `page.ts`, `media.ts`, `award.ts`, `teamMember.ts`, `client.ts`
- Modify: `README.md` (sección "CMS (Sanity) — cómo activar" + Studio aparte)
- Modify: `src/lib/content/index.ts` (comentario/adaptador documentando el switch a Sanity; NO cambiar el default sync)

**Interfaces:**
- Produces:
  - `getSanityClient(): SanityClient | null` — devuelve un cliente configurado si `NEXT_PUBLIC_SANITY_PROJECT_ID` + dataset están en env; si no, `null`.
  - `queries` GROQ (`allProjectsQuery`, `projectBySlugQuery`, `servicesQuery`, `siteSettingsQuery`) + fetchers async tipados (`fetchProjects(): Promise<Project[]>`, etc.) que usan el cliente; documentados como el path de activación.
  - Definiciones de schema (objetos de Sanity) para `project, service, siteSettings, page, media, award, teamMember, client` con los campos del spec §17.
- El `lib/content` sigue devolviendo el seed local por defecto (sync); un comentario explica cómo envolverlo para leer de Sanity cuando el cliente existe.

- [ ] **Step 1: Instalar** — `npm install @sanity/client` (liviano; NO instalar `sanity`/Studio).

- [ ] **Step 2: `client.ts`** — `getSanityClient()` env-gated (projectId, dataset="production", apiVersion fija, useCdn true). Sin env → `null`. Sin `any`.

- [ ] **Step 3: schemas** — definir los 8 schemas como objetos tipados (`defineType`-style pero sin depender del paquete `sanity`: usar objetos planos tipados con `name/type/fields`), reflejando los campos de dominio (project con title, slug, client, year, category, description, heroMedia, gallery, images, videos, services, credits, awards, relatedProjects). `index.ts` los agrupa. Comentar que se consumen desde un `sanity.config.ts` del Studio (documentado en README, no incluido para no traer el paquete pesado).

- [ ] **Step 4: `queries.ts`** — GROQ strings + fetchers async que mapean el resultado a los tipos de dominio (`@/types`), usando `getSanityClient()`; si el cliente es null, lanzan o devuelven `[]` con un comentario (nunca se llaman por defecto).

- [ ] **Step 5: README + comentario en content** — documentar activación (env vars, `npx sanity` para el Studio aparte, o agregar la dep `sanity` y un route `/studio` si se desea). En `lib/content/index.ts`, un bloque de comentario mostrando cómo hacer que `getProjects` lea de Sanity cuando el cliente existe (sin cambiar el default).

- [ ] **Step 6: Verificar** — `npm test`, `npm run typecheck`, `npm run build`, `npm run lint`. La app debe seguir corriendo idéntica (Sanity dormido).

- [ ] **Step 7: Commit** — `git add -A && git commit -m "feat: capa Sanity dormida (cliente env-gated + schemas + queries tipadas) + docs de activacion"`

---

### Task 3: Verificación de la fase

- [ ] **Step 1: Suite + build** — `npm run build && npm run typecheck && npm test && npm run lint` (todo verde; sin nuevas rutas rotas; bundle sin el paquete `sanity`).
- [ ] **Step 2: Confirmar defaults dormidos** — sin ninguna env var nueva, `/` y `/work` siguen 200 (smoke con `npm run start` + curl), el contenido viene del seed. Frenar server.
- [ ] **Step 3 (si hubo fixes): Commit** — `git add -A && git commit -m "test: verificacion Fase 6"`

---

## Self-Review (writing-plans)

- **Cobertura del spec §17/§18/§19 (CMS, media pipeline, video):** Task 1 (Cloudinary loader + video lazy Mux-ready), Task 2 (Sanity: cliente + 8 schemas + queries tipadas + docs de activación, desacoplado del frontend). El Studio embebido y el envío por Mux quedan como puntos de integración documentados (decisión anti-overload de la sección 30, declarada). El requisito central de §17 ("agregar proyectos sin tocar código") se cumple vía la capa desacoplada + queries listas.
- **Placeholders:** Task 1 trae loader+test completos; Task 2 define interfaces concretas (fetchers/queries/schemas) — validadas por typecheck/build.
- **Consistencia:** `cloudinaryLoader` (Task 1) tipado igual que el loader de `next/image`; los fetchers de Sanity (Task 2) devuelven los mismos tipos de dominio (`@/types`) que `lib/content`, garantizando el swap drop-in.
