"use client";

import { useRef } from "react";
import { getServices } from "@/lib/content";
import { useGSAP } from "@/lib/gsap";
import { revealFrom } from "@/animations";
import { KineticHeading } from "@/components/typography/KineticHeading";
import { RevealText } from "@/components/typography/RevealText";
import styles from "./sections.module.css";

/**
 * THE BLUEPRINT — services rendered as a numbered list (01-04), each item
 * fading in with a stagger as the list scrolls into view.
 */
export function Blueprint() {
  const services = getServices();
  const listRef = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const list = listRef.current;
      if (!list) return;
      revealFrom(".js-service-item", {
        stagger: 0.12,
        scroll: list,
        start: "top 80%",
      });
    },
    { scope: listRef, dependencies: [services.length] },
  );

  return (
    <section id="blueprint" className={styles.blueprint}>
      <div className={styles.container}>
        <KineticHeading as="h2">The Blueprint</KineticHeading>

        <RevealText as="p" className={styles.blueprintIntro}>
          Four disciplines, one direction — the practice we bring to every
          brand we build.
        </RevealText>

        <ol ref={listRef} className={styles.serviceList}>
          {services.map((service, index) => (
            <li key={service.id} className={`${styles.serviceItem} js-service-item`}>
              <span className={styles.serviceIndex}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className={styles.serviceTitle}>{service.title}</h3>
                <p className={styles.serviceSummary}>{service.summary}</p>
                <ul className={styles.serviceCapabilities}>
                  {service.capabilities.map((capability) => (
                    <li key={capability} className={styles.serviceCapability}>
                      {capability}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
