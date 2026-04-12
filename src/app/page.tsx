import type { Route } from "next";
import Link from "next/link";
import { ChevronRight, Compass } from "lucide-react";

import { SignInButton } from "@/components/auth/sign-in-button";
import { LoginErrorHandler } from "@/components/auth/login-error-handler";
import { getPublicGames } from "@/server/db/queries/public";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { games: gameList, isDatabaseUnavailable } = await getPublicGames();
  const showFallbackCard = isDatabaseUnavailable || gameList.length === 0;

  return (
    <main className="grid-surface">
      <LoginErrorHandler />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 py-12 sm:px-10 lg:px-12 lg:py-16">
        <section className="flex flex-col items-center space-y-4 text-center">
          <h1 className="text-5xl font-semibold tracking-[-0.06em] text-primary sm:text-6xl lg:text-7xl">
            Enyo
          </h1>
          <p className="max-w-2xl text-base leading-8 text-muted sm:text-lg">
            Rankings and tournaments for competitive games.
          </p>
          <div className="flex gap-3 pt-4 sm:gap-4">
            <Link
              href={`/#games` as Route}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 hover:border-primary/40 hover:bg-white/8 transition px-6 py-3 font-medium text-sm sm:text-base"
            >
              <Compass className="size-5" />
              Explore
            </Link>
            <SignInButton
              size="md"
              label="Join"
              className="text-sm sm:text-base"
            />
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-sm uppercase tracking-[0.32em] text-primary sm:text-base">
                Games
              </p>
              <h2 className="mt-2 text-sm font-medium text-muted sm:text-base">
                Choose a game to view its rankings.
              </h2>
            </div>
          </div>

          {!showFallbackCard ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {gameList.map((game) => (
                <Link
                  key={game.id}
                  href={`/games/${game.id}` as Route}
                  className="glass-panel group overflow-hidden rounded-[1.8rem] max-w-xs"
                >
                  <div
                    className="h-44 w-full bg-cover bg-center"
                    style={{
                      backgroundImage: game.thumbnailImageUrl
                        ? `linear-gradient(180deg, rgba(11,8,15,0.08), rgba(11,8,15,0.68)), url(${game.thumbnailImageUrl})`
                        : "linear-gradient(135deg, rgba(186,17,47,0.48), rgba(11,8,15,0.92))",
                    }}
                  />

                  <div className="flex items-center justify-between gap-4 p-5">
                    <div>
                      <h3 className="text-lg font-semibold">{game.name}</h3>
                      <p className="mt-1.5 line-clamp-2 text-xs leading-4 text-muted">
                        {game.description ?? "Open the game page to inspect current rankings."}
                      </p>
                    </div>

                    <ChevronRight className="size-5 shrink-0 text-secondary transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <div
                aria-disabled="true"
                className="glass-panel overflow-hidden rounded-[1.8rem] opacity-80 max-w-xs"
              >
                <div className="flex h-44 w-full items-center justify-center bg-gradient-to-br from-primary/22 via-primary/8 to-transparent">
                  <div className="h-16 w-16 rounded-[1.4rem] border border-white/8 bg-white/5" />
                </div>

                <div className="space-y-2 p-5">
                  <h3 className="text-lg font-semibold">No games available</h3>
                  <p className="text-xs leading-4 text-muted">
                    Add games to the database or reconnect the current database to
                    load the list here.
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
