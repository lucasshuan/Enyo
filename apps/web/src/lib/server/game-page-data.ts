import "server-only";

import { unstable_cache } from "next/cache";

import type {
  GetGameQuery,
  GetLeaguesQuery,
} from "@/lib/apollo/generated/graphql";
import { GET_GAME } from "@/lib/apollo/queries/games";
import { GET_LEAGUES } from "@/lib/apollo/queries/leagues";
import { safeServerQuery } from "@/lib/apollo/safe-server-query";

export const getCachedGame = (slug: string) =>
  unstable_cache(
    () =>
      safeServerQuery<GetGameQuery>({
        query: GET_GAME,
        variables: { slug },
        token: null,
      }),
    ["game", slug],
    { tags: ["games"], revalidate: 300 },
  )();

export const getCachedGameLeagues = (gameId: string, slug: string) =>
  unstable_cache(
    () =>
      safeServerQuery<GetLeaguesQuery>({
        query: GET_LEAGUES,
        variables: { gameId, pagination: { skip: 0, take: 50 } },
        token: null,
      }),
    ["game-leagues", gameId, slug],
    { tags: ["events"], revalidate: 300 },
  )();
