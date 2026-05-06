import { redirect } from "next/navigation";

import { getServerAuthSession } from "@/auth";
import { CreateEventTemplate } from "@/components/templates/events/create-event-template";
import type { SimpleGame } from "@/actions/game";
import { getCachedGame } from "@/lib/server/game-page-data";

type NewEventPageProps = {
  searchParams: Promise<{
    game?: string;
  }>;
};

export default async function NewEventPage({
  searchParams,
}: NewEventPageProps) {
  const session = await getServerAuthSession();
  if (!session?.user) {
    redirect("/");
  }

  const { game: gameSlug } = await searchParams;
  const initialGame = gameSlug ? await getInitialGame(gameSlug) : undefined;

  return (
    <main>
      <CreateEventTemplate
        gameId={initialGame?.id}
        initialGame={initialGame}
        isGameFixed={!!initialGame}
      />
    </main>
  );
}

async function getInitialGame(slug: string): Promise<SimpleGame | undefined> {
  const data = await getCachedGame(slug);

  if (!data?.game) {
    return undefined;
  }

  return {
    id: data.game.id,
    name: data.game.name,
    slug: data.game.slug,
    description: data.game.description,
    thumbnailImagePath: data.game.thumbnailImagePath,
  };
}
