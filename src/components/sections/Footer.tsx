import { TransitionLink } from "@/components/navigation/TransitionLink";
import { getSiteSettings } from "@/lib/content";
import { NAV_LINKS } from "@/components/navigation/links";
import styles from "./sections.module.css";

export function Footer() {
  const site = getSiteSettings();
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <TransitionLink href="/" className={styles.footerLogo}>
              {site.name}
            </TransitionLink>
            <p className={styles.footerTagline}>{site.tagline}</p>
          </div>

          <div className={styles.footerColumns}>
            <nav className={styles.footerColumn} aria-label="Footer">
              <span className={styles.footerColumnTitle}>Navigate</span>
              <ul className={styles.footerNav}>
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <TransitionLink href={link.href} className={styles.footerLink}>
                      {link.label}
                    </TransitionLink>
                  </li>
                ))}
              </ul>
            </nav>

            <div className={styles.footerColumn}>
              <span className={styles.footerColumnTitle}>Elsewhere</span>
              <ul className={styles.footerSocial}>
                {site.social.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className={styles.footerLink}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <span>
            © {year} {site.name}
          </span>
          <span>{site.tagline}</span>
        </div>
      </div>
    </footer>
  );
}
