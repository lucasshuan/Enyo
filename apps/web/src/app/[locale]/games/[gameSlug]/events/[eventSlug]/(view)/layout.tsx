import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getServerAuthSession } from "@/auth";
import { EventHero } from "@/components/templates/events/event-hero";
import { EventRouteTabs } from "@/components/templates/events/event-route-tabs";
import { getCachedGame } from "@/lib/server/game-page-data";
import {
  getCachedEventEntries,
  getCachedLeague,
} from "@/lib/server/event-page-data";
import { canManageLeagues } from "@/lib/server/permissions";

interface EventViewLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    gameSlug: string;
    eventSlug: string;
    locale: string;
  }>;
}

type EventMetadataProps = {
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

export async function generateMetadata({
  params,
}: EventMetadataProps): Promise<Metadata> {
  const { gameSlug, eventSlug } = await params;
  const data = await getCachedLeague(gameSlug, eventSlug);
  const event = data?.league?.event;

  if (!event) {
    return {
      title: eventSlug,
    };
  }

  return {
    title: event.name,
    description: event.description ?? undefined,
  };
}

export default async function EventViewLayout({
  children,
  params,
}: EventViewLayoutProps) {
  const { gameSlug, eventSlug } = await params;
  const [session, gameData, leagueData] = await Promise.all([
    getServerAuthSession(),
    getCachedGame(gameSlug),
    getCachedLeague(gameSlug, eventSlug),
  ]);

  if (!gameData?.game || !leagueData?.league?.event) {
    notFound();
  }

  const { game } = gameData;
  const { league } = leagueData;
  const entriesData = await getCachedEventEntries(league.event.id);
  const entries = entriesData?.eventEntries ?? EMPTY_ENTRIES;
  const userId = session?.user?.id;
  const isRegistered = userId
    ? entries.nodes.some((entry) => entry.user?.id === userId)
    : false;

  return (
    <main>
      <EventHero
        game={game}
        league={league}
        entries={entries}
        canEdit={canManageLeagues(session)}
        isRegistered={isRegistered}
        isLoggedIn={!!session}
        userId={userId}
        defaultDisplayName={session?.user?.name ?? session?.user?.username}
      />
      <EventRouteTabs
        gameSlug={game.slug}
        eventSlug={league.event.slug}
        participantCount={entries.totalCount}
      />
      <div className="w-full">{children}</div>
    </main>
  );
}
