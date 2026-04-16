import { notFound } from "next/navigation";
import { GET_GAME } from "@/lib/apollo/queries/games";
import { GetGameQuery } from "@/lib/apollo/generated/graphql";
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
  const data = await safeServerQuery<GetGameQuery>({
    query: GET_GAME,
    variables: { slug: gameSlug },
  });

  if (!data?.game) {
    notFound();
  }

  const { game } = data;

  return (
    <>
      <section className="relative min-h-[320px] w-full overflow-hidden">
        {game.backgroundImageUrl ? (
          <>
            <Image
              src={game.backgroundImageUrl}
              alt=""
              fill
              priority
              className="object-cover opacity-60"
              sizes="100vw"
            />
            <div className="from-background/40 to-background absolute inset-0 bg-linear-to-b" />
          </>
        ) : (
          <div className="from-primary/20 to-background/94 absolute inset-0 bg-linear-to-br" />
        )}
        <div
          className="absolute inset-0 z-10"
          style={{
            maskImage:
              "linear-gradient(to bottom, black 50%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 50%, transparent 100%)",
          }}
        />
      </section>
      {children}
    </>
  );
}
