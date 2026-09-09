import { describe, it, expect } from "vitest";
import { mapProgress } from "./progress";

describe("mapProgress", () => {
  it("progreso 0 → par (0,1) t=0", () => {
    expect(mapProgress(0, 5)).toEqual({ from: 0, to: 1, t: 0 });
  });
  it("progreso 1 → último par con t=1", () => {
    expect(mapProgress(1, 5)).toEqual({ from: 3, to: 4, t: 1 });
  });
  it("progreso medio en 3 imágenes → (1,2) t=0", () => {
    expect(mapProgress(0.5, 3)).toEqual({ from: 1, to: 2, t: 0 });
  });
  it("clampa fuera de rango", () => {
    expect(mapProgress(-1, 4)).toEqual({ from: 0, to: 1, t: 0 });
    expect(mapProgress(2, 4)).toEqual({ from: 2, to: 3, t: 1 });
  });
  it("count<=1 → par (0,0) t=0", () => {
    expect(mapProgress(0.7, 1)).toEqual({ from: 0, to: 0, t: 0 });
  });
});
