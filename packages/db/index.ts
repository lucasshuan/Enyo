export * from "./schema.js";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";

export const createDatabaseClient = (databaseUrl: string) => {
  const queryClient = postgres(databaseUrl);
  return drizzle(queryClient, { schema });
};

export type DatabaseClient = ReturnType<typeof createDatabaseClient>;
