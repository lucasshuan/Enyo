"use server";

import { getClient } from "@/lib/apollo/apollo-client";
import { GET_GAME_ACTIONS } from "@/lib/apollo/queries/games";
import {
  APPROVE_GAME,
  CREATE_GAME,
  UPDATE_GAME,
} from "@/lib/apollo/queries/game-mutations";
import {
  UpdateGameMutation,
  CreateGameMutation,
  ApproveGameMutation,
  AddPlayerToGameMutation,
  SearchPlayersQuery,
  RequestUploadUrlDocument,
  GetGameActionsQuery,
} from "@/lib/apollo/generated/graphql";
import { getServerAuthSession } from "@/auth";
import {
  canEditGame,
  canManageGames,
  canManagePlayers,
  canManageLeagues,
} from "@/lib/permissions";
import { revalidatePath } from "next/cache";
import { normalizeOptionalText, slugify } from "@/lib/utils";
import { createSafeAction } from "@/lib/action-utils";

import {
  ADD_PLAYER_TO_ELO_LEAGUE,
  CREATE_ELO_LEAGUE,
  REGISTER_SELF_TO_ELO_LEAGUE,
  UPDATE_ELO_LEAGUE,
} from "@/lib/apollo/queries/elo-league-mutations";
import {
  ADD_PLAYER_TO_STANDARD_LEAGUE,
  CREATE_STANDARD_LEAGUE,
  REGISTER_SELF_TO_STANDARD_LEAGUE,
  UPDATE_STANDARD_LEAGUE,
} from "@/lib/apollo/queries/standard-league-mutations";
import {
  ADD_PLAYER_TO_GAME,
  SEARCH_PLAYERS,
} from "@/lib/apollo/queries/player-mutations";

async function getGameRecord(gameIdOrSlug: string) {
  const { data } = await getClient().query<GetGameActionsQuery>({
    query: GET_GAME_ACTIONS,
    variables: { slug: gameIdOrSlug },
  });
  return data?.game;
}

function revalidateGamePaths(game: { slug: string }) {
  revalidatePath("/");
  revalidatePath("/games");
  revalidatePath(`/games/${game.slug}`);
}

export const requestUploadUrl = createSafeAction(
  "requestUploadUrl",
  async (filename: string, contentType: string) => {
    const session = await getServerAuthSession();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const { data } = await getClient().mutate({
      mutation: RequestUploadUrlDocument,
      variables: { filename, contentType },
    });

    if (!data?.requestUploadUrl) throw new Error("Failed to get upload URL");
    return data.requestUploadUrl;
  },
);

export const updateGame = createSafeAction(
  "updateGame",
  async (
    gameId: string,
    data: {
      name: string;
      slug: string;
      description: string | null;
      backgroundImageUrl: string | null;
      thumbnailImageUrl: string | null;
      steamUrl: string | null;
      websiteUrl: string | null;
    },
  ) => {
    const session = await getServerAuthSession();
    const { data: gameData } = await getClient().query<GetGameActionsQuery>({
      query: GET_GAME_ACTIONS,
      variables: { slug: gameId },
    });
    const game = gameData?.game;

    if (!game) {
      throw new Error("Game not found");
    }

    if (!canEditGame(session, game.authorId)) {
      throw new Error("Unauthorized");
    }

    const { data: result } = await getClient().mutate<UpdateGameMutation>({
      mutation: UPDATE_GAME,
      variables: {
        id: game.id,
        input: {
          name: data.name.trim(),
          slug: data.slug.trim(),
          description: normalizeOptionalText(data.description),
          backgroundImageUrl: normalizeOptionalText(data.backgroundImageUrl),
          thumbnailImageUrl: normalizeOptionalText(data.thumbnailImageUrl),
          steamUrl: normalizeOptionalText(data.steamUrl),
          websiteUrl: normalizeOptionalText(data.websiteUrl),
        },
      },
    });

    if (result?.updateGame) {
      revalidateGamePaths(result.updateGame);
    }
    return true;
  },
);

export const createGame = createSafeAction(
  "createGame",
  async (data: {
    name: string;
    slug: string;
    description: string | null;
    backgroundImageUrl: string | null;
    thumbnailImageUrl: string | null;
    steamUrl: string | null;
    websiteUrl: string | null;
  }) => {
    const session = await getServerAuthSession();

    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const name = data.name.trim();
    const slug = slugify(data.slug || data.name);

    if (!name || !slug) {
      throw new Error("Invalid game data");
    }

    const { data: result } = await getClient().mutate<CreateGameMutation>({
      mutation: CREATE_GAME,
      variables: {
        input: {
          name,
          slug,
          description: normalizeOptionalText(data.description),
          backgroundImageUrl: normalizeOptionalText(data.backgroundImageUrl),
          thumbnailImageUrl: normalizeOptionalText(data.thumbnailImageUrl),
          steamUrl: normalizeOptionalText(data.steamUrl),
          websiteUrl: normalizeOptionalText(data.websiteUrl),
          authorId: session.user.id,
        },
      },
    });

    if (result?.createGame) {
      revalidateGamePaths(result.createGame);
    }

    return {
      game: result?.createGame,
      status: result?.createGame.status,
    };
  },
);

export const approveGame = createSafeAction(
  "approveGame",
  async (gameId: string) => {
    const session = await getServerAuthSession();

    if (!canManageGames(session)) {
      throw new Error("Unauthorized");
    }

    const { data: result } = await getClient().mutate<ApproveGameMutation>({
      mutation: APPROVE_GAME,
      variables: { id: gameId },
    });

    if (result?.approveGame) {
      // We need the slug for revalidation, so we might need a better approve mutation or a query
      // For now, let's assume we can get it or just revalidate general paths
      revalidatePath("/");
      revalidatePath("/games");
    }

    return true;
  },
);

export const addEloLeague = createSafeAction(
  "addEloLeague",
  async (data: {
    gameId?: string;
    gameName?: string;
    name: string;
    slug: string;
    description: string | null;
    about?: string | null;
    initialElo: number;
    allowDraw: boolean;
    kFactor: number;
    scoreRelevance: number;
    inactivityDecay: number;
    inactivityThresholdHours: number;
    inactivityDecayFloor: number;
    allowedFormats: string[];
    participationMode: string;
  }) => {
    const session = await getServerAuthSession();
    if (!session?.user?.id) throw new Error("Unauthorized");

    let game = null;
    if (data.gameId) {
      game = await getGameRecord(data.gameId);
    }

    await getClient().mutate({
      mutation: CREATE_ELO_LEAGUE,
      variables: {
        event: {
          gameId: data.gameId,
          gameName: data.gameName,
          name: data.name,
          slug: data.slug,
          description: data.description,
          about: data.about,
          participationMode: data.participationMode,
        },
        league: {
          initialElo: data.initialElo,
          allowDraw: data.allowDraw,
          kFactor: data.kFactor,
          scoreRelevance: data.scoreRelevance,
          inactivityDecay: data.inactivityDecay,
          inactivityThresholdHours: data.inactivityThresholdHours,
          inactivityDecayFloor: data.inactivityDecayFloor,
          allowedFormats: data.allowedFormats,
        },
      },
    });

    if (game) {
      revalidateGamePaths(game);
    } else {
      revalidatePath("/");
      revalidatePath("/games");
    }

    return true;
  },
);

export const addStandardLeague = createSafeAction(
  "addStandardLeague",
  async (data: {
    gameId?: string;
    gameName?: string;
    name: string;
    slug: string;
    description: string | null;
    about?: string | null;
    allowDraw: boolean;
    pointsPerWin: number;
    pointsPerDraw: number;
    pointsPerLoss: number;
    allowedFormats: string[];
    participationMode: string;
  }) => {
    const session = await getServerAuthSession();
    if (!session?.user?.id) throw new Error("Unauthorized");

    let game = null;
    if (data.gameId) {
      game = await getGameRecord(data.gameId);
    }

    await getClient().mutate({
      mutation: CREATE_STANDARD_LEAGUE,
      variables: {
        event: {
          gameId: data.gameId,
          gameName: data.gameName,
          name: data.name,
          slug: data.slug,
          description: data.description,
          about: data.about,
          participationMode: data.participationMode,
        },
        league: {
          allowDraw: data.allowDraw,
          pointsPerWin: data.pointsPerWin,
          pointsPerDraw: data.pointsPerDraw,
          pointsPerLoss: data.pointsPerLoss,
          allowedFormats: data.allowedFormats,
        },
      },
    });

    if (game) {
      revalidateGamePaths(game);
    } else {
      revalidatePath("/");
      revalidatePath("/games");
    }

    return true;
  },
);

export const checkLeagueSlugAvailability = createSafeAction(
  "checkLeagueSlugAvailability",
  async (gameIdOrSlug: string, slug: string, currentLeagueId?: string) => {
    const normalizedSlug = slugify(slug);

    if (!gameIdOrSlug || !normalizedSlug) {
      return { available: true };
    }

    const game = await getGameRecord(gameIdOrSlug);

    if (!game) {
      return { available: true };
    }

    const conflict = [
      ...(game.eloLeagues ?? []),
      ...(game.standardLeagues ?? []),
    ].some(
      (league) =>
        league.event.slug === normalizedSlug && league.id !== currentLeagueId,
    );

    return { available: !conflict };
  },
);

export const addPlayerToGame = createSafeAction(
  "addPlayerToGame",
  async (
    gameId: string,
    data: {
      username: string;
      userId: string | null;
    },
  ) => {
    const session = await getServerAuthSession();
    if (!canManagePlayers(session)) throw new Error("Unauthorized");

    const game = await getGameRecord(gameId);
    if (!game) throw new Error("Game not found");

    const { data: resultData } =
      await getClient().mutate<AddPlayerToGameMutation>({
        mutation: ADD_PLAYER_TO_GAME,
        variables: {
          input: {
            gameId,
            username: data.username,
            userId: data.userId,
          },
        },
      });

    revalidateGamePaths(game);
    return { playerId: resultData?.addPlayerToGame.id };
  },
);

export const createAndAddPlayerToEloLeague = createSafeAction(
  "createAndAddPlayerToEloLeague",
  async (gameId: string, leagueId: string, username: string) => {
    const result = await addPlayerToGame(gameId, { username, userId: null });

    if (result.success && result.data?.playerId) {
      const addResult = await addPlayerToEloLeague(
        leagueId,
        result.data.playerId,
      );
      return addResult.data;
    }

    throw new Error(result.error || "Failed to add player to league");
  },
);

export const createAndAddPlayerToStandardLeague = createSafeAction(
  "createAndAddPlayerToStandardLeague",
  async (gameId: string, leagueId: string, username: string) => {
    const result = await addPlayerToGame(gameId, { username, userId: null });

    if (result.success && result.data?.playerId) {
      const addResult = await addPlayerToStandardLeague(
        leagueId,
        result.data.playerId,
      );
      return addResult.data;
    }

    throw new Error(result.error || "Failed to add player to league");
  },
);

export const updateEloLeague = createSafeAction(
  "updateEloLeague",
  async (
    leagueId: string,
    data: {
      name: string;
      slug: string;
      description: string | null;
      about?: string | null;
      initialElo: number;
      allowDraw: boolean;
      kFactor: number;
      scoreRelevance: number;
      inactivityDecay: number;
      inactivityThresholdHours: number;
      inactivityDecayFloor: number;
      allowedFormats: string[];
    },
  ) => {
    const session = await getServerAuthSession();
    if (!canManageLeagues(session)) throw new Error("Unauthorized");

    await getClient().mutate({
      mutation: UPDATE_ELO_LEAGUE,
      variables: {
        id: leagueId,
        event: {
          name: data.name,
          slug: data.slug,
          description: data.description,
          about: data.about,
        },
        league: {
          initialElo: data.initialElo,
          allowDraw: data.allowDraw,
          kFactor: data.kFactor,
          scoreRelevance: data.scoreRelevance,
          inactivityDecay: data.inactivityDecay,
          inactivityThresholdHours: data.inactivityThresholdHours,
          inactivityDecayFloor: data.inactivityDecayFloor,
          allowedFormats: data.allowedFormats,
        },
      },
    });

    revalidatePath("/");
    return true;
  },
);

export const updateStandardLeague = createSafeAction(
  "updateStandardLeague",
  async (
    leagueId: string,
    data: {
      name: string;
      slug: string;
      description: string | null;
      about?: string | null;
      allowDraw: boolean;
      pointsPerWin: number;
      pointsPerDraw: number;
      pointsPerLoss: number;
      allowedFormats: string[];
    },
  ) => {
    const session = await getServerAuthSession();
    if (!canManageLeagues(session)) throw new Error("Unauthorized");

    await getClient().mutate({
      mutation: UPDATE_STANDARD_LEAGUE,
      variables: {
        id: leagueId,
        event: {
          name: data.name,
          slug: data.slug,
          description: data.description,
          about: data.about,
        },
        league: {
          allowDraw: data.allowDraw,
          pointsPerWin: data.pointsPerWin,
          pointsPerDraw: data.pointsPerDraw,
          pointsPerLoss: data.pointsPerLoss,
          allowedFormats: data.allowedFormats,
        },
      },
    });

    revalidatePath("/");
    return true;
  },
);

export const searchPlayersByGame = createSafeAction(
  "searchPlayersByGame",
  async (gameId: string, query: string) => {
    const session = await getServerAuthSession();
    if (!canManagePlayers(session)) throw new Error("Unauthorized");

    const { data } = await getClient().query<SearchPlayersQuery>({
      query: SEARCH_PLAYERS,
      variables: { gameId, query },
    });

    return (data?.searchPlayers.nodes || [])
      .filter((r) => !!r.player?.id)
      .map((r) => ({
        id: r.player!.id,
        username: r.username,
        country: r.player?.user?.country ?? null,
      }));
  },
);

export const addPlayerToEloLeague = createSafeAction(
  "addPlayerToEloLeague",
  async (leagueId: string, playerId: string, initialElo?: number) => {
    const session = await getServerAuthSession();
    if (!canManagePlayers(session)) throw new Error("Unauthorized");

    await getClient().mutate({
      mutation: ADD_PLAYER_TO_ELO_LEAGUE,
      variables: { leagueId, playerId, initialElo },
    });

    revalidatePath("/");
    return true;
  },
);

export const addPlayerToStandardLeague = createSafeAction(
  "addPlayerToStandardLeague",
  async (leagueId: string, playerId: string) => {
    const session = await getServerAuthSession();
    if (!canManagePlayers(session)) throw new Error("Unauthorized");

    await getClient().mutate({
      mutation: ADD_PLAYER_TO_STANDARD_LEAGUE,
      variables: { leagueId, playerId },
    });

    revalidatePath("/");
    return true;
  },
);

export const registerSelfToEloLeague = createSafeAction(
  "registerSelfToEloLeague",
  async (leagueId: string) => {
    const session = await getServerAuthSession();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await getClient().mutate({
      mutation: REGISTER_SELF_TO_ELO_LEAGUE,
      variables: { leagueId },
    });

    revalidatePath("/");
    return true;
  },
);

export const registerSelfToStandardLeague = createSafeAction(
  "registerSelfToStandardLeague",
  async (leagueId: string) => {
    const session = await getServerAuthSession();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await getClient().mutate({
      mutation: REGISTER_SELF_TO_STANDARD_LEAGUE,
      variables: { leagueId },
    });

    revalidatePath("/");
    return true;
  },
);
