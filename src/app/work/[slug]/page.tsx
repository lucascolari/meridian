import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAdjacentProject,
  getProject,
  getProjects,
  getRelatedProjects,
  getSiteSettings,
} from "@/lib/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { SITE_URL } from "@/lib/config";
import { RevealText } from "@/components/typography/RevealText";
import { TransitionLink } from "@/components/navigation/TransitionLink";
import { ProjectHero } from "@/components/work/ProjectHero";
import { ProjectGallery } from "@/components/work/ProjectGallery";
import { ProjectDetails } from "@/components/work/ProjectDetails";
import { NextProject } from "@/components/work/NextProject";
import { JsonLd } from "@/components/seo/JsonLd";
import styles from "@/components/work/project.module.css";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

// Solo los slugs generados en build son válidos: cualquier otro devuelve un 404
// real (status 404, no soft-404 con 200) — importante para SEO/crawlers.
export const dynamicParams = false;

export function generateStaticParams() {
  return getProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return buildMetadata();

  const site = getSiteSettings();
  const url = `${SITE_URL}/work/${project.slug}`;

  return buildMetadata({
    title: project.title,
    description: project.excerpt,
    openGraph: {
      type: "website",
      siteName: site.name,
      title: project.title,
      description: project.excerpt,
      url,
      images: [{ url: project.heroMedia.src }],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.excerpt,
      images: [project.heroMedia.src],
    },
  });
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const related = getRelatedProjects(slug);
  const next = getAdjacentProject(slug, "next");

  const site = getSiteSettings();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    creator: site.name,
    dateCreated: String(project.year),
    about: project.category,
    image: project.heroMedia.src,
    url: `${SITE_URL}/work/${project.slug}`,
  };

  return (
    <>
      <ProjectHero project={project} />

      <section className={styles.intro}>
        <RevealText as="p" className={styles.introText}>
          {project.description}
        </RevealText>
      </section>

      {project.gallery.length > 0 ? <ProjectGallery media={project.gallery} /> : null}

      <ProjectDetails project={project} />

      {related.length > 0 ? (
        <section className={styles.related} aria-label="Related projects">
          <h2 className={styles.relatedLabel}>Related work</h2>
          <ul className={styles.relatedList}>
            {related.map((relatedProject) => (
              <li key={relatedProject.slug}>
                <TransitionLink
                  href={`/work/${relatedProject.slug}`}
                  className={styles.relatedLink}
                >
                  {relatedProject.title}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {next ? <NextProject project={next} /> : null}

      <JsonLd data={jsonLd} />
    </>
  );
}
