"use client";

import { useState } from "react";
import { CheckCheck, ChevronRight, Settings2 } from "lucide-react";
import { type Game } from "@/lib/apollo/generated/graphql";
import { useTranslations } from "next-intl";
import { DropdownItem, DropdownMenu } from "@/components/ui/dropdown-menu";
import { EditGameModal } from "@/components/modals/game/edit-game-modal";
import { ApproveGameModal } from "@/components/modals/game/approve-game-modal";

interface PageAdminActionsProps {
  game: Game;
  canEditGame: boolean;
  canApproveGame: boolean;
  canManagePlayers: boolean;
}

export function PageAdminActions({
  game,
  canEditGame,
  canApproveGame,
  canManagePlayers,
}: PageAdminActionsProps) {
  void canManagePlayers;
  const t = useTranslations();
  const [isEditGameOpen, setIsEditGameOpen] = useState(false);
  const [isApproveOpen, setIsApproveOpen] = useState(false);

  return (
    <>
      <DropdownMenu
        side="right"
        align="end"
        width={280}
        openOnHover
        trigger={
          <button
            type="button"
            className="no-lift group relative z-10 -mt-px flex items-center gap-2 rounded-b-2xl border border-t-0 border-border bg-[linear-gradient(180deg,rgb(20_13_22),rgb(11_8_15))] px-4 py-2.5 text-xs font-bold tracking-wider text-white/50 uppercase transition-colors hover:text-white"
          >
            <Settings2 className="size-4" />
            <span>{t("Admin.panel")}</span>
            <ChevronRight className="size-4 opacity-50 transition-transform group-hover:translate-x-1" />
          </button>
        }
      >
        {canEditGame && (
          <DropdownItem
            icon={Settings2}
            onClick={() => setIsEditGameOpen(true)}
          >
            {t("Modals.EditGame.trigger")}
          </DropdownItem>
        )}

        {game.status === "PENDING" && canApproveGame && (
          <DropdownItem
            icon={CheckCheck}
            onClick={() => setIsApproveOpen(true)}
          >
            {t("Modals.ApproveGame.trigger")}
          </DropdownItem>
        )}
      </DropdownMenu>

      {canEditGame && (
        <EditGameModal
          game={game}
          isOpen={isEditGameOpen}
          onClose={() => setIsEditGameOpen(false)}
        />
      )}

      {game.status === "PENDING" && canApproveGame && (
        <ApproveGameModal
          gameId={game.id}
          gameName={game.name}
          isOpen={isApproveOpen}
          onClose={() => setIsApproveOpen(false)}
        />
      )}
    </>
  );
}
