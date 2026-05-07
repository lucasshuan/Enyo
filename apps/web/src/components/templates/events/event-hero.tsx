"use client";

import Image from "next/image";
import { ChevronLeft, CircleDot, Info, Trophy } from "lucide-react";
import { useTranslations } from "next-intl";

import { EventActionBar } from "@/components/triggers/events/event-action-bar";
import { EventManageActions } from "@/components/triggers/events/event-manage-actions";
import { EventRegistrationTrigger } from "@/components/triggers/events/event-registration-trigger";
import { MediaHeroSection } from "@/components/templates/shared/media-hero-section";
import { Link } from "@/i18n/routing";
import type {
  GetEventEntriesQuery,
  GetGameQuery,
  GetLeagueQuery,
} from "@/lib/apollo/generated/graphql";
import { cdnUrl } from "@/lib/utils/cdn";
import { cn } from "@/lib/utils/helpers";

type GameNode = NonNullable<GetGameQuery["game"]>;
type LeagueNode = NonNullable<GetLeagueQuery["league"]>;
type EntriesData = GetEventEntriesQuery["eventEntries"];

interface EventHeroProps {
  game: GameNode;
  league: LeagueNode;
  entries: EntriesData;
  canEdit: boolean;
  isRegistered: boolean;
  isLoggedIn: boolean;
  userId?: string;
  defaultDisplayName?: string;
}

const STATUS_ACCENT: Record<string, string> = {
  DRAFT: "border-amber-300/25 bg-amber-300/10 text-amber-200",
  REGISTRATION: "border-gold/25 bg-gold/10 text-secondary",
  ACTIVE: "border-emerald-300/25 bg-emerald-300/10 text-emerald-200",
  FINISHED: "border-white/12 bg-white/6 text-white/55",
  CANCELLED: "border-red-400/25 bg-red-400/10 text-red-200",
};

function statusLabel(value: string, t: ReturnType<typeof useTranslations>) {
  const labels: Record<string, string> = {
    DRAFT: t("statusDraft"),
    REGISTRATION: t("statusRegistration"),
    ACTIVE: t("statusActive"),
    FINISHED: t("statusFinished"),
    CANCELLED: t("statusCancelled"),
  };

  return labels[value] ?? value;
}

function typeLabel(value: string, t: ReturnType<typeof useTranslations>) {
  if (value === "LEAGUE") return t("eventTypeLeague");
  if (value === "TOURNAMENT") return t("eventTypeTournament");
  return value;
}

export function EventHero({
  game,
  league,
  entries,
  canEdit,
  isRegistered,
  isLoggedIn,
  userId,
  defaultDisplayName,
}: EventHeroProps) {
  const t = useTranslations("EventPage");
  const event = league.event!;
  const backgroundSrc = cdnUrl(game.backgroundImagePath) ?? null;
  const eventThumbnailSrc = cdnUrl(event.thumbnailImagePath) ?? null;
  const gameThumbnailSrc = cdnUrl(game.thumbnailImagePath) ?? null;
  const participantCount = entries.totalCount;

  return (
    <MediaHeroSection backgroundSrc={backgroundSrc}>
      <div className="relative">
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-5 pt-3 pb-0 sm:px-6 lg:px-8">
          <Link
            href={`/games/${game.slug}`}
            className="group focus-visible:ring-gold/40 text-gold/70 hover:text-gold inline-flex items-center gap-1.5 text-xs font-medium transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
          >
            <ChevronLeft className="size-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
            {gameThumbnailSrc ? (
              <span className="relative h-4 w-[33px] shrink-0 overflow-hidden rounded-sm bg-black/45">
                <Image
                  src={gameThumbnailSrc}
                  alt={game.name}
                  fill
                  className="object-cover"
                  sizes="33px"
                />
              </span>
            ) : null}
            <span>{t("backToGame", { gameName: game.name })}</span>
          </Link>

          <div className="flex items-center gap-2">
            <EventActionBar
              eventId={event.id}
              followCount={event.followCount ?? 0}
            />
            {canEdit && (
              <div className="lg:hidden">
                <EventManageActions
                  eventId={event.id}
                  eventName={event.name}
                  gameSlug={game.slug}
                  eventSlug={event.slug}
                />
              </div>
            )}
          </div>
        </div>

        {canEdit && (
          <div className="absolute right-5 bottom-3 z-10 hidden sm:right-6 lg:right-8 lg:flex xl:right-10">
            <EventManageActions
              eventId={event.id}
              eventName={event.name}
              gameSlug={game.slug}
              eventSlug={event.slug}
            />
          </div>
        )}

        <div className="mx-auto grid w-full max-w-[1600px] gap-4 px-5 py-2 sm:px-6 sm:py-3 lg:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.7fr)] lg:items-center lg:px-8 xl:px-10">
          <div className="grid gap-4 md:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
            <div className="bg-background/75 relative aspect-92/43 w-full max-w-80 overflow-hidden rounded-xl shadow-[0_18px_48px_rgb(0_0_0/0.34)]">
              {eventThumbnailSrc ? (
                <Image
                  src={eventThumbnailSrc}
                  alt={event.name}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 320px"
                />
              ) : (
                <div className="from-primary via-primary/70 to-gold/60 absolute inset-0 bg-linear-to-br" />
              )}

              <div
                aria-hidden
                className="absolute inset-0 bg-linear-to-t from-black/55 via-transparent to-black/10"
              />
            </div>

            <div className="flex min-w-0 flex-col justify-center gap-3">
              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-1.5">
                  <span className="border-gold/25 text-secondary inline-flex items-center gap-1.5 rounded-lg border bg-black/45 px-2 py-0.5 text-[9px] font-bold tracking-[0.12em] uppercase backdrop-blur-sm">
                    <Trophy className="size-3" />
                    {typeLabel(event.type, t)}
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-lg border px-2 py-0.5 text-[9px] font-bold tracking-[0.12em] uppercase backdrop-blur-sm",
                      STATUS_ACCENT[event.status] ??
                        "border-white/12 bg-black/45 text-white/55",
                    )}
                  >
                    <CircleDot className="size-3" />
                    {statusLabel(event.status, t)}
                  </span>
                </div>
                <p className="text-primary mt-2 text-xs leading-none font-semibold tracking-wide">
                  {event.name}
                </p>
                {event.description ? (
                  <h1 className="text-foreground font-display mt-1 line-clamp-3 text-xl leading-snug font-semibold tracking-tight sm:text-2xl">
                    {event.description.length > 180
                      ? `${event.description.slice(0, 180)}...`
                      : event.description}
                  </h1>
                ) : (
                  <h1 className="text-foreground font-display mt-1 text-xl leading-snug font-semibold tracking-tight sm:text-2xl">
                    {event.name}
                  </h1>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled
                  className="border-gold-dim/35 bg-card-strong/70 text-secondary inline-flex h-9 cursor-not-allowed items-center gap-2 rounded-lg border px-3.5 text-xs font-semibold opacity-50"
                >
                  <Info className="size-3.5" />
                  {t("viewDetails")}
                </button>
              </div>

              <div className="max-w-sm lg:hidden">
                <EventRegistrationTrigger
                  eventId={event.id}
                  isRegistered={isRegistered}
                  isLoggedIn={isLoggedIn}
                  userId={userId}
                  defaultDisplayName={defaultDisplayName}
                  participantCount={participantCount}
                  maxParticipants={event.maxParticipants}
                  registrationsEnabled={event.registrationsEnabled}
                />
              </div>
            </div>
          </div>

          <div className="hidden lg:ml-auto lg:flex lg:w-full lg:max-w-sm lg:flex-col lg:justify-center">
            <EventRegistrationTrigger
              eventId={event.id}
              isRegistered={isRegistered}
              isLoggedIn={isLoggedIn}
              userId={userId}
              defaultDisplayName={defaultDisplayName}
              participantCount={participantCount}
              maxParticipants={event.maxParticipants}
              registrationsEnabled={event.registrationsEnabled}
            />
          </div>
        </div>
      </div>
    </MediaHeroSection>
  );
}
