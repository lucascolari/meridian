import { describe, it, expect } from "vitest";
import {
  getSiteSettings,
  getServices,
  getProjects,
  getFeaturedProjects,
  getProject,
  getRelatedProjects,
} from "./index";

describe("content layer", () => {
  it("devuelve site settings con el nombre de la marca", () => {
    expect(getSiteSettings().name).toBe("MERIDIAN");
  });

  it("devuelve al menos 4 servicios", () => {
    expect(getServices().length).toBeGreaterThanOrEqual(4);
  });

  it("devuelve los proyectos ordenados por order asc", () => {
    const orders = getProjects().map((p) => p.order);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
  });

  it("featured solo incluye proyectos featured", () => {
    expect(getFeaturedProjects().every((p) => p.featured)).toBe(true);
    expect(getFeaturedProjects().length).toBeGreaterThanOrEqual(3);
  });

  it("getProject encuentra por slug y devuelve undefined si no existe", () => {
    expect(getProject("the-arrival")?.title).toBe("The Arrival");
    expect(getProject("no-existe")).toBeUndefined();
  });

  it("getRelatedProjects resuelve slugs a proyectos y descarta inexistentes", () => {
    const related = getRelatedProjects("the-arrival");
    expect(related.every((p) => typeof p.title === "string")).toBe(true);
    expect(related.find((p) => p.slug === "the-arrival")).toBeUndefined();
  });
});
