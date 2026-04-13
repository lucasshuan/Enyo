"use client";

import { useState } from "react";
import { Settings2, Trophy, UserPlus } from "lucide-react";
import { ActionButton } from "@/components/ui/action-button";
import { EditGameModal } from "./edit-game-modal";
import { AddRankingModal } from "./add-ranking-modal";
import { AddPlayerModal } from "./add-player-modal";
import { type Game } from "@/server/db/schema";
import { useTranslations } from "next-intl";

interface GameAdminActionsProps {
  game: Game;
}

export function GameAdminActions({ game }: GameAdminActionsProps) {
  const t = useTranslations("Admin");
  const [isEditGameOpen, setIsEditGameOpen] = useState(false);
  const [isAddRankingOpen, setIsAddRankingOpen] = useState(false);
  const [isAddPlayerOpen, setIsAddPlayerOpen] = useState(false);

  return (
    <div className="mt-8 space-y-3">
      <div className="mb-4 flex items-center gap-3 px-1">
        <div className="h-px flex-1 bg-white/5" />
        <span className="text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase">
          {t("panel")}
        </span>
        <div className="h-px flex-1 bg-white/5" />
      </div>

      <ActionButton
        icon={Settings2}
        label={t("editGame.trigger")}
        onClick={() => setIsEditGameOpen(true)}
      />

      <ActionButton
        icon={Trophy}
        label={t("addRanking.trigger")}
        onClick={() => setIsAddRankingOpen(true)}
      />

      <ActionButton
        icon={UserPlus}
        label={t("addPlayer.trigger")}
        onClick={() => setIsAddPlayerOpen(true)}
      />

      <EditGameModal
        game={game}
        isOpen={isEditGameOpen}
        onClose={() => setIsEditGameOpen(false)}
      />

      <AddRankingModal
        gameId={game.id}
        isOpen={isAddRankingOpen}
        onClose={() => setIsAddRankingOpen(false)}
      />

      <AddPlayerModal
        gameId={game.id}
        isOpen={isAddPlayerOpen}
        onClose={() => setIsAddPlayerOpen(false)}
      />
    </div>
  );
}
