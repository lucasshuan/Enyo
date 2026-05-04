"use client";

import { useMemo, useState } from "react";
import type { Route } from "next";
import { type LucideIcon, ShieldCheck, Table, Trophy } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { SegmentedTabs, type SegmentedTabItem } from "@/components/ui/tabs";
import { LeagueCard } from "@/components/cards/league-card";
import { type GetLeaguesQuery } from "@/lib/apollo/generated/graphql";
import { cn } from "@/lib/utils/helpers";

type LeagueNode = NonNullable<GetLeaguesQuery["leagues"]["nodes"][number]>;

type GameEventsSectionProps = {
  leagues: LeagueNode[];
  gameSlug: string;
};

const MAIN_LEAGUE_COUNT = 3;
const INITIAL_COMPACT_COUNT = 7;
const COMPACT_INCREMENT = 5;

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "border-success/35 bg-success/10 text-success",
  REGISTRATION: "border-primary/35 bg-primary/10 text-primary",
  DRAFT: "border-warning/35 bg-warning/10 text-warning",
  FINISHED: "border-primary/25 bg-primary/8 text-primary/80",
  CANCELLED: "border-danger/35 bg-danger/10 text-danger",
};

const SYSTEM_STYLES: Record<string, string> = {
  ELO: "text-gold",
  POINTS: "text-primary",
};

function isFeaturedLeague(league: LeagueNode) {
  const config = league.config;
  if (!config || typeof config !== "object" || Array.isArray(config)) {
    return false;
  }

  const flags = config as Record<string, unknown>;
  return flags.featured === true || flags.isFeatured === true;
}

function getParticipantCount(league: LeagueNode) {
  return league.event?.entriesCount ?? 0;
}

function compareLeagues(current: LeagueNode, next: LeagueNode) {
  const featuredDelta =
    Number(isFeaturedLeague(next)) - Number(isFeaturedLeague(current));
  if (featuredDelta !== 0) return featuredDelta;

  const officialDelta =
    Number(next.event?.isApproved ?? false) -
    Number(current.event?.isApproved ?? false);
  if (officialDelta !== 0) return officialDelta;

  const participantDelta =
    getParticipantCount(next) - getParticipantCount(current);
  if (participantDelta !== 0) return participantDelta;

  return (current.event?.name ?? "").localeCompare(next.event?.name ?? "");
}

function getStatusLabel(
  status: string | undefined,
  t: ReturnType<typeof useTranslations>,
) {
  switch (status) {
    case "ACTIVE":
      return t("statusActive");
    case "REGISTRATION":
      return t("statusRegistration");
    case "DRAFT":
      return t("statusDraft");
    case "FINISHED":
      return t("statusFinished");
    case "CANCELLED":
      return t("statusCancelled");
    default:
      return status ?? t("statusUnknown");
  }
}

export function GameEventsSection({
  leagues,
  gameSlug,
}: GameEventsSectionProps) {
  const t = useTranslations("GamePage");
  const [compactCount, setCompactCount] = useState(INITIAL_COMPACT_COUNT);
  const [activeTab, setActiveTab] = useState<"leagues" | "tournaments">(
    "leagues",
  );

  const sortedLeagues = useMemo(
    () => [...leagues].sort(compareLeagues),
    [leagues],
  );
  const mainLeagues = sortedLeagues.slice(0, MAIN_LEAGUE_COUNT);
  const compactLeagues = sortedLeagues.slice(MAIN_LEAGUE_COUNT);
  const visibleCompactLeagues = compactLeagues.slice(0, compactCount);
  const hasMoreCompactLeagues =
    visibleCompactLeagues.length < compactLeagues.length;
  const tabs: SegmentedTabItem<"leagues" | "tournaments">[] = [
    {
      id: "leagues",
      label: t("leagueTab"),
      count: sortedLeagues.length,
      icon: Table,
    },
    {
      id: "tournaments",
      label: t("tournamentTab"),
      count: 0,
      icon: Trophy,
    },
  ];

  return (
    <div className="space-y-5">
      <SegmentedTabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        ariaLabel={t("eventsTitle")}
        className="max-w-96 min-w-82"
      />

      {activeTab === "leagues" && (
        <div
          id="leagues-panel"
          role="tabpanel"
          aria-labelledby="leagues-tab"
          className="animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          {sortedLeagues.length > 0 ? (
            <div className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {mainLeagues.map((league) => (
                  <LeagueCard
                    key={league.eventId}
                    league={league}
                    game={gameSlug}
                  />
                ))}
              </div>

              {visibleCompactLeagues.length > 0 && (
                <div className="space-y-2">
                  {visibleCompactLeagues.map((league) => (
                    <CompactLeagueRow
                      key={league.eventId}
                      league={league}
                      gameSlug={gameSlug}
                      t={t}
                    />
                  ))}
                </div>
              )}

              {hasMoreCompactLeagues && (
                <div className="flex justify-center pt-1">
                  <button
                    type="button"
                    onClick={() =>
                      setCompactCount((current) => current + COMPACT_INCREMENT)
                    }
                    className="border-gold-dim/35 bg-card-strong/50 text-secondary hover:border-gold-dim/55 hover:text-foreground h-10 rounded-xl border px-4 text-sm font-medium transition-all"
                  >
                    {t("showMoreLeagues")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <EmptyEventState
              icon={Table}
              title={t("noLeagues")}
              description={t("noLeaguesDescription")}
            />
          )}
        </div>
      )}

      {activeTab === "tournaments" && (
        <div
          id="tournaments-panel"
          role="tabpanel"
          aria-labelledby="tournaments-tab"
          className="animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <EmptyEventState
            icon={Trophy}
            title={t("noTournaments")}
            description={t("noTournamentsDescription")}
          />
        </div>
      )}
    </div>
  );
}

function EmptyEventState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="glass-panel no-hover flex flex-col items-center justify-center rounded-3xl p-12 text-center">
      <div className="border-border/40 bg-card-strong/60 mb-4 flex size-16 items-center justify-center rounded-2xl border">
        <Icon className="text-muted size-8" />
      </div>
      <p className="text-base font-medium">{title}</p>
      <p className="text-muted mt-2 max-w-sm text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function CompactLeagueRow({
  league,
  gameSlug,
  t,
}: {
  league: LeagueNode;
  gameSlug: string;
  t: ReturnType<typeof useTranslations>;
}) {
  const event = league.event;
  const status = event?.status ?? "DRAFT";
  const isOfficial = event?.isApproved ?? false;
  const isFeatured = isFeaturedLeague(league);

  return (
    <Link
      href={`/games/${gameSlug}/events/${event?.slug ?? ""}` as Route}
      className="border-border bg-card-strong/35 hover:border-gold-dim/45 hover:bg-card-strong/55 group grid min-h-12 grid-cols-[minmax(0,1fr)] items-center gap-2 rounded-xl border px-3 py-2 transition-all sm:grid-cols-[minmax(0,1fr)_auto] lg:grid-cols-[minmax(0,1fr)_auto_auto_auto]"
    >
      <div className="min-w-0">
        <p className="group-hover:text-foreground truncate text-sm font-semibold text-white/85 transition-colors">
          {event?.name ?? ""}
        </p>
      </div>

      <div className="text-muted flex items-center gap-2 text-xs">
        <span>
          {t("eventParticipants", { count: getParticipantCount(league) })}
        </span>
        <span
          className={cn(
            "font-semibold",
            SYSTEM_STYLES[league.classificationSystem] ?? "text-secondary",
          )}
        >
          {league.classificationSystem}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {isFeatured && (
          <span className="border-gold/35 bg-gold/10 text-gold inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold">
            {t("featuredBadge")}
          </span>
        )}
        {isOfficial && (
          <span className="border-primary/35 bg-primary/10 text-primary inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold">
            <ShieldCheck className="size-3" />
            {t("officialBadge")}
          </span>
        )}
      </div>

      <span
        className={cn(
          "inline-flex w-fit items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold",
          STATUS_STYLES[status] ?? "border-border bg-card-strong/60 text-muted",
        )}
      >
        {getStatusLabel(status, t)}
      </span>
    </Link>
  );
}
