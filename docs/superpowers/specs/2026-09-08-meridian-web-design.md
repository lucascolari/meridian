# MERIDIAN — Diseño de la experiencia web

- **Fecha:** 2026-09-08
- **Tipo:** Pieza demo / showcase (agencia creativa ficticia)
- **Autor del contenido:** curado por el estudio (contenido inventado de nivel internacional)
- **Ubicación del código:** `C:\dev\meridian` (fuera de OneDrive, igual que Gular, para que `node_modules` no rompa la sincronización)
- **Relación con otros proyectos:** proyecto independiente. **No mezclar con Gular Agency (`C:\dev\agencia`).**

> Referencia visual: reel de Instagram de `w.wearebrand` (arquitectura cinematográfica en golden hour con tipografía serif en mayúsculas y transiciones escena→escena). Se reinterpreta, no se copia.

---

## 1. Objetivo

Construir una **experiencia digital premium, cinematográfica y técnicamente sofisticada** para una agencia creativa ficticia (**MERIDIAN**), comparable a los mejores sitios de estudios creativos del mundo. No es una landing: es una **pieza audiovisual interactiva multipágina** que sirve como carta de presentación para ganar clientes premium.

Prioridades (en orden): dirección de arte → experiencia → motion → interacción → calidad visual → performance → arquitectura → escalabilidad → SEO → accesibilidad.

---

## 2. Concepto creativo

- **Nombre:** **MERIDIAN** — *creative studio*.
- **Positioning:** creative direction + brand experience + motion + 3D.
- **Tagline:** *"We build iconic brands."*
- **Metáfora central:** construimos marcas como se construye arquitectura icónica. El arco del reel (llegada → estructura → edificio → interior → bienvenida) se resignifica como el **método del estudio**.
- **Capítulos del home** (= etapas del método, con títulos tomados y resignificados del reel):
  1. `THE ARRIVAL` — intro / hero
  2. `THE BLUEPRINT` — statement + servicios (la estructura)
  3. `LIVING SPACES` — trabajos destacados (los edificios habitados)
  4. `INNER SANCTUM` — about / manifiesto del estudio
  5. `WELCOME` — CTA / contacto

### Sistema visual
- **Display:** Fraunces (serif variable, alto contraste), en mayúsculas con tracking amplio. Self-hosted vía `next/font`.
- **Body:** Geist / Inter (grotesque neutro). Self-hosted.
- **Paleta (design tokens):**
  - `--ink` — negro casi puro (fondo dominante)
  - `--bone` — blanco cálido (texto)
  - `--gold` / `--amber` — dorado de golden hour (acento primario)
  - `--electric` — azul eléctrico (acento secundario, el del "blueprint")
  - grises intermedios derivados
- **Ritmo:** lento, intencional, cinematográfico. Nada de bouncing, easing excesivo ni efectos aleatorios.

---

## 3. Stack tecnológico y asignación de técnica (sección 30 del brief)

Base: **Next.js 16 (App Router) + React 19 + TypeScript**, **Tailwind v4 + design tokens en CSS**, deploy **Vercel**.

Regla: usar cada tecnología **solo cuando aporta algo real**. Asignación:

| Efecto / responsabilidad | Técnica | Justificación |
|---|---|---|
| Transición escena↔escena (efecto estrella) | **WebGL** — shader de displacement entre dos texturas + RGB shift, `progress` por scroll | CSS/GSAP no logran el morph líquido entre imágenes; acá Three.js sí aporta |
| Reveals de imagen/texto, clip-path, parallax, tipografía cinética | **GSAP + ScrollTrigger** | Más liviano y controlable que WebGL para esto |
| Smooth scroll | **Lenis** | Base del scroll-driven animation |
| Transiciones entre páginas | **next-view-transitions** + overlay GSAP | Continuidad "una sola experiencia" |
| Microinteracciones UI (menú, hover, estados) | **Motion (Framer Motion)** | Declarativo y accesible |
| 3D puntual (momento de marca en loader / detalle) | **React Three Fiber + Drei**, lazy | Solo si es visible; jamás escenas pesadas ocultas |
| Video grande | **Mux** (cableado, dormido) → mp4 local/CDN en el demo | autoplay muted loop, poster, IntersectionObserver, lazy |
| Imágenes | **next/image** + loader **Cloudinary** (dormido); fuente: stock arquitectura golden-hour | responsive, AVIF/WebP, blur placeholder, lazy/priority |
| CMS | **Sanity** (cableado, dormido) + capa de contenido local tipada con la misma interfaz | contenido desacoplado; drop-in al agregar claves |
| Analytics / errores | **Vercel Analytics + Sentry**, guardados tras env | sin ruido en dev/demo |

### Servicios en la nube — política "cableado pero dormido"
Sanity, Mux, Cloudinary y Sentry requieren **cuenta y API keys del usuario** (tienen free tier). El demo **no puede depender** de que existan. Por eso:
- La arquitectura los soporta al 100%.
- Funcionan apenas se pega una key en `.env.local`.
- Mientras tanto el sitio corre **autocontenido** con contenido curado local (`src/content`) que implementa la **misma interfaz tipada** que devolvería Sanity.

---

## 4. Arquitectura de carpetas

```
C:\dev\meridian
src/
├── app/
│   ├── layout.tsx            # providers globales (Lenis, cursor, transiciones), fuentes, metadata base
│   ├── page.tsx              # HOME cinematográfico
│   ├── work/
│   │   ├── page.tsx          # listado (grid / list / immersive)
│   │   └── [slug]/page.tsx   # project detail
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── studio/[[...tool]]    # Sanity Studio embebido (dormido)
│   ├── api/                  # endpoints (contacto, revalidate)
│   ├── sitemap.ts, robots.ts, opengraph-image.tsx
│   └── (estados) loading.tsx, error.tsx, not-found.tsx
│
├── components/
│   ├── layout/  navigation/  hero/  work/  typography/  media/
│   ├── cursor/  transitions/  webgl/  ui/  seo/
│
├── animations/               # sistema reutilizable y configurable
│   ├── reveal.ts  text.ts  image.ts  clip.ts  parallax.ts  page.ts  transitions.ts
│
├── lib/
│   ├── gsap/       # registro de plugins, contexto SSR-safe
│   ├── sanity/     # cliente + queries (dormido)
│   ├── cloudinary/ # loader de next/image (dormido)
│   ├── mux/        # helpers de playback (dormido)
│   ├── content/    # fuente única: local (seed) ↔ Sanity, misma firma
│   └── utils/
│
├── hooks/          # useLenis, useMediaQuery, useCursor, useDeviceCapabilities, useReducedMotion, useIntersection
├── shaders/        # vertex/  fragment/  (displacement, chromatic aberration)
├── styles/         # globals.css, tokens.css
├── content/        # seed curado tipado: projects, services, settings, awards
└── types/          # tipos compartidos (Project, Service, Media, SiteSettings, ...)
```

---

## 5. Sistema de componentes (principios)

- Componentes chicos, con **una responsabilidad clara**, comunicados por interfaces tipadas.
- Separar **UI / lógica / animación / data / media / WebGL**. Nada de componentes gigantes.
- TypeScript estricto; `any` solo con justificación.
- Piezas clave: `<SmoothScroll>`, `<Cursor>`, `<Nav>` (transformable), `<SceneTransition>` (WebGL), `<KineticHeading>`, `<RevealText>`, `<ImageReveal>`, `<ProjectCard>`, `<ProjectHero>`, `<MediaImage>`, `<MediaVideo>`, `<PageTransition>`, `<FullscreenMenu>`.

---

## 6. Sistema de animaciones

Abstracciones configurables (no animaciones sueltas por componente). Cada una recibe opciones (delay, duration, ease, stagger) y **respeta `prefers-reduced-motion`** (degradación a estado final sin movimiento):

- `reveal` (fade + translate)
- `textReveal` / split lines (tipografía cinética)
- `imageReveal` (clip-path / scale)
- `clipReveal` (máscaras)
- `parallax` (transform en scroll)
- `pageTransition` (entrada/salida de ruta)
- `projectTransition` (card → project page, imagen que escala hasta ocupar viewport)

Durations y easings viven en **tokens** (`--duration-fast/medium/slow`, `--ease-expo/smooth`).

---

## 7. Arquitectura WebGL

- Un **único `<Canvas>`** montado a demanda (dynamic import, sin SSR).
- `<SceneTransition textures={[a,b]} progress={p} />`:
  - `ShaderMaterial` con uniforms: `uProgress`, `uTexture0`, `uTexture1`, `uDisplacement`, `uRgbShift`, `uScale`, `uResolution`.
  - Vertex simple; fragment mezcla texturas por displacement map + aberración cromática opcional.
- **Degradación:** en mobile / low-end / `reduced-motion` → crossfade CSS con las mismas imágenes (mismo resultado narrativo, sin costo).
- 3D (R3F/Drei) **solo** para un momento de marca puntual y **lazy**; nunca escenas pesadas ocultas.

---

## 8. CMS (Sanity) — cableado, dormido

Schemas: `project`, `service`, `page`, `siteSettings`, `media`, `award`, `teamMember`, `client`.

`project` soporta: title, slug, client, year, category, description, heroMedia, images, videos, gallery, credits, awards, relatedProjects.

`lib/content` expone funciones (`getProjects`, `getProject(slug)`, `getServices`, `getSiteSettings`, …) que **hoy** leen `src/content` (seed local tipado) y **mañana** leen Sanity con la misma firma. Objetivo: agregar proyectos sin tocar el código del frontend.

---

## 9. Estrategia de assets

- **Imágenes:** stock de arquitectura golden-hour con licencia libre (Unsplash / Pexels) vía `next/image` remoto; responsive (`sizes`), AVIF/WebP, `priority` solo en el hero, blur placeholder, lazy en el resto. Loader Cloudinary drop-in.
- **Video:** lazy con IntersectionObserver, `muted`+`loop`+`playsInline`, poster; no cargar varios simultáneos. Mux drop-in para adaptive streaming.
- **Fuentes:** self-hosted vía `next/font` (cero CDN → sin bloqueo de render).

---

## 10. Estrategia de performance

- Dynamic imports para WebGL/3D; code splitting; `Suspense`.
- Animar **solo `transform`/`opacity`**; evitar layout thrashing (`top/left/width/height`).
- `useDeviceCapabilities` → DPR reducido y menos efectos en gama baja / mobile.
- Preloading estratégico, `IntersectionObserver`, memoization, cleanup de GSAP/ScrollTrigger.
- Objetivo: **60fps** en condiciones normales; evitar CLS (dimensiones e placeholders).

---

## 11. Responsive (experiencias diseñadas, no reducidas)

- **Desktop:** cursor custom, WebGL, composiciones grandes, interacción horizontal donde sume.
- **Tablet:** simplificación selectiva.
- **Mobile:** touch, WebGL simplificado/crossfade, **fullscreen menu**, menos assets simultáneos, foco en legibilidad. Sin cursor custom.

---

## 12. Accesibilidad y SEO

- **A11y:** HTML semántico, navegación por teclado, focus visible, botones accesibles, alt text, ARIA donde haga falta, contraste suficiente, `prefers-reduced-motion` respetado en todo el sistema de motion.
- **SEO:** metadata dinámica por página/proyecto, Open Graph + Twitter/X cards, `sitemap.ts`, `robots.ts`, canonical, structured data (JSON-LD), semántica. Cada proyecto posicionable individualmente.

---

## 13. Fases de implementación (alto nivel)

El plan detallado se escribe aparte (skill writing-plans). Orden propuesto, cada fase entrega algo funcional y verificable:

1. **Fundación:** scaffold Next+TS+Tailwind v4, tokens, fuentes, Lenis, providers, GSAP setup, capa de contenido + seed, tipos, layout base, estados de carga/error, SEO base.
2. **Home — estructura y motion base:** capítulos (Arrival/Blueprint/Living/Sanctum/Welcome), scroll-driven, kinetic type, reveals, cursor, nav transformable, fullscreen menu.
3. **Efecto estrella WebGL:** `<SceneTransition>` con displacement + degradación CSS.
4. **Work:** listado (grid/immersive) + project detail + transición card→proyecto + page transitions.
5. **About + Contact** + formulario (api route) con validación y estados.
6. **CMS/Media dormidos:** schemas Sanity, loaders Cloudinary/Mux drop-in, Studio embebido.
7. **Performance, a11y, SEO, analytics/Sentry, pulido y deploy a Vercel.**

---

## 14. Fuera de alcance del v1 (YAGNI)

- Poblar Sanity en la nube (queda listo para hacerlo).
- Multiidioma.
- E-commerce / auth / dashboard.
- 3D pesado o escenas complejas: solo un momento puntual de marca.
