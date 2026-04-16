import { notFound } from "next/navigation";
import { GET_GAME } from "@/lib/apollo/queries/games";
import { GetGameQuery } from "@/lib/apollo/generated/graphql";
import { safeServerQuery } from "@/lib/apollo/safe-server-query";

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
      <section className="relative min-h-64 w-full overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: game.backgroundImageUrl
              ? `linear-gradient(180deg, rgba(11,8,15,0.4) 0%, rgba(11,8,15,0) 100%), url(${game.backgroundImageUrl})`
              : "linear-gradient(135deg, color-mix(in srgb, var(--primary) 32%, transparent), rgba(11,8,15,0.94))",
            backgroundPosition: "center",
            backgroundSize: "cover",
            maskImage:
              "linear-gradient(to bottom, black 70%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 70%, transparent 100%)",
          }}
        />
      </section>
      {children}
    </>
  );
}
