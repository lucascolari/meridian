"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import styles from "./media-video.module.css";

interface MediaVideoProps {
  src: string;
  poster?: string;
  className?: string;
}

// TODO(integración Mux): reemplazar <video> por <MuxPlayer playbackId=...> cargado dinámicamente cuando haya playbackId.
export function MediaVideo({ src, poster, className }: MediaVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play();
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, [reducedMotion]);

  const containerClassName = [styles.container, className ?? ""].filter(Boolean).join(" ");

  return (
    <div className={containerClassName}>
      <video
        ref={videoRef}
        className={styles.video}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        controls={reducedMotion}
      />
    </div>
  );
}
