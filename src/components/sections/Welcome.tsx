import Link from "next/link";
import { getSiteSettings } from "@/lib/content";
import { KineticHeading } from "@/components/typography/KineticHeading";
import styles from "./sections.module.css";

/**
 * WELCOME — closing call to action: write in, or start a project.
 */
export function Welcome() {
  const { email } = getSiteSettings();

  return (
    <section id="welcome" className={styles.welcome}>
      <KineticHeading as="h2" className={styles.welcomeHeading}>
        Let&rsquo;s build something iconic.
      </KineticHeading>

      <div className={styles.welcomeActions}>
        <a href={`mailto:${email}`} className={`${styles.welcomeLink} ${styles.welcomeLinkPrimary}`}>
          {email}
        </a>
        <Link href="/contact" className={styles.welcomeLink}>
          Start a project
        </Link>
      </div>
    </section>
  );
}
