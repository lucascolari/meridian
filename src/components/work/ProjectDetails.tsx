import { getServices } from "@/lib/content";
import type { Project } from "@/types";
import styles from "./project.module.css";

interface ProjectDetailsProps {
  project: Project;
}

export function ProjectDetails({ project }: ProjectDetailsProps) {
  const services = getServices();
  const serviceTitles = project.services.map(
    (id) => services.find((s) => s.id === id)?.title ?? id,
  );

  return (
    <section className={styles.details} aria-label="Project details">
      <dl className={styles.detailsGrid}>
        <div className={styles.detailGroup}>
          <dt className={styles.detailLabel}>Client</dt>
          <dd className={styles.detailValue}>{project.client}</dd>
        </div>

        <div className={styles.detailGroup}>
          <dt className={styles.detailLabel}>Year</dt>
          <dd className={styles.detailValue}>{project.year}</dd>
        </div>

        <div className={styles.detailGroup}>
          <dt className={styles.detailLabel}>Category</dt>
          <dd className={styles.detailValue}>{project.category}</dd>
        </div>

        {serviceTitles.length > 0 ? (
          <div className={styles.detailGroup}>
            <dt className={styles.detailLabel}>Services</dt>
            <dd className={styles.detailValue}>
              <ul className={styles.detailList}>
                {serviceTitles.map((title) => (
                  <li key={title}>{title}</li>
                ))}
              </ul>
            </dd>
          </div>
        ) : null}

        {project.credits.length > 0 ? (
          <div className={styles.detailGroup}>
            <dt className={styles.detailLabel}>Credits</dt>
            <dd className={styles.detailValue}>
              <ul className={styles.detailList}>
                {project.credits.map((credit) => (
                  <li key={`${credit.role}-${credit.name}`}>
                    {credit.role} — {credit.name}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ) : null}

        {project.awards.length > 0 ? (
          <div className={styles.detailGroup}>
            <dt className={styles.detailLabel}>Awards</dt>
            <dd className={styles.detailValue}>
              <ul className={styles.detailList}>
                {project.awards.map((award) => (
                  <li key={`${award.title}-${award.year}`}>
                    {award.title}, {award.org} ({award.year})
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ) : null}
      </dl>
    </section>
  );
}
