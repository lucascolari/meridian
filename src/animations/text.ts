import { gsap, registerGsap } from "@/lib/gsap";
import { MOTION, prefersReducedMotion } from "./config";

export function splitIntoWords(text: string): string[] {
  return text.split(/\s+/).filter((w) => w.length > 0);
}

export function splitIntoLinesMarkup(el: HTMLElement): void {
  const words = splitIntoWords(el.textContent ?? "");
  el.textContent = "";
  for (const word of words) {
    const outer = document.createElement("span");
    outer.className = "word";
    outer.style.display = "inline-block";
    outer.style.overflow = "hidden";
    const inner = document.createElement("span");
    inner.className = "word-inner";
    inner.style.display = "inline-block";
    inner.style.willChange = "transform";
    inner.textContent = word;
    outer.appendChild(inner);
    el.appendChild(outer);
    el.appendChild(document.createTextNode(" "));
  }
}

interface RevealTextOpts {
  stagger?: number;
  duration?: number;
  ease?: string;
  scroll?: boolean;
  start?: string;
}

export function revealText(el: HTMLElement, opts: RevealTextOpts = {}): void {
  splitIntoLinesMarkup(el);
  if (prefersReducedMotion()) return;
  registerGsap();
  const {
    stagger = 0.06,
    duration = MOTION.duration.medium,
    ease = MOTION.ease.expo,
    scroll = true,
    start = "top 85%",
  } = opts;
  gsap.from(el.querySelectorAll(".word-inner"), {
    yPercent: 120,
    duration,
    ease,
    stagger,
    scrollTrigger: scroll ? { trigger: el, start } : undefined,
  });
}
