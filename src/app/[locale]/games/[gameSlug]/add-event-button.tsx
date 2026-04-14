"use client";

import { useState, useTransition } from "react";
import { Trophy, Swords, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useUser } from "@/components/providers";
import { AddRankingModal } from "@/components/modals/ranking/add-ranking-modal";
import { AuthModal } from "@/components/modals/auth/auth-modal";
import { DropdownMenu, DropdownItem } from "@/components/ui/dropdown-menu";

export function AddEventButton({ gameId }: { gameId: string }) {
  const t = useTranslations("Modals.AddRanking");
  const { user } = useUser();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAddRankingOpen, setIsAddRankingOpen] = useState(false);
  const [isPending] = useTransition();

  const handleTriggerClick = () => {
    if (!user) {
      setIsAuthModalOpen(true);
    }
  };

  const menuButton = (
    <button
      onClick={handleTriggerClick}
      className="group relative flex w-full items-center gap-4 overflow-hidden rounded-3xl border border-white/5 bg-white/5 p-4 transition-all hover:border-primary/30 hover:bg-white/10 active:scale-[0.98]"
    >
      <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
        <Trophy className="size-6" />
      </div>
      <div className="flex flex-col text-left">
        <span className="text-sm font-bold text-white">
          {t("trigger")}
        </span>
        <span className="text-muted text-xs opacity-60">
          {t("description")}
        </span>
      </div>
      <ChevronRight className="ml-auto size-5 text-white/20 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
      
      {/* Glow effect */}
      <div className="bg-primary/5 absolute -right-4 -bottom-4 size-24 rounded-full opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
    </button>
  );

  return (
    <>
      {user ? (
        <DropdownMenu trigger={menuButton} side="right">
          <DropdownItem 
            icon={Trophy} 
            onClick={() => setIsAddRankingOpen(true)}
          >
            {t("types.ranking")}
          </DropdownItem>
          <DropdownItem 
            icon={Swords}
            className="opacity-50 cursor-not-allowed"
            onClick={() => {
              // Tournament system not implemented yet
            }}
          >
            <div className="flex flex-1 items-center justify-between">
              <span>{t("types.tournament")}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">
                Soon
              </span>
            </div>
          </DropdownItem>
        </DropdownMenu>
      ) : (
        menuButton
      )}

      <AddRankingModal
        gameId={gameId}
        isOpen={isAddRankingOpen}
        onClose={() => setIsAddRankingOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        isPending={isPending}
      />
    </>
  );
}
