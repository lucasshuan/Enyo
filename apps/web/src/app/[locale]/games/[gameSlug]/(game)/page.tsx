import { SectionHeader } from "@/components/ui/section-header";
import { SidebarPageLayout } from "@/components/ui/sidebar-page-layout";
import { getTranslations } from "next-intl/server";
import { getServerAuthSession } from "@/auth";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { canEditGame } from "@/lib/server/permissions";
import { ChevronLeft } from "lucide-react";
import { Link } from "@/i18n/routing";

import { GameInfoCard } from "@/components/triggers/game/game-info-card";
import { AddEventButton } from "@/components/triggers/game/add-event-button";
import { GameActionBar } from "@/components/triggers/game/game-action-bar";
import { GameEventsSection } from "@/components/ui/game-events-section";
import { safeServerQuery } from "@/lib/apollo/safe-server-query";
import type { SimpleGame } from "@/actions/game";

type GamePageProps = {
  params: Promise<{
    gameSlug: string;
  }>;
};

import { unstable_cache } from "next/cache";
import { GET_GAME } from "@/lib/apollo/queries/games";
import { GET_LEAGUES } from "@/lib/apollo/queries/leagues";
import {
  type GetGameQuery,
  type GetLeaguesQuery,
} from "@/lib/apollo/generated/graphql";

const getCachedGame = (slug: string) =>
  unstable_cache(
    () =>
      safeServerQuery<GetGameQuery>({ query: GET_GAME, variables: { slug } }),
    ["game", slug],
    { tags: ["games"], revalidate: 300 },
  )();

const getCachedGameLeagues = (gameId: string, slug: string) =>
  unstable_cache(
    () =>
      safeServerQuery<GetLeaguesQuery>({
        query: GET_LEAGUES,
        variables: { gameId },
      }),
    ["game-leagues", slug],
    { tags: ["events"], revalidate: 300 },
  )();

export async function generateMetadata({
  params,
}: GamePageProps): Promise<Metadata> {
  const { gameSlug } = await params;

  const data = await getCachedGame(gameSlug);

  const t = await getTranslations("GamePage");
  if (!data?.game) {
    return {
      title: t("metaTitleNotFound"),
    };
  }

  const { game } = data;

  return {
    title: game.name,
    description:
      game.description ?? t("metaDescriptionFallback", { gameName: game.name }),
  };
}

export default async function GamePage({ params }: GamePageProps) {
  const { gameSlug } = await params;

  return (
    <main>
      <Suspense fallback={<GamePageSkeleton />}>
        <GamePageContent gameSlug={gameSlug} />
      </Suspense>
    </main>
  );
}

async function GamePageContent({ gameSlug }: { gameSlug: string }) {
  const session = await getServerAuthSession();
  const data = await getCachedGame(gameSlug);

  const t = await getTranslations("GamePage");

  if (!data?.game) {
    notFound();
  }

  const { game } = data;

  const leaguesData = await getCachedGameLeagues(game.id, gameSlug);
  const leagues = leaguesData?.leagues?.nodes ?? [];

  const canEditCurrentGame = canEditGame(session, game.authorId);

  const gameWithCounts = {
    leagueCount: game._count?.events || 0,
    playerCount: 0,
    postCount: 0,
  };

  return (
    <SidebarPageLayout
      sidebar={
        <>
          <Link
            href="/games"
            className="group border-gold/45 bg-card text-muted hover:border-gold hover:text-foreground flex w-full items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200"
          >
            <ChevronLeft className="size-4 transition-transform group-hover:-translate-x-1" />
            {t("backToGames")}
          </Link>

          <GameInfoCard
            game={game}
            leagueCount={gameWithCounts.leagueCount}
            playerCount={gameWithCounts.playerCount}
            postCount={gameWithCounts.postCount}
            canEdit={canEditCurrentGame}
          />
        </>
      }
    >
      <div className="space-y-6">
        <GameActionBar gameId={game.id} followCount={game.followCount ?? 0} />
        <hr className="border-border/50" />
        <section className="space-y-6">
          <SectionHeader
            title={t("eventsTitle")}
            description={t("eventsDescription", { gameName: game.name })}
            actions={
              <AddEventButton
                gameId={game.id}
                game={game as SimpleGame}
                variant="header"
              />
            }
          />

          <GameEventsSection leagues={leagues} gameSlug={gameSlug} />
        </section>
      </div>
    </SidebarPageLayout>
  );
}

function GamePageSkeleton() {
  return (
    <SidebarPageLayout
      sidebar={
        <>
          {/* Back link */}
          <div className="border-gold/45 bg-card flex h-10 w-full items-center gap-2 rounded-xl border px-4">
            <div className="size-4 animate-pulse rounded bg-white/10" />
            <div className="h-3.5 w-24 animate-pulse rounded bg-white/10" />
          </div>

          {/* Game card (GlowBorder approximation) */}
          <div className="border-gold-dim/40 overflow-hidden rounded-3xl border">
            <div className="aspect-368/178 w-full animate-pulse bg-white/10" />
            <div className="space-y-6 p-5">
              <div>
                <div className="h-7 w-40 animate-pulse rounded bg-white/10" />
                <div className="mt-3 space-y-2">
                  <div className="h-3.5 w-full animate-pulse rounded bg-white/6" />
                  <div className="h-3.5 w-4/5 animate-pulse rounded bg-white/6" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-14 animate-pulse rounded-xl bg-white/5"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Author chip */}
          <div className="flex flex-row-reverse items-center justify-center gap-3 px-1 py-2 opacity-60">
            <div className="h-7 w-28 animate-pulse rounded-full bg-white/8" />
            <div className="h-5 w-16 animate-pulse rounded bg-white/5" />
          </div>
        </>
      }
    >
      <div className="space-y-6">
        <section className="space-y-6">
          {/* SectionHeader skeleton */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-7 w-36 animate-pulse rounded bg-white/10 sm:h-8 sm:w-48" />
                <div className="bg-primary/30 h-px w-8 animate-pulse rounded-full" />
              </div>
              <div className="bg-primary/20 h-9 w-32 animate-pulse rounded-2xl" />
            </div>
            <div className="h-4 w-72 animate-pulse rounded bg-white/6 sm:w-96" />
          </div>

          {/* League cards */}
          <div className="grid gap-5 xl:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="glass-panel min-h-80 overflow-hidden rounded-3xl p-6"
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div className="h-6 w-36 animate-pulse rounded bg-white/10" />
                  <div className="h-5 w-16 shrink-0 animate-pulse rounded-full bg-white/6" />
                </div>
                <div className="border-gold/20 mb-4 border-b" />
                <div className="space-y-2.5">
                  {[1, 2, 3].map((j) => (
                    <div
                      key={j}
                      className="h-8 w-full animate-pulse rounded-lg bg-white/4"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </SidebarPageLayout>
  );
}
