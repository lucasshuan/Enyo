import { Link } from "@/i18n/routing";
import type { PublicRanking } from "@/server/db/queries/public";
import { useTranslations } from "next-intl";

interface RankingCardProps {
  ranking: PublicRanking;
  gameSlug: string;
}

export function RankingCard({ ranking, gameSlug }: RankingCardProps) {
  const t = useTranslations("GamePage");
  const topEntries = ranking.entries.slice(0, 4);

  return (
    <Link
      href={`/games/${gameSlug}/rankings/${ranking.slug}`}
      className="glass-panel group hover:border-primary/30 relative block flex h-full min-h-[520px] flex-col overflow-hidden rounded-4xl border-white/5 p-6 transition-all hover:bg-white/5 active:scale-[0.99]"
    >
      {/* Background Glow */}
      <div className="bg-primary/5 absolute -top-24 -right-24 size-48 rounded-full opacity-0 blur-3xl transition-opacity group-hover:opacity-100" />

      <div className="relative mb-6 flex shrink-0 items-center justify-between gap-4">
        <div>
          <p className="text-primary font-mono text-[10px] tracking-[0.24em] uppercase opacity-60 transition-opacity group-hover:opacity-100">
            {t("ranking")}
          </p>
          <h3 className="group-hover:text-primary mt-2 text-2xl font-bold transition-colors">
            {ranking.name}
          </h3>
        </div>
        <div className="border-primary/25 bg-primary/10 text-secondary rounded-full border px-4 py-1.5 text-xs font-semibold shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)] backdrop-blur-md">
          {ranking.entries.length} {t("playersCount")}
        </div>
      </div>

      <div className="relative flex flex-1 flex-col">
        {topEntries.length > 0 ? (
          <div className="space-y-3">
            {topEntries.map((entry, index) => {
              const isLast = index === 3;
              const isTop3 = index < 3;

              return (
                <article
                  key={entry.id}
                  className={`relative rounded-3xl border px-4 py-4 transition-all duration-300 ${
                    isLast
                      ? "border-white/5 bg-white/2 [mask-image:linear-gradient(to_bottom,black_0%,transparent_85%)] opacity-30 grayscale-[0.8]"
                      : "border-white/10 bg-white/5 group-hover:border-white/15 group-hover:bg-white/8"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <span
                          className={`font-mono text-[10px] tracking-[0.24em] uppercase ${isTop3 ? "text-primary font-bold" : "text-muted"}`}
                        >
                          #{entry.position}
                        </span>
                        <h4 className="truncate text-base font-semibold transition-transform duration-300 group-hover:translate-x-1">
                          {entry.displayName}
                        </h4>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {entry.usernames.slice(0, 1).map((username) => (
                          <span
                            key={`${entry.id}-${username}`}
                            className="text-muted rounded-full border border-white/5 bg-white/2 px-2.5 py-0.5 text-[9px] font-medium"
                          >
                            {username}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div
                      className={`rounded-2xl border px-3 py-2 text-right transition-colors ${
                        isTop3
                          ? "border-primary/20 bg-primary/5"
                          : "border-white/5 bg-white/3"
                      }`}
                    >
                      <p className="text-muted font-mono text-[8px] tracking-[0.22em] uppercase">
                        {t("elo")}
                      </p>
                      <p
                        className={`mt-0.5 text-lg font-bold ${isTop3 ? "text-secondary" : ""}`}
                      >
                        {entry.currentElo}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}

            <div className="absolute inset-x-0 -bottom-2 flex translate-y-2 justify-center opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              <div className="bg-primary/90 shadow-primary/20 rounded-full px-4 py-1.5 text-[10px] font-bold tracking-widest text-black uppercase shadow-xl">
                {t("clickToViewFullRanking")}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-muted flex min-h-[300px] flex-1 flex-col items-center justify-center rounded-3xl border border-white/5 bg-white/2 px-4 text-center text-xs italic">
            <svg
              className="mb-4 size-12 opacity-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {t("noPlayers")}
          </div>
        )}
      </div>
    </Link>
  );
}
