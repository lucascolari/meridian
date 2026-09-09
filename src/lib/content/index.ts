import type { AboutContent, Project, Service, SiteSettings } from "@/types";
import { siteSettings } from "@/content/site";
import { services } from "@/content/services";
import { projects } from "@/content/projects";
import { about } from "@/content/about";

// CMS (Sanity) — activación, sin tocar el default sync de este módulo:
//
// Hoy `getProjects`/`getProject`/`getServices`/`getSiteSettings` leen el seed
// local de forma síncrona. Cuando se configure `NEXT_PUBLIC_SANITY_PROJECT_ID`
// (ver README, "CMS (Sanity) — cómo activar"), `getSanityClient()` deja de
// devolver `null` y estas funciones podrían delegar en los fetchers tipados
// de `src/lib/sanity/queries.ts`, por ejemplo:
//
//   import { getSanityClient } from "@/lib/sanity/client";
//   import { fetchProjects } from "@/lib/sanity/queries";
//
//   export async function getProjects(): Promise<Project[]> {
//     if (getSanityClient()) return fetchProjects();
//     return [...projects].sort(byOrder);
//   }
//
// Eso requeriría volver `getProjects` (y el resto) async y propagar el
// `await` en quien las llama — fuera de alcance de esta tarea (YAGNI: el
// sitio sigue funcionando 100% con el seed local, sin ninguna env seteada).

const byOrder = (a: Project, b: Project): number => a.order - b.order;

export function getSiteSettings(): SiteSettings {
  return siteSettings;
}

export function getAbout(): AboutContent {
  return about;
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

export function getAdjacentProject(
  slug: string,
  dir: "next" | "prev",
): Project | undefined {
  const all = getProjects();
  if (all.length < 2) return undefined;
  const i = all.findIndex((p) => p.slug === slug);
  if (i === -1) return undefined;
  const delta = dir === "next" ? 1 : -1;
  const j = (i + delta + all.length) % all.length;
  return all[j];
}
