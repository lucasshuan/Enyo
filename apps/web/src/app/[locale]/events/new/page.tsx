import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/auth";
import { safeServerQuery } from "@/lib/apollo/safe-server-query";
import { GET_GAME } from "@/lib/apollo/queries/games";
import { type GetGameQuery } from "@/lib/apollo/generated/graphql";
import { CreateEventTemplate } from "@/components/templates/events/create-event-template";

interface CreateEventPageProps {
  searchParams: Promise<{ game?: string }>;
}

export default async function CreateEventPage({
  searchParams,
}: CreateEventPageProps) {
  const session = await getServerAuthSession();
  if (!session?.user) {
    redirect("/");
  }

  const { game: gameSlug } = await searchParams;

  if (!gameSlug) {
    return (
      <main>
        <CreateEventTemplate />
      </main>
    );
  }

  const data = await safeServerQuery<GetGameQuery>({
    query: GET_GAME,
    variables: { slug: gameSlug },
  });

  if (!data?.game) {
    return (
      <main>
        <CreateEventTemplate />
      </main>
    );
  }

  const { game } = data;

  const initialGame = {
    id: game.id,
    name: game.name,
    slug: game.slug,
    description: game.description ?? null,
    thumbnailImagePath: game.thumbnailImagePath ?? null,
  };

  return (
    <main>
      <CreateEventTemplate
        gameId={game.id}
        initialGame={initialGame}
        isGameFixed={true}
      />
    </main>
  );
}
