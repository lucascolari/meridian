import { getAbout, getSiteSettings } from "@/lib/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { RevealText } from "@/components/typography/RevealText";
import { KineticHeading } from "@/components/typography/KineticHeading";
import { Manifesto } from "@/components/about/Manifesto";
import { Approach } from "@/components/about/Approach";
import { Team } from "@/components/about/Team";
import styles from "@/components/about/about.module.css";

export const metadata = buildMetadata({
  title: "About",
  description:
    "MERIDIAN is a creative studio directing brand experiences at the meeting point of art direction, motion and technology.",
});

export default function AboutPage() {
  const about = getAbout();
  const site = getSiteSettings();

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <RevealText as="p" className={styles.eyebrow}>
            ABOUT
          </RevealText>
          <KineticHeading as="h1">{`About ${site.name}`}</KineticHeading>
          <RevealText as="p" className={styles.intro}>
            {about.intro}
          </RevealText>
        </div>

        <Manifesto paragraphs={about.manifesto} />
        <Approach steps={about.approach} />
        <Team members={about.team} />

        <section
          id="clients"
          className={styles.clients}
          aria-labelledby="about-clients-heading"
        >
          <KineticHeading as="h2" id="about-clients-heading">
            Clients
          </KineticHeading>
          <RevealText as="div">
            <ul className={styles.clientList}>
              {about.clients.map((client) => (
                <li key={client} className={styles.clientItem}>
                  {client}
                </li>
              ))}
            </ul>
          </RevealText>
        </section>
      </div>
    </main>
  );
}
