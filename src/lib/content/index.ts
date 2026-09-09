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
