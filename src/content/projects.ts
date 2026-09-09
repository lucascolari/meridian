import type { Project } from "@/types";

export const projects: Project[] = [
  {
    slug: "the-arrival",
    title: "The Arrival",
    client: "Meridian Capital",
    year: 2026,
    category: "branding",
    excerpt: "A financial brand that lands like a skyline at dusk.",
    description:
      "A complete identity system for a real estate investment group, built on the language of arrival — the first sight of a city that becomes home.",
    heroMedia: {
      src: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1920&q=80",
      alt: "Aerial view of a city skyline at golden hour",
      width: 1920,
      height: 1080,
      kind: "image",
    },
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1600&q=80",
        alt: "City buildings from below at sunset",
        width: 1600,
        height: 1067,
        kind: "image",
      },
    ],
    services: ["direction", "brand"],
    credits: [
      { role: "Creative Direction", name: "Studio" },
      { role: "Design", name: "Studio" },
    ],
    awards: [{ title: "Site of the Day", org: "Awwwards", year: 2026 }],
    related: ["living-spaces", "inner-sanctum"],
    featured: true,
    order: 1,
  },
  {
    slug: "living-spaces",
    title: "Living Spaces",
    client: "Aurora Residences",
    year: 2026,
    category: "digital",
    excerpt:
      "A residential brand rendered as an interactive walkthrough of light and material.",
    description:
      "A digital-first identity for a residential development, translating architectural material studies into an immersive online experience that lets a home be explored before it is built.",
    heroMedia: {
      src: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1920&q=80",
      alt: "Modern residential interior bathed in warm afternoon light",
      width: 1920,
      height: 1080,
      kind: "image",
    },
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80",
        alt: "Warm light across a residential living space",
        width: 1600,
        height: 1067,
        kind: "image",
      },
    ],
    services: ["direction", "brand", "spatial"],
    credits: [
      { role: "Creative Direction", name: "Studio" },
      { role: "Creative Development", name: "Studio" },
    ],
    awards: [],
    related: ["the-arrival", "welcome"],
    featured: true,
    order: 2,
  },
  {
    slug: "inner-sanctum",
    title: "Inner Sanctum",
    client: "Hotel Solis",
    year: 2025,
    category: "spatial",
    excerpt:
      "A hospitality identity built around stillness, staged as a spatial journey through the hotel itself.",
    description:
      "An immersive digital experience for a boutique hotel, pairing a restrained visual identity with real-time 3D navigation through its rooms, courtyards and rooftop at golden hour.",
    heroMedia: {
      src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80",
      alt: "Sunlit hotel courtyard with warm architectural shadows",
      width: 1920,
      height: 1080,
      kind: "image",
    },
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
        alt: "Golden light across a hotel interior courtyard",
        width: 1600,
        height: 1067,
        kind: "image",
      },
    ],
    services: ["direction", "spatial", "motion"],
    credits: [
      { role: "Creative Direction", name: "Studio" },
      { role: "3D & Interaction", name: "Studio" },
    ],
    awards: [{ title: "FWA of the Day", org: "FWA", year: 2025 }],
    related: ["living-spaces", "the-arrival"],
    featured: true,
    order: 3,
  },
  {
    slug: "the-blueprint",
    title: "The Blueprint",
    client: "Nova Architecture",
    year: 2025,
    category: "branding",
    excerpt:
      "An architecture practice's identity, drawn from the precision of its own drafting tables.",
    description:
      "A visual identity system for an architecture practice, built on structural grids and technical typography that echo the discipline of the studio's blueprints.",
    heroMedia: {
      src: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1920&q=80",
      alt: "Modern architectural facade with dramatic golden-hour light",
      width: 1920,
      height: 1080,
      kind: "image",
    },
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80",
        alt: "Structural detail of a building facade at sunset",
        width: 1600,
        height: 1067,
        kind: "image",
      },
    ],
    services: ["direction", "brand"],
    credits: [
      { role: "Creative Direction", name: "Studio" },
      { role: "Design", name: "Studio" },
    ],
    awards: [],
    related: ["the-arrival"],
    featured: false,
    order: 4,
  },
  {
    slug: "welcome",
    title: "Welcome",
    client: "Meridian Hospitality",
    year: 2026,
    category: "motion",
    excerpt:
      "A hospitality group's arrival film, choreographed like a first walk through the lobby.",
    description:
      "A title sequence and brand film for a hospitality group's flagship launch, using kinetic type and long, unhurried takes to set the pace of an arrival.",
    heroMedia: {
      src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1920&q=80",
      alt: "Hotel lobby entrance glowing at golden hour",
      width: 1920,
      height: 1080,
      kind: "image",
    },
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
        alt: "Warm-lit hotel entrance at dusk",
        width: 1600,
        height: 1067,
        kind: "image",
      },
    ],
    services: ["direction", "motion"],
    credits: [
      { role: "Creative Direction", name: "Studio" },
      { role: "Motion Design", name: "Studio" },
    ],
    awards: [],
    related: ["inner-sanctum"],
    featured: false,
    order: 5,
  },
  {
    slug: "golden-hour",
    title: "Golden Hour",
    client: "Lumen Studios",
    year: 2026,
    category: "motion",
    excerpt: "A short film study of light itself, commissioned as a studio showreel.",
    description:
      "A cinematic showreel exploring the last hour of daylight across six cities, produced as a study in color, pacing and restraint for a production studio's reel.",
    heroMedia: {
      src: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1920&q=80",
      alt: "City skyline glowing under a golden-hour sky",
      width: 1920,
      height: 1080,
      kind: "image",
    },
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80",
        alt: "Silhouetted skyline against a golden sunset",
        width: 1600,
        height: 1067,
        kind: "image",
      },
    ],
    services: ["direction", "motion"],
    credits: [
      { role: "Creative Direction", name: "Studio" },
      { role: "Motion Design", name: "Studio" },
    ],
    awards: [{ title: "Vimeo Staff Pick", org: "Vimeo", year: 2026 }],
    related: ["welcome"],
    featured: false,
    order: 6,
  },
];
