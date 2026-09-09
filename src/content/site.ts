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
