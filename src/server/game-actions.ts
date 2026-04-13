"use server";

import { db } from "@/server/db";
import { games, players, playerUsernames, rankings } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import { getServerAuthSession } from "@/server/auth";
import { hasPermission } from "@/lib/permissions";
import { revalidatePath } from "next/cache";

export async function updateGame(
  gameId: string,
  data: {
    name: string;
    description: string | null;
    backgroundImageUrl: string | null;
    thumbnailImageUrl: string | null;
    steamUrl: string | null;
  },
) {
  const session = await getServerAuthSession();
  if (!hasPermission(session, "manage_games")) throw new Error("Unauthorized");

  await db.update(games).set(data).where(eq(games.id, gameId));
  revalidatePath("/games");
  revalidatePath(`/games/${gameId}`);
  return { success: true };
}

export async function addRanking(data: {
  gameId: string;
  name: string;
  slug: string;
  description: string | null;
}) {
  const session = await getServerAuthSession();
  if (!hasPermission(session, "manage_rankings"))
    throw new Error("Unauthorized");

  await db.insert(rankings).values(data);
  
  const game = await db.query.games.findFirst({
    where: eq(games.id, data.gameId),
    columns: { slug: true }
  });

  if (game) {
    revalidatePath(`/games/${game.slug}`);
  }
  
  return { success: true };
}

export async function addPlayerToGame(
  gameId: string,
  data: {
    username: string;
    country: string | null;
    userId: string | null;
  },
) {
  const session = await getServerAuthSession();
  if (!hasPermission(session, "manage_players"))
    throw new Error("Unauthorized");

  let playerId: string | null = null;
  let wasAddedToExisting = false;

  if (data.userId) {
    const existingPlayer = await db.query.players.findFirst({
      where: and(eq(players.gameId, gameId), eq(players.userId, data.userId)),
    });

    if (existingPlayer) {
      playerId = existingPlayer.id;
      wasAddedToExisting = true;
    }
  }

  if (!playerId) {
    const [newPlayer] = await db
      .insert(players)
      .values({
        gameId,
        userId: data.userId,
        country: data.country,
      })
      .returning({ id: players.id });
    playerId = newPlayer.id;
  }

  await db.insert(playerUsernames).values({
    playerId,
    username: data.username,
  });

  revalidatePath(`/games/${gameId}`);
  return { success: true, wasAddedToExisting };
}
