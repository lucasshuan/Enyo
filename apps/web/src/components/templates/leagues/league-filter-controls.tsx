"use client";

import { useState } from "react";
import { ChevronDown, Settings2 } from "lucide-react";
import type { Route } from "next";
import { Link } from "@/i18n/routing";
import { SearchInput } from "@/components/ui/search-input";
import {
  GameFilterCombobox,
  type GameOption,
} from "@/components/ui/game-filter-combobox";
import { cn } from "@/lib/utils/helpers";

type Filters = {
  search?: string;
  sort?: string;
  game?: string;
  status?: string;
  system?: string;
};

type LeagueFilterTranslations = {
  filterToggle: string;
  clearFilters: string;
  sortLabel: string;
  statusLabel: string;
  systemLabel: string;
  gameLabel: string;
  gamePlaceholder: string;
  noGamesFound: string;
  sortRecent: string;
  sortAlphabetical: string;
  statusActive: string;
  statusRegistration: string;
  statusDraft: string;
  statusFinished: string;
  statusCancelled: string;
  systemElo: string;
  systemPoints: string;
};

type TextKey = keyof LeagueFilterTranslations;

const STATUS_OPTIONS: {
  value: string;
  labelKey: TextKey;
  activeClass: string;
}[] = [
  {
    value: "ACTIVE",
    labelKey: "statusActive",
    activeClass: "border-success/40 bg-success/10 text-success",
  },
  {
    value: "REGISTRATION",
    labelKey: "statusRegistration",
    activeClass: "border-primary/40 bg-primary/10 text-primary",
  },
  {
    value: "DRAFT",
    labelKey: "statusDraft",
    activeClass: "border-warning/40 bg-warning/10 text-warning",
  },
  {
    value: "FINISHED",
    labelKey: "statusFinished",
    activeClass: "border-primary/35 bg-primary/10 text-primary",
  },
  {
    value: "CANCELLED",
    labelKey: "statusCancelled",
    activeClass: "border-danger/40 bg-danger/10 text-danger",
  },
];

const SYSTEM_OPTIONS: {
  value: string;
  labelKey: TextKey;
  activeClass: string;
}[] = [
  {
    value: "ELO",
    labelKey: "systemElo",
    activeClass: "border-gold/40 bg-gold/10 text-gold",
  },
  {
    value: "POINTS",
    labelKey: "systemPoints",
    activeClass: "border-primary/40 bg-primary/10 text-primary",
  },
];

const SORT_OPTIONS: { value: string; labelKey: TextKey }[] = [
  { value: "", labelKey: "sortRecent" },
  { value: "name", labelKey: "sortAlphabetical" },
];

function buildUrl(base: Filters, overrides: Partial<Filters>): string {
  const merged = { ...base, ...overrides };
  const clean: Record<string, string> = {};

  for (const [key, value] of Object.entries(merged)) {
    if (value) clean[key] = value;
  }

  const query = new URLSearchParams(clean).toString();
  return query ? `?${query}` : "/leagues";
}

export function LeagueFilterControls({
  filters,
  games,
  searchPlaceholder,
  translations,
}: {
  filters: Filters;
  games: GameOption[];
  searchPlaceholder: string;
  translations: LeagueFilterTranslations;
}) {
  const hasGameOptions = games.length > 0;
  const hasPanelFilters = !!(filters.status || filters.system || filters.sort);
  const hasActiveFilters =
    hasPanelFilters || !!filters.search || !!filters.game;
  const [isOpen, setIsOpen] = useState(hasPanelFilters);

  const chipBase =
    "rounded-full border px-3 py-1 text-xs font-medium transition-all duration-150";
  const chipIdle =
    "border-border text-muted hover:border-gold-dim/55 hover:text-foreground";

  return (
    <div
      className={cn(
        "grid w-full grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 gap-y-3",
        hasGameOptions &&
          "md:grid-cols-[minmax(0,1fr)_minmax(12rem,16rem)_auto]",
      )}
    >
      <SearchInput
        defaultValue={filters.search}
        placeholder={searchPlaceholder}
        className={cn(
          "w-full max-w-none",
          hasGameOptions && "col-span-2 md:col-span-1",
        )}
      />

      {hasGameOptions && (
        <GameFilterCombobox
          games={games}
          currentGame={filters.game}
          placeholder={translations.gamePlaceholder}
          noResultsText={translations.noGamesFound}
          className="min-w-0"
          inputClassName="h-11 bg-card-strong/50"
        />
      )}

      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className={cn(
          "flex h-11 cursor-pointer items-center gap-2 rounded-xl border px-3 text-sm font-medium transition-all duration-200 select-none",
          hasPanelFilters
            ? "border-gold/45 bg-card-strong/70 text-gold"
            : "border-gold-dim/35 bg-card-strong/50 text-secondary hover:border-gold-dim/55 hover:text-foreground",
        )}
      >
        <Settings2 className="size-4" />
        <span>{translations.filterToggle}</span>
        <ChevronDown
          className={cn("size-4 transition-transform", isOpen && "rotate-180")}
        />
      </button>

      {isOpen && (
        <div
          className={cn(
            "border-border bg-card-strong/45 col-span-2 flex w-full flex-col gap-3 rounded-2xl border p-4",
            hasGameOptions && "md:col-span-3",
          )}
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted w-16 shrink-0 text-xs font-medium">
              {translations.sortLabel}
            </span>
            {SORT_OPTIONS.map((option) => {
              const isActive = (filters.sort ?? "") === option.value;
              return (
                <Link
                  key={option.value || "_recent"}
                  href={
                    buildUrl(filters, {
                      sort: option.value || undefined,
                    }) as Route
                  }
                  className={cn(
                    chipBase,
                    isActive ? "border-gold/40 bg-gold/10 text-gold" : chipIdle,
                  )}
                >
                  {translations[option.labelKey]}
                </Link>
              );
            })}
            {hasActiveFilters && (
              <Link
                href={"/leagues" as Route}
                className="text-muted hover:text-foreground ml-auto text-xs underline underline-offset-2"
              >
                {translations.clearFilters}
              </Link>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted w-16 shrink-0 text-xs font-medium">
              {translations.statusLabel}
            </span>
            {STATUS_OPTIONS.map((option) => {
              const isActive = filters.status === option.value;
              return (
                <Link
                  key={option.value}
                  href={
                    buildUrl(filters, {
                      status: isActive ? undefined : option.value,
                    }) as Route
                  }
                  className={cn(
                    chipBase,
                    isActive ? option.activeClass : chipIdle,
                  )}
                >
                  {translations[option.labelKey]}
                </Link>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted w-16 shrink-0 text-xs font-medium">
              {translations.systemLabel}
            </span>
            {SYSTEM_OPTIONS.map((option) => {
              const isActive = filters.system === option.value;
              return (
                <Link
                  key={option.value}
                  href={
                    buildUrl(filters, {
                      system: isActive ? undefined : option.value,
                    }) as Route
                  }
                  className={cn(
                    chipBase,
                    isActive ? option.activeClass : chipIdle,
                  )}
                >
                  {translations[option.labelKey]}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
