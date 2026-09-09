import { getProjects } from "@/lib/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { RevealText } from "@/components/typography/RevealText";
import { KineticHeading } from "@/components/typography/KineticHeading";
import { WorkGrid } from "@/components/work/WorkGrid";
import styles from "@/components/work/work.module.css";

export const metadata = buildMetadata({
  title: "Work",
  description: "Selected work by MERIDIAN.",
});

export default function WorkPage() {
  const projects = getProjects();

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <RevealText as="p" className={styles.eyebrow}>
            WORK
          </RevealText>
          <KineticHeading as="h1">Selected Work</KineticHeading>
          <p className={styles.intro}>
            A collection of branding, digital, motion and spatial projects
            built with intent, from first sketch to final pixel.
          </p>
        </div>

        <WorkGrid projects={projects} />
      </div>
    </div>
  );
}
