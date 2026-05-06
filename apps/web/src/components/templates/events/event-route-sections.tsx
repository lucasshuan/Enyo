"use client";

import {
  Construction,
  History,
  Home,
  ListOrdered,
  MessageSquareText,
  Sparkles,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { LeagueLeaderboardFullTable } from "@/components/tables/league-leaderboard-full-table";
import type {
  GetEventEntriesQuery,
  GetLeagueQuery,
} from "@/lib/apollo/generated/graphql";
import { cn } from "@/lib/utils/helpers";

type LeagueNode = NonNullable<GetLeagueQuery["league"]>;
type EntriesData = GetEventEntriesQuery["eventEntries"];
type ComingSoonSection = "overview" | "forum" | "players" | "matches";

interface EventLeaderboardSectionProps {
  league: LeagueNode;
  entries: EntriesData;
}

export function EventLeaderboardSection({
  league,
  entries,
}: EventLeaderboardSectionProps) {
  const t = useTranslations("EventPage");
  const event = league.event!;

  return (
    <section className="mx-auto min-h-[24rem] w-full max-w-[1600px] px-5 pt-5 pb-12 sm:px-6 lg:px-8">
      <div className="space-y-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-muted/55 mb-2 flex items-center gap-2 text-[10px] font-semibold tracking-[0.14em] uppercase">
              <ListOrdered className="size-3.5" />
              {t("sectionTabLeaderboard")}
            </div>
            <h2 className="text-foreground text-2xl font-bold tracking-tight">
              {t("leaderboardTitle")}
            </h2>
            <p className="text-muted/55 mt-1 max-w-2xl text-sm leading-6">
              {t("leaderboardDescription")}
            </p>
          </div>

          <div className="border-gold-dim/25 bg-card-strong/35 text-secondary flex h-9 w-fit items-center rounded-full border px-3 text-xs font-semibold">
            {event.name} · {league.classificationSystem}
          </div>
        </div>

        <LeagueLeaderboardFullTable
          entries={entries.nodes}
          classificationSystem={league.classificationSystem}
          allowDraw={league.allowDraw}
        />
      </div>
    </section>
  );
}

export function EventComingSoonSection({
  section,
}: {
  section: ComingSoonSection;
}) {
  const t = useTranslations("EventPage");
  const content = {
    overview: {
      icon: Home,
      title: t("comingSoonOverviewTitle"),
      description: t("comingSoonOverviewDescription"),
      accent: "primary",
    },
    forum: {
      icon: MessageSquareText,
      title: t("comingSoonForumTitle"),
      description: t("comingSoonForumDescription"),
      accent: "blue",
    },
    players: {
      icon: UsersRound,
      title: t("comingSoonPlayersTitle"),
      description: t("comingSoonPlayersDescription"),
      accent: "emerald",
    },
    matches: {
      icon: History,
      title: t("comingSoonMatchesTitle"),
      description: t("comingSoonMatchesDescription"),
      accent: "red",
    },
  } satisfies Record<
    ComingSoonSection,
    {
      icon: LucideIcon;
      title: string;
      description: string;
      accent: "primary" | "blue" | "emerald" | "red";
    }
  >;

  const { icon: Icon, title, description, accent } = content[section];
  const stages = [
    t("comingSoonStageDesign"),
    t("comingSoonStageData"),
    t("comingSoonStageRelease"),
  ];

  return (
    <section className="mx-auto min-h-[24rem] w-full max-w-[1600px] px-5 pt-5 pb-12 sm:px-6 lg:px-8">
      <div className="border-gold-dim/25 bg-card/70 animate-in fade-in slide-in-from-bottom-2 relative overflow-hidden rounded-3xl border shadow-[0_18px_70px_rgb(0_0_0/0.2),inset_0_1px_0_rgb(255_255_255/0.03)] duration-300">
        <div
          aria-hidden="true"
          className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:28px_28px] opacity-35"
        />
        <div
          aria-hidden="true"
          className={cn(
            "absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent",
            accent === "blue" && "via-sky-400/70",
            accent === "emerald" && "via-emerald-300/70",
            accent === "red" && "via-red-400/70",
            accent === "primary" && "via-gold/75",
          )}
        />

        <div className="relative grid min-h-96 gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-center">
          <div className="max-w-2xl">
            <div
              className={cn(
                "mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-bold tracking-[0.12em] uppercase",
                accent === "blue" &&
                  "border-sky-400/25 bg-sky-400/10 text-sky-200",
                accent === "emerald" &&
                  "border-emerald-300/25 bg-emerald-300/10 text-emerald-200",
                accent === "red" &&
                  "border-red-400/25 bg-red-400/10 text-red-200",
                accent === "primary" &&
                  "border-gold/25 bg-gold/10 text-secondary",
              )}
            >
              <Construction className="size-3.5" />
              {t("comingSoonBadge")}
            </div>

            <div className="flex items-start gap-4">
              <span
                className={cn(
                  "flex size-13 shrink-0 items-center justify-center rounded-2xl border shadow-[inset_0_1px_0_rgb(255_255_255/0.08)]",
                  accent === "blue" &&
                    "border-sky-400/25 bg-sky-400/10 text-sky-200",
                  accent === "emerald" &&
                    "border-emerald-300/25 bg-emerald-300/10 text-emerald-200",
                  accent === "red" &&
                    "border-red-400/25 bg-red-400/10 text-red-200",
                  accent === "primary" &&
                    "border-gold/25 bg-gold/10 text-secondary",
                )}
              >
                <Icon className="size-6" />
              </span>

              <div className="min-w-0">
                <h2 className="text-foreground text-2xl leading-tight font-bold tracking-tight sm:text-3xl">
                  {title}
                </h2>
                <p className="text-muted/55 mt-3 max-w-xl text-sm leading-6">
                  {description}
                </p>
              </div>
            </div>
          </div>

          <div className="border-gold-dim/25 bg-background/45 rounded-2xl border p-4 shadow-[inset_0_1px_0_rgb(255_255_255/0.04)]">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="text-muted/50 flex items-center gap-2 text-[10px] font-semibold tracking-[0.14em] uppercase">
                <Sparkles className="size-3.5" />
                {t("comingSoonPanelLabel")}
              </div>
              <span className="bg-primary h-2 w-2 rounded-full shadow-[0_0_16px_rgb(232_166_49/0.75)]" />
            </div>

            <div className="space-y-3">
              {stages.map((stage, index) => (
                <div key={stage} className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-lg border text-[11px] font-bold tabular-nums",
                      index === 0
                        ? "border-gold/30 bg-gold/12 text-secondary"
                        : "text-muted/50 border-white/8 bg-white/5",
                    )}
                  >
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div
                      className={cn(
                        "h-2 rounded-full",
                        index === 0
                          ? "from-gold/80 via-gold-dim/50 bg-linear-to-r to-white/10"
                          : "bg-white/7",
                      )}
                    />
                    <p className="text-muted/50 mt-1.5 truncate text-xs font-medium">
                      {stage}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
