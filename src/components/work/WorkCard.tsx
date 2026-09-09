"use client";

import { useRef } from "react";
import type { CSSProperties } from "react";
import { useGSAP } from "@/lib/gsap";
import { revealFrom } from "@/animations";
import { TransitionLink } from "@/components/navigation/TransitionLink";
import { AnimatedImage } from "@/components/media/AnimatedImage";
import type { Project } from "@/types";
import styles from "./work.module.css";

interface WorkCardProps {
  project: Project;
}

export function WorkCard({ project }: WorkCardProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      revealFrom(el, { scroll: true });
    },
    { scope: ref },
  );

  const coverStyle: CSSProperties = {
    viewTransitionName: `vt-cover-${project.slug}`,
  };

  return (
    <TransitionLink
      ref={ref}
      href={`/work/${project.slug}`}
      className={styles.card}
      aria-label={`${project.title} — ${project.client}, ${project.year}`}
    >
      <div className={styles.cover} style={coverStyle}>
        <AnimatedImage
          media={project.heroMedia}
          fill
          cursor="view"
          sizes="(min-width: 48rem) 50vw, 100vw"
        />
      </div>
      <div className={styles.meta}>
        <h2 className={styles.title}>{project.title}</h2>
        <span className={styles.subline}>
          {project.client} · {project.category.toUpperCase()} · {project.year}
        </span>
      </div>
    </TransitionLink>
  );
}
