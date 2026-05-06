"use client";

import Image from "next/image";
import type { Route } from "next";
import { Link } from "@/i18n/routing";
import { BadgeCheck, ChevronRight } from "lucide-react";
import { type GetLeaguesQuery } from "@/lib/apollo/generated/graphql";
import { useLocale, useTranslations } from "next-intl";
import { cdnUrl } from "@/lib/utils/cdn";
import { formatDate } from "@/lib/utils/date-utils";
import { cn } from "@/lib/utils/helpers";
import { useEffect, useRef, useState } from "react";

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
    className: "border-orange-400/25 bg-orange-400/10 text-orange-300",
  },
  REGISTRATION: {
    label: "Inscrições",
    className: "border-primary/35 bg-primary/12 text-primary",
  },
  ACTIVE: {
    label: "Em andamento",
    className: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
  },
  FINISHED: {
    label: "Finalizado",
    className: "border-white/12 bg-white/5 text-white/45",
  },
  CANCELLED: {
    label: "Cancelado",
    className: "border-red-400/25 bg-red-400/10 text-red-300",
  },
};

const SYSTEM_CONFIG: Record<string, { label: string; className: string }> = {
  ELO: {
    label: "Elo",
    className: "border-gold/25 bg-gold/10 text-gold",
  },
  POINTS: {
    label: "Pontos corridos",
    className: "border-sky-300/20 bg-sky-300/10 text-sky-200/80",
  },
};

const MAX_LEADERBOARD_ENTRIES = 8;
const LEADERBOARD_ROW_HEIGHT = 36;

function getScore(stats: unknown): number | null {
  if (!stats || typeof stats !== "object") return null;
  const s = stats as Record<string, unknown>;
  const raw = s.elo ?? s.currentElo ?? s.points;
  return typeof raw === "number" ? raw : null;
}

function getLeaderboardRowEffect(index: number, rowCapacity: number) {
  if (rowCapacity <= 2) {
    return "group-hover:opacity-100 group-hover:blur-0";
  }

  const fadeStartIndex = Math.max(2, rowCapacity - 2);

  if (index < fadeStartIndex) {
    return "group-hover:opacity-100 group-hover:blur-0";
  }

  return index === fadeStartIndex
    ? "group-hover:opacity-50 group-hover:blur-[0.75px]"
    : "group-hover:opacity-20 group-hover:blur-[1.75px]";
}

function formatShortEventDate(value: unknown, locale: string) {
  if (!value) return null;

  const date =
    value instanceof Date ? value : new Date(value as string | number);

  if (Number.isNaN(date.getTime())) return null;

  return formatDate(date, locale, {
    day: "numeric",
    month: "short",
  }).replace(/\.$/, "");
}

export function LeagueCard({ league, game }: LeagueCardProps) {
  const t = useTranslations("League");
  const locale = useLocale();
  const leaderboardRef = useRef<HTMLDivElement>(null);
  const topEntries = (league.event?.topEntries ?? []).slice(
    0,
    MAX_LEADERBOARD_ENTRIES,
  );
  const [leaderboardRowCapacity, setLeaderboardRowCapacity] = useState(4);
  const count = league.event?.entriesCount ?? 0;
  const isElo = league.classificationSystem === "ELO";
  const status = league.event?.status ?? "DRAFT";
  const statusCfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.DRAFT!;
  const systemCfg =
    SYSTEM_CONFIG[league.classificationSystem] ?? SYSTEM_CONFIG.POINTS!;
  const thumbnailPath = league.event?.thumbnailImagePath;
  const gameThumbnailPath = league.event?.game?.thumbnailImagePath;
  const gameName = league.event?.game?.name ?? "";
  const rawName = league.event?.name ?? "";
  const displayName = rawName || "Evento sem nome";
  const isApproved = league.event?.isApproved ?? false;
  const startDate = formatShortEventDate(league.event?.startDate, locale);
  const endDate = formatShortEventDate(league.event?.endDate, locale);
  const eventDateLabel =
    status === "FINISHED" && endDate
      ? t("dateEnded", { date: endDate })
      : startDate
        ? t("dateStarts", { date: startDate })
        : endDate
          ? t("dateEnds", { date: endDate })
          : t("noDate");
  const visibleTopEntries = topEntries.slice(
    0,
    Math.max(1, Math.min(topEntries.length, leaderboardRowCapacity)),
  );

  useEffect(() => {
    const element = leaderboardRef.current;
    if (!element || topEntries.length === 0) return;

    function updateRowCapacity() {
      if (!element) return;

      const nextCapacity = Math.max(
        1,
        Math.min(
          MAX_LEADERBOARD_ENTRIES,
          Math.floor(element.clientHeight / LEADERBOARD_ROW_HEIGHT),
        ),
      );

      setLeaderboardRowCapacity((currentCapacity) =>
        currentCapacity === nextCapacity ? currentCapacity : nextCapacity,
      );
    }

    updateRowCapacity();

    const observer = new ResizeObserver(updateRowCapacity);
    observer.observe(element);

    return () => observer.disconnect();
  }, [topEntries.length]);

  return (
    <Link
      href={`/games/${game}/events/${league.event?.slug ?? ""}` as Route}
      className="glass-panel group flex flex-col overflow-hidden rounded-2xl transition-all duration-300 select-none"
    >
      {/* Header: event title, game and quick metadata */}
      <div className="shrink-0 p-4 pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3
              className="text-foreground group-hover:text-gold truncate text-lg leading-tight font-bold transition-colors"
              title={displayName}
            >
              {displayName}
            </h3>

            <div className="mt-2 flex min-w-0 items-center gap-2">
              <div
                className="bg-card-strong relative h-5 w-[41.2px] shrink-0 overflow-hidden rounded"
                style={{ aspectRatio: 2.06 }}
              >
                {gameThumbnailPath ? (
                  <Image
                    src={cdnUrl(gameThumbnailPath)!}
                    alt={gameName}
                    fill
                    className="object-cover"
                    sizes="20px"
                  />
                ) : (
                  <div className="from-primary/70 to-gold/50 h-full w-full bg-linear-to-br" />
                )}
              </div>
              <span className="text-secondary/70 min-w-0 truncate text-xs font-semibold">
                {gameName}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-1.5 text-right">
            <p className="text-xs font-semibold whitespace-nowrap text-white/55">
              {t("players", { count })}
            </p>

            <div className="flex max-w-34 flex-wrap justify-end gap-1">
              {isApproved ? (
                <span
                  title={t("official")}
                  aria-label={t("official")}
                  className="border-primary/45 from-primary to-primary-strong shadow-primary/20 inline-flex size-5 items-center justify-center rounded-md border bg-linear-to-b text-white shadow-[0_0_12px]"
                >
                  <BadgeCheck className="size-3.5" aria-hidden="true" />
                </span>
              ) : null}
              <span
                className={cn(
                  "inline-flex h-5 items-center rounded-full border px-2 text-[9px] font-bold tracking-wide whitespace-nowrap uppercase",
                  systemCfg.className,
                )}
              >
                {systemCfg.label}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Thumbnail strip + leaderboard overlay */}
      <div
        className="relative w-full border-y border-white/[0.04]"
        style={{ aspectRatio: "92/43" }}
      >
        {/* Background: thumbnail or gradient */}
        {thumbnailPath ? (
          <Image
            src={cdnUrl(thumbnailPath)!}
            alt={league.event?.name ?? ""}
            fill
            className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:blur-[2px]"
            sizes="(max-width: 1280px) 100vw, 560px"
          />
        ) : (
          <div className="from-primary via-primary/70 to-gold/60 h-full w-full bg-linear-to-br" />
        )}

        {/* Static finish for the resting thumbnail state */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_65%_at_78%_88%,color-mix(in_srgb,var(--gold)_18%,transparent),transparent_68%)] opacity-70 transition-opacity duration-400 group-hover:opacity-0" />
        <div className="bg-gold/18 pointer-events-none absolute inset-x-0 top-0 h-px" />

        {/* Cinematic gradient for text contrast */}
        <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/15 to-transparent transition-all duration-400 group-hover:from-black/90 group-hover:via-black/55" />

        {/* Extra veil on hover for leaderboard contrast */}
        <div className="absolute inset-0 bg-black/0 transition-all duration-400 group-hover:bg-black/50" />

        {/* Leaderboard — invisible by default, cascades in on hover */}
        <div className="absolute inset-0 overflow-hidden px-4 py-3">
          {topEntries.length > 0 ? (
            <div ref={leaderboardRef} className="h-full overflow-hidden">
              <ul className="w-full">
                {visibleTopEntries.map((entry, idx) => {
                  const score = getScore(entry.stats);
                  const hasDivider = idx < visibleTopEntries.length - 1;
                  return (
                    <li
                      key={entry.id}
                      className={cn(
                        "relative flex items-center gap-2 py-1.5 first:pt-0 last:pb-0",
                        "translate-y-2 opacity-0 transition-all duration-300",
                        "group-hover:translate-y-0",
                        getLeaderboardRowEffect(idx, leaderboardRowCapacity),
                      )}
                      style={{ transitionDelay: `${idx * 55}ms` }}
                    >
                      {hasDivider ? (
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute right-0 bottom-0 left-7 h-px bg-white/[0.07]"
                        />
                      ) : null}

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
                        {score != null
                          ? isElo
                            ? score.toFixed(0)
                            : score
                          : "—"}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <div className="w-full translate-y-2 text-center text-xs text-white/35 italic opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              {t("noPlayers")}
            </div>
          )}
        </div>
      </div>

      {/* Footer: status + affordance */}
      <div className="flex min-h-11 shrink-0 items-center justify-between gap-3 border-t border-white/[0.05] px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={cn(
              "inline-flex h-6 shrink-0 items-center rounded-full border px-2.5 text-[10px] font-bold whitespace-nowrap",
              statusCfg.className,
            )}
          >
            {statusCfg.label}
          </span>
          <span className="min-w-0 truncate text-[10px] font-medium text-white/35">
            {eventDateLabel}
          </span>
        </div>
        <ChevronRight className="text-gold/70 size-4 shrink-0 transition-all duration-200 group-hover:translate-x-1 group-hover:text-[color-mix(in_srgb,var(--gold)_78%,white)]" />
      </div>
    </Link>
  );
}
