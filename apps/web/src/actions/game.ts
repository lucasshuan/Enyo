"use server";

import { getClient } from "@/lib/apollo/apollo-client";
import { GET_GAME_ACTIONS, CHECK_GAME_SLUG } from "@/lib/apollo/queries/games";
import {
  APPROVE_GAME,
  CREATE_GAME,
  UPDATE_GAME,
  DELETE_GAME,
} from "@/lib/apollo/queries/game-mutations";
import {
  CREATE_LEAGUE,
  UPDATE_LEAGUE,
} from "@/lib/apollo/queries/league-mutations";
import { CHECK_EVENT_SLUG } from "@/lib/apollo/queries/leagues";
import {
  UpdateGameMutation,
  CreateGameMutation,
  ApproveGameMutation,
  RequestUploadUrlDocument,
  GetGameActionsQuery,
} from "@/lib/apollo/generated/graphql";
import { getServerAuthSession } from "@/auth";
import {
  canEditGame,
  canManageGames,
  canManageLeagues,
} from "@/lib/permissions";
import { revalidatePath } from "next/cache";
import { normalizeOptionalText, slugify } from "@/lib/utils";
import { createSafeAction } from "@/lib/action-utils";

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
      backgroundImagePath: string | null;
      thumbnailImagePath: string | null;
      steamUrl: string | null;
      websiteUrl: string | null;
    },
  ) => {
    const session = await getServerAuthSession();
    if (!session?.user?.id) throw new Error("Unauthorized");

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
          backgroundImagePath: normalizeOptionalText(data.backgroundImagePath),
          thumbnailImagePath: normalizeOptionalText(data.thumbnailImagePath),
          steamUrl: normalizeOptionalText(data.steamUrl),
          websiteUrl: normalizeOptionalText(data.websiteUrl),
        },
      },
    });

    if (result?.updateGame) {
      revalidateGamePaths(result.updateGame);
    }
    return { slug: result?.updateGame?.slug ?? "" };
  },
);

export const createGame = createSafeAction(
  "createGame",
  async (data: {
    name: string;
    slug: string;
    description: string | null;
    backgroundImagePath: string | null;
    thumbnailImagePath: string | null;
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
          backgroundImagePath: normalizeOptionalText(data.backgroundImagePath),
          thumbnailImagePath: normalizeOptionalText(data.thumbnailImagePath),
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

export const createLeague = createSafeAction(
  "createLeague",
  async (data: {
    gameId?: string;
    gameName?: string;
    name: string;
    slug: string;
    description: string | null;
    about?: string | null;
    participationMode?: string;
    status?: string;
    visibility?: string;
    registrationsEnabled?: boolean;
    registrationStartDate?: Date | null;
    registrationEndDate?: Date | null;
    maxParticipants?: number | null;
    requiresApproval?: boolean;
    waitlistEnabled?: boolean;
    officialLinks?: unknown;
    startDate?: Date | null;
    endDate?: Date | null;
    classificationSystem: string;
    config: unknown;
    allowDraw?: boolean;
    allowedFormats?: string[];
    customFieldSchema?: unknown;
    staff?: Array<{ userId: string; role: string }>;
    participants?: Array<{ displayName: string; userId?: string }>;
  }) => {
    const session = await getServerAuthSession();
    if (!session?.user?.id) throw new Error("Unauthorized");

    let game = null;
    if (data.gameId) {
      game = await getGameRecord(data.gameId);
    }

    await getClient().mutate({
      mutation: CREATE_LEAGUE,
      variables: {
        event: {
          gameId: data.gameId,
          gameName: data.gameName,
          name: data.name,
          slug: data.slug,
          description: data.description,
          about: data.about,
          participationMode: data.participationMode,
          status: data.status,
          visibility: data.visibility,
          registrationsEnabled: data.registrationsEnabled,
          registrationStartDate: data.registrationStartDate,
          registrationEndDate: data.registrationEndDate,
          maxParticipants: data.maxParticipants,
          requiresApproval: data.requiresApproval,
          waitlistEnabled: data.waitlistEnabled,
          officialLinks: data.officialLinks,
          startDate: data.startDate,
          endDate: data.endDate,
        },
        league: {
          classificationSystem: data.classificationSystem,
          config: data.config,
          allowDraw: data.allowDraw,
          allowedFormats: data.allowedFormats,
          customFieldSchema: data.customFieldSchema,
        },
        staff: data.staff,
        participants: data.participants,
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

export const checkGameSlugAvailability = createSafeAction(
  "checkGameSlugAvailability",
  async (slug: string, excludeId?: string) => {
    if (!slug) return { available: true };
    const result = await getClient().query<{ checkGameSlug: boolean }>({
      query: CHECK_GAME_SLUG,
      variables: { slug, excludeId },
      fetchPolicy: "no-cache",
    });
    return { available: result.data?.checkGameSlug ?? true };
  },
);

export const checkLeagueSlugAvailability = createSafeAction(
  "checkLeagueSlugAvailability",
  async (gameId: string, slug: string, excludeEventId?: string) => {
    if (!gameId || !slug) return { available: true };
    const result = await getClient().query<{ checkEventSlug: boolean }>({
      query: CHECK_EVENT_SLUG,
      variables: { gameId, slug, excludeEventId },
      fetchPolicy: "no-cache",
    });
    return { available: result.data?.checkEventSlug ?? true };
  },
);

export const updateLeague = createSafeAction(
  "updateLeague",
  async (
    eventId: string,
    data: {
      name?: string;
      slug?: string;
      description?: string | null;
      about?: string | null;
      startDate?: Date | null;
      endDate?: Date | null;
      registrationStartDate?: Date | null;
      registrationEndDate?: Date | null;
      classificationSystem?: string;
      config?: unknown;
      allowDraw?: boolean;
      allowedFormats?: string[];
      customFieldSchema?: unknown;
    },
  ) => {
    const session = await getServerAuthSession();
    if (!canManageLeagues(session)) throw new Error("Unauthorized");

    await getClient().mutate({
      mutation: UPDATE_LEAGUE,
      variables: {
        eventId,
        event: {
          name: data.name,
          slug: data.slug,
          description: data.description,
          about: data.about,
          startDate: data.startDate,
          endDate: data.endDate,
          registrationStartDate: data.registrationStartDate,
          registrationEndDate: data.registrationEndDate,
        },
        league: {
          classificationSystem: data.classificationSystem,
          config: data.config,
          allowDraw: data.allowDraw,
          allowedFormats: data.allowedFormats,
          customFieldSchema: data.customFieldSchema,
        },
      },
    });

    revalidatePath("/");
    return true;
  },
);

export const deleteGame = createSafeAction(
  "deleteGame",
  async (gameSlug: string) => {
    const session = await getServerAuthSession();
    const game = await getGameRecord(gameSlug);
    if (!game) throw new Error("Game not found");
    if (!canEditGame(session, game.authorId)) throw new Error("Unauthorized");

    await getClient().mutate({
      mutation: DELETE_GAME,
      variables: { id: game.id },
    });

    revalidatePath("/");
    revalidatePath("/games");
  },
);
