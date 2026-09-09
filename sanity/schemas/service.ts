import type { SchemaDef } from "./types";

/** Refleja `Service` (`src/types/index.ts`): id, title, summary, capabilities. */
export const service: SchemaDef = {
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    { name: "id", title: "ID", type: "slug" },
    { name: "title", title: "Título", type: "string" },
    { name: "summary", title: "Resumen", type: "text" },
    {
      name: "capabilities",
      title: "Capacidades",
      type: "array",
      of: [{ type: "string" }],
    },
  ],
};
