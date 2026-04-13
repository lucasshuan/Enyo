import { GameCardSkeleton } from "@/components/brand/game-card";

export default function GamesLoading() {
  return (
    <main>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-12 sm:px-10 lg:px-12">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="space-y-4">
              <div className="bg-primary/20 h-10 w-48 animate-pulse rounded-full lg:h-12 lg:w-64" />
              <div className="h-6 w-full max-w-md animate-pulse rounded-full bg-white/5" />
            </div>
            <div className="h-12 w-full animate-pulse rounded-2xl bg-white/5 md:w-80" />
          </div>
        </div>

        <div className="flex items-center gap-4 border-b border-white/5 pb-6">
          <div className="h-9 w-32 animate-pulse rounded-full bg-white/5" />
          <div className="h-9 w-32 animate-pulse rounded-full bg-white/5" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <GameCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </main>
  );
}
