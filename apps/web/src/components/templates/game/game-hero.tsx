"use client";

import { useState } from "react";
import Image from "next/image";
import { AlertCircle, ChevronLeft, ExternalLink, Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

import { GameActionBar } from "@/components/triggers/game/game-action-bar";
import { GameInfoModal } from "@/components/modals/game/game-info-modal";
import { GameManageActions } from "@/components/triggers/game/game-manage-actions";
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
      <section className="bg-card/25 relative isolate min-h-[420px] overflow-hidden">
        {/* Background + color overlays wrapped so only they fade to transparent at bottom */}
        <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black_50%,transparent_100%)]">
          {backgroundSrc ? (
            <Image
              src={backgroundSrc}
              alt=""
              fill
              priority
              className="object-cover object-center opacity-70"
              sizes="100vw"
            />
          ) : (
            <div className="from-primary/22 via-background-soft/85 to-background absolute inset-0 bg-linear-to-br" />
          )}

          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(ellipse_70%_90%_at_82%_42%,transparent_0%,rgb(13_12_14/0.18)_46%,rgb(13_12_14/0.92)_100%),linear-gradient(90deg,rgb(13_12_14/0.98)_0%,rgb(13_12_14/0.88)_31%,rgb(13_12_14/0.46)_58%,rgb(13_12_14/0.82)_100%)]"
          />
        </div>

        {/* Content wrapper — ocupa ~80% da altura total da section */}
        <div className="relative">
          {/* Overlay topbar */}
          <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-5 pt-14 pb-0 sm:px-6 lg:px-8">
            <Link
              href="/games"
              className="group focus-visible:ring-gold/40 text-gold/70 hover:text-gold inline-flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
            >
              <ChevronLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
              <span>{t("backToGames")}</span>
            </Link>
            <GameActionBar
              gameId={game.id}
              followCount={game.followCount ?? 0}
            />
          </div>

          <div className="mx-auto grid w-full max-w-[1600px] gap-6 px-5 py-6 sm:px-6 sm:py-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.7fr)] lg:items-center lg:px-8 xl:px-10">
            <div className="grid gap-5 md:grid-cols-[minmax(0,368px)_minmax(0,1fr)]">
              <div className="bg-background/75 relative aspect-92/43 w-full max-w-92 overflow-hidden rounded-2xl shadow-[0_22px_60px_rgb(0_0_0/0.38)]">
                {thumbnailSrc ? (
                  <Image
                    src={thumbnailSrc}
                    alt={game.name}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 368px"
                  />
                ) : (
                  <div className="from-primary/25 to-primary/5 absolute inset-0 bg-linear-to-br" />
                )}

                <div
                  aria-hidden
                  className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-black/15"
                />
              </div>

              <div className="flex min-w-0 flex-col justify-center gap-5">
                <div className="min-w-0">
                  {game.status === "PENDING" && (
                    <div className="animate-pending-pulse border-warning/25 bg-warning/10 text-warning mb-3 inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold">
                      <AlertCircle className="size-4 shrink-0" />
                      {t("pendingNotice")}
                    </div>
                  )}

                  <h1 className="text-foreground inline-flex flex-wrap items-center gap-2 text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
                    {game.name}
                    {game.steamUrl && (
                      <a
                        href={game.steamUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={t("playOnSteam")}
                        className="inline-flex shrink-0 items-center rounded-xl border border-white/10 bg-black/60 p-2 text-[#c6d4df] shadow-[0_2px_8px_rgb(0_0_0/0.5)] backdrop-blur-sm transition-all duration-200 hover:border-[#66c0f4]/40 hover:bg-black/80 hover:text-[#66c0f4] hover:shadow-[0_0_12px_rgb(102_192_244/0.2)] focus-visible:ring-2 focus-visible:ring-[#66c0f4]/40 focus-visible:outline-none"
                      >
                        <SteamIcon className="size-5" />
                      </a>
                    )}
                  </h1>
                  <p className="text-muted mt-3 max-w-2xl text-sm leading-6">
                    {game.description
                      ? game.description.length > 230
                        ? game.description.slice(0, 230) + "…"
                        : game.description
                      : t("sidebarDescription")}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="border-gold-dim/35 bg-card-strong/70 text-secondary hover:border-gold/55 hover:text-foreground focus-visible:ring-gold/35 inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none"
                  >
                    <Info className="size-4" />
                    {t("viewDetails")}
                  </button>

                  {game.websiteUrl && (
                    <HeroExternalLink href={game.websiteUrl}>
                      <ExternalLink className="size-4" />
                      {t("visitWebsite")}
                    </HeroExternalLink>
                  )}
                </div>
              </div>
            </div>

            <div className="hidden lg:block" aria-hidden="true" />
          </div>

          {canEdit && (
            <div className="relative flex justify-end px-5 pb-4 sm:px-6 lg:px-8 xl:px-10">
              <GameManageActions
                gameId={game.id}
                gameSlug={gameSlug}
                gameName={game.name}
                eventCount={eventCount}
              />
            </div>
          )}
        </div>

        {/* Espaço extra para a imagem de fundo se estender além do conteúdo */}
        <div className="h-4 sm:h-6" />
      </section>

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
      className="text-muted hover:border-gold-dim/45 hover:text-foreground focus-visible:ring-gold/35 inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-semibold transition-colors hover:bg-white/8 focus-visible:ring-2 focus-visible:outline-none"
    >
      {children}
    </a>
  );
}

function SteamIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M11.979 0C5.353 0 0 5.373 0 12c0 2.221.606 4.3 1.666 6.1L6.155 13.92c-.11-.421-.168-.86-.168-1.314 0-2.868 2.324-5.193 5.19-5.193 2.87 0 5.194 2.325 5.194 5.193 0 2.868-2.324 5.194-5.193 5.194-.852 0-1.656-.205-2.36-.566L4.793 23c2.164 1.344 4.7 2.128 7.397 2.128 6.577 0 11.905-5.328 11.905-11.905S18.556 0 11.979 0Zm-.791 10.158c-1.353 0-2.45 1.097-2.45 2.448s1.097 2.45 2.45 2.45c1.35 0 2.449-1.099 2.449-2.45s-1.099-2.448-2.449-2.448Zm0 1.258c.656 0 1.19.532 1.19 1.19 0 .656-.534 1.191-1.19 1.191-.659 0-1.192-.534-1.192-1.191 0-.66.533-1.19 1.192-1.19Z" />
    </svg>
  );
}
