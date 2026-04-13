import { Link } from "@/i18n/routing";
import type { PublicRanking } from "@/server/db/queries/types";
import { useTranslations } from "next-intl";

interface RankingCardProps {
  ranking: PublicRanking;
  game: string;
}

export function RankingCard({ ranking, game }: RankingCardProps) {
  const t = useTranslations("GamePage");

  return (
    <Link
      href={`/games/${game}/rankings/${ranking.slug}`}
      className="glass-panel group hover:border-primary/30 relative block flex h-full min-h-[280px] flex-col overflow-hidden rounded-4xl border-white/5 p-6 transition-all hover:bg-white/5 active:scale-[0.99]"
    >
      {/* Background Glow */}
      <div className="bg-primary/5 absolute -top-24 -right-24 size-48 rounded-full opacity-0 blur-3xl transition-opacity group-hover:opacity-100" />

      <div className="relative mb-4 flex shrink-0 items-center justify-between gap-4">
        <div>
          <h3 className="group-hover:text-primary text-xl font-bold transition-colors">
            {ranking.name}
          </h3>
        </div>
        <div className="border-white/5 bg-white/5 text-muted rounded-full border px-3 py-1 text-[10px] font-semibold">
          {ranking.entries.length} {t("playersCount")}
        </div>
      </div>

      <div className="relative flex flex-1 flex-col justify-center">
        {ranking.entries.length > 0 ? (
          <div className="space-y-1">
            {ranking.entries.slice(0, 5).map((entry) => (
              <div
                key={entry.id}
                className="flex items-center gap-3 border-b border-white/5 py-1.5 last:border-0"
              >
                <span className="text-primary w-6 font-mono text-[11px] font-bold">
                  #{entry.position}
                </span>
                {entry.country && (
                  <span
                    className={`fi fi-${entry.country.toLowerCase()} fis size-3.5 shrink-0 rounded-xs opacity-80`}
                  />
                )}
                <span className="text-foreground/80 truncate text-sm font-medium transition-colors group-hover:text-white">
                  {entry.displayName}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-muted flex flex-1 items-center justify-center text-xs italic opacity-40">
            {t("noPlayers")}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-end text-[10px] font-bold tracking-widest text-white/20 uppercase transition-colors group-hover:text-primary">
        {t("clickToViewFullRanking")} →
      </div>
    </Link>
  );
}
