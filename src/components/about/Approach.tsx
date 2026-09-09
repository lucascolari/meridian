"use client";

import { useRef } from "react";
import { useGSAP } from "@/lib/gsap";
import { revealFrom } from "@/animations";
import { KineticHeading } from "@/components/typography/KineticHeading";
import { RevealText } from "@/components/typography/RevealText";
import type { ApproachStep } from "@/types";
import styles from "./about.module.css";

interface ApproachProps {
  steps: ApproachStep[];
}

export function Approach({ steps }: ApproachProps) {
  const listRef = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const list = listRef.current;
      if (!list) return;
      revealFrom(".js-approach-step", {
        stagger: 0.12,
        scroll: list,
        start: "top 80%",
      });
    },
    { scope: listRef, dependencies: [steps.length] },
  );

  return (
    <section id="approach" className={styles.approach} aria-labelledby="about-approach-heading">
      <KineticHeading as="h2" id="about-approach-heading">
        Approach
      </KineticHeading>
      <RevealText as="p" className={styles.approachIntro}>
        From first conversation to final launch, the same method drives every project we take on.
      </RevealText>
      <ol ref={listRef} className={styles.approachList}>
        {steps.map((step) => (
          <li key={step.index} className={`${styles.approachStep} js-approach-step`}>
            <span className={styles.approachIndex}>{step.index}</span>
            <div>
              <h3 className={styles.approachTitle}>{step.title}</h3>
              <p className={styles.approachBody}>{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
