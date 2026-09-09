import type { SchemaDef } from "./types";

/**
 * `media` es un objeto embebido (no documento propio): se usa dentro de
 * `project.heroMedia` / `project.gallery`, reflejando la interfaz `Media`
 * de `src/types/index.ts` (src, alt, width, height, kind, poster).
 */
export const media: SchemaDef = {
  name: "media",
  title: "Media",
  type: "object",
  fields: [
    { name: "src", title: "Archivo", type: "image" },
    { name: "alt", title: "Texto alternativo", type: "string" },
    { name: "width", title: "Ancho", type: "number" },
    { name: "height", title: "Alto", type: "number" },
    {
      name: "kind",
      title: "Tipo",
      type: "string",
      options: { list: ["image", "video"] },
    },
    { name: "poster", title: "Poster (video)", type: "image" },
  ],
};
