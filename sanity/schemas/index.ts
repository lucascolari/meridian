import { project } from "./project";
import { service } from "./service";
import { siteSettings } from "./siteSettings";
import { page } from "./page";
import { media } from "./media";
import { award } from "./award";
import { teamMember } from "./teamMember";
import { client } from "./client";
import type { SchemaDef, SchemaField } from "./types";

export type { SchemaDef, SchemaField };
export { project, service, siteSettings, page, media, award, teamMember, client };

/**
 * Array consumido por un `sanity.config.ts` de Studio, ej.:
 *
 *   import { schemaTypes } from "./sanity/schemas";
 *   export default defineConfig({ schema: { types: schemaTypes }, ... });
 *
 * Ver README, sección "CMS (Sanity) — cómo activar".
 */
export const schemaTypes: SchemaDef[] = [
  project,
  service,
  siteSettings,
  page,
  media,
  award,
  teamMember,
  client,
];
