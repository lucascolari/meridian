"use client";

import { useRef } from "react";
import type { ElementType, ReactNode } from "react";
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
  const Tag = as as ElementType;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      revealFrom(el, { scroll: true });
    },
    { scope: ref },
  );

  return (
    <Tag
      ref={ref}
      className={className ? `${styles.revealText} ${className}` : styles.revealText}
    >
      {children}
    </Tag>
  );
}
