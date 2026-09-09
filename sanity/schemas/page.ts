import type { SchemaDef } from "./types";

/** Página de contenido libre (ej. legal, landing puntual) — fuera de los tipos de dominio fijos. */
export const page: SchemaDef = {
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    { name: "title", title: "Título", type: "string" },
    { name: "slug", title: "Slug", type: "slug" },
    {
      name: "body",
      title: "Contenido",
      type: "array",
      of: [{ type: "block" }],
    },
  ],
};
