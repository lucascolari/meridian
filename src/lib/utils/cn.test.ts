import { describe, it, expect } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("junta clases truthy separadas por espacio", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });
  it("descarta valores falsy", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });
  it("devuelve string vacío sin argumentos válidos", () => {
    expect(cn(false, null)).toBe("");
  });
});
