import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Link } from "@/i18n/routing";
import type { Route } from "next";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

import { GET_LEAGUE, GET_EVENT_ENTRIES } from "@/lib/apollo/queries/leagues";
import { safeServerQuery } from "@/lib/apollo/safe-server-query";
import {
  type GetLeagueQuery,
  type GetEventEntriesQuery,
} from "@/lib/apollo/generated/graphql";
import { SectionHeader } from "@/components/ui/section-header";
import { LeagueLeaderboardFullTable } from "@/components/tables/league-leaderboard-full-table";

interface LeaderboardPageProps {
  params: Promise<{
    gameSlug: string;
    eventSlug: string;
  }>;
}

export async function generateMetadata({
  params,
}: LeaderboardPageProps): Promise<Metadata> {
  const { gameSlug, eventSlug } = await params;
  const data = await safeServerQuery<GetLeagueQuery>({
    query: GET_LEAGUE,
    variables: { gameSlug, leagueSlug: eventSlug },
  });

  const eventName = data?.league?.event?.name ?? eventSlug;
  return {
    title: `Classificação — ${eventName}`,
  };
}

export default async function LeaderboardPage({
  params,
}: LeaderboardPageProps) {
  const { gameSlug, eventSlug } = await params;

  const [leagueData, t] = await Promise.all([
    safeServerQuery<GetLeagueQuery>({
      query: GET_LEAGUE,
      variables: { gameSlug, leagueSlug: eventSlug },
    }),
    getTranslations("LeaderboardPage"),
  ]);

  if (!leagueData?.league) notFound();

  const league = leagueData.league;
  const event = league.event!;
  const eventId = event.id;

  const entriesData = await safeServerQuery<GetEventEntriesQuery>({
    query: GET_EVENT_ENTRIES,
    variables: { eventId, take: 500, skip: 0 },
  });

  const entries = entriesData?.eventEntries ?? {
    nodes: [],
    totalCount: 0,
    hasNextPage: false,
  };

  return (
    <main className="mx-auto mt-4 w-full max-w-5xl px-6 pb-12 sm:px-10 lg:px-12">
      <div className="space-y-6">
        {/* Back to event */}
        <Link
          href={`/games/${gameSlug}/events/${eventSlug}` as Route}
          className="group border-gold/45 bg-card text-muted hover:border-gold hover:text-foreground inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200"
        >
          <ChevronLeft className="size-4 transition-transform group-hover:-translate-x-1" />
          {t("backToEvent")}
        </Link>

        <SectionHeader
          title={t("title")}
          description={`${event.name} · ${league.classificationSystem}`}
        />

        <LeagueLeaderboardFullTable
          entries={entries.nodes}
          classificationSystem={league.classificationSystem}
          allowDraw={league.allowDraw}
        />
      </div>
    </main>
  );
}
