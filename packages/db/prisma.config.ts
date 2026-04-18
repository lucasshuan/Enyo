import { readFileSync } from "node:fs";
import path from "node:path";
import { defineConfig } from "prisma/config";

// Auto-load apps/api/.env when DATABASE_URL is not already set in the environment.
// This makes `pnpm db:migrate <name>` work from the monorepo root without extra tooling.
if (!process.env.DATABASE_URL) {
  const envPath = path.resolve(__dirname, "../../apps/api/.env");
  try {
    const lines = readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const match = line.match(/^([^#=][^=]*)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const val = match[2].trim().replace(/^"(.*)"$/, "$1");
        if (!process.env[key]) process.env[key] = val;
      }
    }
  } catch {
    // env file not present (e.g. CI), rely on environment variables directly
  }
}

const prismaGenerateUrl =
  process.env.DATABASE_URL ??
  "postgresql://prisma:prisma@127.0.0.1:5432/prisma";

export default defineConfig({
  schema: path.join(__dirname, "prisma/schema.prisma"),
  migrations: {
    path: path.join(__dirname, "prisma/migrations"),
    seed: "node --env-file=.env --import tsx ./prisma/seed.ts",
  },
  datasource: {
    // Prisma Client generation does not need a live database connection.
    url: prismaGenerateUrl,
  },
});
