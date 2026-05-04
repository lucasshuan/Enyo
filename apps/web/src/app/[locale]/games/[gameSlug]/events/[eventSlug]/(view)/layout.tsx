import { notFound } from "next/navigation";
import { GET_GAME_LAYOUT } from "@/lib/apollo/queries/games";
import { GetGameLayoutQuery } from "@/lib/apollo/generated/graphql";
import { safeServerQuery } from "@/lib/apollo/safe-server-query";
import Image from "next/image";
import { cdnUrl } from "@/lib/utils/cdn";

interface EventViewLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    gameSlug: string;
    eventSlug: string;
    locale: string;
  }>;
}

export default async function EventViewLayout({
  children,
  params,
}: EventViewLayoutProps) {
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
      <section className="relative min-h-70 w-full overflow-hidden mask-[linear-gradient(to_bottom,black_55%,transparent_100%)]">
        {game.backgroundImagePath ? (
          <>
            <Image
              src={cdnUrl(game.backgroundImagePath)!}
              alt=""
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-linear-to-b from-black/30 to-transparent" />
          </>
        ) : (
          <div className="from-primary/20 to-background/94 absolute inset-0 bg-linear-to-br" />
        )}
        <div className="game-banner-sep" />
      </section>
      {children}
    </>
  );
}
