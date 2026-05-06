import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getServerAuthSession } from "@/auth";
import { GameHero } from "@/components/templates/game/game-hero";
import { GameRouteTabs } from "@/components/templates/game/game-route-tabs";
import { getCachedGame } from "@/lib/server/game-page-data";
import { canEditGame } from "@/lib/server/permissions";

interface GameLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    gameSlug: string;
    locale: string;
  }>;
}

type GameMetadataProps = {
  params: Promise<{
    gameSlug: string;
  }>;
};

export async function generateMetadata({
  params,
}: GameMetadataProps): Promise<Metadata> {
  const { gameSlug } = await params;
  const data = await getCachedGame(gameSlug);

  const t = await getTranslations("GamePage");
  if (!data?.game) {
    return {
      title: t("metaTitleNotFound"),
    };
  }

  const { game } = data;

  return {
    title: game.name,
    description:
      game.description ?? t("metaDescriptionFallback", { gameName: game.name }),
  };
}

export default async function GameLayout({
  children,
  params,
}: GameLayoutProps) {
  const { gameSlug } = await params;
  const [session, data] = await Promise.all([
    getServerAuthSession(),
    getCachedGame(gameSlug),
  ]);

  if (!data?.game) {
    notFound();
  }

  const { game } = data;
  const canEditCurrentGame = canEditGame(session, game.authorId);

  return (
    <main>
      <GameHero
        game={game}
        canEdit={canEditCurrentGame}
        gameSlug={game.slug}
        eventCount={game._count?.events ?? 0}
      />
      <GameRouteTabs game={game} />
      <div className="w-full">{children}</div>
    </main>
  );
}
