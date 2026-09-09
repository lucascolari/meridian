"use client";
import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type CursorVariant = "default" | "view" | "play" | "explore" | "drag";

interface CursorState {
  variant: CursorVariant;
  label: string;
  setCursor: (variant: CursorVariant, label?: string) => void;
  reset: () => void;
}

const CursorContext = createContext<CursorState | null>(null);

export function CursorProvider({ children }: { children: ReactNode }) {
  const [variant, setVariant] = useState<CursorVariant>("default");
  const [label, setLabel] = useState("");
  const value = useMemo<CursorState>(
    () => ({
      variant,
      label,
      setCursor: (v, l = "") => { setVariant(v); setLabel(l); },
      reset: () => { setVariant("default"); setLabel(""); },
    }),
    [variant, label],
  );
  return <CursorContext.Provider value={value}>{children}</CursorContext.Provider>;
}

export function useCursorContext(): CursorState {
  const ctx = useContext(CursorContext);
  if (!ctx) throw new Error("useCursor must be used within CursorProvider");
  return ctx;
}
