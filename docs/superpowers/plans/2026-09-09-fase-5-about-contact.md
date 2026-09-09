# MERIDIAN — Fase 5: About + Contact — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Construir las páginas `/about` (manifiesto, método, equipo, clientes) y `/contact` (info + formulario con API route, validación tipada y estados accesibles), alimentadas por contenido curado y coherentes con la dirección de arte.

**Architecture:** Contenido de About en `src/content/about.ts` expuesto por `getAbout()` (misma capa desacoplada). La validación del formulario vive en una función pura tipada (`validateContact`, testeada) reutilizada por el cliente y por el route handler `/api/contact`. El form es un client component con estados (idle/submitting/success/error) y a11y; el route valida y responde JSON (sin servicio de email real en el demo — queda listo para conectar).

**Tech Stack:** Next.js 16 App Router (route handlers), React 19, TS, GSAP, Vitest.

## Global Constraints

- Ubicación `C:\dev\meridian`. NO mezclar con Gular.
- TS estricto, sin `any` sin justificar.
- Motion respeta `prefers-reduced-motion`; animar solo transform/opacity/clip-path.
- Contenido desde la capa de contenido; copy inglés, voz de estudio, sin rastros de autoría.
- **El demo NO envía emails reales** (no hay servicio configurado): `/api/contact` valida y responde `{ ok: true }`, dejando el punto de integración marcado. No pedir ni manejar credenciales.
- A11y del form: labels asociados, `aria-invalid`, mensajes de error enlazados con `aria-describedby`, foco y estados visibles.
- Commits terminan con línea en blanco + exactamente:
  `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`
- `npm run build/typecheck/test/lint` en verde al cerrar cada tarea. `/about` y `/contact` prerenderizan.
- YAGNI.

---

### Task 1: Contenido About + `getAbout` (TDD)

**Files:**
- Modify: `src/types/index.ts` (tipos About)
- Create: `src/content/about.ts`
- Modify: `src/lib/content/index.ts` (`getAbout`)
- Modify: `src/lib/content/index.test.ts` (test de `getAbout`)

**Interfaces:**
- Produces (tipos): `interface ApproachStep { index: string; title: string; body: string }`, `interface TeamMember { name: string; role: string }`, `interface AboutContent { intro: string; manifesto: string[]; approach: ApproachStep[]; team: TeamMember[]; clients: string[] }`.
- `getAbout(): AboutContent`.

- [ ] **Step 1: Tipos** — añadir a `src/types/index.ts` `ApproachStep`, `TeamMember`, `AboutContent` (shapes de arriba).

- [ ] **Step 2: Seed** — `src/content/about.ts`: `export const about: AboutContent = {...}` con intro, 3-4 párrafos de manifiesto, 4 approach steps (01-04: Discover, Direct, Design, Deliver — coherentes con el estudio), 3-4 team members (nombres inventados + roles: Creative Director, Design Lead, Motion Director, Technical Director), 6-8 clients (nombres ficticios premium). Inglés, voz de estudio, sin rastros de autoría.

- [ ] **Step 3: Test** — añadir a `src/lib/content/index.test.ts`:
```ts
import { getAbout } from "./index";
it("getAbout devuelve manifiesto y approach no vacíos", () => {
  const a = getAbout();
  expect(a.manifesto.length).toBeGreaterThan(0);
  expect(a.approach.length).toBeGreaterThanOrEqual(4);
  expect(a.team.length).toBeGreaterThan(0);
});
```

- [ ] **Step 4: Correr y verificar que falla** — `npm test -- content` → FAIL.

- [ ] **Step 5: Implementar `getAbout`** en `src/lib/content/index.ts`:
```ts
import { about } from "@/content/about";
import type { AboutContent } from "@/types";
export function getAbout(): AboutContent {
  return about;
}
```

- [ ] **Step 6: Correr y verificar que pasa** — `npm test -- content` → PASS. Luego `npm run typecheck`.

- [ ] **Step 7: Commit** — `git add -A && git commit -m "feat: contenido About + getAbout (test)"`

---

### Task 2: Página `/about`

**Files:**
- Create: `src/app/about/page.tsx`
- Create: `src/components/about/Manifesto.tsx`
- Create: `src/components/about/Approach.tsx`
- Create: `src/components/about/Team.tsx`
- Create: `src/components/about/about.module.css`

**Interfaces:**
- Consumes: `getAbout`, `getSiteSettings` (`@/lib/content`), `KineticHeading`, `RevealText`, `buildMetadata`.
- Produces: `/about` (server component, `metadata = buildMetadata({ title:"About", description:"MERIDIAN is a creative studio..." })`), con padding superior para el nav; secciones: intro/manifiesto (`Manifesto`), método (`Approach`, 01-04), equipo (`Team`), y una fila de clients.

- [ ] **Step 1..N** — implementar la página + 3 componentes + CSS module. Kinetic headings + reveals, transform/opacity only, reduced-motion respetado, tokens, semántica (`<section>`, headings jerárquicos correctos: h1 de página, h2 de secciones), sin rastros de autoría. Verificar `npm run build` (prerender `/about`), `npm run typecheck`, `npm run lint`.

- [ ] **Step final: Commit** — `git add -A && git commit -m "feat: pagina /about (manifiesto, metodo, equipo, clientes)"`

---

### Task 3: Validación de contacto (TDD) + route handler

**Files:**
- Create: `src/lib/contact/validate.ts`
- Test: `src/lib/contact/validate.test.ts`
- Create: `src/app/api/contact/route.ts`

**Interfaces:**
- Produces:
  - `interface ContactInput { name: string; email: string; message: string }`
  - `interface ValidationResult { ok: boolean; errors: Partial<Record<keyof ContactInput, string>> }`
  - `validateContact(input: Partial<ContactInput>): ValidationResult` — pura: name requerido (≥2), email con formato válido, message requerido (≥10).
  - `POST /api/contact` — parsea JSON, valida con `validateContact`; si falla → `Response.json({ ok:false, errors }, { status: 400 })`; si ok → `Response.json({ ok:true }, { status: 200 })` (sin enviar email; comentario marcando el punto de integración).

- [ ] **Step 1: Test** `src/lib/contact/validate.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { validateContact } from "./validate";

describe("validateContact", () => {
  it("acepta input válido", () => {
    const r = validateContact({ name: "Ada", email: "ada@studio.com", message: "I would like to talk about a brand." });
    expect(r.ok).toBe(true);
    expect(r.errors).toEqual({});
  });
  it("rechaza email inválido", () => {
    const r = validateContact({ name: "Ada", email: "nope", message: "A sufficiently long message here." });
    expect(r.ok).toBe(false);
    expect(r.errors.email).toBeTruthy();
  });
  it("rechaza name corto y message corto", () => {
    const r = validateContact({ name: "A", email: "ada@studio.com", message: "short" });
    expect(r.ok).toBe(false);
    expect(r.errors.name).toBeTruthy();
    expect(r.errors.message).toBeTruthy();
  });
  it("rechaza campos ausentes", () => {
    const r = validateContact({});
    expect(r.ok).toBe(false);
    expect(Object.keys(r.errors).length).toBe(3);
  });
});
```

- [ ] **Step 2: Correr y verificar que falla** — `npm test -- validate` → FAIL.

- [ ] **Step 3: Implementar `validate.ts`**:
```ts
export interface ContactInput { name: string; email: string; message: string }
export interface ValidationResult {
  ok: boolean;
  errors: Partial<Record<keyof ContactInput, string>>;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact(input: Partial<ContactInput>): ValidationResult {
  const errors: Partial<Record<keyof ContactInput, string>> = {};
  const name = (input.name ?? "").trim();
  const email = (input.email ?? "").trim();
  const message = (input.message ?? "").trim();
  if (name.length < 2) errors.name = "Please enter your name.";
  if (!EMAIL_RE.test(email)) errors.email = "Please enter a valid email.";
  if (message.length < 10) errors.message = "Tell us a little more (10+ characters).";
  return { ok: Object.keys(errors).length === 0, errors };
}
```

- [ ] **Step 4: Correr y verificar que pasa** — `npm test -- validate` → PASS.

- [ ] **Step 5: Route handler** `src/app/api/contact/route.ts`:
```ts
import { validateContact } from "@/lib/contact/validate";
import type { ContactInput } from "@/lib/contact/validate";

export async function POST(request: Request): Promise<Response> {
  let body: Partial<ContactInput> = {};
  try {
    body = (await request.json()) as Partial<ContactInput>;
  } catch {
    return Response.json({ ok: false, errors: { message: "Invalid request." } }, { status: 400 });
  }
  const result = validateContact(body);
  if (!result.ok) {
    return Response.json({ ok: false, errors: result.errors }, { status: 400 });
  }
  // TODO(integración): enviar el email/registrar el lead con un servicio real.
  return Response.json({ ok: true }, { status: 200 });
}
```

- [ ] **Step 6: Verificar** — `npm test`, `npm run typecheck`, `npm run build`, `npm run lint`.

- [ ] **Step 7: Commit** — `git add -A && git commit -m "feat: validacion de contacto (test) + route handler /api/contact"`

---

### Task 4: Página `/contact` + formulario

**Files:**
- Create: `src/app/contact/page.tsx`
- Create: `src/components/contact/ContactForm.tsx`
- Create: `src/components/contact/contact.module.css`

**Interfaces:**
- Consumes: `getSiteSettings` (`@/lib/content`), `validateContact` + `ContactInput` (`@/lib/contact/validate`), `KineticHeading`, `RevealText`, `buildMetadata`.
- Produces: `/contact` (server, `metadata = buildMetadata({ title:"Contact", description:"Let's build something iconic." })`), con heading grande, email `mailto:` + social, y `<ContactForm />`.
  - `ContactForm` (`"use client"`): campos name/email/message; on submit → `validateContact` local (bloquea si hay errores, muestra mensajes); si ok → `fetch("/api/contact", { method:"POST", body: JSON.stringify(...) })`; estados `idle | submitting | success | error`; deshabilita el submit mientras envía; muestra un mensaje de éxito accesible (`role="status"`) y de error (`role="alert"`). Labels asociados, `aria-invalid`, errores con `aria-describedby`. Solo transform/opacity en animaciones.

- [ ] **Step 1..N** — implementar la página + form + CSS. A11y completa (labels, aria-invalid, aria-describedby, foco, estados). Verificar `npm run build` (prerender `/contact`), `npm run typecheck`, `npm run lint`.

- [ ] **Step final: Commit** — `git add -A && git commit -m "feat: pagina /contact + formulario con estados y a11y"`

---

### Task 5: Verificación de la fase

- [ ] **Step 1: Suite + build** — `npm run build && npm run typecheck && npm test && npm run lint` (todo verde; `/about` y `/contact` prerenderizan; `/api/contact` como route ƒ).
- [ ] **Step 2: Smoke** — `npm run start` en background; `curl` a `/about` y `/contact` → 200; `POST /api/contact` con JSON válido → 200 `{ok:true}` y con inválido → 400. Frenar el server.
- [ ] **Step 3 (si hubo fixes): Commit** — `git add -A && git commit -m "test: verificacion Fase 5"`

---

## Self-Review (writing-plans)

- **Cobertura del spec §16-ish/§17(parcial)/§23 (about, contact, team/clients, a11y):** Task 1 (contenido About + getAbout), Task 2 (/about), Task 3 (validación pura testeada + API route), Task 4 (/contact + form accesible), Task 5 (verificación). El envío real de email queda como punto de integración (YAGNI para el demo, declarado).
- **Placeholders:** Tasks 1 y 3 traen código+tests completos; Tasks 2 y 4 van por requisitos (UI validada por build+browser).
- **Consistencia de nombres:** `getAbout`/`AboutContent` (Task 1) usados en Task 2; `validateContact`/`ContactInput` (Task 3) usados por el route (Task 3) y el form (Task 4); `buildMetadata` reutilizado. Los links del Nav a `/about` y `/contact` (ya existentes desde Fase 2/4) ahora resuelven a páginas reales.
