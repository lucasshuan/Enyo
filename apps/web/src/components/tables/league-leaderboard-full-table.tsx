"use client";

import { TableCore } from "./league-leaderboard-table";
import type { GetEventEntriesQuery } from "@/lib/apollo/generated/graphql";

type EntryNode = GetEventEntriesQuery["eventEntries"]["nodes"][number];

interface LeagueLeaderboardFullTableProps {
  entries: EntryNode[];
  classificationSystem: string;
  allowDraw: boolean;
}

export function LeagueLeaderboardFullTable({
  entries,
  classificationSystem,
  allowDraw,
}: LeagueLeaderboardFullTableProps) {
  return (
    <TableCore
      entries={entries}
      classificationSystem={classificationSystem}
      allowDraw={allowDraw}
      showSearch
    />
  );
}
