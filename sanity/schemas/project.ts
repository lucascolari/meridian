import type { SchemaDef } from "./types";

/**
 * Refleja `Project` (`src/types/index.ts`) más los campos de spec (§8):
 * title, slug, client, year, category, description, heroMedia, gallery,
 * images, videos, services, credits, awards, relatedProjects.
 */
export const project: SchemaDef = {
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    { name: "title", title: "Título", type: "string" },
    { name: "slug", title: "Slug", type: "slug" },
    { name: "client", title: "Cliente", type: "reference", to: [{ type: "client" }] },
    { name: "year", title: "Año", type: "number" },
    {
      name: "category",
      title: "Categoría",
      type: "string",
      options: { list: ["branding", "digital", "motion", "spatial"] },
    },
    { name: "excerpt", title: "Extracto", type: "text" },
    { name: "description", title: "Descripción", type: "text" },
    { name: "heroMedia", title: "Media principal", type: "media" },
    {
      name: "gallery",
      title: "Galería",
      type: "array",
      of: [{ type: "media" }],
    },
    {
      name: "images",
      title: "Imágenes",
      type: "array",
      of: [{ type: "media" }],
    },
    {
      name: "videos",
      title: "Videos",
      type: "array",
      of: [{ type: "media" }],
    },
    {
      name: "services",
      title: "Servicios",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "credits",
      title: "Créditos",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "role", title: "Rol", type: "string" },
            { name: "name", title: "Nombre", type: "string" },
          ],
        },
      ],
    },
    {
      name: "awards",
      title: "Premios",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", title: "Título", type: "string" },
            { name: "org", title: "Organización", type: "string" },
            { name: "year", title: "Año", type: "number" },
          ],
        },
      ],
    },
    {
      name: "relatedProjects",
      title: "Proyectos relacionados",
      type: "array",
      of: [{ type: "reference", to: [{ type: "project" }] }],
    },
    { name: "featured", title: "Destacado", type: "boolean" },
    { name: "order", title: "Orden", type: "number" },
  ],
};
