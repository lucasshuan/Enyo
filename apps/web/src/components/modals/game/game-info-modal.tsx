"use client";

import { useQuery } from "@apollo/client/react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import {
  Calendar,
  ExternalLink,
  Gamepad2,
  Globe,
  Hash,
  Info,
  ShieldCheck,
  User,
} from "lucide-react";

import { InfoModal } from "@/components/ui/info-modal";
import { InfoSection } from "@/components/ui/info-section";
import { InfoField } from "@/components/ui/info-field";
import { GET_GAME_STAFF } from "@/lib/apollo/queries/games";
import type {
  GetGameStaffQuery,
  GetGameQuery,
} from "@/lib/apollo/generated/graphql";
import { cdnUrl } from "@/lib/cdn";
import { formatDate } from "@/lib/date-utils";

type Game = NonNullable<GetGameQuery["game"]>;

interface GameInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: Game;
}

export function GameInfoModal({ isOpen, onClose, game }: GameInfoModalProps) {
  const t = useTranslations("Modals.GameInfo");
  const locale = useLocale();

  const { data: staffData } = useQuery<GetGameStaffQuery>(GET_GAME_STAFF, {
    variables: { gameId: game.id },
    skip: !isOpen,
  });

  const staff = staffData?.gameStaff ?? [];

  return (
    <InfoModal
      isOpen={isOpen}
      onClose={onClose}
      title={game.name}
      subtitle={game.slug}
      heroImageSrc={
        game.thumbnailImagePath ? cdnUrl(game.thumbnailImagePath)! : undefined
      }
    >
      <div className="space-y-6 p-6">
        {/* About */}
        {game.description && (
          <InfoSection title={t("sections.about")} icon={Info}>
            <p className="text-secondary/80 text-sm leading-relaxed">
              {game.description}
            </p>
          </InfoSection>
        )}

        {/* Details */}
        <InfoSection title={t("sections.details")} icon={Gamepad2}>
          <div className="space-y-2.5 rounded-2xl border border-white/5 bg-white/2 p-4">
            <InfoField label={t("fields.name")} value={game.name} />
            <InfoField
              label={t("fields.identifier")}
              icon={Hash}
              value={game.slug}
            />
            <InfoField
              label={t("fields.status")}
              value={
                <span
                  className={
                    game.status === "APPROVED"
                      ? "text-xs font-semibold text-green-400"
                      : "text-xs font-semibold text-orange-400"
                  }
                >
                  {t(`status.${game.status}`)}
                </span>
              }
            />
            {game.createdAt && (
              <InfoField
                label={t("fields.createdAt")}
                icon={Calendar}
                value={formatDate(game.createdAt, locale)}
              />
            )}
            {game.updatedAt && (
              <InfoField
                label={t("fields.updatedAt")}
                icon={Calendar}
                value={formatDate(game.updatedAt, locale)}
              />
            )}
          </div>
        </InfoSection>

        {/* Creator */}
        {game.author && (
          <InfoSection title={t("sections.author")} icon={User}>
            <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/2 p-4">
              <div className="relative size-10 shrink-0 overflow-hidden rounded-full bg-white/10">
                {game.author.imagePath ? (
                  <Image
                    src={cdnUrl(game.author.imagePath)!}
                    alt={game.author.name ?? ""}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                ) : (
                  <span className="flex size-full items-center justify-center text-xs font-bold text-white/40">
                    {(game.author.name ?? "?").slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  {game.author.name}
                </p>
                <p className="text-muted text-xs">@{game.author.username}</p>
              </div>
            </div>
          </InfoSection>
        )}

        {/* Administrators / Staff */}
        {staff.length > 0 && (
          <InfoSection title={t("sections.admins")} icon={ShieldCheck}>
            <ul className="space-y-2">
              {staff.map((s) => (
                <li
                  key={s.userId}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-white/5 bg-white/2 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative size-8 shrink-0 overflow-hidden rounded-full bg-white/10">
                      {s.user?.imagePath ? (
                        <Image
                          src={cdnUrl(s.user.imagePath)!}
                          alt={s.user.name ?? ""}
                          fill
                          className="object-cover"
                          sizes="32px"
                        />
                      ) : (
                        <span className="flex size-full items-center justify-center text-[10px] font-bold text-white/40">
                          {(s.user?.name ?? "?").slice(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {s.user?.name}
                      </p>
                      <p className="text-muted text-xs">@{s.user?.username}</p>
                    </div>
                  </div>
                  <div>
                    {s.isFullAccess ? (
                      <span className="border-primary/30 bg-primary/10 text-primary inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold">
                        <ShieldCheck className="size-3" />
                        {t("fullAccess")}
                      </span>
                    ) : s.capabilities.length > 0 ? (
                      <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-medium text-white/50">
                        {s.capabilities.length} {t("capabilities")}
                      </span>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </InfoSection>
        )}

        {/* Links */}
        {(game.steamUrl || game.websiteUrl) && (
          <InfoSection title={t("sections.links")} icon={Globe}>
            <div className="flex flex-wrap gap-2">
              {game.steamUrl && (
                <a
                  href={game.steamUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/60 transition-colors hover:border-white/20 hover:text-white"
                >
                  <ExternalLink className="size-3.5" />
                  Steam
                </a>
              )}
              {game.websiteUrl && (
                <a
                  href={game.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/60 transition-colors hover:border-white/20 hover:text-white"
                >
                  <ExternalLink className="size-3.5" />
                  {t("website")}
                </a>
              )}
            </div>
          </InfoSection>
        )}
      </div>
    </InfoModal>
  );
}
