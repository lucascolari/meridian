import { getFeaturedProjects, getSiteSettings } from "@/lib/content";
import { KineticHeading } from "@/components/typography/KineticHeading";
import { RevealText } from "@/components/typography/RevealText";
import { AnimatedImage } from "@/components/media/AnimatedImage";
import styles from "./sections.module.css";

/**
 * THE ARRIVAL — full-viewport opener. Background is the first featured
 * project's hero media so the brand lands on top of real work.
 */
export function Hero() {
  const site = getSiteSettings();
  const [firstFeatured] = getFeaturedProjects();

  return (
    <section id="arrival" className={styles.hero}>
      {firstFeatured ? (
        <AnimatedImage
          media={firstFeatured.heroMedia}
          fill
          priority
          parallax
          sizes="100vw"
          className={styles.heroMedia}
        />
      ) : null}

      <div className={styles.heroOverlay} aria-hidden="true" />

      <div className={styles.heroContent}>
        <RevealText as="p" className={styles.eyebrow}>
          THE ARRIVAL — CREATIVE STUDIO
        </RevealText>

        <KineticHeading as="h1" className={styles.heroTitle}>
          {site.name}
        </KineticHeading>

        <RevealText as="p" className={styles.heroTagline}>
          {site.tagline}
        </RevealText>

        <div className={styles.heroFooter}>
          <RevealText as="span" className={styles.heroScroll}>
            Scroll
            <span className={styles.heroScrollLine} aria-hidden="true" />
          </RevealText>
        </div>
      </div>
    </section>
  );
}
