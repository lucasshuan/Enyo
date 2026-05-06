import { notFound } from "next/navigation";

import { GameEventsPageSection } from "@/components/templates/game/game-route-sections";
import {
  getCachedGame,
  getCachedGameLeagues,
} from "@/lib/server/game-page-data";

type GameEventsPageProps = {
  params: Promise<{
    gameSlug: string;
  }>;
};

export default async function GameEventsPage({ params }: GameEventsPageProps) {
  const { gameSlug } = await params;
  const data = await getCachedGame(gameSlug);

  if (!data?.game) {
    notFound();
  }

  const leaguesData = await getCachedGameLeagues(data.game.id, gameSlug);
  const leagues = leaguesData?.leagues?.nodes ?? [];

  return (
    <GameEventsPageSection
      game={data.game}
      leagues={leagues}
      gameSlug={gameSlug}
    />
  );
}
