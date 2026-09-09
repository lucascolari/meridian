"use client";
import { useEffect, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

interface Capabilities {
  isTouch: boolean;
  isLowEnd: boolean;
  prefersReducedMotion: boolean;
  dpr: number;
}

export function useDeviceCapabilities(): Capabilities {
  const prefersReducedMotion = useReducedMotion();
  const [caps, setCaps] = useState<Omit<Capabilities, "prefersReducedMotion">>({
    isTouch: false,
    isLowEnd: false,
    dpr: 1,
  });

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const cores = navigator.hardwareConcurrency ?? 4;
    const memory = (navigator as Navigator & { deviceMemory?: number })
      .deviceMemory;
    const isLowEnd = cores <= 4 || (memory !== undefined && memory <= 4);
    const dpr = Math.min(window.devicePixelRatio || 1, isLowEnd ? 1 : 2);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- deteccion de capabilities del cliente una sola vez tras montar
    setCaps({ isTouch, isLowEnd, dpr });
  }, []);

  return { ...caps, prefersReducedMotion };
}
