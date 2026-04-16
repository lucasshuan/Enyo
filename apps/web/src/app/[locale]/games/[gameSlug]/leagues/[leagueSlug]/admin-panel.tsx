"use client";

import { useState } from "react";
import { Settings2, UserPlus } from "lucide-react";
import { ActionButton } from "@/components/ui/action-button";
import { EditLeagueModal } from "@/components/modals/league/edit-league-modal";
import { AddPlayerToLeagueModal } from "@/components/modals/league/add-player-to-league-modal";
import { type League } from "@/lib/apollo/generated/graphql";
import { useTranslations } from "next-intl";
import { useUser } from "@/components/providers";

interface LeagueAdminPanelProps {
  league: League;
}

export function LeagueAdminPanel({ league }: LeagueAdminPanelProps) {
  const { canManageLeagues, canManagePlayers } = useUser();
  const hasAnyAction = canManageLeagues || canManagePlayers;
  const t = useTranslations();
  const [isEditLeagueOpen, setIsEditLeagueOpen] = useState(false);
  const [isAddPlayerOpen, setIsAddPlayerOpen] = useState(false);

  if (!hasAnyAction) return null;

  return (
    <div className="mt-8 space-y-3">
      <div className="mb-4 flex items-center gap-3 px-1">
        <div className="h-px flex-1 bg-white/5" />
        <span className="text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase">
          {t("Admin.panel")}
        </span>
        <div className="h-px flex-1 bg-white/5" />
      </div>

      {canManageLeagues && (
        <ActionButton
          icon={Settings2}
          label={t("Modals.EditLeague.trigger")}
          onClick={() => setIsEditLeagueOpen(true)}
        />
      )}

      {canManagePlayers && (
        <ActionButton
          icon={UserPlus}
          label={t("Modals.AddPlayerToLeague.trigger")}
          onClick={() => setIsAddPlayerOpen(true)}
        />
      )}

      <EditLeagueModal
        league={league}
        isOpen={isEditLeagueOpen}
        onClose={() => setIsEditLeagueOpen(false)}
      />

      <AddPlayerToLeagueModal
        gameId={league.gameId}
        leagueId={league.id}
        isOpen={isAddPlayerOpen}
        onClose={() => setIsAddPlayerOpen(false)}
      />
    </div>
  );
}
