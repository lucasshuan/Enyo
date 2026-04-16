import { notFound } from "next/navigation";
import { getServerAuthSession } from "@/auth";
import { canManageLeagues } from "@/lib/permissions";
import { LeagueTemplate } from "@/components/templates/events/league";

import { GET_LEAGUE } from "@/lib/apollo/queries/leagues";
import { GetLeagueQuery } from "@/lib/apollo/generated/graphql";
import { safeServerQuery } from "@/lib/apollo/safe-server-query";

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

  // For now, we use GET_LEAGUE as it handles the Event fetching behind the scenes
  const data = await safeServerQuery<GetLeagueQuery>({
    query: GET_LEAGUE,
    variables: { gameSlug, leagueSlug: eventSlug },
  });

  if (!data?.league) {
    notFound();
  }

  const { league } = data;
  const isEditor = canManageLeagues(session);

  // Dynamic Template Selection
  if (league.type === "LEAGUE") {
    return (
      <LeagueTemplate league={league} session={session} isEditor={isEditor} />
    );
  }

  // Fallback for other event types (Tournaments, etc.)
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-12 text-center">
      <h1 className="text-3xl font-bold">{league.name}</h1>
      <p className="text-muted mt-4">
        Template for {league.type} not implemented yet.
      </p>
    </div>
  );
}
