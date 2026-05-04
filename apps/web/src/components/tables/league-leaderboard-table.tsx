"use client";

import Image from "next/image";
import { ChevronUp, ChevronDown, Search, Trophy } from "lucide-react";
import { useState, useMemo } from "react";

import { UserChip } from "@/components/ui/user-chip";
import { Tooltip } from "@/components/ui/tooltip";
import { cdnUrl } from "@/lib/utils/cdn";
import { cn } from "@/lib/utils/helpers";
import type { GetEventEntriesQuery } from "@/lib/apollo/generated/graphql";

type EntryNode = GetEventEntriesQuery["eventEntries"]["nodes"][number];

// ─── Component props ──────────────────────────────────────────────────────────

interface LeagueLeaderboardTableProps {
  entries: EntryNode[];
  classificationSystem: string;
  allowDraw: boolean;
}

export interface TableCoreProps {
  entries: EntryNode[];
  classificationSystem: string;
  allowDraw: boolean;
  /** If true, renders a search input above the table */
  showSearch?: boolean;
}

// ─── Stats parsing ────────────────────────────────────────────────────────────

function getStats(entry: EntryNode): Record<string, unknown> {
  return (entry.stats as Record<string, unknown> | null) ?? {};
}

function getEntryPoints(entry: EntryNode, system: string): number | null {
  const s = getStats(entry);
  if (system === "ELO") return typeof s.elo === "number" ? s.elo : null;
  return typeof s.points === "number" ? s.points : null;
}

function getPointsDelta(entry: EntryNode, system: string): number | null {
  const s = getStats(entry);
  const raw =
    system === "ELO"
      ? (s.eloDelta ?? s.elo_delta ?? s.pointsDelta ?? s.pointsChange)
      : (s.pointsDelta ?? s.points_delta ?? s.pointsChange);
  return typeof raw === "number" ? raw : null;
}

function getRankChange(entry: EntryNode): number | null {
  const s = getStats(entry);
  const raw = s.rankChange ?? s.rank_change;
  return typeof raw === "number" ? raw : null;
}

function getRecentResults(entry: EntryNode): string[] {
  const s = getStats(entry);
  const arr = s.recentResults ?? s.recent_results ?? s.lastResults;
  if (Array.isArray(arr)) {
    return (arr as unknown[])
      .filter((r): r is string => typeof r === "string")
      .slice(-5);
  }
  const single = s.lastResult ?? s.lastOutcome ?? s.recent;
  return typeof single === "string" ? [single] : [];
}

function countWins(results: string[]): number {
  return results.filter((r) => ["WIN", "W"].includes(r.toUpperCase())).length;
}

function getMatches(entry: EntryNode): number | null {
  const s = getStats(entry);
  const raw = s.matches ?? s.matchesPlayed ?? s.gamesPlayed ?? s.played;
  return typeof raw === "number" ? raw : null;
}

function getStatsWins(entry: EntryNode): number | null {
  const s = getStats(entry);
  const raw = s.wins ?? s.victories ?? s.won;
  return typeof raw === "number" ? raw : null;
}

function getLosses(entry: EntryNode): number | null {
  const s = getStats(entry);
  const raw = s.losses ?? s.defeats ?? s.lost;
  return typeof raw === "number" ? raw : null;
}

function getDraws(entry: EntryNode): number | null {
  const s = getStats(entry);
  const raw = s.draws ?? s.ties ?? s.drawn;
  return typeof raw === "number" ? raw : null;
}

// ─── Sort types ───────────────────────────────────────────────────────────────

type SortKey =
  | "rank"
  | "name"
  | "points"
  | "rankChange"
  | "wins"
  | "matches"
  | "statsWins"
  | "losses"
  | "draws"
  | "country";
type SortDir = "asc" | "desc";

const DEFAULT_DIR: Record<SortKey, SortDir> = {
  rank: "asc",
  name: "asc",
  country: "asc",
  points: "desc",
  rankChange: "desc",
  wins: "desc",
  matches: "desc",
  statsWins: "desc",
  losses: "asc",
  draws: "desc",
};

interface RowData {
  entry: EntryNode;
  rank: number;
  points: number | null;
  pointsDelta: number | null;
  rankChange: number | null;
  recentResults: string[];
  wins: number;
  matches: number | null;
  statsWins: number | null;
  losses: number | null;
  draws: number | null;
}

function buildSortFn(key: SortKey, dir: SortDir) {
  return (a: RowData, b: RowData): number => {
    let cmp = 0;
    switch (key) {
      case "rank":
        cmp = a.rank - b.rank;
        break;
      case "name":
        cmp = (a.entry.user?.name ?? a.entry.displayName).localeCompare(
          b.entry.user?.name ?? b.entry.displayName,
        );
        break;
      case "points":
        cmp = (a.points ?? -Infinity) - (b.points ?? -Infinity);
        break;
      case "rankChange":
        cmp = (a.rankChange ?? -Infinity) - (b.rankChange ?? -Infinity);
        break;
      case "wins":
        cmp = a.wins - b.wins;
        break;
      case "matches":
        cmp = (a.matches ?? -Infinity) - (b.matches ?? -Infinity);
        break;
      case "statsWins":
        cmp = (a.statsWins ?? -Infinity) - (b.statsWins ?? -Infinity);
        break;
      case "losses":
        cmp = (a.losses ?? Infinity) - (b.losses ?? Infinity);
        break;
      case "draws":
        cmp = (a.draws ?? -Infinity) - (b.draws ?? -Infinity);
        break;
      case "country":
        cmp = (a.entry.user?.country ?? "zzz").localeCompare(
          b.entry.user?.country ?? "zzz",
        );
        break;
    }
    return dir === "asc" ? cmp : -cmp;
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function RankDelta({ change }: { change: number | null }) {
  if (change === null) return null;
  if (change === 0) {
    return <span className="text-[9px] leading-none text-white/20">━</span>;
  }
  const up = change > 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-px text-[9px] leading-none font-bold",
        up ? "text-success" : "text-danger",
      )}
    >
      {up ? "▲" : "▼"}
      {Math.abs(change)}
    </span>
  );
}

function PointsDelta({
  delta,
  isElo,
}: {
  delta: number | null;
  isElo?: boolean;
}) {
  if (delta === null || delta === 0) return null;
  const pos = delta > 0;
  const formatted = isElo ? delta.toFixed(2) : String(delta);
  return (
    <span
      className={cn(
        "text-[10px] leading-none font-medium tabular-nums",
        pos ? "text-success" : "text-danger",
      )}
    >
      {pos ? "+" : ""}
      {formatted}
    </span>
  );
}

const OUTCOME_MAP: Record<string, { cls: string; label: string }> = {
  WIN: { cls: "bg-success/20 text-success border-success/30", label: "V" },
  W: { cls: "bg-success/20 text-success border-success/30", label: "V" },
  LOSS: { cls: "bg-danger/20  text-danger  border-danger/30", label: "D" },
  DEFEAT: { cls: "bg-danger/20  text-danger  border-danger/30", label: "D" },
  L: { cls: "bg-danger/20  text-danger  border-danger/30", label: "D" },
  DRAW: { cls: "bg-warning/20 text-warning border-warning/30", label: "E" },
  D: { cls: "bg-warning/20 text-warning border-warning/30", label: "E" },
  TIE: { cls: "bg-warning/20 text-warning border-warning/30", label: "E" },
};

function OutcomePill({ outcome }: { outcome: string }) {
  const def = OUTCOME_MAP[outcome.toUpperCase()];
  return (
    <span
      className={cn(
        "inline-flex size-[18px] items-center justify-center rounded border text-[9px] font-bold",
        def?.cls ?? "border-white/10 bg-white/5 text-white/30",
      )}
    >
      {def?.label ?? outcome.slice(0, 1).toUpperCase()}
    </span>
  );
}

const RANK_STYLE: Record<number, { rankColor: string; pointsColor: string }> = {
  1: {
    rankColor: "text-gold",
    pointsColor: "text-gold",
  },
  2: {
    rankColor: "text-white/75",
    pointsColor: "text-foreground",
  },
  3: {
    rankColor: "text-white/55",
    pointsColor: "text-foreground",
  },
};

interface SortableHeaderProps {
  label: string;
  tooltip?: string;
  sortKey: SortKey;
  currentKey: SortKey;
  currentDir: SortDir;
  onSort: (key: SortKey) => void;
  className?: string;
}

function SortableHeader({
  label,
  tooltip,
  sortKey,
  currentKey,
  currentDir,
  onSort,
  className,
}: SortableHeaderProps) {
  const active = currentKey === sortKey;
  return (
    <Tooltip
      content={tooltip}
      className={cn("flex h-full w-full items-center", className)}
      contentClassName="w-max max-w-[180px] px-2.5 py-1.5 text-[10px] font-medium rounded-lg leading-snug"
    >
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={cn(
          "flex items-center gap-1 text-[9px] font-semibold tracking-wide uppercase transition-colors",
          active ? "text-foreground" : "text-white/30 hover:text-white/60",
        )}
      >
        {label}
        {active &&
          (currentDir === "asc" ? (
            <ChevronDown className="size-3 shrink-0" />
          ) : (
            <ChevronUp className="size-3 shrink-0" />
          ))}
      </button>
    </Tooltip>
  );
}

// ─── Core table ───────────────────────────────────────────────────────────────

export function TableCore({
  entries,
  classificationSystem,
  allowDraw,
  showSearch = false,
}: TableCoreProps) {
  const [sortKey, setSortKey] = useState<SortKey>("rank");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [search, setSearch] = useState("");

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(DEFAULT_DIR[key]);
    }
  };

  const rows = useMemo<RowData[]>(() => {
    return entries.map((entry, idx) => {
      const recentResults = getRecentResults(entry);
      return {
        entry,
        rank: idx + 1,
        points: getEntryPoints(entry, classificationSystem),
        pointsDelta: getPointsDelta(entry, classificationSystem),
        rankChange: getRankChange(entry),
        recentResults,
        wins: countWins(recentResults),
        matches: getMatches(entry),
        statsWins: getStatsWins(entry),
        losses: getLosses(entry),
        draws: getDraws(entry),
      };
    });
  }, [entries, classificationSystem]);

  const filteredRows = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter(
      (r) =>
        r.entry.displayName.toLowerCase().includes(q) ||
        (r.entry.user?.name?.toLowerCase().includes(q) ?? false),
    );
  }, [rows, search]);

  const sortedRows = useMemo(
    () => [...filteredRows].sort(buildSortFn(sortKey, sortDir)),
    [filteredRows, sortKey, sortDir],
  );

  const ptsLabel = classificationSystem === "ELO" ? "Elo" : "Pts";

  const gridCols = allowDraw
    ? "grid-cols-[2rem_1fr_2.5rem_3rem_3rem_3rem_3rem_6rem_5.5rem]"
    : "grid-cols-[2rem_1fr_2.5rem_3rem_3rem_3rem_6rem_5.5rem]";

  if (entries.length === 0) {
    return (
      <div className="glass-panel corner-round no-hover flex flex-col items-center justify-center rounded-2xl p-10 text-center">
        <Trophy className="text-muted/20 mb-3 size-8" />
        <p className="text-muted text-sm">Nenhum participante ainda.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {showSearch && (
        <div className="relative">
          <Search className="text-muted/30 absolute top-1/2 left-4 size-4 -translate-y-1/2" />
          <input
            type="search"
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
            placeholder="Buscar jogador…"
            className="field-base field-border-default pl-10"
          />
        </div>
      )}

      <div className="glass-panel corner-round no-hover overflow-hidden rounded-2xl">
        {/* Header */}
        <div
          className={cn(
            "border-border grid items-center gap-2 border-b bg-black/40 px-4 py-2.5",
            gridCols,
          )}
        >
          <SortableHeader
            label="#"
            tooltip="Posição no ranking"
            sortKey="rank"
            currentKey={sortKey}
            currentDir={sortDir}
            onSort={handleSort}
          />
          <SortableHeader
            label="Jogador"
            sortKey="name"
            currentKey={sortKey}
            currentDir={sortDir}
            onSort={handleSort}
          />
          <SortableHeader
            label="País"
            tooltip="Ordenar por país"
            sortKey="country"
            currentKey={sortKey}
            currentDir={sortDir}
            onSort={handleSort}
            className="justify-center"
          />
          <SortableHeader
            label="J"
            tooltip="Partidas jogadas"
            sortKey="matches"
            currentKey={sortKey}
            currentDir={sortDir}
            onSort={handleSort}
            className="justify-center"
          />
          <SortableHeader
            label="V"
            tooltip="Vitórias"
            sortKey="statsWins"
            currentKey={sortKey}
            currentDir={sortDir}
            onSort={handleSort}
            className="justify-center"
          />
          <SortableHeader
            label="D"
            tooltip="Derrotas"
            sortKey="losses"
            currentKey={sortKey}
            currentDir={sortDir}
            onSort={handleSort}
            className="justify-center"
          />
          {allowDraw && (
            <SortableHeader
              label="E"
              tooltip="Empates"
              sortKey="draws"
              currentKey={sortKey}
              currentDir={sortDir}
              onSort={handleSort}
              className="justify-center"
            />
          )}
          <SortableHeader
            label="Últ. 5"
            tooltip="Últimas 5 partidas"
            sortKey="wins"
            currentKey={sortKey}
            currentDir={sortDir}
            onSort={handleSort}
            className="justify-center"
          />
          <SortableHeader
            label={ptsLabel}
            tooltip={
              classificationSystem === "ELO" ? "Pontuação Elo" : "Pontos"
            }
            sortKey="points"
            currentKey={sortKey}
            currentDir={sortDir}
            onSort={handleSort}
            className="justify-center"
          />
        </div>

        {/* Rows */}
        {sortedRows.map((row, idx) => {
          const accent = RANK_STYLE[row.rank];
          return (
            <div
              key={row.entry.id}
              className={cn(
                "grid items-center gap-2 px-4 py-3 transition-colors hover:bg-white/[0.03]",
                gridCols,
                idx < sortedRows.length - 1 && "border-b border-white/[0.05]",
              )}
            >
              {/* Rank + change */}
              <div className="flex items-center justify-end gap-1.5">
                <RankDelta change={row.rankChange} />
                <span
                  className={cn(
                    "text-sm font-bold tabular-nums",
                    accent?.rankColor ?? "text-white/45",
                  )}
                >
                  #{row.rank}
                </span>
              </div>

              {/* Player */}
              <div className="min-w-0 overflow-hidden">
                {row.entry.user ? (
                  <UserChip user={row.entry.user} className="max-w-full" />
                ) : (
                  <div className="bg-card inline-flex max-w-full items-center gap-2 rounded-lg border border-white/10 px-2 py-1">
                    {row.entry.imagePath ? (
                      <div className="relative size-5 shrink-0 overflow-hidden rounded-md bg-white/10">
                        <Image
                          src={cdnUrl(row.entry.imagePath)!}
                          alt={row.entry.displayName}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex size-5 shrink-0 items-center justify-center rounded-md bg-white/10 text-[9px] font-bold text-white/50">
                        {row.entry.displayName.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <span className="truncate text-sm font-medium text-white/75">
                      {row.entry.displayName}
                    </span>
                  </div>
                )}
              </div>

              {/* Country */}
              <div className="flex justify-center">
                {row.entry.user?.country ? (
                  <Tooltip
                    content={
                      new Intl.DisplayNames(["pt-BR"], { type: "region" }).of(
                        row.entry.user.country.toUpperCase(),
                      ) ?? row.entry.user.country.toUpperCase()
                    }
                    contentClassName="w-max max-w-[180px] px-2.5 py-1.5 text-[10px] font-medium rounded-lg leading-snug"
                  >
                    <span
                      className={`fi fi-${row.entry.user.country.toLowerCase()} h-3 w-4 overflow-hidden rounded-[2px]`}
                    />
                  </Tooltip>
                ) : (
                  <span className="text-xs text-white/15">—</span>
                )}
              </div>

              {/* Matches */}
              <div className="flex justify-center">
                <span
                  className={cn(
                    "text-xs tabular-nums",
                    row.matches != null ? "text-white/60" : "text-white/15",
                  )}
                >
                  {row.matches != null ? row.matches : "—"}
                </span>
              </div>

              {/* Wins */}
              <div className="flex justify-center">
                <span
                  className={cn(
                    "text-xs tabular-nums",
                    row.statsWins != null ? "text-success/80" : "text-white/15",
                  )}
                >
                  {row.statsWins != null ? row.statsWins : "—"}
                </span>
              </div>

              {/* Losses */}
              <div className="flex justify-center">
                <span
                  className={cn(
                    "text-xs tabular-nums",
                    row.losses != null ? "text-danger/70" : "text-white/15",
                  )}
                >
                  {row.losses != null ? row.losses : "—"}
                </span>
              </div>

              {/* Draws (conditional) */}
              {allowDraw && (
                <div className="flex justify-center">
                  <span
                    className={cn(
                      "text-xs tabular-nums",
                      row.draws != null ? "text-warning/70" : "text-white/15",
                    )}
                  >
                    {row.draws != null ? row.draws : "—"}
                  </span>
                </div>
              )}

              {/* Last 5 results */}
              <div className="flex items-center justify-center gap-0.5">
                {row.recentResults.length > 0 ? (
                  row.recentResults.map((outcome, i) => (
                    <OutcomePill key={i} outcome={outcome} />
                  ))
                ) : (
                  <span className="text-xs text-white/15">—</span>
                )}
              </div>

              {/* Points + delta */}
              <div className="flex flex-col items-center">
                {row.points != null ? (
                  <>
                    <span
                      className={cn(
                        "text-sm font-bold tabular-nums",
                        accent?.pointsColor ?? "text-foreground/75",
                      )}
                    >
                      {classificationSystem === "ELO"
                        ? row.points.toFixed(2)
                        : row.points.toLocaleString()}
                    </span>
                    <PointsDelta
                      delta={row.pointsDelta}
                      isElo={classificationSystem === "ELO"}
                    />
                  </>
                ) : (
                  <span className="text-xs text-white/20">—</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Event-page table (shows footer link to dedicated page) ──────────────────

export function LeagueLeaderboardTable({
  entries,
  classificationSystem,
  allowDraw,
}: LeagueLeaderboardTableProps) {
  return (
    <TableCore
      entries={entries}
      classificationSystem={classificationSystem}
      allowDraw={allowDraw}
    />
  );
}
