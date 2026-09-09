"use client";
import { useLenisContext } from "@/components/layout/SmoothScroll";
import type Lenis from "lenis";

export function useLenis(): Lenis | null {
  return useLenisContext();
}
