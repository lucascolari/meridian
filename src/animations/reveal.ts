import { gsap, registerGsap } from "@/lib/gsap";
import { MOTION, prefersReducedMotion } from "./config";

interface RevealOpts {
  y?: number;
  opacity?: number;
  duration?: number;
  ease?: string;
  delay?: number;
  stagger?: number;
  scroll?: boolean | Element;
  start?: string;
}

export function revealFrom(
  target: gsap.TweenTarget,
  opts: RevealOpts = {},
): gsap.core.Tween | undefined {
  if (prefersReducedMotion()) return undefined;
  registerGsap();
  const {
    y = 40,
    opacity = 0,
    duration = MOTION.duration.medium,
    ease = MOTION.ease.expo,
    delay = 0,
    stagger = 0,
    scroll = false,
    start = "top 85%",
  } = opts;
  const scrollTrigger =
    scroll === false
      ? undefined
      : { trigger: scroll === true ? (target as Element) : scroll, start };
  return gsap.from(target, { y, opacity, duration, ease, delay, stagger, scrollTrigger });
}
