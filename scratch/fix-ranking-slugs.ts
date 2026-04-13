import "dotenv/config";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { rankings } from "../src/server/db/schema";
import { eq, isNull } from "drizzle-orm";

const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

async function fixSlugs() {
  const allRankings = await db.select().from(rankings).where(isNull(rankings.slug));

  console.log(`Found ${allRankings.length} rankings without slugs.`);

  for (const ranking of allRankings) {
    const slug = ranking.name.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-");
    await db.update(rankings).set({ slug }).where(eq(rankings.id, ranking.id));
    console.log(`Updated ranking "${ranking.name}" with slug "${slug}"`);
  }
}

fixSlugs()
  .then(() => {
    console.log("Fix completed.");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
