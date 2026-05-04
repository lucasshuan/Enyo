import Image from "next/image";
import type { Route } from "next";
import { Link } from "@/i18n/routing";
import { ChevronRight } from "lucide-react";
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
  "text-white/55",
  "text-white/35",
  "text-white/20",
];

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  DRAFT: {
    label: "Rascunho",
    className: "border-orange-500/30 bg-orange-500/10 text-orange-400",
  },
  REGISTRATION: {
    label: "Inscrições",
    className: "border-primary/30 bg-primary/10 text-primary",
  },
  ACTIVE: {
    label: "Em andamento",
    className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  },
  FINISHED: {
    label: "Finalizado",
    className: "border-white/15 bg-white/5 text-white/40",
  },
  CANCELLED: {
    label: "Cancelado",
    className: "border-red-500/30 bg-red-500/10 text-red-400",
  },
};

const SYSTEM_CONFIG: Record<string, { label: string; className: string }> = {
  ELO: {
    label: "Elo",
    className: "text-amber-300/80",
  },
  POINTS: {
    label: "Pontos",
    className: "text-blue-300/80",
  },
};

// Hover opacity per rank position
const HOVER_OPACITY = [
  "group-hover:opacity-100",
  "group-hover:opacity-100",
  "group-hover:opacity-50",
  "group-hover:opacity-20",
];

function getScore(stats: unknown): number | null {
  if (!stats || typeof stats !== "object") return null;
  const s = stats as Record<string, unknown>;
  const raw = s.elo ?? s.currentElo ?? s.points;
  return typeof raw === "number" ? raw : null;
}

export function LeagueCard({ league, game }: LeagueCardProps) {
  const t = useTranslations("League");
  const topEntries = (league.event?.topEntries ?? []).slice(0, 4);
  const count = league.event?.entriesCount ?? 0;
  const isElo = league.classificationSystem === "ELO";
  const status = league.event?.status ?? "DRAFT";
  const statusCfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.DRAFT!;
  const systemCfg =
    SYSTEM_CONFIG[league.classificationSystem] ?? SYSTEM_CONFIG.POINTS!;
  const thumbnailPath = league.event?.thumbnailImagePath;
  const rawName = league.event?.name ?? "";
  const displayName =
    rawName.length > 20 ? rawName.slice(0, 17) + "\u2026" : rawName;

  return (
    <Link
      href={`/games/${game}/events/${league.event?.slug ?? ""}` as Route}
      className="glass-panel group flex flex-col overflow-hidden rounded-2xl transition-all duration-300 select-none"
    >
      {/* Thumbnail strip + leaderboard overlay */}
      <div className="relative w-full" style={{ aspectRatio: "92/43" }}>
        {/* Background: thumbnail or gradient */}
        {thumbnailPath ? (
          <Image
            src={cdnUrl(thumbnailPath)!}
            alt={league.event?.name ?? ""}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 1280px) 100vw, 560px"
          />
        ) : (
          <div className="from-primary/25 via-primary/10 h-full w-full bg-linear-to-br to-transparent" />
        )}

        {/* Cinematic gradient for text contrast */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/35 to-black/10" />

        {/* Extra veil on hover for leaderboard contrast */}
        <div className="absolute inset-0 bg-black/0 transition-all duration-400 group-hover:bg-black/50" />

        {/* Leaderboard — invisible by default, cascades in on hover */}
        <div className="absolute inset-0 flex items-start px-4 py-3">
          {topEntries.length > 0 ? (
            <ul className="w-full space-y-1.5">
              {topEntries.map((entry, idx) => {
                const score = getScore(entry.stats);
                return (
                  <li
                    key={entry.id}
                    className={cn(
                      "flex items-center gap-2",
                      "translate-y-2 opacity-0 transition-all duration-300",
                      "group-hover:translate-y-0",
                      HOVER_OPACITY[idx] ?? "group-hover:opacity-20",
                      idx === 3 && "group-hover:blur-[1px]",
                    )}
                    style={{ transitionDelay: `${idx * 55}ms` }}
                  >
                    <span
                      className={cn(
                        "w-5 shrink-0 text-right text-[10px] font-bold tabular-nums",
                        RANK_COLORS[idx] ?? "text-white/15",
                      )}
                    >
                      #{idx + 1}
                    </span>

                    <div className="relative size-6 shrink-0 overflow-hidden rounded bg-white/10">
                      {(entry.user?.imagePath ?? entry.imagePath) ? (
                        <Image
                          src={
                            cdnUrl(entry.user?.imagePath ?? entry.imagePath)!
                          }
                          alt={entry.displayName}
                          fill
                          className="object-cover"
                          sizes="24px"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center text-[8px] font-bold text-white/40">
                          {entry.displayName.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <span className="min-w-0 flex-1 truncate text-xs font-medium text-white/80">
                      {entry.displayName}
                    </span>

                    {entry.user?.country ? (
                      <span
                        className={`fi fi-${entry.user.country.toLowerCase()} h-2.5 w-3.5 shrink-0 overflow-hidden rounded-xs`}
                        title={entry.user.country.toUpperCase()}
                      />
                    ) : null}

                    <span
                      className={cn(
                        "min-w-9 shrink-0 text-right text-[11px] font-bold tabular-nums",
                        idx === 0
                          ? "text-gold"
                          : idx === 1
                            ? "text-white/55"
                            : "text-white/30",
                      )}
                    >
                      {score != null ? (isElo ? score.toFixed(0) : score) : "—"}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="w-full translate-y-2 text-center text-xs text-white/35 italic opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              {t("noPlayers")}
            </div>
          )}
        </div>
      </div>

      {/* Header: title + badges in a single row */}
      <div className="shrink-0 p-4 pb-3">
        <div className="flex items-start gap-2">
          <h3
            className="flex-1 text-sm leading-[1.15] font-bold text-white/90 transition-colors group-hover:text-white"
            style={{ height: "2.3em" }}
          >
            {displayName}
          </h3>
          <div className="flex shrink-0 flex-col items-end gap-1">
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium",
                statusCfg.className,
              )}
            >
              {statusCfg.label}
            </span>
            <span
              className={cn(
                "text-[10px] font-semibold tracking-wide uppercase",
                systemCfg.className,
              )}
            >
              {systemCfg.label}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex shrink-0 items-center justify-between px-4 py-2.5">
        {count > 0 ? (
          <p className="text-[10px] text-white/30">{t("players", { count })}</p>
        ) : (
          <span />
        )}
        <ChevronRight className="text-gold/80 size-5 shrink-0 transition-all duration-200 group-hover:translate-x-1 group-hover:text-[color-mix(in_srgb,var(--gold)_78%,white)]" />
      </div>
    </Link>
  );
}
