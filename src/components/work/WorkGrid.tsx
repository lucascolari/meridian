import type { Project } from "@/types";
import { WorkCard } from "./WorkCard";
import styles from "./work.module.css";

interface WorkGridProps {
  projects: Project[];
}

export function WorkGrid({ projects }: WorkGridProps) {
  return (
    <div className={styles.grid}>
      {projects.map((project) => (
        <WorkCard key={project.slug} project={project} />
      ))}
    </div>
  );
}
