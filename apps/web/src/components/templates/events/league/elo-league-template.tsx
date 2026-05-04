import Image from "next/image";
import { ChevronLeft, Trophy, Lock, Globe } from "lucide-react";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import type { Route } from "next";

import { SidebarPageLayout } from "@/components/ui/sidebar-page-layout";
import { GlowBorder } from "@/components/ui/glow-border";
import { SectionHeader } from "@/components/ui/section-header";
import { EventRegistrationTrigger } from "@/components/triggers/events/event-registration-trigger";
import { EventManageActions } from "@/components/triggers/events/event-manage-actions";
import { EventActionBar } from "@/components/triggers/events/event-action-bar";
import { LeagueLeaderboardTable } from "@/components/tables/league-leaderboard-table";

import { cdnUrl } from "@/lib/utils/cdn";
import { cn } from "@/lib/utils/helpers";
import { formatDate } from "@/lib/utils/date-utils";

import type {
  GetLeagueQuery,
  GetEventEntriesQuery,
} from "@/lib/apollo/generated/graphql";
import type { Session } from "next-auth";

type LeagueData = NonNullable<GetLeagueQuery["league"]>;
type EventEntriesData = NonNullable<GetEventEntriesQuery>["eventEntries"];

interface EloLeagueTemplateProps {
  league: LeagueData;
  entries: EventEntriesData;
  session: Session | null;
  isEditor: boolean;
  isRegistered: boolean;
}

const STATUS_COLOR: Record<string, string> = {
  DRAFT: "text-warning",
  REGISTRATION: "text-primary",
  ACTIVE: "text-success",
  FINISHED: "text-white/40",
  CANCELLED: "text-danger",
};
const STATUS_LABEL: Record<string, string> = {
  DRAFT: "Rascunho",
  REGISTRATION: "Inscrições abertas",
  ACTIVE: "Em andamento",
  FINISHED: "Encerrado",
  CANCELLED: "Cancelado",
};
const CLASSIFICATION_LABEL: Record<string, string> = {
  ELO: "Elo",
  POINTS: "Pontos corridos",
};

function EventTypeBadge({ type }: { type: string }) {
  const styles: Record<string, string> = {
    LEAGUE:
      "border-gold/35 bg-[color-mix(in_srgb,var(--gold)_12%,transparent)] text-gold",
    TOURNAMENT: "border-danger/30 bg-danger/10 text-danger",
  };
  const labels: Record<string, string> = {
    LEAGUE: "Liga",
    TOURNAMENT: "Torneio",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
        styles[type] ?? "border-primary/20 bg-primary/10 text-primary",
      )}
    >
      <Trophy className="size-3" />
      {labels[type] ?? type}
    </span>
  );
}

export async function EloLeagueTemplate({
  league,
  entries,
  session,
  isEditor,
  isRegistered,
}: EloLeagueTemplateProps) {
  const t = await getTranslations("EventPage");
  const event = league.event!;
  const game = event.game;

  const gameSlug = game.slug;
  const eventSlug = event.slug;
  const gameThumbnail = game.thumbnailImagePath;

  const userId = session?.user?.id;
  const userName = session?.user?.name ?? "";

  return (
    <SidebarPageLayout
      sidebar={
        <>
          {/* Back to game — gold border, matches game page style */}
          <Link
            href={`/games/${gameSlug}` as Route}
            className="group border-gold/45 bg-card text-muted hover:border-gold hover:text-foreground flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all duration-200"
          >
            <ChevronLeft className="size-4 shrink-0 transition-transform group-hover:-translate-x-1" />
            {gameThumbnail && (
              <div
                className="relative h-8 w-auto shrink-0 overflow-hidden rounded-lg opacity-70 transition-opacity group-hover:opacity-100"
                style={{ aspectRatio: "92/43" }}
              >
                <Image
                  src={cdnUrl(gameThumbnail)!}
                  alt={game.name}
                  fill
                  className="object-cover"
                  sizes="70px"
                />
              </div>
            )}
            <span className="min-w-0 truncate">{game.name}</span>
          </Link>

          {/* Event info card */}
          <GlowBorder
            className="rounded-3xl"
            borderClassName="bg-[color-mix(in_srgb,var(--gold)_45%,transparent)]"
          >
            <div className="relative space-y-0">
              {/* Event thumbnail */}
              {event.thumbnailImagePath && (
                <div
                  className="relative w-full overflow-hidden rounded-t-3xl"
                  style={{ aspectRatio: "92/43" }}
                >
                  <Image
                    src={cdnUrl(event.thumbnailImagePath)!}
                    alt={event.name}
                    fill
                    className="object-cover"
                    sizes="320px"
                  />
                </div>
              )}

              <div className="relative p-5">
                {isEditor && (
                  <div className="absolute top-3 right-3">
                    <EventManageActions
                      eventId={event.id}
                      eventName={event.name}
                      gameSlug={gameSlug}
                      eventSlug={eventSlug}
                    />
                  </div>
                )}
                {/* Title + description */}
                <div className="mb-4">
                  <div className="mb-2">
                    <EventTypeBadge type={event.type} />
                  </div>
                  <h2 className="text-foreground text-base leading-snug font-bold">
                    {event.name}
                  </h2>
                  {event.description && (
                    <p className="text-muted mt-1 text-[13px] leading-snug">
                      {event.description}
                    </p>
                  )}
                </div>

                <div className="border-border/50 border-t" />

                {/* Key / value rows — all dd use the same text size for equal row height */}
                <dl className="mt-4 space-y-1.5">
                  {/* Formato */}
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-muted/60 shrink-0 text-[11px] font-medium">
                      Formato
                    </dt>
                    <dd className="text-foreground/80 text-right text-[12px] font-medium">
                      {CLASSIFICATION_LABEL[league.classificationSystem] ??
                        league.classificationSystem}
                    </dd>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-muted/60 shrink-0 text-[11px] font-medium">
                      Status
                    </dt>
                    <dd
                      className={cn(
                        "text-right text-[12px] font-semibold",
                        STATUS_COLOR[event.status] ?? "text-white/40",
                      )}
                    >
                      {STATUS_LABEL[event.status] ?? event.status}
                    </dd>
                  </div>

                  {/* Visibilidade */}
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-muted/60 shrink-0 text-[11px] font-medium">
                      Visibilidade
                    </dt>
                    <dd className="text-foreground/80 inline-flex items-center gap-1 text-right text-[12px] font-medium">
                      {event.visibility === "PRIVATE" ? (
                        <>
                          <Lock className="size-3" />
                          Privado
                        </>
                      ) : (
                        <>
                          <Globe className="size-3" />
                          Público
                        </>
                      )}
                    </dd>
                  </div>

                  {/* Início */}
                  {event.startDate && (
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-muted/60 shrink-0 text-[11px] font-medium">
                        Início
                      </dt>
                      <dd className="text-foreground/80 text-right text-[12px] font-medium tabular-nums">
                        {formatDate(event.startDate)}
                      </dd>
                    </div>
                  )}

                  {/* Fim */}
                  {event.endDate && (
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-muted/60 shrink-0 text-[11px] font-medium">
                        Fim
                      </dt>
                      <dd className="text-foreground/80 text-right text-[12px] font-medium tabular-nums">
                        {formatDate(event.endDate)}
                      </dd>
                    </div>
                  )}

                  {/* Participantes */}
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-muted/60 shrink-0 text-[11px] font-medium">
                      Participantes
                    </dt>
                    <dd className="text-foreground/80 text-right text-[12px] font-medium tabular-nums">
                      {entries.totalCount}
                      {event.maxParticipants != null && (
                        <span className="text-muted">
                          {" "}
                          / {event.maxParticipants}
                        </span>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </GlowBorder>

          {/* Registration trigger */}
          <EventRegistrationTrigger
            eventId={event.id}
            isRegistered={isRegistered}
            isLoggedIn={!!session}
            userId={userId}
            defaultDisplayName={userName}
            participantCount={entries.totalCount}
            maxParticipants={event.maxParticipants}
            registrationsEnabled={event.registrationsEnabled}
          />
        </>
      }
    >
      <div className="space-y-6">
        <EventActionBar
          eventId={event.id}
          followCount={event.followCount ?? 0}
        />
        <hr className="border-border/50" />

        {/* About section */}
        {event.about && (
          <section className="space-y-4 pt-4">
            <SectionHeader title={t("aboutTitle")} />
            <div
              className="prose prose-sm text-foreground/80 [&_em]:text-foreground/70 [&_h2]:text-foreground [&_h3]:text-foreground [&_strong]:text-foreground max-w-none [&_h2]:text-lg [&_h2]:font-bold [&_h3]:text-base [&_h3]:font-semibold [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5"
              dangerouslySetInnerHTML={{ __html: event.about }}
            />
          </section>
        )}

        {/* Leaderboard section */}
        <section className="space-y-4 pt-4">
          <SectionHeader
            title={t("leaderboardTitle")}
            description={t("leaderboardDescription")}
          />
          <LeagueLeaderboardTable
            entries={entries.nodes}
            classificationSystem={league.classificationSystem}
            allowDraw={league.allowDraw}
          />
        </section>
      </div>
    </SidebarPageLayout>
  );
}
