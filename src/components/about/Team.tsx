import { KineticHeading } from "@/components/typography/KineticHeading";
import { RevealText } from "@/components/typography/RevealText";
import type { TeamMember } from "@/types";
import styles from "./about.module.css";

interface TeamProps {
  members: TeamMember[];
}

export function Team({ members }: TeamProps) {
  return (
    <section id="team" className={styles.team} aria-labelledby="about-team-heading">
      <KineticHeading as="h2" id="about-team-heading">
        Team
      </KineticHeading>
      <div className={styles.teamGrid}>
        {members.map((member) => (
          <RevealText as="div" key={member.name} className={styles.teamMember}>
            <span className={styles.teamName}>{member.name}</span>
            <span className={styles.teamRole}>{member.role}</span>
          </RevealText>
        ))}
      </div>
    </section>
  );
}
