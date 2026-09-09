"use client";

import { useRef } from "react";
import { useGSAP } from "@/lib/gsap";
import { revealText } from "@/animations";
import styles from "./typography.module.css";

type HeadingTag = "h1" | "h2" | "h3" | "h4";

interface KineticHeadingProps {
  as?: HeadingTag;
  children: string;
  className?: string;
  id?: string;
  stagger?: number;
  start?: string;
}

export function KineticHeading({
  as: Tag = "h1",
  children,
  className,
  id,
  stagger,
  start,
}: KineticHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      revealText(el, { stagger, start });
    },
    { scope: ref, dependencies: [children, stagger, start] },
  );

  return (
    <Tag
      ref={ref}
      id={id}
      className={className ? `${styles.heading} ${className}` : styles.heading}
    >
      {children}
    </Tag>
  );
}
