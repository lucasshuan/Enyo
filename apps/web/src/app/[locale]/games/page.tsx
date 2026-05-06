import { Link } from "@/i18n/routing";
import { Trophy } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { unstable_cache } from "next/cache";
import { GET_GAMES } from "@/lib/apollo/queries/games";
import { GetGamesQuery } from "@/lib/apollo/generated/graphql";
import { GameCard, GameCardSkeleton } from "@/components/cards/game-card";
import { SearchInput } from "@/components/ui/search-input";
import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/utils/helpers";
import { buttonVariants } from "@/components/ui/button";
import { Suspense } from "react";
import { safeServerQuery } from "@/lib/apollo/safe-server-query";
import { getServerAuthSession } from "@/auth";
import { AddGameButton } from "@/components/triggers/game/add-game-button";

const getCachedGames = unstable_cache(
  async (search: string | undefined, token: string | null) =>
    safeServerQuery<GetGamesQuery>({
      token,
      query: GET_GAMES,
      variables: { search, pagination: { skip: 0, take: 50 } },
    }),
  ["games-list"],
  { tags: ["games"], revalidate: 300 },
);

interface GamesPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ search?: string; sort?: string }>;
}

export default async function GamesPage({ searchParams }: GamesPageProps) {
  const { search, sort } = await searchParams;
  const t = await getTranslations("GamesPage");
  const gridT = {
    cardFallbackDescription: t("cardFallbackDescription"),
    pendingBadge: t("pendingBadge"),
    noGamesFound: t("noGamesFound"),
    noGamesTitle: t("noGamesTitle"),
    noGamesFoundDescription: t("noGamesFoundDescription"),
    noGamesDescription: t("noGamesDescription"),
    clearSearch: t("clearSearch"),
  };
  const session = await getServerAuthSession();
  const token = session?.user?.accessToken ?? null;

  return (
    <main className="mx-auto flex w-full flex-col gap-8 px-6 pt-20 pb-12">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-6">
          <SectionHeader title={t("title")} description={t("description")} />
          <div>
            <AddGameButton />
          </div>
        </div>

        <div className="flex w-full flex-col gap-4 lg:max-w-md lg:items-end">
          <SearchInput
            defaultValue={search}
            placeholder={t("searchPlaceholder")}
            className="w-full"
          />

          <div className="flex flex-wrap items-center gap-3 lg:justify-end">
            <Link
              href={
                sort !== "name"
                  ? "#"
                  : `?${new URLSearchParams({ ...(search ? { search } : {}), sort: "popular" })}`
              }
              className={cn(
                "flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-200",
                sort !== "name"
                  ? "border-gold/40 bg-gold/10 text-gold shadow-[0_0_12px_color-mix(in_srgb,var(--gold)_15%,transparent)]"
                  : "border-border text-muted hover:border-gold/30 hover:text-foreground",
              )}
            >
              <Trophy className="size-4" />
              {t("sortPopular")}
            </Link>
            <Link
              href={
                sort === "name"
                  ? "#"
                  : `?${new URLSearchParams({ ...(search ? { search } : {}), sort: "name" })}`
              }
              className={cn(
                "flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-200",
                sort === "name"
                  ? "border-gold/40 bg-gold/10 text-gold shadow-[0_0_12px_color-mix(in_srgb,var(--gold)_15%,transparent)]"
                  : "border-border text-muted hover:border-gold/30 hover:text-foreground",
              )}
            >
              {t("sortAlphabetical")}
            </Link>
          </div>
        </div>
      </div>
      <div className="border-b border-white/5" />

      <Suspense fallback={<GamesGridSkeleton />}>
        <GamesGrid search={search} translations={gridT} token={token} />
      </Suspense>
    </main>
  );
}

function GamesGridSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <GameCardSkeleton key={i} />
      ))}
    </div>
  );
}

type GamesGridTranslations = {
  cardFallbackDescription: string;
  pendingBadge: string;
  noGamesFound: string;
  noGamesTitle: string;
  noGamesFoundDescription: string;
  noGamesDescription: string;
  clearSearch: string;
};

async function GamesGrid({
  search,
  translations,
  token,
}: {
  search?: string;
  translations: GamesGridTranslations;
  token: string | null;
}) {
  const data = await getCachedGames(search, token);

  const games = data?.games?.nodes || [];
  const gameList = games.map((game) => ({
    ...game,
    leagueCount: game._count?.events || 0,
    playerCount: 0,
    tourneyCount: 0,
    postCount: 0,
  }));

  const showEmptySearch = gameList.length === 0 && !!search;

  if (gameList.length > 0) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {gameList.map((game, index) => (
          <GameCard
            key={game.id}
            game={game}
            fallbackDescription={translations.cardFallbackDescription}
            pendingLabel={translations.pendingBadge}
            priority={index < 4}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="glass-panel mb-6 flex size-20 items-center justify-center rounded-2xl">
        <Trophy className="text-muted size-10" />
      </div>
      <h3 className="text-xl font-semibold">
        {showEmptySearch
          ? translations.noGamesFound
          : translations.noGamesTitle}
      </h3>
      <p className="text-muted mt-2 max-w-sm">
        {showEmptySearch
          ? translations.noGamesFoundDescription
          : translations.noGamesDescription}
      </p>
      {showEmptySearch && (
        <Link
          href="/games"
          className={cn(
            buttonVariants({ intent: "secondary", size: "sm" }),
            "mt-6",
          )}
        >
          {translations.clearSearch}
        </Link>
      )}
    </div>
  );
}
