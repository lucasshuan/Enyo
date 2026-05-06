"use client";

import Image from "next/image";
import { ChevronLeft, CircleDot, Info, Trophy } from "lucide-react";
import { useTranslations } from "next-intl";

import { EventActionBar } from "@/components/triggers/events/event-action-bar";
import { EventManageActions } from "@/components/triggers/events/event-manage-actions";
import { EventRegistrationTrigger } from "@/components/triggers/events/event-registration-trigger";
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
    <section className="bg-card/25 relative isolate min-h-[420px] overflow-hidden">
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

      <div className="relative">
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-5 pt-14 pb-0 sm:px-6 lg:px-8">
          <Link
            href={`/games/${game.slug}`}
            className="group focus-visible:ring-gold/40 text-gold/70 hover:text-gold inline-flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
          >
            <ChevronLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            {gameThumbnailSrc ? (
              <span className="relative h-5 w-[41.2px] shrink-0 overflow-hidden rounded-md bg-black/45">
                <Image
                  src={gameThumbnailSrc}
                  alt={game.name}
                  fill
                  className="object-cover"
                  sizes="42px"
                />
              </span>
            ) : null}
            <span>{t("backToGame", { gameName: game.name })}</span>
          </Link>

          <EventActionBar
            eventId={event.id}
            followCount={event.followCount ?? 0}
          />
        </div>

        <div className="mx-auto grid w-full max-w-[1600px] gap-6 px-5 py-6 sm:px-6 sm:py-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.7fr)] lg:items-center lg:px-8 xl:px-10">
          <div className="grid gap-5 md:grid-cols-[minmax(0,368px)_minmax(0,1fr)]">
            <div className="bg-background/75 relative aspect-92/43 w-full max-w-92 overflow-hidden rounded-2xl shadow-[0_22px_60px_rgb(0_0_0/0.38)]">
              {eventThumbnailSrc ? (
                <Image
                  src={eventThumbnailSrc}
                  alt={event.name}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 368px"
                />
              ) : (
                <div className="from-primary via-primary/70 to-gold/60 absolute inset-0 bg-linear-to-br" />
              )}

              <div
                aria-hidden
                className="absolute inset-0 bg-linear-to-t from-black/55 via-transparent to-black/10"
              />
            </div>

            <div className="flex min-w-0 flex-col justify-center gap-5">
              <div className="min-w-0">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="border-gold/25 text-secondary inline-flex items-center gap-1.5 rounded-xl border bg-black/45 px-2.5 py-1 text-[10px] font-bold tracking-[0.12em] uppercase backdrop-blur-sm">
                    <Trophy className="size-3.5" />
                    {typeLabel(event.type, t)}
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1 text-[10px] font-bold tracking-[0.12em] uppercase backdrop-blur-sm",
                      STATUS_ACCENT[event.status] ??
                        "border-white/12 bg-black/45 text-white/55",
                    )}
                  >
                    <CircleDot className="size-3.5" />
                    {statusLabel(event.status, t)}
                  </span>
                </div>
                <p className="text-primary mt-3 text-sm font-semibold tracking-wide">
                  {event.name}
                </p>
                {event.description ? (
                  <h1 className="text-foreground mt-2 text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
                    {event.description.length > 230
                      ? `${event.description.slice(0, 230)}...`
                      : event.description}
                  </h1>
                ) : (
                  <h1 className="text-foreground mt-2 text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
                    {event.name}
                  </h1>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled
                  className="border-gold-dim/35 bg-card-strong/70 text-secondary inline-flex h-10 cursor-not-allowed items-center gap-2 rounded-xl border px-4 text-sm font-semibold opacity-50"
                >
                  <Info className="size-4" />
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

        {canEdit && (
          <div className="relative flex justify-end px-5 pb-4 sm:px-6 lg:px-8 xl:px-10">
            <EventManageActions
              eventId={event.id}
              eventName={event.name}
              gameSlug={game.slug}
              eventSlug={event.slug}
            />
          </div>
        )}
      </div>

      <div className="h-4 sm:h-6" />
    </section>
  );
}
