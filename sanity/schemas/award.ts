import type { SchemaDef } from "./types";

/** Refleja `Award` (`src/types/index.ts`): title, org, year. */
export const award: SchemaDef = {
  name: "award",
  title: "Award",
  type: "document",
  fields: [
    { name: "title", title: "Título", type: "string" },
    { name: "org", title: "Organización", type: "string" },
    { name: "year", title: "Año", type: "number" },
  ],
};
