import Image from "next/image";
import type { Route } from "next";
import { Link } from "@/i18n/routing";
import { type GetLeaguesQuery } from "@/lib/apollo/generated/graphql";
import { useTranslations } from "next-intl";
import { cdnUrl } from "@/lib/utils/cdn";
import { cn } from "@/lib/utils/helpers";

type LeagueNode = NonNullable<GetLeaguesQuery["leagues"]["nodes"][number]>;

interface LeagueCardProps {
  league: LeagueNode;
  game: string;
}

const RANK_COLORS = [
  "text-gold",
  "text-white/60",
  "text-white/45",
  "text-white/30",
  "text-white/20",
];

function getElo(stats: unknown): number | null {
  if (!stats || typeof stats !== "object") return null;
  const s = stats as Record<string, unknown>;
  const raw = s.elo ?? s.currentElo ?? s.points;
  return typeof raw === "number" ? raw : null;
}

export function LeagueCard({ league, game }: LeagueCardProps) {
  const t = useTranslations("League");
  const topEntries = league.event?.topEntries ?? [];
  const count = league.event?.entriesCount ?? 0;
  const isElo = league.classificationSystem === "ELO";

  return (
    <Link
      href={`/games/${game}/events/${league.event?.slug ?? ""}` as Route}
      className="glass-panel group hover:border-gold relative flex h-full min-h-80 flex-col overflow-hidden rounded-3xl border-white/5 p-6 transition-all select-none hover:bg-[color-mix(in_srgb,var(--gold)_10%,transparent)] active:scale-[0.99]"
    >
      {/* Header */}
      <div className="relative mb-5 flex shrink-0 items-start justify-between gap-4">
        <div>
          <h3 className="group-hover:text-primary text-xl font-bold transition-colors">
            {league.event?.name}
          </h3>
          <p className="text-muted mt-1 text-xs">
            {league.classificationSystem}
          </p>
        </div>
      </div>

      {/* Leaderboard preview */}
      <div className="relative flex flex-1 flex-col justify-center">
        {topEntries.length > 0 ? (
          <div className="relative">
            <ul className="space-y-2.5">
              {topEntries.map((entry, idx) => {
                const elo = getElo(entry.stats);
                // opacity fades: 100%, 100%, 100%, 55%, 25%
                const opacityClass =
                  idx === 3
                    ? "opacity-55"
                    : idx === 4
                      ? "opacity-25"
                      : "opacity-100";

                return (
                  <li
                    key={entry.id}
                    className={cn(
                      "flex items-center gap-3 transition-opacity",
                      opacityClass,
                    )}
                  >
                    {/* Rank */}
                    <span
                      className={cn(
                        "w-6 shrink-0 text-right text-xs font-bold tabular-nums",
                        RANK_COLORS[idx] ?? "text-white/15",
                      )}
                    >
                      #{idx + 1}
                    </span>

                    {/* Avatar — prefer user profile pic, fall back to entry image, then initials */}
                    <div className="relative size-7 shrink-0 overflow-hidden rounded-md bg-white/5">
                      {(entry.user?.imagePath ?? entry.imagePath) ? (
                        <Image
                          src={
                            cdnUrl(entry.user?.imagePath ?? entry.imagePath)!
                          }
                          alt={entry.displayName}
                          fill
                          className="object-cover"
                          sizes="28px"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center text-[9px] font-bold text-white/30">
                          {entry.displayName.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Name */}
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-white/75 transition-colors group-hover:text-white/90">
                      {entry.displayName}
                    </span>

                    {/* Country flag */}
                    {entry.user?.country ? (
                      <span
                        className={`fi fi-${entry.user.country.toLowerCase()} h-3 w-4 shrink-0 overflow-hidden rounded-[2px]`}
                        title={entry.user.country.toUpperCase()}
                      />
                    ) : null}

                    {/* Elo / Points — always show, dash if null */}
                    <span
                      className={cn(
                        "min-w-10 shrink-0 text-right text-xs font-bold tabular-nums",
                        idx === 0
                          ? "text-gold"
                          : idx === 1
                            ? "text-white/60"
                            : "text-white/35",
                      )}
                    >
                      {elo != null ? (isElo ? elo.toFixed(2) : elo) : "—"}
                    </span>
                  </li>
                );
              })}
            </ul>

            {/* Bottom fade overlay when there are entries fading */}
            {topEntries.length >= 4 && (
              <div className="from-card pointer-events-none absolute right-0 -bottom-1 left-0 h-12 bg-linear-to-t to-transparent" />
            )}
          </div>
        ) : (
          <div className="text-muted flex flex-1 items-center justify-center text-xs italic opacity-40">
            {t("noPlayers")}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-end justify-between gap-2">
        {count > 0 ? (
          <p className="text-[10px] text-white/20">{t("players", { count })}</p>
        ) : (
          <span />
        )}
        <div className="group-hover:text-primary flex items-center text-[10px] font-bold tracking-widest text-white/20 uppercase transition-colors">
          {t("clickToViewFullLeague")} →
        </div>
      </div>
    </Link>
  );
}
