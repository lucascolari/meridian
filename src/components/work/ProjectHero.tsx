import type { CSSProperties } from "react";
import { AnimatedImage } from "@/components/media/AnimatedImage";
import { KineticHeading } from "@/components/typography/KineticHeading";
import type { Project } from "@/types";
import styles from "./project.module.css";

interface ProjectHeroProps {
  project: Project;
}

export function ProjectHero({ project }: ProjectHeroProps) {
  const coverStyle: CSSProperties = {
    viewTransitionName: `vt-cover-${project.slug}`,
  };

  return (
    <section className={styles.hero}>
      <div className={styles.heroCover} style={coverStyle}>
        <AnimatedImage media={project.heroMedia} fill priority sizes="100vw" />
      </div>

      <div className={styles.heroOverlay} aria-hidden="true" />

      <div className={styles.heroContent}>
        <KineticHeading as="h1" className={styles.heroTitle}>
          {project.title}
        </KineticHeading>
        <p className={styles.heroMeta}>
          {project.client} · {project.category.toUpperCase()} · {project.year}
        </p>
      </div>
    </section>
  );
}
