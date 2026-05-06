"use client";

import { useState, useTransition } from "react";
import { Trophy, ChevronRight, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useUser } from "@/components/providers";
import { useRouter } from "@/i18n/routing";
import { AuthModal } from "@/components/modals/auth/auth-modal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/helpers";
import type { SimpleGame } from "@/actions/game";

interface AddEventButtonProps {
  gameId: string;
  game?: SimpleGame;
  variant?: "sidebar" | "header";
}

export function AddEventButton({
  game,
  variant = "sidebar",
}: AddEventButtonProps) {
  const t = useTranslations("Modals.AddEvent");
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPending] = useTransition();

  const handleTriggerClick = () => {
    if (isLoading) return;

    if (!user) {
      setIsAuthModalOpen(true);
    } else {
      const href = game?.slug ? `/events/new?game=${game.slug}` : "/events/new";
      router.push(href);
    }
  };

  const menuButton =
    variant === "sidebar" ? (
      <button
        onClick={handleTriggerClick}
        className="group border-primary/45 from-primary/20 via-primary/10 to-gold/10 hover:border-gold/45 hover:from-primary/28 hover:to-gold/18 relative flex min-h-21 w-full items-center gap-3 overflow-hidden rounded-xl border bg-linear-to-br px-3.5 py-3 text-left shadow-[0_10px_24px_rgb(0_0_0/0.16),inset_0_1px_0_rgb(255_255_255/0.05)] transition-all active:scale-[0.98]"
      >
        <div className="bg-primary/18 text-primary group-hover:bg-primary/25 flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors">
          <Trophy className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-foreground block truncate text-sm font-bold">
            {t("trigger")}
          </span>
          <span className="text-secondary/70 mt-0.5 block text-xs leading-snug">
            {t("description")}
          </span>
        </div>
        <ChevronRight className="text-gold/60 group-hover:text-gold size-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
      </button>
    ) : (
      <button
        onClick={handleTriggerClick}
        className={cn(
          buttonVariants({ intent: "primary", size: "md" }),
          "group shrink-0",
        )}
      >
        <Plus className="mr-1.5 size-4 transition-transform duration-300 group-hover:rotate-90" />
        {variant === "header" ? t("headerTrigger") : t("trigger")}
      </button>
    );

  return (
    <>
      {menuButton}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        isPending={isPending}
      />
    </>
  );
}
