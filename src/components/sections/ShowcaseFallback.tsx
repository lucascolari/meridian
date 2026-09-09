import Image from "next/image";
import type { SiteSettings } from "@/types";
import styles from "./showcase.module.css";

interface ShowcaseFallbackProps {
  images: string[];
  alts: string[];
  labels: SiteSettings["chapters"];
}

/**
 * Presentacion sin WebGL para touch / low-end / prefers-reduced-motion:
 * una pila vertical de imagenes reales, sin pin ni scrub, cada una con su
 * capitulo superpuesto en texto legible.
 */
export function ShowcaseFallback({ images, alts, labels }: ShowcaseFallbackProps) {
  return (
    <section id="showcase" className={styles.fallback}>
      {images.map((src, index) => {
        const chapter = labels[index];
        return (
          <div key={chapter?.id ?? src} className={styles.fallbackItem}>
            <Image
              src={src}
              alt={alts[index] ?? chapter?.label ?? ""}
              fill
              sizes="100vw"
              className={styles.fallbackImage}
            />
            <div className={styles.fallbackOverlay} aria-hidden="true" />
            <div className={styles.fallbackCaption}>
              <span className={styles.fallbackEyebrow}>
                {String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
              </span>
              {chapter ? <h3 className={styles.fallbackLabel}>{chapter.label}</h3> : null}
            </div>
          </div>
        );
      })}
    </section>
  );
}
