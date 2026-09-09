import { createClient, type SanityClient } from "@sanity/client";

const API_VERSION = "2024-01-01";
const DATASET = "production";

/**
 * Devuelve un cliente de Sanity configurado, o `null` si no hay proyecto
 * configurado (Sanity dormido por defecto). El dataset puede overridearse
 * con `NEXT_PUBLIC_SANITY_DATASET`; si no está seteado usa "production".
 */
export function getSanityClient(): SanityClient | null {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (!projectId) return null;

  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || DATASET;

  return createClient({
    projectId,
    dataset,
    apiVersion: API_VERSION,
    useCdn: true,
  });
}
