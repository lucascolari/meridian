import type { SchemaDef } from "./types";

/** Refleja `SiteSettings` (`src/types/index.ts`): name, tagline, description, email, social, chapters. */
export const siteSettings: SchemaDef = {
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    { name: "name", title: "Nombre", type: "string" },
    { name: "tagline", title: "Tagline", type: "string" },
    { name: "description", title: "Descripción", type: "text" },
    { name: "email", title: "Email", type: "string" },
    {
      name: "social",
      title: "Redes",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", title: "Label", type: "string" },
            { name: "href", title: "URL", type: "url" },
          ],
        },
      ],
    },
    {
      name: "chapters",
      title: "Capítulos (home)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "id", title: "ID", type: "string" },
            { name: "label", title: "Label", type: "string" },
          ],
        },
      ],
    },
  ],
};
