import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { unstable_cache } from "next/cache";
import { GET_LEAGUES } from "@/lib/apollo/queries/leagues";
import { type GetLeaguesQuery } from "@/lib/apollo/generated/graphql";
import { LeagueCard } from "@/components/cards/league-card";
import { SectionHeader } from "@/components/ui/section-header";
import { safeServerQuery } from "@/lib/apollo/safe-server-query";
import { getServerAuthSession } from "@/auth";
import { Table } from "lucide-react";
import { AddEventButton } from "@/components/triggers/game/add-event-button";
import { type GameOption } from "@/components/ui/game-filter-combobox";
import { LeagueFilterControls } from "@/components/templates/leagues/league-filter-controls";

const getCachedLeagues = unstable_cache(
  async (token: string | null) =>
    safeServerQuery<GetLeaguesQuery>({
      token,
      query: GET_LEAGUES,
      variables: { pagination: { skip: 0, take: 50 } },
    }),
  ["leagues-list"],
  { tags: ["events"], revalidate: 300 },
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

type Filters = {
  search?: string;
  sort?: string;
  game?: string;
  status?: string;
  system?: string;
};

// ─── Filter config ────────────────────────────────────────────────────────────

type LeagueNode = GetLeaguesQuery["leagues"]["nodes"][number];

type LeaguesPageText = {
  filterToggle: string;
  clearFilters: string;
  sortLabel: string;
  statusLabel: string;
  systemLabel: string;
  gameLabel: string;
  gamePlaceholder: string;
  noGamesFound: string;
  noLeaguesTitle: string;
  noLeaguesDescription: string;
  sortRecent: string;
  sortAlphabetical: string;
  statusActive: string;
  statusRegistration: string;
  statusDraft: string;
  statusFinished: string;
  statusCancelled: string;
  systemElo: string;
  systemPoints: string;
};

function getGameOptions(leagues: LeagueNode[]): GameOption[] {
  const gamesMap = new Map<string, GameOption>();

  for (const league of leagues) {
    const game = league.event?.game;
    if (game?.slug && !gamesMap.has(game.slug)) {
      gamesMap.set(game.slug, {
        slug: game.slug,
        name: game.name,
        thumbnailImagePath: game.thumbnailImagePath,
      });
    }
  }

  return Array.from(gamesMap.values()).sort((currentGame, nextGame) =>
    currentGame.name.localeCompare(nextGame.name),
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type LeaguesPageProps = {
  searchParams: Promise<Filters>;
};

export default async function LeaguesPage({ searchParams }: LeaguesPageProps) {
  const t = await getTranslations("LeaguesPage");
  const filters = await searchParams;
  const session = await getServerAuthSession();
  const token = session?.user?.accessToken ?? null;
  const data = await getCachedLeagues(token);
  const leagues = data?.leagues?.nodes ?? [];
  const games = getGameOptions(leagues);
  const translations: LeaguesPageText = {
    filterToggle: t("filterToggle"),
    clearFilters: t("clearFilters"),
    sortLabel: t("sortLabel"),
    statusLabel: t("statusLabel"),
    systemLabel: t("systemLabel"),
    gameLabel: t("gameLabel"),
    gamePlaceholder: t("gamePlaceholder"),
    noGamesFound: t("noGamesFound"),
    noLeaguesTitle: t("noLeaguesTitle"),
    noLeaguesDescription: t("noLeaguesDescription"),
    sortRecent: t("sortRecent"),
    sortAlphabetical: t("sortAlphabetical"),
    statusActive: t("statusActive"),
    statusRegistration: t("statusRegistration"),
    statusDraft: t("statusDraft"),
    statusFinished: t("statusFinished"),
    statusCancelled: t("statusCancelled"),
    systemElo: t("systemElo"),
    systemPoints: t("systemPoints"),
  };

  return (
    <main className="mx-auto flex w-full flex-col gap-8 px-6 pt-20 pb-12 sm:px-10 lg:px-12">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col items-start gap-6">
          <SectionHeader title={t("title")} description={t("description")} />
          <div>
            <AddEventButton gameId="" variant="header" />
          </div>
        </div>

        <div className="w-full lg:max-w-3xl">
          <Suspense
            fallback={
              <div className="grid w-full grid-cols-[minmax(0,1fr)_auto] gap-3">
                <div className="bg-card-strong/50 h-11 animate-pulse rounded-xl" />
                <div className="bg-card-strong/50 h-11 w-28 animate-pulse rounded-xl" />
              </div>
            }
          >
            <LeagueFilterControls
              filters={filters}
              games={games}
              searchPlaceholder={t("searchPlaceholder")}
              translations={translations}
            />
          </Suspense>
        </div>
      </div>

      <div className="border-b border-white/5" />

      <LeaguesContent
        filters={filters}
        leagues={leagues}
        translations={translations}
      />
    </main>
  );
}

// ─── Filters + Grid ───────────────────────────────────────────────────────────

function LeaguesContent({
  filters,
  leagues: allLeagues,
  translations,
}: {
  filters: Filters;
  leagues: LeagueNode[];
  translations: LeaguesPageText;
}) {
  let leagues = allLeagues;
  if (filters.search) {
    const query = filters.search.toLowerCase();
    leagues = leagues.filter(
      (league) =>
        league.event?.name?.toLowerCase().includes(query) ||
        league.event?.game?.name?.toLowerCase().includes(query),
    );
  }
  if (filters.game) {
    leagues = leagues.filter(
      (league) => league.event?.game?.slug === filters.game,
    );
  }
  if (filters.status) {
    leagues = leagues.filter(
      (league) => league.event?.status === filters.status,
    );
  }
  if (filters.system) {
    leagues = leagues.filter(
      (league) => league.classificationSystem === filters.system,
    );
  }
  if (filters.sort === "name") {
    leagues = [...leagues].sort((a, b) =>
      (a.event?.name ?? "").localeCompare(b.event?.name ?? ""),
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {leagues.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="glass-panel mb-6 flex size-20 items-center justify-center rounded-2xl">
            <Table className="text-muted size-10" />
          </div>
          <h3 className="text-xl font-semibold">
            {translations.noLeaguesTitle}
          </h3>
          <p className="text-muted mt-2 max-w-sm text-sm">
            {translations.noLeaguesDescription}
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {leagues.map((league) => (
            <LeagueCard
              key={league.eventId}
              league={league}
              game={league.event?.game?.slug ?? ""}
            />
          ))}
        </div>
      )}
    </div>
  );
}
