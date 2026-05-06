"use client";

import Image from "next/image";
import type { Route } from "next";
import { Globe } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/routing";
import { type GetLeaguesQuery } from "@/lib/apollo/generated/graphql";
import { cn } from "@/lib/utils/helpers";
import { cdnUrl } from "@/lib/utils/cdn";

type LeagueNode = NonNullable<GetLeaguesQuery["leagues"]["nodes"][number]>;
type TopEntry = NonNullable<
  NonNullable<LeagueNode["event"]>["topEntries"]
>[number];

interface EventCardProps {
  event: LeagueNode;
}

const SYSTEM_CONFIG: Record<string, string> = {
  ELO: "text-gold",
  POINTS: "text-primary",
};

function getScore(entry: TopEntry): number | null {
  const stats = entry.stats;
  if (!stats || typeof stats !== "object" || Array.isArray(stats)) return null;

  const data = stats as Record<string, unknown>;
  const score = data.elo ?? data.currentElo ?? data.points;

  return typeof score === "number" ? score : null;
}

export function EventCard({ event }: EventCardProps) {
  const t = useTranslations("EventsPage");

  const data = event.event;
  const isTournament = data?.type === "TOURNAMENT";
  const isApproved = data?.isApproved ?? false;
  const gameName = data?.game?.name ?? "";
  const gameThumbnail = data?.game?.thumbnailImagePath;
  const gameSlug = data?.game?.slug ?? "";
  const eventSlug = data?.slug ?? "";
  const eventName = data?.name ?? "";
  const entriesCount = data?.entriesCount ?? 0;
  const topEntries = (data?.topEntries ?? []).slice(0, 6);

  return (
    <Link
      href={`/games/${gameSlug}/events/${eventSlug}` as Route}
      className="glass-panel group hover:border-gold/35 hover:bg-gold/5 relative flex h-full min-h-80 flex-col overflow-hidden rounded-xl p-5 transition-all select-none active:scale-[0.99]"
    >
      <div className="relative z-10 mb-4 flex shrink-0 items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1.5">
          <h3 className="group-hover:text-gold line-clamp-2 text-xl leading-tight font-bold transition-colors">
            {eventName}
          </h3>

          <div className="flex items-center gap-1.5">
            {gameThumbnail ? (
              <Image
                src={cdnUrl(gameThumbnail)!}
                alt={gameName}
                width={16}
                height={16}
                className="size-4 rounded-sm object-cover opacity-75"
              />
            ) : null}
            <span className="text-muted truncate text-xs font-medium">
              {gameName}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <div className="text-muted rounded-full border border-white/6 bg-white/5 px-3 py-1 text-[10px] font-semibold whitespace-nowrap">
            {t("players", { count: entriesCount })}
          </div>
          <div className="flex flex-wrap justify-end gap-1.5">
            <span
              className={cn(
                "rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
                isTournament
                  ? "border-amber-400/25 bg-amber-500/12 text-amber-300"
                  : "border-primary/25 bg-primary/15 text-primary",
              )}
            >
              {isTournament ? t("tournamentType") : t("leagueType")}
            </span>
            {!isApproved ? (
              <span className="rounded-full border border-amber-400/20 bg-amber-500/12 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-amber-300 uppercase">
                {t("pendingApproval")}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="border-gold/80 group-hover:border-gold mb-4 border-b transition-colors" />

      <div className="relative flex flex-1 flex-col">
        {topEntries.length > 0 ? (
          <div className="space-y-0.5">
            {topEntries.map((entry, index) => {
              const score = getScore(entry);
              const avatarPath = entry.user?.imagePath ?? entry.imagePath;
              const avatarUrl = avatarPath ? cdnUrl(avatarPath) : null;
              const country = entry.user?.country;

              return (
                <div
                  key={entry.id}
                  className="flex items-center gap-3 border-b border-white/5 py-2 last:border-0"
                  style={{
                    opacity:
                      index >= 3 ? Math.max(0, 1 - (index - 2) * 0.3) : 1,
                    filter:
                      index >= 4 ? `blur(${(index - 3) * 0.35}px)` : "none",
                  }}
                >
                  <span className="text-primary w-6 shrink-0 text-right font-mono text-[10px] font-bold">
                    #{index + 1}
                  </span>

                  {country ? (
                    <span
                      className={`fi fi-${country.toLowerCase()} h-3 w-4 shrink-0 rounded-xs`}
                      title={country.toUpperCase()}
                    />
                  ) : avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt={entry.displayName}
                      width={16}
                      height={16}
                      className="size-4 shrink-0 rounded-sm object-cover"
                    />
                  ) : (
                    <Globe className="size-3.5 shrink-0 text-white/30" />
                  )}

                  <span className="text-foreground/80 flex-1 truncate text-xs font-semibold transition-colors group-hover:text-white">
                    {entry.displayName}
                  </span>

                  <span
                    className={cn(
                      "shrink-0 font-mono text-[11px] font-bold opacity-75",
                      SYSTEM_CONFIG[event.classificationSystem] ??
                        "text-secondary",
                    )}
                  >
                    {score != null ? score.toFixed(0) : "-"}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-muted flex flex-1 items-center justify-center text-xs italic opacity-40">
            {t("noPlayers")}
          </div>
        )}
      </div>

      <div className="group-hover:text-gold mt-4 flex items-center justify-end text-[10px] font-bold tracking-widest text-white/20 uppercase transition-colors">
        View event →
      </div>
    </Link>
  );
}

export function EventCardSkeleton() {
  return (
    <div className="glass-panel flex h-full min-h-80 flex-col overflow-hidden rounded-xl p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex flex-1 flex-col gap-2">
          <div className="h-6 w-40 animate-pulse rounded bg-white/10" />
          <div className="h-3 w-24 animate-pulse rounded bg-white/5" />
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <div className="h-5 w-20 animate-pulse rounded-full bg-white/5" />
          <div className="h-4 w-14 animate-pulse rounded-full bg-white/5" />
        </div>
      </div>
      <div className="border-gold/80 mb-4 border-b" />
      <div className="space-y-2">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="flex items-center gap-3 py-1">
            <div className="h-3 w-5 animate-pulse rounded bg-white/10" />
            <div className="h-3 w-4 animate-pulse rounded bg-white/5" />
            <div className="h-3 flex-1 animate-pulse rounded bg-white/5" />
            <div className="h-3 w-8 animate-pulse rounded bg-white/5" />
          </div>
        ))}
      </div>
    </div>
  );
}
