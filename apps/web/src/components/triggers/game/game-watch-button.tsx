"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { useTranslations } from "next-intl";
import { Bell, BellPlus, LoaderCircle, Users } from "lucide-react";

import { cn, formatCompactNumber } from "@/lib/utils/helpers";
import { Tooltip } from "@/components/ui/tooltip";
import { useUser } from "@/components/providers";
import { AuthModal } from "@/components/modals/auth/auth-modal";
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
  const [authModalOpen, setAuthModalOpen] = useState(false);

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
    if (!isLoggedIn) {
      setAuthModalOpen(true);
      return;
    }
    if (loading) return;

    const nextState = !isFollowing;
    setOptimisticFollowing(nextState);
    setLocalCount(
      (prev) => (prev ?? serverCount ?? followCount) + (nextState ? 1 : -1),
    );
    setRingKey((k) => k + 1);

    try {
      await toggleFollow({ variables: { gameId } });
    } catch {
      setOptimisticFollowing(!nextState);
      setLocalCount(
        (prev) => (prev ?? serverCount ?? followCount) + (nextState ? -1 : 1),
      );
    }
  };

  // ── Compact pill variant (action bar) ─────────────────────────────────────
  if (variant === "compact") {
    return (
      <>
        <div className="rounded-xl backdrop-blur-sm">
          <button
            onClick={handleToggle}
            disabled={loading}
            aria-pressed={isFollowing}
            className={cn(
              "group relative flex h-10 w-60 items-center gap-2.5 overflow-hidden rounded-xl border px-3 font-medium shadow-[inset_0_1px_0_rgb(255_255_255/0.10),0_10px_24px_-16px_rgb(0_0_0/0.9)] transition-[color,border-color,box-shadow,transform] duration-300 focus-visible:ring-2 focus-visible:outline-none active:scale-[0.99]",
              isFollowing
                ? "border-gold/35 hover:border-gold/55 focus-visible:ring-primary/45 bg-[linear-gradient(180deg,var(--primary)_0%,var(--primary-strong)_100%)] text-white hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.15),0_0_18px_color-mix(in_srgb,var(--primary)_36%,transparent)]"
                : "border-gold-dim/45 text-gold/80 hover:border-gold/60 hover:text-gold focus-visible:ring-gold/35 bg-[linear-gradient(180deg,#26211c_0%,#151312_100%)] hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.13),0_0_16px_color-mix(in_srgb,var(--gold)_16%,transparent)]",
              loading && "cursor-wait",
            )}
          >
            {loading ? (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-black/20"
              />
            ) : null}

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
                    ? "bg-black/20 text-white/75"
                    : "text-gold/55 bg-black/30",
                )}
              >
                <Users className="size-2.5" />
                {formatCompactNumber(displayCount)}
              </span>
            </Tooltip>
          </button>
        </div>
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          isPending={false}
        />
      </>
    );
  }

  // ── Card variant (sidebar) ─────────────────────────────────────────────
  return (
    <>
      <button
        onClick={handleToggle}
        disabled={loading}
        aria-pressed={isFollowing}
        className={cn(
          "group relative w-full overflow-hidden rounded-2xl border px-4 py-3 text-left transition-all duration-300 focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:outline-none",
          isFollowing
            ? "border-primary/30 bg-primary/10 hover:border-primary/45 hover:bg-primary/15"
            : "border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/6",
          loading && "cursor-wait",
        )}
      >
        {loading ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-black/15"
          />
        ) : null}

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
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        isPending={false}
      />
    </>
  );
}
