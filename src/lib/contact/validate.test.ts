import { describe, it, expect } from "vitest";
import { validateContact } from "./validate";

describe("validateContact", () => {
  it("acepta input válido", () => {
    const r = validateContact({ name: "Ada", email: "ada@studio.com", message: "I would like to talk about a brand." });
    expect(r.ok).toBe(true);
    expect(r.errors).toEqual({});
  });
  it("rechaza email inválido", () => {
    const r = validateContact({ name: "Ada", email: "nope", message: "A sufficiently long message here." });
    expect(r.ok).toBe(false);
    expect(r.errors.email).toBeTruthy();
  });
  it("rechaza name corto y message corto", () => {
    const r = validateContact({ name: "A", email: "ada@studio.com", message: "short" });
    expect(r.ok).toBe(false);
    expect(r.errors.name).toBeTruthy();
    expect(r.errors.message).toBeTruthy();
  });
  it("rechaza campos ausentes", () => {
    const r = validateContact({});
    expect(r.ok).toBe(false);
    expect(Object.keys(r.errors).length).toBe(3);
  });
});
