import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import Image from "next/image";

import { getRankingData } from "@/server/db/queries/public";
import { SectionHeader } from "@/components/ui/section-header";

interface RankingPageProps {
  params: Promise<{
    gameSlug: string;
    rankingSlug: string;
  }>;
}

export default async function RankingPage({ params }: RankingPageProps) {
  const { gameSlug, rankingSlug } = await params;

  return (
    <main>
      <Suspense fallback={<RankingPageSkeleton />}>
        <RankingPageContent gameSlug={gameSlug} rankingSlug={rankingSlug} />
      </Suspense>
    </main>
  );
}

async function RankingPageContent({
  gameSlug,
  rankingSlug,
}: {
  gameSlug: string;
  rankingSlug: string;
}) {
  const data = await getRankingData(gameSlug, rankingSlug);
  const t = await getTranslations("GamePage");

  if (!data) {
    notFound();
  }

  const { ranking, game, entries } = data;

  return (
    <div className="relative z-10 mx-auto mt-4 flex w-full max-w-7xl flex-col gap-8 px-6 pb-12 sm:px-10 lg:flex-row lg:gap-12 lg:px-12">
      {/* Sidebar (Left) */}
      <aside className="w-full shrink-0 lg:w-[320px] xl:w-[360px]">
        <div className="sticky top-28 space-y-4">
          <Link
            href={`/games/${gameSlug}`}
            className="glass-panel group flex items-center gap-4 overflow-hidden rounded-3xl p-2.5 transition-all hover:bg-white/5 active:scale-[0.98]"
          >
            <div className="relative aspect-video h-12 shrink-0 overflow-hidden rounded-2xl shadow-2xl">
              {game.thumbnailImageUrl ? (
                <Image
                  src={game.thumbnailImageUrl}
                  alt={game.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="from-primary/20 h-full w-full bg-linear-to-br" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-muted text-[10px] font-bold tracking-widest uppercase opacity-50">
                {game.name}
              </span>
              <span className="text-secondary group-hover:text-primary text-xs font-bold uppercase tracking-wider transition-colors">
                {t("viewGame")}
              </span>
            </div>
          </Link>

          <div className="glass-panel overflow-hidden rounded-4xl p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <svg
                className="text-primary size-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Ranking Info
            </h2>

            <div className="space-y-1">
              <div className="flex items-center justify-between py-1">
                <span className="text-[11px] opacity-60">Total Players</span>
                <span className="text-secondary text-xs font-semibold">
                  {entries.length}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-[11px] opacity-60">Created</span>
                <span className="text-xs font-semibold">
                  {ranking.createdAt
                    ? new Date(ranking.createdAt).toLocaleDateString()
                    : "—"}
                </span>
              </div>
              <div className="pt-3">
                <p className="text-muted text-[10px] leading-relaxed italic opacity-50">
                  This ranking is calculated based on Elo points. Results are
                  updated frequently by game administrators.
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content (Right) */}
      <div className="min-w-0 flex-1 space-y-8">
        <SectionHeader title={ranking.name} description={game.name} />

        <div className="glass-panel overflow-hidden rounded-4xl">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-white/10 bg-white/2">
                  <th className="px-6 py-4 text-xs font-bold tracking-[0.2em] uppercase opacity-50">
                    #
                  </th>
                  <th className="px-6 py-4 text-xs font-bold tracking-[0.2em] uppercase opacity-50">
                    {t("ranking")}
                  </th>
                  <th className="px-6 py-4 text-xs font-bold tracking-[0.2em] uppercase opacity-50">
                    Elo
                  </th>
                  <th className="hidden px-6 py-4 text-xs font-bold tracking-[0.2em] uppercase opacity-50 sm:table-cell">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {entries.map((entry) => (
                  <tr
                    key={entry.id}
                    className="group transition-colors hover:bg-white/5"
                  >
                    <td className="px-6 py-5">
                      <span
                        className={`font-mono font-bold ${entry.position <= 3 ? "text-primary" : "opacity-40"}`}
                      >
                        {entry.position}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-lg font-semibold">
                          {entry.displayName}
                        </span>
                        <div className="mt-1 flex gap-1.5">
                          {entry.usernames.slice(0, 3).map((u) => (
                            <span
                              key={u}
                              className="text-muted border-white/10 bg-white/5 rounded-full border px-2 py-0.5 text-[10px] lowercase transition-all group-hover:bg-white/10"
                            >
                              {u}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-secondary font-mono text-xl font-semibold">
                        {entry.currentElo}
                      </span>
                    </td>
                    <td className="hidden px-6 py-5 sm:table-cell">
                      {entry.country && (
                        <span className="text-[10px] tracking-widest uppercase opacity-40">
                          {entry.country}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {entries.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-muted"
                    >
                      {t("noPlayers")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function RankingPageSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mx-auto mt-4 flex max-w-7xl flex-col gap-12 px-6 pb-12 sm:px-10 lg:flex-row lg:gap-12 lg:px-12">
        <div className="h-96 w-full rounded-4xl bg-white/5 lg:w-[360px]" />
        <div className="h-[600px] flex-1 rounded-4xl bg-white/5" />
      </div>
    </div>
  );
}
