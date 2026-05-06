import { notFound } from "next/navigation";

import { EventLeaderboardSection } from "@/components/templates/events/event-route-sections";
import {
  getCachedEventEntries,
  getCachedLeague,
} from "@/lib/server/event-page-data";

type LeaderboardPageProps = {
  params: Promise<{
    gameSlug: string;
    eventSlug: string;
  }>;
};

const EMPTY_ENTRIES = {
  nodes: [],
  totalCount: 0,
  hasNextPage: false,
};

export default async function LeaderboardPage({
  params,
}: LeaderboardPageProps) {
  const { gameSlug, eventSlug } = await params;
  const leagueData = await getCachedLeague(gameSlug, eventSlug);

  if (!leagueData?.league?.event) {
    notFound();
  }

  const entriesData = await getCachedEventEntries(leagueData.league.event.id);
  const entries = entriesData?.eventEntries ?? EMPTY_ENTRIES;

  return (
    <EventLeaderboardSection league={leagueData.league} entries={entries} />
  );
}
