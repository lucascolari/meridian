import type { CSSProperties } from "react";
import { TransitionLink } from "@/components/navigation/TransitionLink";
import { AnimatedImage } from "@/components/media/AnimatedImage";
import type { Project } from "@/types";
import styles from "./project.module.css";

interface NextProjectProps {
  project: Project;
}

export function NextProject({ project }: NextProjectProps) {
  const coverStyle: CSSProperties = {
    viewTransitionName: `vt-cover-${project.slug}`,
  };

  return (
    <TransitionLink
      href={`/work/${project.slug}`}
      className={styles.next}
      aria-label={`Next project — ${project.title}`}
    >
      <div className={styles.nextCover} style={coverStyle}>
        <AnimatedImage media={project.heroMedia} fill sizes="100vw" cursor="view" />
      </div>

      <div className={styles.nextOverlay} aria-hidden="true" />

      <div className={styles.nextContent}>
        <p className={styles.nextLabel}>Next project</p>
        <h2 className={styles.nextTitle}>{project.title}</h2>
      </div>
    </TransitionLink>
  );
}
