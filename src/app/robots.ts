import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";

const baseUrl = SITE_URL;

// Requerido con output: export (GitHub Pages) para generar robots.txt estático.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/studio"] },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
