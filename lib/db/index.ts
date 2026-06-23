import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

type Db = NeonHttpDatabase<typeof schema>;

// Local development: when LOCAL_DB_PATH is set, run against an in-process
// PGlite database instead of Neon. Keeps the production Neon HTTP path
// untouched. The instance is cached on globalThis so it survives the dev
// server's module reloads (HMR) and shares a single connection.
async function createLocalDb(path: string): Promise<Db> {
  const { PGlite } = await import("@electric-sql/pglite");
  const { drizzle: drizzlePglite } = await import("drizzle-orm/pglite");
  const g = globalThis as unknown as { __pgliteClient?: InstanceType<typeof PGlite> };
  const client = g.__pgliteClient ?? (g.__pgliteClient = new PGlite(path));
  return drizzlePglite(client, { schema }) as unknown as Db;
}

function createNeonDb(): Db {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set");
  }
  return drizzle(neon(databaseUrl), { schema });
}

const localPath = process.env.LOCAL_DB_PATH;
export const db: Db = localPath ? await createLocalDb(localPath) : createNeonDb();
