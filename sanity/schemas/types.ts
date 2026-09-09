/**
 * Tipos compartidos para las definiciones de schema de Sanity.
 *
 * Deliberadamente NO importan nada del paquete `sanity` (Studio): son
 * objetos planos tipados (`name`/`type`/`fields`), consumibles desde un
 * `sanity.config.ts` de Studio (ver README, "CMS (Sanity) — cómo activar")
 * sin traer esa dependencia pesada al bundle de la app.
 */
export interface SchemaField {
  name: string;
  title?: string;
  type: string;
  of?: unknown;
  to?: unknown;
  fields?: SchemaField[];
  options?: Record<string, unknown>;
  validation?: unknown;
}

export interface SchemaDef {
  name: string;
  title?: string;
  type: string;
  fields: SchemaField[];
}
