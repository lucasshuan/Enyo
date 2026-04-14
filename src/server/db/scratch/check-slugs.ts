import "dotenv/config";
import { db } from "../client";
import { games, rankings } from "../schema";
import { eq, sql } from "drizzle-orm";

async function check() {
  console.log("--- Investigating Game Slugs ---");
  const gameResults = await db
    .select({
      id: games.id,
      name: games.name,
      slug: games.slug,
      status: games.status,
    })
    .from(games);
  
  console.table(gameResults);

  console.log("\n--- Investigating Ranking Slugs ---");
  const rankingResults = await db
    .select({
      id: rankings.id,
      gameId: rankings.gameId,
      name: rankings.name,
      slug: rankings.slug,
      isApproved: rankings.isApproved,
      allowDraw: rankings.allowDraw,
      ratingSystem: rankings.ratingSystem,
    })
    .from(rankings);
  
  console.table(rankingResults);

  const targetGame = "superfighters-deluxe";
  const targetRanking = "sa";

  const specificCheck = await db
    .select({
      rankingName: rankings.name,
      rankingSlug: rankings.slug,
      gameName: games.name,
      gameStatus: games.status,
      gameId: games.id
    })
    .from(rankings)
    .innerJoin(games, eq(rankings.gameId, games.id))
    .where(
      sql`lower(${games.slug}) = ${targetGame.toLowerCase()} AND lower(${rankings.slug}) = ${targetRanking.toLowerCase()}`
    );

  console.log("\n--- Specific Check Result ---");
  console.log(specificCheck);
}

check().catch(console.error);
