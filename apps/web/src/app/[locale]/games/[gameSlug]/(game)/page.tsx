import { SectionHeader } from "@/components/ui/section-header";
import { GlowBorder } from "@/components/ui/glow-border";
import { getTranslations } from "next-intl/server";
import { getServerAuthSession } from "@/auth";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { canEditGame } from "@/lib/permissions";
import { LeagueCard } from "@/components/cards/league-card";
import { AlertCircle, ChevronLeft, Ghost } from "lucide-react";
import { UserChip } from "@/components/ui/user-chip";
import { Link } from "@/i18n/routing";
import { cn, formatCompactNumber } from "@/lib/utils";

import { GameManageActions } from "@/components/triggers/game/game-manage-actions";
import { AddEventButton } from "@/components/triggers/game/add-event-button";
import { safeServerQuery } from "@/lib/apollo/safe-server-query";
import type { SimpleGame } from "@/actions/get-games";
import { cdnUrl } from "@/lib/cdn";

type GamePageProps = {
  params: Promise<{
    gameSlug: string;
  }>;
};

export const dynamic = "force-dynamic";

import { GET_GAME } from "@/lib/apollo/queries/games";
import { GET_LEAGUES } from "@/lib/apollo/queries/leagues";
import {
  type GetGameQuery,
  type GetLeaguesQuery,
} from "@/lib/apollo/generated/graphql";
import { buttonVariants } from "@/components/ui/button";

export async function generateMetadata({
  params,
}: GamePageProps): Promise<Metadata> {
  const { gameSlug } = await params;

  const data = await safeServerQuery<GetGameQuery>({
    query: GET_GAME,
    variables: { slug: gameSlug },
  });

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
  const data = await safeServerQuery<GetGameQuery>({
    query: GET_GAME,
    variables: { slug: gameSlug },
  });

  const t = await getTranslations("GamePage");

  if (!data?.game) {
    notFound();
  }

  const { game } = data;
  const author = game.author;

  const leaguesData = await safeServerQuery<GetLeaguesQuery>({
    query: GET_LEAGUES,
    variables: { gameId: game.id },
  });
  const leagues = leaguesData?.leagues?.nodes ?? [];

  const canEditCurrentGame = canEditGame(session, game.authorId);

  const gameWithCounts = {
    ...game,
    leagueCount: game._count?.events || 0,
    playerCount: 0,
    tourneyCount: 0,
    postCount: 0,
  };

  return (
    <div className="relative mx-auto mt-4 flex w-full flex-col gap-8 px-6 pb-12 sm:px-10 lg:flex-row lg:gap-8 lg:px-12">
      {/* Sidebar */}
      <aside className="w-full shrink-0 lg:w-[320px] xl:w-90">
        <div className="sticky top-28 flex flex-col gap-3">
          <Link
            href="/games"
            className="group border-gold/45 bg-card text-muted hover:border-gold hover:text-foreground flex w-full items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200"
          >
            <ChevronLeft className="size-4 transition-transform group-hover:-translate-x-1" />
            {t("backToGames")}
          </Link>

          <GlowBorder
            className="rounded-3xl"
            borderClassName="bg-[color-mix(in_srgb,var(--gold)_45%,transparent)]"
          >
            <div className="relative aspect-368/178 w-full overflow-hidden">
              {game.thumbnailImagePath ? (
                <Image
                  src={cdnUrl(game.thumbnailImagePath)!}
                  alt={game.name}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 360px"
                />
              ) : (
                <div className="from-primary/20 to-primary/5 h-full w-full bg-linear-to-br" />
              )}
              {canEditCurrentGame && (
                <div className="absolute top-3 right-3 z-10">
                  <GameManageActions
                    gameId={game.id}
                    gameSlug={game.slug}
                    gameName={game.name}
                    eventCount={game._count?.events ?? 0}
                  />
                </div>
              )}
            </div>

            <div className="space-y-6 p-5">
              <div>
                {game.status === "PENDING" && (
                  <div className="animate-pending-pulse mb-4 flex items-center gap-3 rounded-2xl border border-orange-500/20 bg-orange-500/10 px-4 py-3 text-orange-400">
                    <AlertCircle className="size-5 shrink-0 animate-pulse" />
                    <p className="text-xs font-semibold tracking-wider uppercase">
                      {t("pendingNotice")}
                    </p>
                  </div>
                )}
                <h1 className="text-foreground text-2xl font-bold tracking-tight">
                  {game.name}
                </h1>
                <p className="text-muted mt-2 text-[13px] leading-snug">
                  {game.description ?? t("sidebarDescription")}
                </p>
              </div>

              {game.status === "PENDING" && <></>}

              {game.status !== "PENDING" && (
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-xl border border-white/5 bg-white/5 px-3 py-2 transition-colors hover:bg-white/10">
                    <p className="text-muted font-mono text-[9px] opacity-60">
                      {t("events")}
                    </p>
                    <p className="text-secondary mt-0.5 text-lg font-bold">
                      {formatCompactNumber(
                        (gameWithCounts.leagueCount || 0) +
                          (gameWithCounts.tourneyCount || 0),
                      )}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-white/5 px-3 py-2 transition-colors hover:bg-white/10">
                    <p className="text-muted font-mono text-[9px] opacity-60">
                      {t("sidebarPlayers")}
                    </p>
                    <p className="text-secondary mt-0.5 text-lg font-bold">
                      {formatCompactNumber(gameWithCounts.playerCount || 0)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-white/5 px-3 py-2 transition-colors hover:bg-white/10">
                    <p className="text-muted font-mono text-[9px] opacity-60">
                      {t("posts")}
                    </p>
                    <p className="text-secondary mt-0.5 text-lg font-bold">
                      {formatCompactNumber(gameWithCounts.postCount || 0)}
                    </p>
                  </div>
                </div>
              )}

              {game.steamUrl && (
                <a
                  href={game.steamUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 py-2 text-xs font-bold text-white/40 transition-colors hover:text-white"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-4"
                  >
                    <path d="M11.979 0C5.353 0 0 5.373 0 12c0 2.221.606 4.3 1.666 6.1L6.155 13.92c-.11-.421-.168-.86-.168-1.314 0-2.868 2.324-5.193 5.19-5.193 2.87 0 5.194 2.325 5.194 5.193 0 2.868-2.324 5.194-5.193 5.194-.852 0-1.656-.205-2.36-.566L4.793 23c2.164 1.344 4.7 2.128 7.397 2.128 6.577 0 11.905-5.328 11.905-11.905S18.556 0 11.979 0Zm-.791 10.158c-1.353 0-2.45 1.097-2.45 2.448s1.097 2.45 2.45 2.45c1.35 0 2.449-1.099 2.449-2.45s-1.099-2.448-2.449-2.448Zm0 1.258c.656 0 1.19.532 1.19 1.19 0 .656-.534 1.191-1.19 1.191-.659 0-1.192-.534-1.192-1.191 0-.66.533-1.19 1.192-1.19Z" />
                  </svg>
                  {t("playOnSteam")}
                </a>
              )}

              {game.websiteUrl && (
                <a
                  href={game.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 py-2 text-xs font-bold text-white/40 transition-colors hover:text-white"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-4"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  {t("visitWebsite")}
                </a>
              )}
            </div>
          </GlowBorder>

          {author && (
            <div className="flex flex-row-reverse items-center justify-center gap-3 px-1 py-2 opacity-80 transition-opacity hover:opacity-100">
              <div className="flex">
                <UserChip user={author} />
              </div>
              <span className="font-signature text-secondary text-lg whitespace-nowrap italic">
                {t("ideaBy")}
              </span>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="min-w-0 flex-1 space-y-6">
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

          {leagues.length > 0 ? (
            <div className="grid gap-5 xl:grid-cols-2">
              {leagues.map((league: (typeof leagues)[number]) => (
                <LeagueCard
                  key={league.eventId}
                  league={league}
                  game={gameSlug}
                />
              ))}
            </div>
          ) : (
            <div className="glass-panel no-hover flex flex-col items-center justify-center rounded-3xl p-12 text-center">
              <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-white/5">
                <Ghost className="size-8 text-white/20" />
              </div>
              <p className="text-base font-medium">{t("noEvents")}</p>
              <p className="text-muted mt-2 max-w-sm text-sm leading-relaxed">
                {t("noEventsDescription")}
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function GamePageSkeleton() {
  return (
    <div className="relative mx-auto mt-4 flex w-full flex-col gap-8 px-6 pb-12 sm:px-10 lg:flex-row lg:gap-8 lg:px-12">
      {/* Sidebar */}
      <aside className="w-full shrink-0 lg:w-[320px] xl:w-90">
        <div className="sticky top-28 flex flex-col gap-3">
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
        </div>
      </aside>

      {/* Main content */}
      <div className="min-w-0 flex-1 space-y-6">
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
    </div>
  );
}
