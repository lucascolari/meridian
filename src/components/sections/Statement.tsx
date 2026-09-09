import { KineticHeading } from "@/components/typography/KineticHeading";
import styles from "./sections.module.css";

/**
 * INNER SANCTUM — a single manifesto line, generously spaced, near-black.
 */
export function Statement() {
  return (
    <section id="sanctum" className={styles.sanctum}>
      <KineticHeading as="h2" className={styles.sanctumStatement}>
        We build brands that feel inevitable.
      </KineticHeading>
    </section>
  );
}
