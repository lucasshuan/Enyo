import "dotenv/config";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq, and, sql } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";

const games = pgTable("games", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull(),
});

const rankings = pgTable("rankings", {
  id: text("id").primaryKey(),
  gameId: text("game_id").notNull(),
  name: text("name").notNull(),
  slug: text("slug"),
});

const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

async function testRankingData() {
  const gameSlug = "superfighters-deluxe";
  const rankingSlug = "sa";

  console.log(`Testing getRankingData for: ${gameSlug} / ${rankingSlug}`);

  const results = await db
    .select({
      ranking: rankings,
      game: games,
    })
    .from(rankings)
    .innerJoin(games, eq(rankings.gameId, games.id))
    .where(
      and(
        eq(sql`lower(${games.slug})`, gameSlug.toLowerCase().trim()),
        eq(sql`lower(${rankings.slug})`, rankingSlug.toLowerCase().trim()),
      ),
    )
    .limit(1);

  if (results.length === 0) {
    console.log("NOT FOUND!");
    
    // Check if game exists
    const gameList = await db.select().from(games).limit(10);
    console.log("Existing Game Slugs:", gameList.map(g => g.slug));
    
    const game = gameList.find(g => g.slug.toLowerCase() === gameSlug.toLowerCase());
    console.log("Game found:", !!game);
    
    // Check if ranking exists for that game
    if (game) {
        const rankingList = await db.select().from(rankings).where(eq(rankings.gameId, game.id));
        console.log("Rankings found for game:", rankingList.length);
        rankingList.forEach((r, i) => {
            console.log(`Ranking ${i} name: "${r.name}", slug: "${r.slug}"`);
        });
    }
  } else {
    console.log("FOUND SUCCESS!");
    console.log("Ranking Name:", results[0].ranking.name);
  }
}

testRankingData()
  .then(() => process.exit(0))
  .catch((err) => {
      console.error(err);
      process.exit(1);
  });
