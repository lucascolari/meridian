import { getSiteSettings } from "@/lib/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { RevealText } from "@/components/typography/RevealText";
import { KineticHeading } from "@/components/typography/KineticHeading";
import { ContactForm } from "@/components/contact/ContactForm";
import styles from "@/components/contact/contact.module.css";

export const metadata = buildMetadata({
  title: "Contact",
  description: "Let's build something iconic.",
});

export default function ContactPage() {
  const site = getSiteSettings();

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <RevealText as="p" className={styles.eyebrow}>
            CONTACT
          </RevealText>
          <KineticHeading as="h1">{`Let's build something iconic`}</KineticHeading>
          <RevealText as="p" className={styles.intro}>
            {site.tagline}
          </RevealText>
        </div>

        <div className={styles.grid}>
          <div className={styles.info}>
            <a href={`mailto:${site.email}`} className={styles.email}>
              {site.email}
            </a>
            <ul className={styles.socialList}>
              {site.social.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className={styles.socialLink}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <ContactForm />
        </div>
      </div>
    </div>
  );
}
