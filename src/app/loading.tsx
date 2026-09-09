export default function Loading() {
  return (
    <div
      aria-busy="true"
      style={{
        display: "grid",
        placeItems: "center",
        minHeight: "100vh",
        background: "var(--ink)",
        color: "var(--muted)",
        fontFamily: "var(--font-display)",
        letterSpacing: "0.3em",
        textTransform: "uppercase",
      }}
    >
      Meridian
    </div>
  );
}
