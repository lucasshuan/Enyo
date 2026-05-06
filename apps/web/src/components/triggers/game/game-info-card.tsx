"use client";

import { useState } from "react";
import Image from "next/image";
import { AlertCircle, Info } from "lucide-react";
import { useTranslations } from "next-intl";

import { GlowBorder } from "@/components/ui/glow-border";
import { UserChip } from "@/components/ui/user-chip";
import { GameManageActions } from "@/components/triggers/game/game-manage-actions";
import { GameInfoModal } from "@/components/modals/game/game-info-modal";

import { cdnUrl } from "@/lib/utils/cdn";
import { cn, formatCompactNumber } from "@/lib/utils/helpers";
import type { GetGameQuery } from "@/lib/apollo/generated/graphql";

type Game = NonNullable<GetGameQuery["game"]>;

interface GameInfoCardProps {
  game: Game;
  leagueCount: number;
  playerCount: number;
  postCount: number;
  canEdit: boolean;
}

/**
 * GameInfoCard — client wrapper for the game sidebar card.
 *
 * Renders the GlowBorder game card with a hover-brightened border and a
 * subtle "view details" hint. Clicking anywhere on the card (except the
 * manage action buttons and external links) opens the GameInfoModal.
 */
export function GameInfoCard({
  game,
  leagueCount,
  playerCount,
  postCount,
  canEdit,
}: GameInfoCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActionsHovered, setIsActionsHovered] = useState(false);
  const t = useTranslations("GamePage");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const stopAndPrevent = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      {/* group wrapper enables group-hover for border and image effects */}
      <div className="group/card">
        {/* Clickable card — interactive children stop propagation */}
        <div
          role="button"
          tabIndex={0}
          onClick={openModal}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") openModal();
          }}
          className="cursor-pointer rounded-3xl focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:outline-none"
        >
          <GlowBorder
            className="rounded-3xl"
            borderClassName={cn(
              "transition-[background] duration-300",
              "bg-[color-mix(in_srgb,var(--gold)_45%,transparent)]",
              !isActionsHovered &&
                "group-hover/card:bg-[color-mix(in_srgb,var(--gold)_75%,transparent)]",
            )}
          >
            {/* Thumbnail */}
            <div className="relative aspect-368/178 w-full overflow-hidden">
              {game.thumbnailImagePath ? (
                <Image
                  src={cdnUrl(game.thumbnailImagePath)!}
                  alt={game.name}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 360px"
                />
              ) : (
                <div className="from-primary/20 to-primary/5 h-full w-full bg-linear-to-br" />
              )}

              {/* Manage actions — stop propagation so they don't open the modal */}
              {canEdit && (
                <div
                  className="group/actions absolute top-3 right-3 z-10"
                  onClick={stopAndPrevent}
                  onKeyDown={stopAndPrevent}
                  onMouseEnter={() => setIsActionsHovered(true)}
                  onMouseLeave={() => setIsActionsHovered(false)}
                >
                  <GameManageActions
                    gameId={game.id}
                    gameSlug={game.slug}
                    gameName={game.name}
                    eventCount={game._count?.events ?? 0}
                  />
                </div>
              )}

              {/* "View details" hover hint */}
              <div
                className={cn(
                  "absolute bottom-3 left-3 z-10 flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/50 px-2 py-1 opacity-0 backdrop-blur-sm transition-opacity duration-300",
                  !isActionsHovered && "group-hover/card:opacity-100",
                )}
              >
                <Info className="size-3 text-white/60" />
                <span className="text-[10px] font-medium text-white/60">
                  {t("viewDetails")}
                </span>
              </div>
            </div>

            {/* Game info content */}
            <div className="space-y-4 p-4">
              <div>
                {game.status === "PENDING" && (
                  <div className="animate-pending-pulse mb-4 flex items-center gap-3 rounded-2xl border border-orange-500/20 bg-orange-500/10 px-4 py-3 text-orange-400">
                    <AlertCircle className="size-5 shrink-0 animate-pulse" />
                    <p className="text-xs font-semibold tracking-wider uppercase">
                      {t("pendingNotice")}
                    </p>
                  </div>
                )}
                <h1 className="text-foreground text-xl font-bold tracking-tight">
                  {game.name}
                </h1>
                <p className="text-muted mt-2 text-[13px] leading-snug">
                  {game.description ?? t("sidebarDescription")}
                </p>
              </div>

              {game.status !== "PENDING" && (
                <div className="grid grid-cols-3 gap-1.5">
                  <div className="rounded-xl border border-white/5 bg-white/5 px-2 py-1.5 transition-colors hover:bg-white/10">
                    <p className="text-muted font-mono text-[9px] opacity-60">
                      {t("events")}
                    </p>
                    <p className="text-secondary mt-0.5 text-base font-bold">
                      {formatCompactNumber(leagueCount)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-white/5 px-2 py-1.5 transition-colors hover:bg-white/10">
                    <p className="text-muted font-mono text-[9px] opacity-60">
                      {t("sidebarPlayers")}
                    </p>
                    <p className="text-secondary mt-0.5 text-base font-bold">
                      {formatCompactNumber(playerCount)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-white/5 px-2 py-1.5 transition-colors hover:bg-white/10">
                    <p className="text-muted font-mono text-[9px] opacity-60">
                      {t("posts")}
                    </p>
                    <p className="text-secondary mt-0.5 text-base font-bold">
                      {formatCompactNumber(postCount)}
                    </p>
                  </div>
                </div>
              )}

              {/* External links — stop propagation so clicks don't open the modal */}
              {(game.steamUrl || game.websiteUrl) && (
                <div
                  className="flex flex-col gap-0"
                  onClick={stopAndPrevent}
                  onKeyDown={stopAndPrevent}
                >
                  {game.steamUrl && (
                    <a
                      href={game.steamUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 py-2 text-xs font-bold text-white/40 transition-colors hover:text-white"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-4"
                      >
                        <path d="M11.979 0C5.353 0 0 5.373 0 12c0 2.221.606 4.3 1.666 6.1L6.155 13.92c-.11-.421-.168-.86-.168-1.314 0-2.868 2.324-5.193 5.19-5.193 2.87 0 5.194 2.325 5.194 5.193 0 2.868-2.324 5.194-5.193 5.194-.852 0-1.656-.205-2.36-.566L4.793 23c2.164 1.344 4.7 2.128 7.397 2.128 6.577 0 11.905-5.328 11.905-11.905S18.556 0 11.979 0Zm-.791 10.158c-1.353 0-2.45 1.097-2.45 2.448s1.097 2.45 2.45 2.45c1.35 0 2.449-1.099 2.449-2.45s-1.099-2.448-2.449-2.448Zm0 1.258c.656 0 1.19.532 1.19 1.19 0 .656-.534 1.191-1.19 1.191-.659 0-1.192-.534-1.192-1.191 0-.66.533-1.19 1.192-1.19Z" />
                      </svg>
                      {t("playOnSteam")}
                    </a>
                  )}
                  {game.websiteUrl && (
                    <a
                      href={game.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 py-2 text-xs font-bold text-white/40 transition-colors hover:text-white"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="size-4"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                      {t("visitWebsite")}
                    </a>
                  )}
                </div>
              )}
            </div>
          </GlowBorder>
        </div>

        {/* Author chip — outside the clickable card */}
        {game.author && (
          <div className="flex flex-row-reverse items-center justify-center gap-3 px-1 py-2 opacity-80 transition-opacity hover:opacity-100">
            <UserChip user={game.author} />
            <span className="font-signature text-secondary text-lg whitespace-nowrap italic">
              {t("ideaBy")}
            </span>
          </div>
        )}
      </div>

      <GameInfoModal
        isOpen={isModalOpen}
        onClose={closeModal}
        game={game}
        canEdit={canEdit}
      />
    </>
  );
}
