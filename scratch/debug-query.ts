import "dotenv/config";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq, asc, desc, sql } from "drizzle-orm";
import { pgTable, text, integer, timestamp, uniqueIndex, index } from "drizzle-orm/pg-core";

// Simplified schema for debugging
const games = pgTable("games", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
});

const rankings = pgTable("rankings", {
  id: text("id").primaryKey(),
  gameId: text("game_id").notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
});

const rankingEntries = pgTable("ranking_entries", {
  id: text("id").primaryKey(),
  rankingId: text("ranking_id").notNull(),
  playerId: text("player_id").notNull(),
  currentElo: integer("current_elo").notNull(),
  updatedAt: timestamp("updated_at"),
});

const players = pgTable("players", {
  id: text("id").primaryKey(),
  userId: text("user_id"),
  country: text("country"),
  primaryUsernameId: text("primary_username_id"),
});

const users = pgTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull(),
  name: text("name").notNull(),
});

const playerUsernames = pgTable("player_usernames", {
  id: text("id").primaryKey(),
  playerId: text("player_id").notNull(),
  username: text("username").notNull(),
});

const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

async function testQuery() {
  try {
    const [game] = await db.select().from(games).limit(1);
    if (!game) {
      console.log("No games found.");
      return;
    }

    console.log(`Testing query for game: ${game.name} (${game.id})`);

    const rows = await db
      .select({
        rankingId: rankings.id,
        rankingName: rankings.name,
        rankingSlug: rankings.slug,
        entryId: rankingEntries.id,
        currentElo: rankingEntries.currentElo,
        entryUpdatedAt: rankingEntries.updatedAt,
        playerId: players.id,
        country: players.country,
        primaryUsernameId: players.primaryUsernameId,
        playerUsernameId: playerUsernames.id,
        playerUsername: playerUsernames.username,
        accountUsername: users.username,
        accountName: users.name,
      })
      .from(rankings)
      .leftJoin(rankingEntries, eq(rankingEntries.rankingId, rankings.id))
      .leftJoin(players, eq(players.id, rankingEntries.playerId))
      .leftJoin(users, eq(users.id, players.userId))
      .leftJoin(playerUsernames, eq(playerUsernames.playerId, players.id))
      .where(eq(rankings.gameId, game.id))
      .orderBy(
        asc(rankings.name),
        desc(rankingEntries.currentElo),
        asc(rankingEntries.updatedAt),
        asc(players.id),
        asc(playerUsernames.username),
      );

    console.log(`Query successful. Found ${rows.length} rows.`);
  } catch (err) {
    console.error("Query failed with error:");
    console.error(err);
  }
}

testQuery()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
