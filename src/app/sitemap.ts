import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/content";
import { SITE_URL } from "@/lib/config";

const baseUrl = SITE_URL;

// Requerido con output: export (GitHub Pages) para generar el sitemap estático.
export const dynamic = "force-static";

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
