"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { getProjects, getSiteSettings } from "@/lib/content";
import { useDeviceCapabilities } from "@/hooks/useDeviceCapabilities";
import { registerGsap, ScrollTrigger } from "@/lib/gsap";
import { ShowcaseFallback } from "./ShowcaseFallback";
import styles from "./showcase.module.css";

const SceneCanvas = dynamic(
  () => import("@/components/webgl/SceneCanvas").then((m) => m.SceneCanvas),
  { ssr: false },
);

/**
 * SHOWCASE — heroes de proyecto en una seccion pineada por scroll, con
 * transicion WebGL entre imagenes. En touch / low-end / prefers-reduced-motion
 * se degrada a ShowcaseFallback (sin pin, sin canvas).
 */
export function Showcase() {
  const projects = getProjects().slice(0, 5);
  const images = projects.map((project) => project.heroMedia.src);
  const alts = projects.map((project) => project.heroMedia.alt);
  const labels = getSiteSettings().chapters;

  const capabilities = useDeviceCapabilities();
  const useFallback =
    !capabilities.resolved ||
    capabilities.isTouch ||
    capabilities.isLowEnd ||
    capabilities.prefersReducedMotion;

  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (useFallback || images.length < 2) return;
    const section = sectionRef.current;
    if (!section) return;

    registerGsap();

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        progressRef.current = self.progress;
        setActive(Math.round(self.progress * (labels.length - 1)));
      },
    });

    ScrollTrigger.refresh();

    return () => {
      trigger.kill();
    };
  }, [useFallback, images.length, labels.length]);

  if (images.length < 2) return null;

  if (useFallback) {
    return <ShowcaseFallback images={images} alts={alts} labels={labels} />;
  }

  return (
    <section
      id="showcase"
      ref={sectionRef}
      className={styles.track}
      style={{ height: `${images.length * 100}vh` }}
    >
      <div className={styles.stage}>
        <div className={styles.canvasWrap} aria-hidden="true">
          <SceneCanvas images={images} progressRef={progressRef} />
        </div>
        <div className={styles.overlay} aria-hidden="true" />
        <div className={styles.labels}>
          <span className={styles.eyebrow}>Showcase</span>
          <ul className={styles.labelList}>
            {labels.map((chapter, index) => (
              <li
                key={chapter.id}
                className={
                  index === active ? `${styles.label} ${styles.labelActive}` : styles.label
                }
              >
                {chapter.label}
              </li>
            ))}
          </ul>
          <span className={styles.progress}>
            {String(active + 1).padStart(2, "0")} / {String(labels.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
}
