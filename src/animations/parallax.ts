import { gsap, registerGsap } from "@/lib/gsap";
import { prefersReducedMotion } from "./config";

interface ParallaxOpts {
  amount?: number;
  start?: string;
  end?: string;
}

export function parallax(target: gsap.TweenTarget, opts: ParallaxOpts = {}): void {
  if (prefersReducedMotion()) return;
  registerGsap();
  const { amount = 100, start = "top bottom", end = "bottom top" } = opts;
  gsap.to(target, {
    yPercent: amount / 10,
    ease: "none",
    scrollTrigger: { trigger: target as Element, start, end, scrub: true },
  });
}
