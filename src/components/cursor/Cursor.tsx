"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useDeviceCapabilities } from "@/hooks/useDeviceCapabilities";
import { useCursorContext } from "./CursorProvider";

export function Cursor() {
  const { isTouch } = useDeviceCapabilities();
  const { variant, label } = useCursorContext();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isTouch) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;
    const xDot = gsap.quickTo(dot, "x", { duration: 0.15, ease: "power3" });
    const yDot = gsap.quickTo(dot, "y", { duration: 0.15, ease: "power3" });
    const xRing = gsap.quickTo(ring, "x", { duration: 0.4, ease: "power3" });
    const yRing = gsap.quickTo(ring, "y", { duration: 0.4, ease: "power3" });
    const move = (e: PointerEvent) => {
      xDot(e.clientX); yDot(e.clientY); xRing(e.clientX); yRing(e.clientY);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <div className="cursor" data-variant={variant} aria-hidden="true">
      <div className="cursor-dot" ref={dotRef} />
      <div className="cursor-ring" ref={ringRef}>
        {label ? <span className="cursor-label">{label}</span> : null}
      </div>
    </div>
  );
}
