import type { Award, Media, Project, ProjectCredit, Service, SiteSettings } from "@/types";
import { getSanityClient } from "./client";

/**
 * GROQ + fetchers tipados: es el path de activación del CMS, no se llama
 * por defecto (`src/lib/content/index.ts` sigue leyendo el seed local en
 * sync). Cuando `getSanityClient()` deja de ser `null` (env configurado),
 * estas funciones quedan listas para reemplazar ese seed.
 */

export const allProjectsQuery = /* groq */ `
  *[_type == "project"] | order(order asc) {
    "slug": slug.current,
    title,
    "client": client->name,
    year,
    category,
    excerpt,
    description,
    heroMedia,
    gallery,
    services,
    credits,
    awards,
    "related": relatedProjects[]->slug.current,
    featured,
    order
  }
`;

export const projectBySlugQuery = /* groq */ `
  *[_type == "project" && slug.current == $slug][0] {
    "slug": slug.current,
    title,
    "client": client->name,
    year,
    category,
    excerpt,
    description,
    heroMedia,
    gallery,
    services,
    credits,
    awards,
    "related": relatedProjects[]->slug.current,
    featured,
    order
  }
`;

export const servicesQuery = /* groq */ `
  *[_type == "service"] {
    "id": id.current,
    title,
    summary,
    capabilities
  }
`;

export const siteSettingsQuery = /* groq */ `
  *[_type == "siteSettings"][0] {
    name,
    tagline,
    description,
    email,
    social,
    chapters
  }
`;

interface SanityProject {
  slug: string;
  title: string;
  client: string;
  year: number;
  category: Project["category"];
  excerpt: string;
  description: string;
  heroMedia: Media;
  gallery: Media[];
  services: string[];
  credits: ProjectCredit[];
  awards: Award[];
  related: (string | null)[];
  featured: boolean;
  order: number;
}

function toProject(doc: SanityProject): Project {
  return {
    ...doc,
    related: doc.related.filter((slug): slug is string => Boolean(slug)),
  };
}

/** Devuelve `[]` si el CMS no está activado (sin env, cliente `null`). */
export async function fetchProjects(): Promise<Project[]> {
  const client = getSanityClient();
  if (!client) return [];
  const docs = await client.fetch<SanityProject[]>(allProjectsQuery);
  return docs.map(toProject);
}

/** Devuelve `null` si el CMS no está activado o si no hay proyecto con ese slug. */
export async function fetchProject(slug: string): Promise<Project | null> {
  const client = getSanityClient();
  if (!client) return null;
  const doc = await client.fetch<SanityProject | null>(projectBySlugQuery, { slug });
  return doc ? toProject(doc) : null;
}

/** Devuelve `[]` si el CMS no está activado. */
export async function fetchServices(): Promise<Service[]> {
  const client = getSanityClient();
  if (!client) return [];
  return client.fetch<Service[]>(servicesQuery);
}

/** Devuelve `null` si el CMS no está activado. */
export async function fetchSiteSettings(): Promise<SiteSettings | null> {
  const client = getSanityClient();
  if (!client) return null;
  return client.fetch<SiteSettings | null>(siteSettingsQuery);
}
