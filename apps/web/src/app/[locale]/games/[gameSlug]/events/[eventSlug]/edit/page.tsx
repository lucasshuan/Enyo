import { notFound, redirect } from "next/navigation";
import { getServerAuthSession } from "@/auth";
import { canManageLeagues } from "@/lib/server/permissions";
import { safeServerQuery } from "@/lib/apollo/safe-server-query";
import { GET_LEAGUE } from "@/lib/apollo/queries/leagues";
import { type GetLeagueQuery } from "@/lib/apollo/generated/graphql";
import { EditEventTemplate } from "@/components/templates/events/edit-event-template";

interface EditEventPageProps {
  params: Promise<{
    gameSlug: string;
    eventSlug: string;
  }>;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { gameSlug, eventSlug } = await params;

  const session = await getServerAuthSession();
  if (!canManageLeagues(session)) {
    redirect(`/games/${gameSlug}/events/${eventSlug}`);
  }

  const data = await safeServerQuery<GetLeagueQuery>({
    query: GET_LEAGUE,
    variables: { gameSlug, leagueSlug: eventSlug },
  });

  if (!data?.league) notFound();

  const { league } = data;

  const leagueForEdit = {
    eventId: league.eventId,
    gameId: league.event?.game?.id ?? "",
    name: league.event?.name ?? "",
    slug: league.event?.slug ?? "",
    description: league.event?.description ?? null,
    about: league.event?.about ?? null,
    thumbnailImagePath: league.event?.thumbnailImagePath ?? null,
    type: (league.event?.type ?? "LEAGUE") as "LEAGUE" | "TOURNAMENT",
    participationMode: (league.event?.participationMode ?? "SOLO") as
      | "SOLO"
      | "TEAM",
    classificationSystem: league.classificationSystem as "ELO" | "POINTS",
    allowDraw: league.allowDraw,
    config: (league.config ?? {}) as Record<string, unknown>,
    allowedFormats: [...league.allowedFormats],
    status: league.event?.status ?? null,
    visibility: league.event?.visibility ?? null,
    startDate: league.event?.startDate ?? null,
    endDate: league.event?.endDate ?? null,
    registrationsEnabled: league.event?.registrationsEnabled ?? null,
    registrationStartDate: league.event?.registrationStartDate ?? null,
    registrationEndDate: league.event?.registrationEndDate ?? null,
    maxParticipants: league.event?.maxParticipants ?? null,
    requiresApproval: league.event?.requiresApproval ?? null,
    waitlistEnabled: league.event?.waitlistEnabled ?? null,
    officialLinks: Array.isArray(league.event?.officialLinks)
      ? (league.event.officialLinks as Array<{ label: string; url: string }>)
      : null,
    game: {
      name: league.event?.game?.name ?? "",
      slug: league.event?.game?.slug ?? "",
      thumbnailImagePath: league.event?.game?.thumbnailImagePath ?? null,
      description: league.event?.game?.description ?? null,
    },
  };

  return (
    <EditEventTemplate
      league={leagueForEdit}
      gameSlug={gameSlug}
      eventSlug={eventSlug}
    />
  );
}
