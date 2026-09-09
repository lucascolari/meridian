"use client";

import { useRef } from "react";
import type { ReactNode, RefObject } from "react";
import { useGSAP } from "@/lib/gsap";
import { revealFrom } from "@/animations";
import styles from "./typography.module.css";

type RevealTextTag = "p" | "div" | "span";

interface RevealTextProps {
  as?: RevealTextTag;
  children: ReactNode;
  className?: string;
}

export function RevealText({ as = "p", children, className }: RevealTextProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      revealFrom(el, { scroll: true });
    },
    { scope: ref },
  );

  const fullClassName = className ? `${styles.revealText} ${className}` : styles.revealText;

  if (as === "div") {
    return (
      <div ref={ref as RefObject<HTMLDivElement | null>} className={fullClassName}>
        {children}
      </div>
    );
  }
  if (as === "span") {
    return (
      <span ref={ref as RefObject<HTMLSpanElement | null>} className={fullClassName}>
        {children}
      </span>
    );
  }
  return (
    <p ref={ref as RefObject<HTMLParagraphElement | null>} className={fullClassName}>
      {children}
    </p>
  );
}
