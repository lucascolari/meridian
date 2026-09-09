"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getFeaturedProjects, getSiteSettings } from "@/lib/content";
import { useLenis } from "@/hooks/useLenis";
import { gsap } from "@/lib/gsap";
import { MOTION, prefersReducedMotion } from "@/animations";
import { NAV_LINKS } from "./links";
import styles from "./nav.module.css";

interface FullscreenMenuProps {
  open: boolean;
  onClose: () => void;
}

export function FullscreenMenu({ open, onClose }: FullscreenMenuProps) {
  const [rendered, setRendered] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const lenis = useLenis();
  const projects = getFeaturedProjects();
  const { social } = getSiteSettings();

  // Monta el overlay apenas se pide abrir, para poder animar la entrada.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sincroniza el montaje del overlay con el prop `open` antes de animar la entrada
    if (open) setRendered(true);
  }, [open]);

  // Animacion de entrada + bloqueo de scroll + foco + Escape.
  useEffect(() => {
    if (!open || !rendered) return;
    const overlay = overlayRef.current;
    if (!overlay) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    lenis?.stop();

    const items = overlay.querySelectorAll<HTMLElement>("[data-menu-item]");
    if (prefersReducedMotion()) {
      gsap.set(overlay, { opacity: 1 });
      gsap.set(items, { opacity: 1, y: 0 });
    } else {
      gsap.set(overlay, { opacity: 1 });
      gsap.fromTo(
        items,
        { y: 32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: MOTION.duration.fast,
          ease: MOTION.ease.expo,
          stagger: 0.04,
        },
      );
    }

    overlay.querySelector<HTMLElement>("[data-autofocus]")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      lenis?.start();
    };
  }, [open, rendered, lenis, onClose]);

  // Animacion de salida + reanuda scroll + restaura foco.
  useEffect(() => {
    if (open || !rendered) return;
    lenis?.start();
    previousFocusRef.current?.focus();

    const overlay = overlayRef.current;
    if (!overlay || prefersReducedMotion()) {
      setRendered(false);
      return;
    }
    gsap.to(overlay, {
      opacity: 0,
      duration: MOTION.duration.fast * 0.6,
      ease: MOTION.ease.expo,
      onComplete: () => setRendered(false),
    });
  }, [open, rendered, lenis]);

  return (
    <div
      ref={overlayRef}
      id="fullscreen-menu"
      className={`${styles.overlay} ${rendered ? "" : styles.overlayHidden}`}
      style={{ pointerEvents: open ? "auto" : "none" }}
      role="dialog"
      aria-modal="true"
      aria-label="Main navigation"
      aria-hidden={!open}
    >
      <button
        type="button"
        data-autofocus
        className={styles.closeButton}
        onClick={onClose}
      >
        Close
      </button>

      <nav className={styles.menuLinks} aria-label="Primary">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            data-menu-item
            className={styles.menuLink}
            onClick={onClose}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className={styles.menuFooter}>
        <div data-menu-item className={styles.menuColumn}>
          <span className={styles.menuColumnTitle}>Selected work</span>
          <ul className={styles.workList}>
            {projects.map((project) => (
              <li key={project.slug}>
                <Link
                  href={`/work/${project.slug}`}
                  onClick={onClose}
                  className={styles.workLink}
                >
                  {project.title}
                  <span className={styles.workMeta}>
                    {project.client} — {project.year}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div data-menu-item className={styles.menuColumn}>
          <span className={styles.menuColumnTitle}>Elsewhere</span>
          <ul className={styles.socialList}>
            {social.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={styles.socialLink}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
