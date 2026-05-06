"use server";

import { getClient } from "@/lib/apollo/apollo-client";
import { CHECK_EVENT_SLUG } from "@/lib/apollo/queries/leagues";
import {
  CREATE_LEAGUE,
  UPDATE_LEAGUE,
  DELETE_LEAGUE,
} from "@/lib/apollo/queries/league-mutations";
import { getServerAuthSession } from "@/auth";
import { canManageLeagues } from "@/lib/server/permissions";
import { revalidatePath, revalidateTag } from "next/cache";
import { createSafeAction } from "@/lib/utils/action-utils";

// ─── Internal helpers ────────────────────────────────────────────────────────

function revalidateAfterEventMutation(gameSlug?: string) {
  revalidatePath("/");
  revalidateTag("events", {});
  revalidateTag("games", {});
  if (gameSlug) {
    revalidatePath(`/games/${gameSlug}`);
    revalidatePath(`/games/${gameSlug}/events`);
  }
}

// ─── Events ───────────────────────────────────────────────────────────────────

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
    thumbnailImagePath?: string | null;
    classificationSystem: string;
    config: unknown;
    allowDraw?: boolean;
    allowedFormats?: string[];
    customFieldSchema?: unknown;
    staff?: Array<{
      userId: string;
      capabilities?: string[];
      isFullAccess?: boolean;
    }>;
    participants?: Array<{ displayName: string; userId?: string }>;
  }) => {
    const session = await getServerAuthSession();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const result = await getClient().mutate<{
      createLeague?: {
        event?: {
          game?: {
            slug?: string | null;
          } | null;
        } | null;
      } | null;
    }>({
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
          thumbnailImagePath: data.thumbnailImagePath,
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

    revalidateAfterEventMutation(
      result.data?.createLeague?.event?.game?.slug ?? undefined,
    );
    return true;
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
      status?: string;
      visibility?: string;
      startDate?: Date | null;
      endDate?: Date | null;
      registrationsEnabled?: boolean;
      registrationStartDate?: Date | null;
      registrationEndDate?: Date | null;
      maxParticipants?: number | null;
      requiresApproval?: boolean;
      waitlistEnabled?: boolean;
      officialLinks?: unknown;
      thumbnailImagePath?: string | null;
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
          status: data.status,
          visibility: data.visibility,
          startDate: data.startDate,
          endDate: data.endDate,
          registrationsEnabled: data.registrationsEnabled,
          registrationStartDate: data.registrationStartDate,
          registrationEndDate: data.registrationEndDate,
          maxParticipants: data.maxParticipants,
          requiresApproval: data.requiresApproval,
          waitlistEnabled: data.waitlistEnabled,
          officialLinks: data.officialLinks,
          thumbnailImagePath: data.thumbnailImagePath,
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

    revalidateAfterEventMutation();
    return true;
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

export const deleteLeague = createSafeAction(
  "deleteLeague",
  async (data: { eventId: string; gameSlug: string }) => {
    const session = await getServerAuthSession();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await getClient().mutate({
      mutation: DELETE_LEAGUE,
      variables: { eventId: data.eventId },
    });

    revalidateAfterEventMutation(data.gameSlug);
    return true;
  },
);
