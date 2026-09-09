import { describe, it, expect } from "vitest";
import { splitIntoWords } from "./text";

describe("splitIntoWords", () => {
  it("divide por espacios y descarta vacíos", () => {
    expect(splitIntoWords("We build iconic")).toEqual(["We", "build", "iconic"]);
  });
  it("colapsa espacios múltiples", () => {
    expect(splitIntoWords("  a   b ")).toEqual(["a", "b"]);
  });
  it("string vacío → array vacío", () => {
    expect(splitIntoWords("   ")).toEqual([]);
  });
});
