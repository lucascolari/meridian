"use client";

import { useEffect, useState } from "react";
import { TransitionLink } from "./TransitionLink";
import { useCursor } from "@/hooks/useCursor";
import { FullscreenMenu } from "./FullscreenMenu";
import { NAV_LINKS } from "./links";
import styles from "./nav.module.css";

const COMPACT_THRESHOLD = 80;

export function Nav() {
  const [compact, setCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { setCursor, reset } = useCursor();

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > COMPACT_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`${styles.header} ${compact ? styles.compact : ""}`}
      >
        <TransitionLink
          href="/"
          className={styles.logo}
          onMouseEnter={() => setCursor("explore")}
          onMouseLeave={reset}
        >
          MERIDIAN
        </TransitionLink>

        <nav className={styles.links} aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <TransitionLink
              key={link.href}
              href={link.href}
              className={styles.link}
              onMouseEnter={() => setCursor("explore")}
              onMouseLeave={reset}
            >
              {link.label}
            </TransitionLink>
          ))}
        </nav>

        <button
          type="button"
          className={styles.menuButton}
          aria-expanded={menuOpen}
          aria-controls="fullscreen-menu"
          onMouseEnter={() => setCursor("explore")}
          onMouseLeave={reset}
          onClick={() => setMenuOpen((value) => !value)}
        >
          Menu
        </button>
      </header>

      <FullscreenMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
