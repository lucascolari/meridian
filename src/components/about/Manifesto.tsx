import { KineticHeading } from "@/components/typography/KineticHeading";
import { RevealText } from "@/components/typography/RevealText";
import styles from "./about.module.css";

interface ManifestoProps {
  paragraphs: string[];
}

export function Manifesto({ paragraphs }: ManifestoProps) {
  return (
    <section
      id="manifesto"
      className={styles.manifesto}
      aria-labelledby="about-manifesto-heading"
    >
      <KineticHeading as="h2" id="about-manifesto-heading">
        Manifesto
      </KineticHeading>
      <div className={styles.manifestoBody}>
        {paragraphs.map((paragraph) => (
          <RevealText as="p" key={paragraph} className={styles.manifestoParagraph}>
            {paragraph}
          </RevealText>
        ))}
      </div>
    </section>
  );
}
