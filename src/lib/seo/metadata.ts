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
