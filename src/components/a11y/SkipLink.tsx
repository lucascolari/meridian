import styles from "./skip-link.module.css";

// Link de accesibilidad: invisible hasta recibir foco de teclado, salta el
// nav/cursor overlay y lleva directo al landmark <main id="main">.
export function SkipLink() {
  return (
    <a href="#main" className={styles.skipLink}>
      Skip to content
    </a>
  );
}
