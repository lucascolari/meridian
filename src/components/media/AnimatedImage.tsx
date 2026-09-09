"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, registerGsap, useGSAP } from "@/lib/gsap";
import { MOTION, parallax, prefersReducedMotion } from "@/animations";
import { useCursor } from "@/hooks/useCursor";
import type { CursorVariant } from "@/components/cursor/CursorProvider";
import type { Media } from "@/types";
import styles from "./media.module.css";

type AnimatedImageCursor = Extract<CursorVariant, "view" | "explore">;

interface AnimatedImageProps {
  media: Media;
  priority?: boolean;
  sizes?: string;
  className?: string;
  parallax?: boolean;
  cursor?: AnimatedImageCursor;
  fill?: boolean;
}

const CURSOR_LABELS: Record<AnimatedImageCursor, string> = {
  view: "View",
  explore: "Explore",
};

export function AnimatedImage({
  media,
  priority = false,
  sizes,
  className,
  parallax: withParallax = false,
  cursor,
  fill = false,
}: AnimatedImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const { setCursor, reset } = useCursor();

  useGSAP(
    () => {
      const container = containerRef.current;
      const img = imgRef.current;
      if (!container || !img) return;

      registerGsap();

      if (!prefersReducedMotion()) {
        gsap.from(img, {
          clipPath: "inset(100% 0 0 0)",
          duration: MOTION.duration.slow,
          ease: MOTION.ease.expo,
          scrollTrigger: { trigger: container, start: "top 85%" },
        });
      }

      if (withParallax) {
        parallax(img);
      }
    },
    { scope: containerRef, dependencies: [media.src, withParallax] },
  );

  const containerClassName = [
    styles.container,
    fill ? styles.containerFill : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const imageClassName = [
    styles.image,
    fill ? styles.imageFill : styles.imageIntrinsic,
    withParallax ? styles.imageParallax : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={containerRef}
      className={containerClassName}
      onMouseEnter={cursor ? () => setCursor(cursor, CURSOR_LABELS[cursor]) : undefined}
      onMouseLeave={cursor ? () => reset() : undefined}
    >
      {fill ? (
        <Image
          ref={imgRef}
          src={media.src}
          alt={media.alt}
          fill
          sizes={sizes ?? "100vw"}
          priority={priority}
          className={imageClassName}
        />
      ) : (
        <Image
          ref={imgRef}
          src={media.src}
          alt={media.alt}
          width={media.width}
          height={media.height}
          sizes={sizes}
          priority={priority}
          className={imageClassName}
        />
      )}
    </div>
  );
}
