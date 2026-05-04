"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { useTranslations } from "next-intl";
import { Bell, BellPlus, LoaderCircle, Users } from "lucide-react";

import { cn, formatCompactNumber } from "@/lib/utils/helpers";
import { Tooltip } from "@/components/ui/tooltip";
import { useUser } from "@/components/providers";
import {
  GameFollowCountDocument,
  IsFollowingGameDocument,
  ToggleGameFollowDocument,
} from "@/lib/apollo/generated/graphql";

interface GameWatchButtonProps {
  gameId: string;
  followCount: number;
  /** "card" — full-width sidebar card (default). "compact" — inline pill for action bars. */
  variant?: "card" | "compact";
}

export function GameWatchButton({
  gameId,
  followCount,
  variant = "card",
}: GameWatchButtonProps) {
  const t = useTranslations("GamePage");
  const { user } = useUser();
  const isLoggedIn = !!user;

  const [optimisticFollowing, setOptimisticFollowing] = useState<
    boolean | null
  >(null);
  const [ringKey, setRingKey] = useState(0);
  const [localCount, setLocalCount] = useState<number | null>(null);

  const { data: followData } = useQuery(IsFollowingGameDocument, {
    variables: { gameId },
    skip: !isLoggedIn,
    fetchPolicy: "cache-and-network",
  });

  const { data: countData } = useQuery(GameFollowCountDocument, {
    variables: { gameId },
    fetchPolicy: "network-only",
  });

  const serverFollowing = followData?.isFollowingGame ?? null;
  const isFollowing = optimisticFollowing ?? serverFollowing ?? false;

  // Use fresh count from network; fall back to prop while loading
  const serverCount = countData?.gameFollowCount;
  const displayCount = localCount ?? serverCount ?? followCount;

  const [toggleFollow, { loading }] = useMutation(ToggleGameFollowDocument);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn || loading) return;

    const nextState = !isFollowing;
    setOptimisticFollowing(nextState);
    setLocalCount((prev) => (prev ?? serverCount ?? followCount) + (nextState ? 1 : -1));
    setRingKey((k) => k + 1);

    try {
      await toggleFollow({ variables: { gameId } });
    } catch {
      setOptimisticFollowing(!nextState);
      setLocalCount((prev) => (prev ?? serverCount ?? followCount) + (nextState ? -1 : 1));
    }
  };

  // ── Compact pill variant (action bar) ─────────────────────────────────────
  if (variant === "compact") {
    return (
      <button
        onClick={handleToggle}
        disabled={!isLoggedIn || loading}
        aria-pressed={isFollowing}
        className={cn(
          "group focus-visible:ring-gold/40 relative flex h-10 w-60 items-center gap-2.5 overflow-hidden rounded-xl px-3 font-medium transition-all duration-300 focus-visible:ring-2 focus-visible:outline-none",
          isFollowing
            ? "border-primary/60 bg-primary/25 hover:bg-primary/30 border text-white shadow-[0_0_14px_0px_color-mix(in_srgb,var(--primary)_35%,transparent)]"
            : "border-gold-dim/50 bg-card-strong/80 text-gold/80 hover:border-gold/60 hover:text-gold border",
          !isLoggedIn && "cursor-default opacity-50",
          loading && "opacity-60",
        )}
      >
        {/* Subtle background tint */}
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 transition-opacity duration-300",
            isFollowing
              ? "bg-[radial-gradient(ellipse_70%_80%_at_10%_50%,color-mix(in_srgb,var(--primary)_20%,transparent),transparent)]"
              : "bg-[radial-gradient(ellipse_60%_80%_at_10%_50%,color-mix(in_srgb,var(--gold)_8%,transparent),transparent)] opacity-0 group-hover:opacity-100",
          )}
        />

        {/* Bell icon */}
        <span className="relative shrink-0">
          {loading ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : isFollowing ? (
            <Bell
              key={ringKey}
              className="animate-bell-ring size-4 fill-white/30 text-white transition-none"
            />
          ) : (
            <BellPlus className="size-4" />
          )}
        </span>

        {/* Label */}
        <span className="relative flex-1 text-left text-sm">
          {isFollowing ? t("watching") : t("watchGame")}
        </span>

        {/* Follower count chip */}
        <Tooltip content={t("watchersTooltip", { count: displayCount })}>
          <span
            className={cn(
              "relative flex items-center gap-1 rounded-lg px-1.5 py-0.5 text-[10px] font-bold tabular-nums",
              isFollowing
                ? "bg-white/10 text-white/70"
                : "bg-gold-dim/20 text-gold/60",
            )}
          >
            <Users className="size-2.5" />
            {formatCompactNumber(displayCount)}
          </span>
        </Tooltip>
      </button>
    );
  }

  // ── Card variant (sidebar) ─────────────────────────────────────────────────
  return (
    <button
      onClick={handleToggle}
      disabled={!isLoggedIn || loading}
      aria-pressed={isFollowing}
      className={cn(
        "group relative w-full overflow-hidden rounded-2xl border px-4 py-3 text-left transition-all duration-300 focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:outline-none",
        isFollowing
          ? "border-primary/30 bg-primary/10 hover:border-primary/45 hover:bg-primary/15"
          : "border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/6",
        !isLoggedIn && "cursor-default opacity-50",
        loading && "opacity-60",
      )}
    >
      {/* Radial glow when following */}
      {isFollowing && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-40"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 20% 50%, color-mix(in srgb, var(--primary) 20%, transparent), transparent 70%)",
          }}
        />
      )}

      <div className="relative flex items-center gap-3">
        {/* Bell icon container */}
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-xl transition-all duration-300",
            isFollowing
              ? "bg-primary/20 text-primary"
              : "bg-white/5 text-white/40 group-hover:bg-white/10 group-hover:text-white/70",
          )}
        >
          {loading ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : isFollowing ? (
            <Bell
              key={ringKey}
              className={cn(
                "fill-primary/50 size-4 transition-none",
                "animate-bell-ring",
              )}
            />
          ) : (
            <BellPlus className="size-4 transition-transform duration-200 group-hover:scale-110" />
          )}
        </div>

        {/* Text */}
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "text-sm leading-tight font-semibold transition-colors duration-200",
              isFollowing
                ? "text-primary"
                : "text-white/70 group-hover:text-white",
            )}
          >
            {isFollowing ? t("watching") : t("watchGame")}
          </p>
          <p className="mt-0.5 text-[11px] leading-tight text-white/30">
            {isFollowing ? t("watchingDescription") : t("watchDescription")}
          </p>
        </div>

        {/* Follower count */}
        <div
          className={cn(
            "flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold tabular-nums transition-colors duration-200",
            isFollowing
              ? "bg-primary/15 text-primary"
              : "bg-white/5 text-white/25",
          )}
        >
          <Users className="size-3 opacity-70" />
          <span>{formatCompactNumber(displayCount)}</span>
        </div>
      </div>
    </button>
  );
}
