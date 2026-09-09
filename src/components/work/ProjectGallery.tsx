import { AnimatedImage } from "@/components/media/AnimatedImage";
import type { Media } from "@/types";
import styles from "./project.module.css";

interface ProjectGalleryProps {
  media: Media[];
}

export function ProjectGallery({ media }: ProjectGalleryProps) {
  return (
    <div className={styles.gallery}>
      {media.map((item) => (
        <div className={styles.galleryItem} key={item.src}>
          <AnimatedImage media={item} fill parallax sizes="(min-width: 48rem) 50vw, 100vw" />
        </div>
      ))}
    </div>
  );
}
