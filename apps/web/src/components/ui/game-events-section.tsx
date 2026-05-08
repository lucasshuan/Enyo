"use client";

import {
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  CheckCircle2,
  ListFilter,
  Search,
  SlidersHorizontal,
  Sparkles,
  Table,
  X,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { LeagueCard } from "@/components/cards/league-card";
import { CustomSelect } from "@/components/ui/custom-select";
import { SectionHeader } from "@/components/ui/section-header";
import { type GetLeaguesQuery } from "@/lib/apollo/generated/graphql";
import { cn } from "@/lib/utils/helpers";

type LeagueNode = NonNullable<GetLeaguesQuery["leagues"]["nodes"][number]>;
type EventTypeFilter = "ALL" | "LEAGUE" | "TOURNAMENT";
type StatusFilter =
  | "ALL"
  | "ACTIVE"
  | "REGISTRATION"
  | "DRAFT"
  | "FINISHED"
  | "CANCELLED";
type SystemFilter = "ALL" | "ELO" | "POINTS";
type HighlightFilter = "ALL" | "OFFICIAL" | "FEATURED";
type SortOption = "recommended" | "participants" | "alphabetical";

type GameEventsSectionProps = {
  leagues: LeagueNode[];
  gameSlug: string;
  action?: ReactNode;
};

const STATUS_FILTERS: {
  value: StatusFilter;
  labelKey: string;
}[] = [
  { value: "ALL", labelKey: "allStatuses" },
  { value: "REGISTRATION", labelKey: "statusRegistration" },
  { value: "ACTIVE", labelKey: "statusActive" },
  { value: "DRAFT", labelKey: "statusDraft" },
  { value: "FINISHED", labelKey: "statusFinished" },
  { value: "CANCELLED", labelKey: "statusCancelled" },
];

const SYSTEM_FILTERS: {
  value: SystemFilter;
  labelKey: string;
}[] = [
  { value: "ALL", labelKey: "allSystems" },
  { value: "ELO", labelKey: "systemElo" },
  { value: "POINTS", labelKey: "systemPoints" },
];

const SORT_OPTIONS: {
  value: SortOption;
  labelKey: string;
}[] = [
  { value: "recommended", labelKey: "sortRecommended" },
  { value: "participants", labelKey: "sortParticipants" },
  { value: "alphabetical", labelKey: "sortAlphabetical" },
];

const HIGHLIGHT_FILTERS: {
  value: HighlightFilter;
  labelKey: string;
}[] = [
  { value: "ALL", labelKey: "allHighlights" },
  { value: "OFFICIAL", labelKey: "filterOfficial" },
  { value: "FEATURED", labelKey: "filterFeatured" },
];

const EVENT_TYPE_FILTERS: {
  value: EventTypeFilter;
  labelKey: string;
}[] = [
  { value: "ALL", labelKey: "eventTypeAll" },
  { value: "LEAGUE", labelKey: "eventTypeLeagues" },
  { value: "TOURNAMENT", labelKey: "eventTypeTournaments" },
];

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

function getEventType(league: LeagueNode): Exclude<EventTypeFilter, "ALL"> {
  return league.event?.type === "TOURNAMENT" ? "TOURNAMENT" : "LEAGUE";
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

function sortLeagues(leagues: LeagueNode[], sortBy: SortOption) {
  const sorted = [...leagues];

  if (sortBy === "alphabetical") {
    return sorted.sort((current, next) =>
      (current.event?.name ?? "").localeCompare(next.event?.name ?? ""),
    );
  }

  if (sortBy === "participants") {
    return sorted.sort((current, next) => {
      const participantDelta =
        getParticipantCount(next) - getParticipantCount(current);
      if (participantDelta !== 0) return participantDelta;
      return compareLeagues(current, next);
    });
  }

  return sorted.sort(compareLeagues);
}

function getSearchText(league: LeagueNode) {
  return [league.event?.name, league.event?.status, league.classificationSystem]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function GameEventsSection({
  leagues,
  gameSlug,
  action,
}: GameEventsSectionProps) {
  const t = useTranslations("GamePage");
  const [eventTypeFilter, setEventTypeFilter] =
    useState<EventTypeFilter>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [systemFilter, setSystemFilter] = useState<SystemFilter>("ALL");
  const [highlightFilter, setHighlightFilter] =
    useState<HighlightFilter>("ALL");
  const [sortBy, setSortBy] = useState<SortOption>("recommended");

  const sortedLeagues = useMemo(
    () => [...leagues].sort(compareLeagues),
    [leagues],
  );
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  const baseFilteredLeagues = useMemo(() => {
    let visibleLeagues = sortedLeagues;

    if (normalizedSearchTerm) {
      visibleLeagues = visibleLeagues.filter((league) =>
        getSearchText(league).includes(normalizedSearchTerm),
      );
    }

    if (statusFilter !== "ALL") {
      visibleLeagues = visibleLeagues.filter(
        (league) => league.event?.status === statusFilter,
      );
    }

    if (systemFilter !== "ALL") {
      visibleLeagues = visibleLeagues.filter(
        (league) => league.classificationSystem === systemFilter,
      );
    }

    if (highlightFilter === "OFFICIAL") {
      visibleLeagues = visibleLeagues.filter(
        (league) => league.event?.isApproved ?? false,
      );
    }

    if (highlightFilter === "FEATURED") {
      visibleLeagues = visibleLeagues.filter(isFeaturedLeague);
    }

    return visibleLeagues;
  }, [
    highlightFilter,
    normalizedSearchTerm,
    sortedLeagues,
    statusFilter,
    systemFilter,
  ]);

  const eventTypeCounts = useMemo<Record<EventTypeFilter, number>>(
    () => ({
      ALL: baseFilteredLeagues.length,
      LEAGUE: baseFilteredLeagues.filter(
        (league) => getEventType(league) === "LEAGUE",
      ).length,
      TOURNAMENT: baseFilteredLeagues.filter(
        (league) => getEventType(league) === "TOURNAMENT",
      ).length,
    }),
    [baseFilteredLeagues],
  );

  const filteredLeagues = useMemo(() => {
    const visibleLeagues =
      eventTypeFilter === "ALL"
        ? baseFilteredLeagues
        : baseFilteredLeagues.filter(
            (league) => getEventType(league) === eventTypeFilter,
          );

    return sortLeagues(visibleLeagues, sortBy);
  }, [baseFilteredLeagues, eventTypeFilter, sortBy]);

  const hasContextualFilters =
    normalizedSearchTerm.length > 0 ||
    statusFilter !== "ALL" ||
    systemFilter !== "ALL" ||
    highlightFilter !== "ALL";

  const hasActiveFilters = hasContextualFilters || sortBy !== "recommended";

  function resetFilters() {
    setSearchTerm("");
    setStatusFilter("ALL");
    setSystemFilter("ALL");
    setHighlightFilter("ALL");
    setSortBy("recommended");
  }

  const emptyStateTitle =
    hasContextualFilters && sortedLeagues.length > 0
      ? t("noFilteredEvents")
      : eventTypeFilter === "LEAGUE"
        ? t("noLeagues")
        : eventTypeFilter === "TOURNAMENT"
          ? t("noTournaments")
          : t("noEvents");
  const emptyStateDescription =
    hasContextualFilters && sortedLeagues.length > 0
      ? t("noFilteredEventsDescription")
      : eventTypeFilter === "LEAGUE"
        ? t("noLeaguesDescription")
        : eventTypeFilter === "TOURNAMENT"
          ? t("noTournamentsDescription")
          : t("noEventsDescription");

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(15rem,18rem)_minmax(0,1fr)] xl:grid-cols-[18rem_minmax(0,1fr)]">
      <aside className="border-gold-dim/25 bg-card/70 rounded-2xl border p-3 shadow-[0_18px_70px_rgb(0_0_0/0.2),inset_0_1px_0_rgb(255_255_255/0.03)] lg:sticky lg:top-24 lg:self-start">
        <div className="space-y-3">
          {action ? <div>{action}</div> : null}

          <div className="relative">
            <Search className="text-muted/50 pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <input
              value={searchTerm}
              aria-label={t("searchPlaceholder")}
              placeholder={t("searchPlaceholder")}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="focus:border-gold/45 focus:ring-gold/10 border-gold-dim/35 bg-card-strong/50 text-secondary placeholder:text-secondary/30 h-10 w-full rounded-xl border pr-9 pl-9 text-sm outline-hidden transition-all focus:ring-3"
            />
            {searchTerm ? (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="text-muted/45 hover:text-secondary absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
                aria-label={t("clearEventFilters")}
              >
                <X className="size-4" />
              </button>
            ) : null}
          </div>

          <div className="flex flex-col gap-1">
            <CompactSelect
              icon={SlidersHorizontal}
              label={t("sortLabel")}
              value={sortBy}
              onChange={setSortBy}
              options={SORT_OPTIONS.map((option) => ({
                value: option.value,
                label: t(option.labelKey),
              }))}
            />
            <CompactSelect
              icon={ListFilter}
              label={t("statusLabel")}
              value={statusFilter}
              onChange={setStatusFilter}
              options={STATUS_FILTERS.map((option) => ({
                value: option.value,
                label: t(option.labelKey),
              }))}
            />
            <CompactSelect
              icon={CheckCircle2}
              label={t("systemLabel")}
              value={systemFilter}
              onChange={setSystemFilter}
              options={SYSTEM_FILTERS.map((option) => ({
                value: option.value,
                label: t(option.labelKey),
              }))}
            />
            <CompactSelect
              icon={Sparkles}
              label={t("highlightsLabel")}
              value={highlightFilter}
              onChange={setHighlightFilter}
              options={HIGHLIGHT_FILTERS.map((option) => ({
                value: option.value,
                label: t(option.labelKey),
              }))}
            />
          </div>

          <button
            type="button"
            onClick={resetFilters}
            disabled={!hasActiveFilters}
            className="border-gold-dim/30 bg-card-strong/35 text-muted hover:border-gold-dim/55 hover:text-foreground disabled:text-muted/35 disabled:hover:border-gold-dim/30 disabled:hover:text-muted/35 flex h-9 w-full items-center justify-center gap-2 rounded-xl border text-xs font-semibold transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-55 disabled:active:scale-100"
          >
            <X className="size-3.5" />
            {t("clearEventFilters")}
          </button>
        </div>
      </aside>

      <section className="min-w-0 space-y-4">
        <SectionHeader
          title={t("eventListTitle")}
          description={t("eventListDescription")}
          actions={
            <div className="border-gold-dim/25 bg-card-strong/35 text-secondary flex h-9 w-fit items-center rounded-full border px-3 text-xs font-semibold">
              {t("eventListSummary", {
                shown: filteredLeagues.length,
                total: sortedLeagues.length,
              })}
            </div>
          }
        />

        <EventTypeTabs
          activeFilter={eventTypeFilter}
          ariaLabel={t("eventTypeTabsAriaLabel")}
          onChange={setEventTypeFilter}
          tabs={EVENT_TYPE_FILTERS.map((filter) => ({
            value: filter.value,
            label: t(filter.labelKey),
            count: eventTypeCounts[filter.value],
          }))}
        />

        {filteredLeagues.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredLeagues.map((league) => (
              <LeagueCard
                key={league.eventId}
                league={league}
                game={gameSlug}
              />
            ))}
          </div>
        ) : (
          <EmptyEventState
            icon={Table}
            title={emptyStateTitle}
            description={emptyStateDescription}
          />
        )}
      </section>
    </div>
  );
}

function EventTypeTabs({
  activeFilter,
  ariaLabel,
  tabs,
  onChange,
}: {
  activeFilter: EventTypeFilter;
  ariaLabel: string;
  tabs: { value: EventTypeFilter; label: string; count: number }[];
  onChange: (value: EventTypeFilter) => void;
}) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicator, setIndicator] = useState<{
    left: number;
    width: number;
  } | null>(null);
  const activeIndex = tabs.findIndex((tab) => tab.value === activeFilter);

  useLayoutEffect(() => {
    const el = tabRefs.current[activeIndex];
    if (!el) return;
    setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
  }, [activeIndex]);

  return (
    <div className="custom-scrollbar overflow-x-auto">
      <div
        className="border-gold-dim/25 bg-card-strong/30 relative inline-flex min-w-full items-center gap-1 rounded-2xl border p-1 sm:min-w-0"
        role="tablist"
        aria-label={ariaLabel}
      >
        {indicator ? (
          <span
            aria-hidden
            className="border-primary/35 from-primary/22 to-primary-strong/18 absolute rounded-xl border bg-linear-to-b shadow-[0_10px_30px_rgb(0_0_0/0.22)] transition-[left,width] duration-300 ease-in-out"
            style={{
              left: indicator.left,
              width: indicator.width,
              top: 4,
              bottom: 4,
            }}
          />
        ) : null}

        {tabs.map((tab, index) => {
          const selected = tab.value === activeFilter;

          return (
            <button
              key={tab.value}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onChange(tab.value)}
              className={cn(
                "relative z-10 flex flex-1 items-center justify-center gap-2 rounded-xl border border-transparent px-3 py-2 text-sm font-semibold whitespace-nowrap transition-colors duration-200 sm:flex-none",
                selected
                  ? "text-foreground"
                  : "text-secondary/65 hover:text-secondary",
              )}
            >
              <span>{tab.label}</span>
              <span
                className={cn(
                  "rounded-full border px-2 py-0.5 text-[10px] font-bold tabular-nums transition-colors duration-200",
                  selected
                    ? "border-primary/30 bg-primary/15 text-primary"
                    : "border-gold-dim/20 bg-card/55 text-secondary/55",
                )}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CompactLabel({
  icon: Icon,
  label,
}: {
  icon: LucideIcon;
  label: string;
}) {
  return (
    <div className="text-muted/55 flex min-w-0 flex-1 items-center gap-1.5 text-[10px] font-semibold tracking-[0.12em] uppercase">
      <Icon className="size-3" />
      <span className="truncate">{label}</span>
    </div>
  );
}

function CompactSelect<T extends string>({
  icon: Icon,
  label,
  value,
  options,
  onChange,
}: {
  icon: LucideIcon;
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="bg-card-strong/10 hover:bg-card-strong/20 flex items-center gap-3 rounded-xl px-2.5 py-2 transition-colors">
      <CompactLabel icon={Icon} label={label} />
      <CustomSelect
        value={value}
        onChange={onChange}
        options={options}
        className="w-36 shrink-0"
        triggerClassName="h-7 w-full rounded-lg border-0 bg-transparent px-1 py-0 text-xs text-secondary hover:bg-transparent hover:text-foreground"
      />
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
    <div className="border-gold-dim/25 bg-card/55 flex min-h-80 flex-col items-center justify-center rounded-2xl border p-8 text-center shadow-[0_18px_70px_rgb(0_0_0/0.16),inset_0_1px_0_rgb(255_255_255/0.03)]">
      <Icon className="text-secondary mb-4 size-10 opacity-40" />
      <h3 className="text-foreground text-lg font-semibold">{title}</h3>
      <p className="text-muted/45 mt-2 max-w-md text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}
