"use client";

import { ShareButton } from "@/components/ui/share-button";
import { GameWatchButton } from "@/components/triggers/game/game-watch-button";

interface GameActionBarProps {
  gameId: string;
  followCount: number;
}

export function GameActionBar({ gameId, followCount }: GameActionBarProps) {
  return (
    <div className="flex items-center justify-end gap-2">
      <GameWatchButton
        gameId={gameId}
        followCount={followCount}
        variant="compact"
      />
      <ShareButton />
    </div>
  );
}
