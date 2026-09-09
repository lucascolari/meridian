export type Category = "branding" | "digital" | "motion" | "spatial";

export interface Media {
  src: string;
  alt: string;
  width: number;
  height: number;
  kind: "image" | "video";
  poster?: string;
}

export interface Service {
  id: string;
  title: string;
  summary: string;
  capabilities: string[];
}

export interface Award {
  title: string;
  org: string;
  year: number;
}

export interface ProjectCredit {
  role: string;
  name: string;
}

export interface Project {
  slug: string;
  title: string;
  client: string;
  year: number;
  category: Category;
  excerpt: string;
  description: string;
  heroMedia: Media;
  gallery: Media[];
  services: string[];
  credits: ProjectCredit[];
  awards: Award[];
  related: string[];
  featured: boolean;
  order: number;
}

export interface ApproachStep {
  index: string;
  title: string;
  body: string;
}

export interface TeamMember {
  name: string;
  role: string;
}

export interface AboutContent {
  intro: string;
  manifesto: string[];
  approach: ApproachStep[];
  team: TeamMember[];
  clients: string[];
}

export interface SiteSettings {
  name: string;
  tagline: string;
  description: string;
  email: string;
  social: { label: string; href: string }[];
  chapters: { id: string; label: string }[];
}
