import { TransitionLink } from "@/components/navigation/TransitionLink";
import { getFeaturedProjects } from "@/lib/content";
import { KineticHeading } from "@/components/typography/KineticHeading";
import { RevealText } from "@/components/typography/RevealText";
import { AnimatedImage } from "@/components/media/AnimatedImage";
import styles from "./sections.module.css";

/**
 * LIVING SPACES — selected work as large alternating cards. Each card links
 * to the project's future detail page (arrives in Phase 4).
 */
export function FeaturedWork() {
  const projects = getFeaturedProjects();

  return (
    <section id="living" className={styles.living}>
      <div className={styles.container}>
        <div className={styles.livingHeader}>
          <RevealText as="p" className={styles.eyebrow}>
            LIVING SPACES
          </RevealText>
          <KineticHeading as="h2">Selected Work</KineticHeading>
        </div>

        <div className={styles.projectList}>
          {projects.map((project, index) => (
            <TransitionLink
              key={project.slug}
              href={`/work/${project.slug}`}
              className={
                index % 2 === 1
                  ? `${styles.projectCard} ${styles.projectCardReverse}`
                  : styles.projectCard
              }
            >
              <div className={styles.projectMediaFrame}>
                <AnimatedImage
                  media={project.heroMedia}
                  fill
                  parallax
                  cursor="view"
                  sizes="(min-width: 56rem) 55vw, 100vw"
                />
              </div>
              <div className={styles.projectInfo}>
                <span className={styles.projectClient}>{project.client}</span>
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <span className={styles.projectMeta}>
                  {project.category} — {project.year}
                </span>
              </div>
            </TransitionLink>
          ))}
        </div>
      </div>
    </section>
  );
}
