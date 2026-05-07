"use client";

import { useState } from "react";
import Image from "next/image";
import { AlertCircle, ChevronLeft, ExternalLink, Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

import { GameActionBar } from "@/components/triggers/game/game-action-bar";
import { GameInfoModal } from "@/components/modals/game/game-info-modal";
import { GameManageActions } from "@/components/triggers/game/game-manage-actions";
import { MediaHeroSection } from "@/components/templates/shared/media-hero-section";
import { cdnUrl } from "@/lib/utils/cdn";
import type { GetGameQuery } from "@/lib/apollo/generated/graphql";

type Game = NonNullable<GetGameQuery["game"]>;

interface GameHeroProps {
  game: Game;
  canEdit: boolean;
  gameSlug: string;
  eventCount: number;
}

export function GameHero({
  game,
  canEdit,
  gameSlug,
  eventCount,
}: GameHeroProps) {
  const t = useTranslations("GamePage");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const backgroundSrc = cdnUrl(game.backgroundImagePath) ?? null;
  const thumbnailSrc = cdnUrl(game.thumbnailImagePath) ?? null;

  return (
    <>
      <MediaHeroSection backgroundSrc={backgroundSrc}>
        <div className="relative">
          {/* Overlay topbar */}
          <div className="mx-auto flex w-full max-w-400 items-center justify-between px-5 pt-3 pb-0 sm:px-6 lg:px-8">
            <Link
              href="/games"
              className="group focus-visible:ring-gold/40 text-gold/70 hover:text-gold inline-flex items-center gap-1.5 text-xs font-medium transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
            >
              <ChevronLeft className="size-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
              <span>{t("backToGames")}</span>
            </Link>
            <div className="flex items-center gap-2">
              {canEdit && (
                <div className="lg:hidden">
                  <GameManageActions
                    gameId={game.id}
                    gameSlug={gameSlug}
                    gameName={game.name}
                    eventCount={eventCount}
                  />
                </div>
              )}
              <GameActionBar
                gameId={game.id}
                followCount={game.followCount ?? 0}
              />
            </div>
          </div>

          {canEdit && (
            <div className="absolute right-5 bottom-3 z-10 hidden sm:right-6 lg:right-8 lg:flex xl:right-10">
              <GameManageActions
                gameId={game.id}
                gameSlug={gameSlug}
                gameName={game.name}
                eventCount={eventCount}
              />
            </div>
          )}

          <div className="mx-auto grid w-full max-w-400 gap-4 px-5 py-2 sm:px-6 sm:py-3 lg:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.7fr)] lg:items-center lg:px-8 xl:px-10">
            <div className="grid gap-4 md:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
              <div className="bg-background/75 relative aspect-92/43 w-full max-w-80 overflow-hidden rounded-xl shadow-[0_18px_48px_rgb(0_0_0/0.34)]">
                {thumbnailSrc ? (
                  <Image
                    src={thumbnailSrc}
                    alt={game.name}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 320px"
                  />
                ) : (
                  <div className="from-primary/25 to-primary/5 absolute inset-0 bg-linear-to-br" />
                )}

                <div
                  aria-hidden
                  className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-black/15"
                />
              </div>

              <div className="flex min-w-0 flex-col justify-center gap-3">
                <div className="min-w-0">
                  {game.status === "PENDING" && (
                    <div className="animate-pending-pulse border-warning/25 bg-warning/10 text-warning mb-2 inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold">
                      <AlertCircle className="size-3.5 shrink-0" />
                      {t("pendingNotice")}
                    </div>
                  )}

                  <h1 className="text-foreground font-display text-xl leading-none font-semibold tracking-tight sm:text-2xl">
                    {game.name}
                  </h1>
                  <p className="text-muted mt-2 line-clamp-3 max-w-xl text-xs leading-4">
                    {game.description
                      ? game.description.length > 180
                        ? game.description.slice(0, 180) + "…"
                        : game.description
                      : t("sidebarDescription")}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="border-gold-dim/35 bg-card-strong/70 text-secondary hover:border-gold/55 hover:text-foreground focus-visible:ring-gold/35 inline-flex h-9 items-center gap-2 rounded-lg border px-3.5 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none"
                  >
                    <Info className="size-3.5" />
                    {t("viewDetails")}
                  </button>

                  {game.websiteUrl && (
                    <HeroExternalLink href={game.websiteUrl}>
                      <ExternalLink className="size-3.5" />
                      {t("visitWebsite")}
                    </HeroExternalLink>
                  )}
                </div>
              </div>
            </div>

            <div className="hidden lg:block" aria-hidden="true" />
          </div>
        </div>
      </MediaHeroSection>

      <GameInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        game={game}
      />
    </>
  );
}

function HeroExternalLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-muted hover:border-gold-dim/45 hover:text-foreground focus-visible:ring-gold/35 inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3.5 text-xs font-semibold transition-colors hover:bg-white/8 focus-visible:ring-2 focus-visible:outline-none"
    >
      {children}
    </a>
  );
}
