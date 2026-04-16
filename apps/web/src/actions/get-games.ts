"use server";

import { getClient } from "@/lib/apollo/apollo-client";
import { GET_GAMES_SIMPLE } from "@/lib/apollo/queries/games";
import { GetGamesSimpleQuery } from "@/lib/apollo/generated/graphql";

export type SimpleGame = GetGamesSimpleQuery["games"]["nodes"][number];

export async function getGamesSimple(search?: string): Promise<SimpleGame[]> {
  try {
    const { data } = await getClient().query<GetGamesSimpleQuery>({
      query: GET_GAMES_SIMPLE,
      variables: {
        search,
        pagination: { take: 50 },
      },
      fetchPolicy: "network-only",
    });

    if (!data?.games) {
      return [];
    }

    return data.games.nodes;
  } catch (error) {
    console.error("Error fetching games simple:", error);
    return [];
  }
}
