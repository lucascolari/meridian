import { TransitionLink } from "@/components/navigation/TransitionLink";

export default function NotFound() {
  return (
    <div style={{ display: "grid", placeItems: "center", minHeight: "100vh", gap: "1.5rem", textAlign: "center", padding: "var(--gutter)" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3rem,12vw,8rem)", margin: 0 }}>404</h1>
      <p style={{ color: "var(--muted)" }}>This page is off the map.</p>
      <TransitionLink href="/" style={{ color: "var(--gold)" }}>Back to Meridian</TransitionLink>
    </div>
  );
}
