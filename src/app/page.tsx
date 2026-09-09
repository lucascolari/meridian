import { getSiteSettings, getFeaturedProjects } from "@/lib/content";

export default function HomePage() {
  const site = getSiteSettings();
  const featured = getFeaturedProjects();
  return (
    <main style={{ padding: "var(--space-5) var(--gutter)" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3rem,10vw,9rem)", margin: 0 }}>
        {site.name}
      </h1>
      <p style={{ color: "var(--muted)", fontSize: "1.25rem" }}>{site.tagline}</p>
      <ul>
        {featured.map((p) => (
          <li key={p.slug}>{p.title} — {p.client}</li>
        ))}
      </ul>
    </main>
  );
}
