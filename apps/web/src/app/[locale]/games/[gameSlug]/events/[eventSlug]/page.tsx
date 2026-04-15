import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getServerAuthSession } from "@/auth";
import { canManageRankings } from "@/lib/permissions";
import { RankingTemplate } from "@/components/templates/events/ranking";

import { GET_RANKING } from "@/lib/apollo/queries/rankings";
import { Ranking } from "@/lib/apollo/types";
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
      <Suspense
        fallback={
          <div className="animate-pulse p-12 text-center text-white/20">
            Loading...
          </div>
        }
      >
        <EventPageContent gameSlug={gameSlug} eventSlug={eventSlug} />
      </Suspense>
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

  // For now, we use GET_RANKING as it handles the Event fetching behind the scenes
  const data = await safeServerQuery<{ ranking: Ranking }>({
    query: GET_RANKING,
    variables: { gameSlug, rankingSlug: eventSlug },
  });

  if (!data?.ranking) {
    notFound();
  }

  const { ranking } = data;
  const isEditor = canManageRankings(session);

  // Dynamic Template Selection
  if (ranking.type === "RANKING") {
    return (
      <RankingTemplate
        ranking={ranking}
        session={session}
        isEditor={isEditor}
      />
    );
  }

  // Fallback for other event types (Tournaments, etc.)
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-12 text-center">
      <h1 className="text-3xl font-bold">{ranking.name}</h1>
      <p className="text-muted mt-4">
        Template for {ranking.type} not implemented yet.
      </p>
    </div>
  );
}
