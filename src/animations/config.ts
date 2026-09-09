export const MOTION = {
  duration: { fast: 0.35, medium: 0.7, slow: 1.2 },
  ease: { expo: "expo.out", smooth: "power3.out" },
} as const;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
