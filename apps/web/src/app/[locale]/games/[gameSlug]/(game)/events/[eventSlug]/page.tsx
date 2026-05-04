import { notFound } from "next/navigation";
import { getServerAuthSession } from "@/auth";
import { canManageLeagues } from "@/lib/server/permissions";
import { GET_EVENT_META } from "@/lib/apollo/queries/events";
import { GET_LEAGUE, GET_EVENT_ENTRIES } from "@/lib/apollo/queries/leagues";
import { safeServerQuery } from "@/lib/apollo/safe-server-query";
import { type GetLeagueQuery, type GetEventEntriesQuery } from "@/lib/apollo/generated/graphql";
import { EloLeagueTemplate } from "@/components/templates/events/league/elo-league-template";

interface EventPageProps {
  params: Promise<{
    gameSlug: string;
    eventSlug: string;
  }>;
}

export default async function EventPage({ params }: EventPageProps) {
  const { gameSlug, eventSlug } = await params;

  return (
    <main>
      <EventPageContent gameSlug={gameSlug} eventSlug={eventSlug} />
    </main>
  );
}

async function EventPageContent({
  gameSlug,
  eventSlug,
}: {
  gameSlug: string;
  eventSlug: string;
}) {
  const session = await getServerAuthSession();
  const isEditor = canManageLeagues(session);

  // Resolve event type first
  const metaData = await safeServerQuery<{
    eventMeta: { id: string; type: string } | null;
  }>({
    query: GET_EVENT_META,
    variables: { gameSlug, slug: eventSlug },
  });

  if (!metaData?.eventMeta) {
    notFound();
  }

  const { type } = metaData.eventMeta;

  if (type === "LEAGUE") {
    const data = await safeServerQuery<GetLeagueQuery>({
      query: GET_LEAGUE,
      variables: { gameSlug, leagueSlug: eventSlug },
    });

    if (!data?.league) notFound();

    const league = data.league;
    const eventId = league.event?.id;

    const entriesData = eventId
      ? await safeServerQuery<GetEventEntriesQuery>({
          query: GET_EVENT_ENTRIES,
          variables: { eventId, take: 1000, skip: 0 },
        })
      : null;

    const entries = entriesData?.eventEntries ?? {
      nodes: [],
      totalCount: 0,
      hasNextPage: false,
    };

    // Check if current user is already registered
    const userId = session?.user?.id;
    const isRegistered = userId
      ? entries.nodes.some((e) => e.user?.id === userId)
      : false;

    return (
      <EloLeagueTemplate
        league={league}
        entries={entries}
        session={session}
        isEditor={isEditor}
        isRegistered={isRegistered}
      />
    );
  }

  // Fallback for future event types (Tournaments, etc.)
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-12 text-center">
      <h1 className="text-3xl font-bold">{eventSlug}</h1>
      <p className="text-muted mt-4">
        Template for {type} not implemented yet.
      </p>
    </div>
  );
}
