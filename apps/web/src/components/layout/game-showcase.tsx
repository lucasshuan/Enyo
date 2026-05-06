"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import type { Route } from "next";
import { CalendarDays, ChevronRight, Users } from "lucide-react";
import { cn } from "@/lib/utils/helpers";
import { buttonVariants } from "@/components/ui/button";
import { cdnUrl } from "@/lib/utils/cdn";

export interface ShowcaseGame {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  thumbnailImagePath?: string | null;
  backgroundImagePath?: string | null;
  eventCount: number;
  playerCount: number;
  followCount: number;
  events?: { id: string; name: string; slug: string; type: string }[];
}

interface GameShowcaseProps {
  games: ShowcaseGame[];
  labels: {
    title: string;
    description: string;
    events: string;
    recentEvents: string;
    players: string;
    explore: string;
    viewAll: string;
    emptyTitle: string;
    emptyDescription: string;
  };
}

const AUTOPLAY_MS = 5500;

export function GameShowcase({ games, labels }: GameShowcaseProps) {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const count = games.length;

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!isPaused && count > 1) {
      timerRef.current = setInterval(
        () => setActive((p) => (p + 1) % count),
        AUTOPLAY_MS,
      );
    }
  }, [count, isPaused]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  const select = (i: number) => {
    setActive(i);
    resetTimer();
  };

  if (count === 0) {
    return (
      <EmptyState
        title={labels.emptyTitle}
        description={labels.emptyDescription}
      />
    );
  }

  const game = games[active];

  return (
    <section className="relative space-y-10">
      {/* Header */}
      <div className="relative flex items-end justify-between gap-4">
        {/* Diagonal championship slash */}
        <div
          className="from-primary-strong via-primary/40 animate-slash-pulse pointer-events-none absolute -top-4 -bottom-4 -left-16 w-3/5 -skew-x-12 overflow-hidden rounded-r-2xl bg-linear-to-r to-transparent motion-reduce:animate-none sm:-left-20"
          aria-hidden="true"
        >
          {/* Periodic sheen sweep */}
          <div className="animate-slash-sheen pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-linear-to-r from-transparent via-white/20 to-transparent motion-reduce:hidden" />
        </div>

        <div className="relative -ml-4 sm:-ml-7 lg:-ml-10">
          <h2 className="font-display text-2xl font-bold tracking-widest uppercase sm:text-3xl">
            <span className="text-gold-metallic">{labels.title}</span>
          </h2>
          <p className="text-muted mt-1 text-sm italic sm:text-base">
            {labels.description}
          </p>
        </div>
        <Link
          href="/games"
          className="group text-muted hover:text-foreground relative hidden items-center gap-1 text-sm transition-colors sm:flex"
        >
          {labels.viewAll}
          <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Main showcase area */}
      <div className="relative grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:gap-0">
        {/* ── Left: info panel ── */}
        <div className="relative z-10 flex flex-col justify-center lg:pr-10">
          <div key={game.id} className="animate-showcase-slide space-y-5">
            {/* Game name */}
            <h3 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {game.name}
            </h3>

            {/* Description */}
            {game.description && (
              <p className="text-muted max-w-md text-sm leading-relaxed sm:text-base">
                {game.description}
              </p>
            )}

            {/* Stats */}
            <div className="flex gap-6">
              <Stat
                icon={CalendarDays}
                value={game.eventCount}
                label={labels.events}
              />
              <Stat
                icon={Users}
                value={game.playerCount}
                label={labels.players}
              />
            </div>

            {/* CTA */}
            <div className="flex items-center gap-3">
              <Link
                href={`/games/${game.slug}` as Route}
                className={cn(
                  buttonVariants({ intent: "primary", size: "sm" }),
                  "gap-2",
                )}
              >
                {labels.explore}
                <ChevronRight className="size-4 transition-transform group-hover:-translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* ── Right: carousel card ── */}
        <div
          className="group/card relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Background glow */}
          <div
            className="bg-primary/5 pointer-events-none absolute -inset-8 rounded-full blur-[80px] transition-opacity duration-700"
            aria-hidden="true"
          />

          {/* Card */}
          <div className="glass-panel relative overflow-hidden rounded-3xl [&::after]:hidden">
            {/* Image */}
            <div className="relative aspect-video w-full overflow-hidden">
              <div
                key={`img-${game.id}`}
                className="animate-showcase-fade absolute inset-0"
              >
                {game.backgroundImagePath || game.thumbnailImagePath ? (
                  <Image
                    src={
                      cdnUrl(
                        game.backgroundImagePath ?? game.thumbnailImagePath,
                      )!
                    }
                    alt={game.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, min(55vw, 704px)"
                    priority={active === 0}
                  />
                ) : (
                  <div className="from-primary/30 to-background h-full w-full bg-linear-to-br" />
                )}
              </div>

              {/* Gradient masks */}
              <div className="from-background/95 absolute inset-0 bg-linear-to-t via-transparent to-transparent" />
              <div className="from-background/40 lg:from-background/70 absolute inset-0 bg-linear-to-r to-transparent" />

              {/* Recent events overlay */}
              {game.events && game.events.length > 0 && (
                <div className="absolute right-3 bottom-3 left-3 flex flex-col gap-1.5">
                  <p className="mb-0.5 px-1 text-[10px] font-semibold tracking-widest text-white/35 uppercase">
                    {labels.recentEvents}
                  </p>
                  {game.events.slice(0, 3).map((event) => (
                    <Link
                      key={event.id}
                      href={`/games/${game.slug}/events/${event.slug}` as Route}
                      className="group/ev flex items-center justify-between gap-2 rounded-xl border border-white/8 bg-black/40 px-3 py-2 backdrop-blur-md transition-all hover:border-white/15 hover:bg-black/55"
                    >
                      <span className="truncate text-xs font-medium text-white/75 transition-colors group-hover/ev:text-white">
                        {event.name}
                      </span>
                      <span className="shrink-0 rounded-md border border-white/10 bg-white/8 px-1.5 py-0.5 font-mono text-[9px] font-semibold tracking-wider text-white/40 uppercase">
                        {event.type}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail strip / selector */}
            {count > 1 && (
              <div className="flex gap-2 p-3">
                {games.map((g, i) => (
                  <button
                    key={g.id}
                    onClick={() => select(i)}
                    className={cn(
                      "group/thumb relative h-14 flex-1 overflow-hidden rounded-xl border transition-all duration-300 sm:h-16",
                      i === active
                        ? "border-primary/40 ring-primary/20 ring-1"
                        : "border-white/5 opacity-50 hover:opacity-80",
                    )}
                  >
                    {g.thumbnailImagePath ? (
                      <Image
                        src={cdnUrl(g.thumbnailImagePath)!}
                        alt={g.name}
                        fill
                        className="object-cover"
                        sizes="150px"
                      />
                    ) : (
                      <div className="from-primary/20 to-background h-full w-full bg-linear-to-br" />
                    )}
                    {/* Overlay name */}
                    <div className="absolute inset-0 bottom-0 flex items-center justify-center bg-black/40"></div>
                    <span className="bg-primary-strong absolute right-0 bottom-0 flex items-center justify-center rounded-tl-lg px-2 text-[8px] font-semibold tracking-wide text-white/80 shadow-md sm:text-[9px]">
                      {g.name}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Progress bar */}
            {count > 1 && (
              <div className="flex gap-1.5 px-3 pb-3">
                {games.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "relative h-0.5 flex-1 overflow-hidden rounded-full bg-white/8",
                    )}
                  >
                    <div
                      className={cn(
                        "bg-primary/60 absolute inset-y-0 left-0 rounded-full",
                        i === active
                          ? "animate-showcase-progress"
                          : i < active
                            ? "w-full"
                            : "w-0",
                      )}
                      style={
                        i === active
                          ? ({
                              "--showcase-duration": `${AUTOPLAY_MS}ms`,
                              animationPlayState: isPaused
                                ? "paused"
                                : "running",
                            } as React.CSSProperties)
                          : undefined
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile "View all" */}
      <div className="flex justify-center sm:hidden">
        <Link
          href="/games"
          className="group text-muted hover:text-foreground inline-flex items-center gap-1 text-sm transition-colors"
        >
          {labels.viewAll}
          <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}

function Stat({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex size-9 items-center justify-center rounded-xl border border-white/8 bg-white/5">
        <Icon className="text-primary size-4" />
      </div>
      <div>
        <p className="text-lg leading-none font-bold">{value}</p>
        <p className="text-muted text-xs">{label}</p>
      </div>
    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="space-y-10">
      <div className="glass-panel flex flex-col items-center justify-center rounded-3xl py-20 text-center">
        <div className="mb-4 flex size-16 items-center justify-center rounded-2xl border border-white/8 bg-white/5">
          <CalendarDays className="text-muted size-7" />
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-muted mt-1 max-w-sm text-sm">{description}</p>
      </div>
    </section>
  );
}
