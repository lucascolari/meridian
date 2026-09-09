import type { SchemaDef } from "./types";

/** Refleja `TeamMember` (`src/types/index.ts`): name, role. */
export const teamMember: SchemaDef = {
  name: "teamMember",
  title: "Team Member",
  type: "document",
  fields: [
    { name: "name", title: "Nombre", type: "string" },
    { name: "role", title: "Rol", type: "string" },
    { name: "photo", title: "Foto", type: "image" },
  ],
};
