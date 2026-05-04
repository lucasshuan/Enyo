"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import {
  ArrowUpRight,
  Calendar,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Gamepad2,
  Globe,
  Hash,
  Info,
  ShieldCheck,
  User,
} from "lucide-react";

import { InfoModal } from "@/components/ui/info-modal";
import { FollowButton } from "@/components/ui/follow-button";
import { InfoSection } from "@/components/ui/info-section";
import { InfoField } from "@/components/ui/info-field";
import {
  GET_GAME_STAFF,
  GET_GLOBAL_GAME_MANAGERS,
} from "@/lib/apollo/queries/games";
import type {
  GetGameStaffQuery,
  GetGlobalGameManagersQuery,
  GetGameQuery,
} from "@/lib/apollo/generated/graphql";
import { cdnUrl } from "@/lib/utils/cdn";
import { formatDate } from "@/lib/utils/date-utils";
import { cn } from "@/lib/utils/helpers";

type Game = NonNullable<GetGameQuery["game"]>;

interface GameInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: Game;
}

export function GameInfoModal({ isOpen, onClose, game }: GameInfoModalProps) {
  const t = useTranslations("Modals.GameInfo");
  const locale = useLocale();
  const pathname = usePathname();
  const [adminsExpanded, setAdminsExpanded] = useState(false);

  const gamePagePath = `/games/${game.slug}`;
  const isOnGamePage =
    pathname === gamePagePath || pathname.startsWith(`${gamePagePath}/`);

  const { data: staffData } = useQuery<GetGameStaffQuery>(GET_GAME_STAFF, {
    variables: { gameId: game.id },
    skip: !isOpen,
  });

  const { data: managersData } = useQuery<GetGlobalGameManagersQuery>(
    GET_GLOBAL_GAME_MANAGERS,
    { skip: !isOpen },
  );

  const staff = staffData?.gameStaff ?? [];
  const globalManagers = managersData?.globalGameManagers ?? [];

  // Merge: global managers first (deduplicated against game staff)
  const staffUserIds = new Set(staff.map((s) => s.userId));
  const extraManagers = globalManagers.filter((m) => !staffUserIds.has(m.id));

  const totalAdminCount = staff.length + extraManagers.length;

  return (
    <InfoModal
      isOpen={isOpen}
      onClose={onClose}
      className="sm:max-w-3xl lg:max-w-4xl"
      title={game.name}
      subtitle={game.slug}
      heroImageSrc={
        game.backgroundImagePath
          ? cdnUrl(game.backgroundImagePath)!
          : game.thumbnailImagePath
            ? cdnUrl(game.thumbnailImagePath)!
            : undefined
      }
      headerAction={
        <div className="flex items-center gap-2">
          <FollowButton
            targetId={game.id}
            targetType="GAME"
            followCount={game.followCount ?? 0}
          />
          <a
            href={isOnGamePage ? undefined : gamePagePath}
            target="_blank"
            rel="noreferrer"
            aria-disabled={isOnGamePage}
            tabIndex={isOnGamePage ? -1 : undefined}
            className={cn(
              "flex items-center gap-1.5 rounded-xl border border-white/20 bg-black/40 px-3 py-1.5 text-xs font-medium text-white/70 backdrop-blur-sm transition-colors",
              isOnGamePage
                ? "pointer-events-none cursor-not-allowed opacity-30"
                : "hover:border-white/40 hover:text-white",
            )}
          >
            <ArrowUpRight className="size-3.5" />
            {t("viewGame")}
          </a>
        </div>
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

        {/* Details — adaptive grid: name wide, metadata fills a row of 3 */}
        <InfoSection title={t("sections.details")} icon={Gamepad2}>
          <div className="grid grid-cols-3 gap-2">
            {/* Name spans 2 cols — usually longer */}
            <div className="col-span-2 rounded-xl border border-white/5 bg-white/2 px-3 py-2.5">
              <InfoField label={t("fields.name")} value={game.name} stacked />
            </div>
            {/* Slug fits in 1 col */}
            <div className="rounded-xl border border-white/5 bg-white/2 px-3 py-2.5">
              <InfoField
                label={t("fields.identifier")}
                icon={Hash}
                value={game.slug}
                stacked
              />
            </div>
            {/* Status + two dates fill a row of 3 */}
            <div className="rounded-xl border border-white/5 bg-white/2 px-3 py-2.5">
              <InfoField
                label={t("fields.status")}
                stacked
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
            </div>
            {game.createdAt && (
              <div className="rounded-xl border border-white/5 bg-white/2 px-3 py-2.5">
                <InfoField
                  label={t("fields.createdAt")}
                  icon={Calendar}
                  value={formatDate(game.createdAt, locale)}
                  stacked
                />
              </div>
            )}
            {game.updatedAt && (
              <div className="rounded-xl border border-white/5 bg-white/2 px-3 py-2.5">
                <InfoField
                  label={t("fields.updatedAt")}
                  icon={Calendar}
                  value={formatDate(game.updatedAt, locale)}
                  stacked
                />
              </div>
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

        {/* Administrators / Staff — collapsible */}
        <InfoSection title={t("sections.admins")} icon={ShieldCheck}>
          {/* Toggle row */}
          <button
            type="button"
            onClick={() => setAdminsExpanded((v) => !v)}
            className="flex w-full items-center justify-between rounded-xl border border-white/5 bg-white/2 px-4 py-3 text-sm transition-colors hover:bg-white/5"
          >
            <span className="text-muted text-xs">
              {adminsExpanded ? t("hideAdmins") : t("showAdmins")}
              {totalAdminCount > 0 && (
                <span className="ml-2 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-white/50">
                  {totalAdminCount}
                </span>
              )}
            </span>
            {adminsExpanded ? (
              <ChevronUp className="text-muted size-4 shrink-0" />
            ) : (
              <ChevronDown className="text-muted size-4 shrink-0" />
            )}
          </button>

          {adminsExpanded && (
            <ul className="mt-2 space-y-2">
              {/* Game-specific staff */}
              {staff.map((s) => (
                <li key={`staff-${s.userId}`}>
                  <Link
                    href={`/profile/${s.user?.username}` as never}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-white/5 bg-white/2 px-4 py-3 transition-colors hover:border-white/10 hover:bg-white/4"
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
                        <p className="text-muted text-xs">
                          @{s.user?.username}
                        </p>
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
                  </Link>
                </li>
              ))}

              {/* Platform-wide managers (not already in game staff) */}
              {extraManagers.map((m) => (
                <li key={`manager-${m.id}`}>
                  <Link
                    href={`/profile/${m.username}` as never}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-white/5 bg-white/2 px-4 py-3 transition-colors hover:border-white/10 hover:bg-white/4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative size-8 shrink-0 overflow-hidden rounded-full bg-white/10">
                        {m.imagePath ? (
                          <Image
                            src={cdnUrl(m.imagePath)!}
                            alt={m.name}
                            fill
                            className="object-cover"
                            sizes="32px"
                          />
                        ) : (
                          <span className="flex size-full items-center justify-center text-[10px] font-bold text-white/40">
                            {m.name.slice(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {m.name}
                        </p>
                        <p className="text-muted text-xs">@{m.username}</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-1 text-[10px] font-semibold text-blue-400">
                      <ShieldCheck className="size-3" />
                      {m.isAdmin ? t("platformAdmin") : t("gameManager")}
                    </span>
                  </Link>
                </li>
              ))}

              {totalAdminCount === 0 && (
                <li className="text-muted px-4 py-3 text-xs">
                  {t("noAdmins")}
                </li>
              )}
            </ul>
          )}
        </InfoSection>

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
