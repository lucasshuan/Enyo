import { notFound } from "next/navigation";
import { GET_GAME_LAYOUT } from "@/lib/apollo/queries/games";
import { GetGameLayoutQuery } from "@/lib/apollo/generated/graphql";
import { safeServerQuery } from "@/lib/apollo/safe-server-query";
import Image from "next/image";

interface GameLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    gameSlug: string;
    locale: string;
  }>;
}

export default async function GameLayout({
  children,
  params,
}: GameLayoutProps) {
  const { gameSlug } = await params;
  const data = await safeServerQuery<GetGameLayoutQuery>({
    query: GET_GAME_LAYOUT,
    variables: { slug: gameSlug },
  });

  if (!data?.game) {
    notFound();
  }

  const { game } = data;

  return (
    <>
      <section className="relative min-h-70 w-full overflow-hidden">
        {game.backgroundImageUrl ? (
          <>
            <Image
              src={game.backgroundImageUrl}
              alt=""
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            {/* Subtle top-to-bottom darken so text above is legible */}
            <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-transparent" />
          </>
        ) : (
          <div className="from-primary/20 to-background/94 absolute inset-0 bg-linear-to-br" />
        )}
        {/* Animated gold separator — replaces the mask fade */}
        <div className="game-banner-sep" />
      </section>
      {children}
    </>
  );
}
