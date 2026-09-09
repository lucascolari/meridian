"use client";
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main style={{ display: "grid", placeItems: "center", minHeight: "100vh", gap: "1.5rem", textAlign: "center", padding: "var(--gutter)" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem,6vw,4rem)" }}>
        Something broke.
      </h1>
      <button
        onClick={reset}
        style={{ background: "var(--gold)", color: "var(--ink)", border: "none", padding: "0.75rem 2rem", borderRadius: "999px", cursor: "pointer" }}
      >
        Try again
      </button>
    </main>
  );
}
