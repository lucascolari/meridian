import type { SchemaDef } from "./types";

/** Cliente (empresa) referenciado desde `project.client`. */
export const client: SchemaDef = {
  name: "client",
  title: "Client",
  type: "document",
  fields: [
    { name: "name", title: "Nombre", type: "string" },
    { name: "logo", title: "Logo", type: "image" },
    { name: "website", title: "Sitio web", type: "url" },
  ],
};
