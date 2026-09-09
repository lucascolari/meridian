"use client";
import { useCursorContext } from "@/components/cursor/CursorProvider";

export function useCursor() {
  const { setCursor, reset } = useCursorContext();
  return { setCursor, reset };
}
