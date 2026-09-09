# MERIDIAN — Fase 1: Fundación — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dejar la base técnica de MERIDIAN funcionando y testeada: app Next.js 16 + TS + Tailwind v4 con design tokens, fuentes self-hosted, capa de contenido tipada con seed local, smooth scroll (Lenis), setup de GSAP, hooks de capabilities, layout raíz con providers, SEO base y estados de carga/error.

**Architecture:** Next.js App Router. El contenido está desacoplado detrás de `lib/content` (hoy lee `src/content` local; mañana Sanity, misma firma). El motion se centraliza (Lenis provider + setup GSAP + hooks que respetan `prefers-reduced-motion`). Todo el diseño se controla por design tokens en CSS.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript (estricto), Tailwind CSS v4, Lenis, GSAP, Vitest + Testing Library.

## Global Constraints

- Ubicación del código: `C:\dev\meridian` (fuera de OneDrive). NO mezclar con Gular (`C:\dev\agencia`).
- Node ≥ 18 (la PC tiene v24). Gestor: npm.
- TypeScript estricto. Prohibido `any` salvo justificación en comentario.
- Nombre de la marca: **MERIDIAN**. Tagline: **"We build iconic brands."**
- Paleta por tokens: `--ink` (negro casi puro), `--bone` (blanco cálido), `--gold`/`--amber` (dorado), `--electric` (azul acento).
- Todo el sistema de motion debe respetar `prefers-reduced-motion`.
- Servicios cloud (Sanity/Mux/Cloudinary/Sentry): cableados pero dormidos; el sitio corre sin ninguna API key.
- Sin atribución de autoría (ni Lucas ni IA) en el código, copy ni historial visible del sitio. (Los commits de git sí llevan la co-autoría requerida por la skill.)
- Commits frecuentes, uno por tarea como mínimo.

---

### Task 1: Scaffold del proyecto Next.js + toolchain de test

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Create: `eslint.config.mjs`
- Create: `.gitignore`
- Create: `next-env.d.ts`
- Create: `vitest.config.mts`
- Create: `vitest.setup.ts`
- Create: `src/app/layout.tsx` (placeholder mínimo, se reemplaza en Task 9)
- Create: `src/app/page.tsx` (placeholder mínimo)
- Create: `src/app/globals.css` (placeholder mínimo, se reemplaza en Task 2)
- Create: `src/lib/utils/cn.ts`
- Test: `src/lib/utils/cn.test.ts`

**Interfaces:**
- Consumes: nada (primer task).
- Produces: `cn(...classes: Array<string | false | null | undefined>): string` en `src/lib/utils/cn.ts`. Scripts npm: `dev`, `build`, `start`, `lint`, `typecheck`, `test`.

- [ ] **Step 1: Crear `package.json`**

```json
{
  "name": "meridian",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 2: Instalar dependencias**

Run (en `C:\dev\meridian`):
```bash
npm install next@^16 react@^19 react-dom@^19 lenis gsap @gsap/react
npm install -D typescript @types/node @types/react @types/react-dom eslint eslint-config-next @tailwindcss/postcss tailwindcss vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```
Expected: instala sin errores; se crea `node_modules` y `package-lock.json`.

- [ ] **Step 3: Crear archivos de configuración**

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

`next.config.ts`:
```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default nextConfig;
```

`postcss.config.mjs`:
```js
export default {
  plugins: { "@tailwindcss/postcss": {} },
};
```

`eslint.config.mjs`:
```js
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  { ignores: [".next/**", "node_modules/**"] },
];
```

`.gitignore`:
```
node_modules
.next
out
.env*.local
*.tsbuildinfo
next-env.d.ts
coverage
```

`next-env.d.ts`:
```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />
```

- [ ] **Step 4: Crear config de Vitest**

`vitest.config.mts`:
```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
});
```

`vitest.setup.ts`:
```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 5: Crear placeholders de app mínimos**

`src/app/globals.css`:
```css
:root { color-scheme: dark; }
body { margin: 0; background: #0a0a0a; color: #f5f0e6; }
```

`src/app/layout.tsx`:
```tsx
import "./globals.css";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

`src/app/page.tsx`:
```tsx
export default function HomePage() {
  return <main>MERIDIAN</main>;
}
```

- [ ] **Step 6: Escribir el test de `cn`**

`src/lib/utils/cn.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("junta clases truthy separadas por espacio", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });
  it("descarta valores falsy", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });
  it("devuelve string vacío sin argumentos válidos", () => {
    expect(cn(false, null)).toBe("");
  });
});
```

- [ ] **Step 7: Correr el test y verificar que falla**

Run: `npm test -- cn`
Expected: FAIL (`Cannot find module './cn'`).

- [ ] **Step 8: Implementar `cn`**

`src/lib/utils/cn.ts`:
```ts
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}
```

- [ ] **Step 9: Correr test, typecheck y build**

Run:
```bash
npm test -- cn
npm run typecheck
npm run build
```
Expected: test PASS; typecheck sin errores; build compila la ruta `/`.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js 16 + TS + Vitest + utilidad cn"
```

---

### Task 2: Design tokens + globals + Tailwind v4

**Files:**
- Create: `src/styles/tokens.css`
- Modify: `src/app/globals.css` (reemplaza el placeholder)

**Interfaces:**
- Consumes: nada.
- Produces: variables CSS globales disponibles en toda la app: colores (`--ink`, `--bone`, `--gold`, `--amber`, `--electric`, `--muted`), tipografía (`--font-display`, `--font-body` — se rellenan en Task 3), escala de espaciado (`--space-1..8`), durations (`--duration-fast/medium/slow`), easings (`--ease-expo`, `--ease-smooth`), z-index (`--z-nav`, `--z-cursor`, `--z-overlay`), y utilidades Tailwind mapeadas vía `@theme inline`.

- [ ] **Step 1: Crear `src/styles/tokens.css`**

```css
:root {
  /* Color */
  --ink: #0a0a0a;
  --ink-soft: #121110;
  --bone: #f5f0e6;
  --muted: #a39c8e;
  --gold: #d9a441;
  --amber: #f0b357;
  --electric: #2b6fff;

  /* Tipografía (families se completan en Task 3) */
  --font-display: "Fraunces", Georgia, serif;
  --font-body: "Geist", system-ui, sans-serif;

  /* Espaciado (rem) */
  --space-1: 0.5rem;
  --space-2: 1rem;
  --space-3: 1.5rem;
  --space-4: 2.5rem;
  --space-5: 4rem;
  --space-6: 6rem;
  --space-7: 9rem;
  --space-8: 14rem;

  /* Layout */
  --container-max: 90rem;
  --gutter: clamp(1.25rem, 4vw, 4rem);

  /* Motion */
  --duration-fast: 0.35s;
  --duration-medium: 0.7s;
  --duration-slow: 1.2s;
  --ease-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-smooth: cubic-bezier(0.65, 0, 0.35, 1);

  /* Z layers */
  --z-nav: 100;
  --z-overlay: 200;
  --z-cursor: 300;
}
```

- [ ] **Step 2: Reemplazar `src/app/globals.css`**

```css
@import "tailwindcss";
@import "../styles/tokens.css";

@theme inline {
  --color-ink: var(--ink);
  --color-bone: var(--bone);
  --color-muted: var(--muted);
  --color-gold: var(--gold);
  --color-amber: var(--amber);
  --color-electric: var(--electric);
  --font-display: var(--font-display);
  --font-body: var(--font-body);
}

* { box-sizing: border-box; }

html { -webkit-font-smoothing: antialiased; }

body {
  margin: 0;
  background: var(--ink);
  color: var(--bone);
  font-family: var(--font-body);
  overflow-x: hidden;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 3: Verificar build**

Run: `npm run build`
Expected: compila sin errores de PostCSS/Tailwind.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: design tokens + globals con Tailwind v4"
```

---

### Task 3: Fuentes self-hosted (next/font)

**Files:**
- Create: `src/styles/fonts.ts`
- Modify: `src/app/layout.tsx` (aplica las variables de fuente al `<html>`)
- Modify: `src/styles/tokens.css` (apunta las families a las variables de next/font)

**Interfaces:**
- Consumes: tokens de Task 2.
- Produces: `fontVariables: string` (className con las CSS vars `--font-fraunces` y `--font-geist`) exportado desde `src/styles/fonts.ts`.

- [ ] **Step 1: Crear `src/styles/fonts.ts`**

```ts
import { Fraunces, Geist } from "next/font/google";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz"],
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

export const fontVariables = `${fraunces.variable} ${geist.variable}`;
```

- [ ] **Step 2: Apuntar los tokens a las variables de next/font**

En `src/styles/tokens.css`, reemplazar las dos líneas de `--font-*`:
```css
  --font-display: var(--font-fraunces), Georgia, serif;
  --font-body: var(--font-geist), system-ui, sans-serif;
```

- [ ] **Step 3: Aplicar las fuentes en el layout**

En `src/app/layout.tsx`, importar y aplicar al `<html>`:
```tsx
import "./globals.css";
import type { ReactNode } from "react";
import { fontVariables } from "@/styles/fonts";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 4: Verificar build**

Run: `npm run build`
Expected: build descarga y self-hostea Fraunces + Geist sin errores.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: fuentes self-hosted Fraunces + Geist via next/font"
```

---

### Task 4: Tipos de dominio

**Files:**
- Create: `src/types/index.ts`

**Interfaces:**
- Consumes: nada.
- Produces (tipos exportados):
  - `Media = { src: string; alt: string; width: number; height: number; kind: "image" | "video"; poster?: string }`
  - `Category = "branding" | "digital" | "motion" | "spatial"`
  - `Service = { id: string; title: string; summary: string; capabilities: string[] }`
  - `Award = { title: string; org: string; year: number }`
  - `ProjectCredit = { role: string; name: string }`
  - `Project = { slug: string; title: string; client: string; year: number; category: Category; excerpt: string; description: string; heroMedia: Media; gallery: Media[]; services: string[]; credits: ProjectCredit[]; awards: Award[]; related: string[]; featured: boolean; order: number }`
  - `SiteSettings = { name: string; tagline: string; description: string; email: string; social: { label: string; href: string }[]; chapters: { id: string; label: string }[] }`

- [ ] **Step 1: Crear `src/types/index.ts`**

```ts
export type Category = "branding" | "digital" | "motion" | "spatial";

export interface Media {
  src: string;
  alt: string;
  width: number;
  height: number;
  kind: "image" | "video";
  poster?: string;
}

export interface Service {
  id: string;
  title: string;
  summary: string;
  capabilities: string[];
}

export interface Award {
  title: string;
  org: string;
  year: number;
}

export interface ProjectCredit {
  role: string;
  name: string;
}

export interface Project {
  slug: string;
  title: string;
  client: string;
  year: number;
  category: Category;
  excerpt: string;
  description: string;
  heroMedia: Media;
  gallery: Media[];
  services: string[];
  credits: ProjectCredit[];
  awards: Award[];
  related: string[];
  featured: boolean;
  order: number;
}

export interface SiteSettings {
  name: string;
  tagline: string;
  description: string;
  email: string;
  social: { label: string; href: string }[];
  chapters: { id: string; label: string }[];
}
```

- [ ] **Step 2: Verificar typecheck**

Run: `npm run typecheck`
Expected: sin errores.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: tipos de dominio (Project, Service, SiteSettings, Media)"
```

---

### Task 5: Seed de contenido curado

**Files:**
- Create: `src/content/site.ts`
- Create: `src/content/services.ts`
- Create: `src/content/projects.ts`

**Interfaces:**
- Consumes: tipos de Task 4.
- Produces: `siteSettings: SiteSettings`, `services: Service[]`, `projects: Project[]` (constantes tipadas). Al menos 6 proyectos, ≥3 con `featured: true`. Imágenes: URLs de Unsplash de arquitectura golden-hour (`images.unsplash.com`).

- [ ] **Step 1: Crear `src/content/site.ts`**

```ts
import type { SiteSettings } from "@/types";

export const siteSettings: SiteSettings = {
  name: "MERIDIAN",
  tagline: "We build iconic brands.",
  description:
    "MERIDIAN is a creative studio directing brand experiences at the meeting point of art direction, motion and technology.",
  email: "studio@meridian.studio",
  social: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Behance", href: "https://behance.net" },
    { label: "LinkedIn", href: "https://linkedin.com" },
  ],
  chapters: [
    { id: "arrival", label: "The Arrival" },
    { id: "blueprint", label: "The Blueprint" },
    { id: "living", label: "Living Spaces" },
    { id: "sanctum", label: "Inner Sanctum" },
    { id: "welcome", label: "Welcome" },
  ],
};
```

- [ ] **Step 2: Crear `src/content/services.ts`**

```ts
import type { Service } from "@/types";

export const services: Service[] = [
  {
    id: "direction",
    title: "Creative Direction",
    summary: "The vision and the language before the first pixel.",
    capabilities: ["Brand strategy", "Art direction", "Naming", "Positioning"],
  },
  {
    id: "brand",
    title: "Brand Experience",
    summary: "Identity systems designed to be remembered.",
    capabilities: ["Visual identity", "Design systems", "Guidelines", "Editorial"],
  },
  {
    id: "motion",
    title: "Motion Design",
    summary: "Narrative through movement, intentional and controlled.",
    capabilities: ["Film", "Kinetic type", "Title design", "Sound"],
  },
  {
    id: "spatial",
    title: "Digital & Spatial",
    summary: "Immersive web, WebGL and real-time experiences.",
    capabilities: ["Creative development", "WebGL / 3D", "Interaction", "Performance"],
  },
];
```

- [ ] **Step 3: Crear `src/content/projects.ts`**

Nota: usar URLs de Unsplash con parámetros de tamaño. Formato de src: `https://images.unsplash.com/PHOTO-ID?auto=format&fit=crop&w=1920&q=80`. Definir 6 proyectos. Ejemplo completo del primero y estructura idéntica para el resto (variar slug/title/client/category/ids de foto):

```ts
import type { Project } from "@/types";

export const projects: Project[] = [
  {
    slug: "the-arrival",
    title: "The Arrival",
    client: "Meridian Capital",
    year: 2026,
    category: "branding",
    excerpt: "A financial brand that lands like a skyline at dusk.",
    description:
      "A complete identity system for a real estate investment group, built on the language of arrival — the first sight of a city that becomes home.",
    heroMedia: {
      src: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1920&q=80",
      alt: "Aerial view of a city skyline at golden hour",
      width: 1920,
      height: 1080,
      kind: "image",
    },
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1600&q=80",
        alt: "City buildings from below at sunset",
        width: 1600,
        height: 1067,
        kind: "image",
      },
    ],
    services: ["direction", "brand"],
    credits: [
      { role: "Creative Direction", name: "Studio" },
      { role: "Design", name: "Studio" },
    ],
    awards: [{ title: "Site of the Day", org: "Awwwards", year: 2026 }],
    related: ["living-spaces", "inner-sanctum"],
    featured: true,
    order: 1,
  },
  // Repetir la MISMA estructura para 5 proyectos más, variando datos:
  // 2) slug "living-spaces", title "Living Spaces", client "Aurora Residences",
  //    category "digital", featured true, order 2, related ["the-arrival","welcome"]
  // 3) slug "inner-sanctum", title "Inner Sanctum", client "Hotel Solis",
  //    category "spatial", featured true, order 3, related ["living-spaces","the-arrival"]
  // 4) slug "the-blueprint", title "The Blueprint", client "Nova Architecture",
  //    category "branding", featured false, order 4, related ["the-arrival"]
  // 5) slug "welcome", title "Welcome", client "Meridian Hospitality",
  //    category "motion", featured false, order 5, related ["inner-sanctum"]
  // 6) slug "golden-hour", title "Golden Hour", client "Lumen Studios",
  //    category "motion", featured false, order 6, related ["welcome"]
  // Usar estas foto-IDs de Unsplash (arquitectura/golden hour), una por hero:
  //   living-spaces: photo-1512453979798-5ea266f8880c
  //   inner-sanctum: photo-1600585154340-be6161a56a0c
  //   the-blueprint: photo-1503387762-592deb58ef4e
  //   welcome:       photo-1600607687939-ce8a6c25118c
  //   golden-hour:   photo-1494526585095-c41746248156
  // Cada uno con al menos 1 item de gallery (puede reutilizar la misma foto-ID a w=1600).
];
```

- [ ] **Step 4: Verificar typecheck**

Run: `npm run typecheck`
Expected: sin errores (los 6 proyectos cumplen el tipo `Project`).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: seed de contenido curado (site, services, 6 proyectos)"
```

---

### Task 6: Capa de contenido (API desacoplada)

**Files:**
- Create: `src/lib/content/index.ts`
- Test: `src/lib/content/index.test.ts`

**Interfaces:**
- Consumes: seed de Task 5, tipos de Task 4.
- Produces (funciones síncronas — firma estable para swap a Sanity async en fase 6):
  - `getSiteSettings(): SiteSettings`
  - `getServices(): Service[]`
  - `getProjects(): Project[]` (ordenado por `order` asc)
  - `getFeaturedProjects(): Project[]` (solo `featured`, ordenado por `order`)
  - `getProject(slug: string): Project | undefined`
  - `getRelatedProjects(slug: string): Project[]` (resuelve `related` a objetos `Project`, ignora slugs inexistentes)

- [ ] **Step 1: Escribir los tests**

`src/lib/content/index.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import {
  getSiteSettings,
  getServices,
  getProjects,
  getFeaturedProjects,
  getProject,
  getRelatedProjects,
} from "./index";

describe("content layer", () => {
  it("devuelve site settings con el nombre de la marca", () => {
    expect(getSiteSettings().name).toBe("MERIDIAN");
  });

  it("devuelve al menos 4 servicios", () => {
    expect(getServices().length).toBeGreaterThanOrEqual(4);
  });

  it("devuelve los proyectos ordenados por order asc", () => {
    const orders = getProjects().map((p) => p.order);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
  });

  it("featured solo incluye proyectos featured", () => {
    expect(getFeaturedProjects().every((p) => p.featured)).toBe(true);
    expect(getFeaturedProjects().length).toBeGreaterThanOrEqual(3);
  });

  it("getProject encuentra por slug y devuelve undefined si no existe", () => {
    expect(getProject("the-arrival")?.title).toBe("The Arrival");
    expect(getProject("no-existe")).toBeUndefined();
  });

  it("getRelatedProjects resuelve slugs a proyectos y descarta inexistentes", () => {
    const related = getRelatedProjects("the-arrival");
    expect(related.every((p) => typeof p.title === "string")).toBe(true);
    expect(related.find((p) => p.slug === "the-arrival")).toBeUndefined();
  });
});
```

- [ ] **Step 2: Correr los tests y verificar que fallan**

Run: `npm test -- content`
Expected: FAIL (`Cannot find module './index'`).

- [ ] **Step 3: Implementar la capa de contenido**

`src/lib/content/index.ts`:
```ts
import type { Project, Service, SiteSettings } from "@/types";
import { siteSettings } from "@/content/site";
import { services } from "@/content/services";
import { projects } from "@/content/projects";

const byOrder = (a: Project, b: Project): number => a.order - b.order;

export function getSiteSettings(): SiteSettings {
  return siteSettings;
}

export function getServices(): Service[] {
  return services;
}

export function getProjects(): Project[] {
  return [...projects].sort(byOrder);
}

export function getFeaturedProjects(): Project[] {
  return getProjects().filter((p) => p.featured);
}

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getRelatedProjects(slug: string): Project[] {
  const project = getProject(slug);
  if (!project) return [];
  return project.related
    .map((relatedSlug) => getProject(relatedSlug))
    .filter((p): p is Project => Boolean(p));
}
```

- [ ] **Step 4: Correr los tests y verificar que pasan**

Run: `npm test -- content`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: capa de contenido desacoplada con tests"
```

---

### Task 7: Hooks de capabilities y motion

**Files:**
- Create: `src/hooks/useMediaQuery.ts`
- Create: `src/hooks/useReducedMotion.ts`
- Create: `src/hooks/useDeviceCapabilities.ts`
- Test: `src/hooks/useMediaQuery.test.ts`
- Test: `src/hooks/useReducedMotion.test.ts`

**Interfaces:**
- Consumes: nada.
- Produces:
  - `useMediaQuery(query: string): boolean`
  - `useReducedMotion(): boolean`
  - `useDeviceCapabilities(): { isTouch: boolean; isLowEnd: boolean; prefersReducedMotion: boolean; dpr: number }`

- [ ] **Step 1: Escribir el test de `useMediaQuery`**

`src/hooks/useMediaQuery.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useMediaQuery } from "./useMediaQuery";

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
    onchange: null,
  }));
}

describe("useMediaQuery", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("devuelve true cuando la media query matchea", () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"));
    expect(result.current).toBe(true);
  });

  it("devuelve false cuando no matchea", () => {
    mockMatchMedia(false);
    const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"));
    expect(result.current).toBe(false);
  });
});
```

- [ ] **Step 2: Correr y verificar que falla**

Run: `npm test -- useMediaQuery`
Expected: FAIL (módulo no existe).

- [ ] **Step 3: Implementar `useMediaQuery`**

`src/hooks/useMediaQuery.ts`:
```ts
"use client";
import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}
```

- [ ] **Step 4: Escribir el test de `useReducedMotion`**

`src/hooks/useReducedMotion.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useReducedMotion } from "./useReducedMotion";

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
    onchange: null,
  }));
}

describe("useReducedMotion", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("es true cuando el usuario prefiere menos movimiento", () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });
});
```

- [ ] **Step 5: Correr y verificar que falla**

Run: `npm test -- useReducedMotion`
Expected: FAIL.

- [ ] **Step 6: Implementar `useReducedMotion`**

`src/hooks/useReducedMotion.ts`:
```ts
"use client";
import { useMediaQuery } from "./useMediaQuery";

export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
```

- [ ] **Step 7: Implementar `useDeviceCapabilities` (sin test unitario: agrega APIs del navegador; se valida por typecheck/build)**

`src/hooks/useDeviceCapabilities.ts`:
```ts
"use client";
import { useEffect, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

interface Capabilities {
  isTouch: boolean;
  isLowEnd: boolean;
  prefersReducedMotion: boolean;
  dpr: number;
}

export function useDeviceCapabilities(): Capabilities {
  const prefersReducedMotion = useReducedMotion();
  const [caps, setCaps] = useState<Omit<Capabilities, "prefersReducedMotion">>({
    isTouch: false,
    isLowEnd: false,
    dpr: 1,
  });

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const cores = navigator.hardwareConcurrency ?? 4;
    const memory = (navigator as Navigator & { deviceMemory?: number })
      .deviceMemory;
    const isLowEnd = cores <= 4 || (memory !== undefined && memory <= 4);
    const dpr = Math.min(window.devicePixelRatio || 1, isLowEnd ? 1 : 2);
    setCaps({ isTouch, isLowEnd, dpr });
  }, []);

  return { ...caps, prefersReducedMotion };
}
```

- [ ] **Step 8: Correr todos los tests + typecheck**

Run:
```bash
npm test
npm run typecheck
```
Expected: todos los tests PASS; typecheck sin errores.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: hooks de media query, reduced motion y capabilities"
```

---

### Task 8: Setup de GSAP + provider de Lenis

**Files:**
- Create: `src/lib/gsap/index.ts`
- Create: `src/components/layout/SmoothScroll.tsx`
- Create: `src/hooks/useLenis.ts`

**Interfaces:**
- Consumes: `useReducedMotion` (Task 7).
- Produces:
  - `registerGsap(): void` (registra ScrollTrigger + useGSAP una sola vez, client-only).
  - `<SmoothScroll>{children}</SmoothScroll>` — monta Lenis, integra con ScrollTrigger, se desactiva si `prefers-reduced-motion`.
  - `useLenis(): Lenis | null` (acceso a la instancia vía contexto).

- [ ] **Step 1: Crear el setup de GSAP**

`src/lib/gsap/index.ts`:
```ts
"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

let registered = false;

export function registerGsap(): void {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  registered = true;
}

export { gsap, ScrollTrigger, useGSAP };
```

- [ ] **Step 2: Crear el provider `SmoothScroll` con contexto**

`src/components/layout/SmoothScroll.tsx`:
```tsx
"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Lenis from "lenis";
import { registerGsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const LenisContext = createContext<Lenis | null>(null);
export const useLenisContext = () => useContext(LenisContext);

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    registerGsap();
    if (reduced) return;

    const instance = new Lenis({ lerp: 0.1, smoothWheel: true });
    setLenis(instance);
    instance.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => {
      instance.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };
    rafRef.current = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafRef.current);
      instance.destroy();
      setLenis(null);
    };
  }, [reduced]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
```

- [ ] **Step 3: Crear el hook `useLenis`**

`src/hooks/useLenis.ts`:
```ts
"use client";
import { useLenisContext } from "@/components/layout/SmoothScroll";
import type Lenis from "lenis";

export function useLenis(): Lenis | null {
  return useLenisContext();
}
```

- [ ] **Step 4: Verificar typecheck + build**

Run:
```bash
npm run typecheck
npm run build
```
Expected: sin errores.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: setup de GSAP + provider de smooth scroll (Lenis)"
```

---

### Task 9: Layout raíz con providers + metadata base

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/lib/seo/metadata.ts`
- Modify: `src/app/page.tsx` (home provisional que consume contenido y valida la cadena entera)

**Interfaces:**
- Consumes: `fontVariables` (Task 3), `SmoothScroll` (Task 8), `getSiteSettings` (Task 6).
- Produces:
  - `buildMetadata(overrides?: Partial<Metadata>): Metadata` en `src/lib/seo/metadata.ts` (metadata base con title template, description, Open Graph, Twitter card).
  - Layout raíz que envuelve `children` en `<SmoothScroll>`.

- [ ] **Step 1: Crear el helper de metadata**

`src/lib/seo/metadata.ts`:
```ts
import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/content";

const site = getSiteSettings();
const baseUrl = "https://meridian.studio";

export function buildMetadata(overrides: Partial<Metadata> = {}): Metadata {
  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: `${site.name} — ${site.tagline}`,
      template: `%s — ${site.name}`,
    },
    description: site.description,
    openGraph: {
      type: "website",
      siteName: site.name,
      title: `${site.name} — ${site.tagline}`,
      description: site.description,
      url: baseUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: `${site.name} — ${site.tagline}`,
      description: site.description,
    },
    ...overrides,
  };
}
```

- [ ] **Step 2: Reescribir el layout raíz**

`src/app/layout.tsx`:
```tsx
import "./globals.css";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { fontVariables } from "@/styles/fonts";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata();

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Home provisional que consume el contenido**

`src/app/page.tsx`:
```tsx
import { getSiteSettings, getFeaturedProjects } from "@/lib/content";

export default function HomePage() {
  const site = getSiteSettings();
  const featured = getFeaturedProjects();
  return (
    <main style={{ padding: "var(--space-5) var(--gutter)" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3rem,10vw,9rem)", margin: 0 }}>
        {site.name}
      </h1>
      <p style={{ color: "var(--muted)", fontSize: "1.25rem" }}>{site.tagline}</p>
      <ul>
        {featured.map((p) => (
          <li key={p.slug}>{p.title} — {p.client}</li>
        ))}
      </ul>
    </main>
  );
}
```

- [ ] **Step 4: Verificar build + arranque de dev**

Run:
```bash
npm run build
```
Expected: compila `/` sin errores; el home renderiza el nombre, tagline y la lista de featured.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: layout raíz con providers + metadata base + home provisional"
```

---

### Task 10: SEO técnico (sitemap + robots)

**Files:**
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`

**Interfaces:**
- Consumes: `getProjects` (Task 6).
- Produces: `sitemap(): MetadataRoute.Sitemap` (home + /work + /about + /contact + una entrada por proyecto) y `robots(): MetadataRoute.Robots`.

- [ ] **Step 1: Crear `src/app/sitemap.ts`**

```ts
import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/content";

const baseUrl = "https://meridian.studio";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/work", "/about", "/contact"].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
  }));
  const projectRoutes = getProjects().map((p) => ({
    url: `${baseUrl}/work/${p.slug}`,
    lastModified: new Date(),
  }));
  return [...staticRoutes, ...projectRoutes];
}
```

- [ ] **Step 2: Crear `src/app/robots.ts`**

```ts
import type { MetadataRoute } from "next";

const baseUrl = "https://meridian.studio";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/studio"] },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

- [ ] **Step 3: Verificar build**

Run: `npm run build`
Expected: build genera `/sitemap.xml` y `/robots.txt` sin errores.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: sitemap dinámico + robots"
```

---

### Task 11: Estados de carga y error + README

**Files:**
- Create: `src/app/loading.tsx`
- Create: `src/app/error.tsx`
- Create: `src/app/not-found.tsx`
- Create: `README.md`

**Interfaces:**
- Consumes: tokens (Task 2), `getSiteSettings` (Task 6).
- Produces: rutas de UI de estado (elegantes, coherentes con la marca; sin spinner genérico ni pantalla blanca).

- [ ] **Step 1: Crear `src/app/loading.tsx`**

```tsx
export default function Loading() {
  return (
    <div
      aria-busy="true"
      style={{
        display: "grid",
        placeItems: "center",
        minHeight: "100vh",
        background: "var(--ink)",
        color: "var(--muted)",
        fontFamily: "var(--font-display)",
        letterSpacing: "0.3em",
        textTransform: "uppercase",
      }}
    >
      Meridian
    </div>
  );
}
```

- [ ] **Step 2: Crear `src/app/error.tsx`**

```tsx
"use client";
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main style={{ display: "grid", placeItems: "center", minHeight: "100vh", gap: "1.5rem", textAlign: "center", padding: "var(--gutter)" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem,6vw,4rem)" }}>
        Something broke.
      </h1>
      <button
        onClick={reset}
        style={{ background: "var(--gold)", color: "var(--ink)", border: "none", padding: "0.75rem 2rem", borderRadius: "999px", cursor: "pointer" }}
      >
        Try again
      </button>
    </main>
  );
}
```

- [ ] **Step 3: Crear `src/app/not-found.tsx`**

```tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ display: "grid", placeItems: "center", minHeight: "100vh", gap: "1.5rem", textAlign: "center", padding: "var(--gutter)" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3rem,12vw,8rem)", margin: 0 }}>404</h1>
      <p style={{ color: "var(--muted)" }}>This page is off the map.</p>
      <Link href="/" style={{ color: "var(--gold)" }}>Back to Meridian</Link>
    </main>
  );
}
```

- [ ] **Step 4: Crear `README.md`**

```markdown
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
```

- [ ] **Step 5: Verificar build + toda la suite**

Run:
```bash
npm test
npm run typecheck
npm run build
```
Expected: todo PASS; build sin errores.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: estados de carga/error/404 + README"
```

---

## Self-Review (writing-plans)

- **Cobertura del spec (secciones 1–14):** Fase 1 cubre stack base (§3), estructura de carpetas (§4), tokens/fonts/sistema visual (§2), tipos + capa de contenido/CMS-ready (§5, §8), hooks de capabilities (§10, §11), smooth scroll + GSAP setup (§6, §7 parcial), SEO base (§12) y estados de carga (§13). El resto de §5/§6/§7 (componentes visuales, sistema de animación completo, WebGL, work/detail, about/contact, media dormida, analytics/pulido) queda para las fases 2–7 (abajo). Sin huecos para el alcance de "fundación".
- **Placeholders:** el único bloque intencionalmente resumido es la lista de 6 proyectos en Task 5 — se dan foto-IDs exactas y la estructura completa del primero; es repetición mecánica del mismo tipo, no lógica. Aceptable.
- **Consistencia de tipos:** `Project/Service/SiteSettings/Media` (Task 4) se usan idénticos en Tasks 5, 6, 9, 10. Firmas de `lib/content` estables entre Task 6 (definición), Task 9 y Task 10 (consumo). `useReducedMotion` (Task 7) consumido por Task 8. `fontVariables` (Task 3) por Task 9.

---

## Fases siguientes (se planificarán una por una)

- **Fase 2 — Home cinematográfico:** capítulos (Arrival/Blueprint/Living/Sanctum/Welcome), scroll-driven, tipografía cinética, sistema de animación (`animations/*`), cursor custom desktop, nav transformable + fullscreen menu.
- **Fase 3 — Efecto estrella WebGL:** `<SceneTransition>` con shader de displacement + RGB shift; degradación a crossfade CSS en mobile/low-end/reduced-motion.
- **Fase 4 — Work:** listado (grid/immersive) + project detail + transición card→proyecto + page transitions (next-view-transitions).
- **Fase 5 — About + Contact:** manifiesto, formulario con api route, validación y estados.
- **Fase 6 — CMS/Media dormidos:** schemas Sanity + Studio embebido, loader Cloudinary, MuxPlayer; `lib/content` pasa a async con la misma firma.
- **Fase 7 — Performance/a11y/SEO/analytics + deploy:** auditoría 60fps, JSON-LD, Vercel Analytics + Sentry tras env, deploy a Vercel.
