/**
 * Conexión a la Base de Datos con Drizzle ORM
 *
 * - Producción (Vercel): Usa Turso (LibSQL en la nube)
 * - Desarrollo local: Usa SQLite local con better-sqlite3
 */

import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

// En Astro, las variables de entorno del servidor se acceden con import.meta.env
const TURSO_DATABASE_URL = import.meta.env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN = import.meta.env.TURSO_AUTH_TOKEN;

// Cliente de LibSQL (Turso en producción, SQLite local en desarrollo)
const client = createClient({
  url: TURSO_DATABASE_URL || "file:yishaq.db",
  authToken: TURSO_AUTH_TOKEN,
});

// Crear instancia de Drizzle con el esquema
export const db = drizzle(client, { schema });

// Exportar el esquema para uso en queries
export * from "./schema";
