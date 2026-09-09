import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/content";
import { SITE_URL } from "@/lib/config";

// TODO(fase-6): resolver dentro de buildMetadata cuando el contenido pase a async
const site = getSiteSettings();
const baseUrl = SITE_URL;

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
