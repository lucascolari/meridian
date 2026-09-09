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
import styles from "@/components/work/project.module.css";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

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
  });
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const related = getRelatedProjects(slug);
  const next = getAdjacentProject(slug, "next");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    creator: "MERIDIAN",
    dateCreated: String(project.year),
    about: project.category,
  };

  return (
    <main>
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
          <p className={styles.relatedLabel}>Related work</p>
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
