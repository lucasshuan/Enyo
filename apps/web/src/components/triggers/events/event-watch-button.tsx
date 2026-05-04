"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { useTranslations } from "next-intl";
import { Bell, BellPlus, LoaderCircle, Users } from "lucide-react";

import { cn, formatCompactNumber } from "@/lib/utils/helpers";
import { Tooltip } from "@/components/ui/tooltip";
import { useUser } from "@/components/providers";
import {
  EventFollowCountDocument,
  IsFollowingEventDocument,
  ToggleEventFollowDocument,
} from "@/lib/apollo/generated/graphql";

interface EventWatchButtonProps {
  eventId: string;
  followCount: number;
}

export function EventWatchButton({
  eventId,
  followCount,
}: EventWatchButtonProps) {
  const t = useTranslations("EventPage");
  const { user } = useUser();
  const isLoggedIn = !!user;

  const [optimisticFollowing, setOptimisticFollowing] = useState<
    boolean | null
  >(null);
  const [ringKey, setRingKey] = useState(0);
  const [localCount, setLocalCount] = useState<number | null>(null);

  const { data: followData } = useQuery(IsFollowingEventDocument, {
    variables: { eventId },
    skip: !isLoggedIn,
    fetchPolicy: "cache-and-network",
  });

  const { data: countData } = useQuery(EventFollowCountDocument, {
    variables: { eventId },
    fetchPolicy: "network-only",
  });

  const serverFollowing = followData?.isFollowingEvent ?? null;
  const isFollowing = optimisticFollowing ?? serverFollowing ?? false;

  const serverCount = countData?.eventFollowCount;
  const displayCount = localCount ?? serverCount ?? followCount;

  const [toggleFollow, { loading }] = useMutation(ToggleEventFollowDocument);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn || loading) return;

    const nextState = !isFollowing;
    setOptimisticFollowing(nextState);
    setLocalCount(
      (prev) => (prev ?? serverCount ?? followCount) + (nextState ? 1 : -1),
    );
    setRingKey((k) => k + 1);

    try {
      await toggleFollow({ variables: { eventId } });
    } catch {
      setOptimisticFollowing(!nextState);
      setLocalCount(
        (prev) => (prev ?? serverCount ?? followCount) + (nextState ? -1 : 1),
      );
    }
  };

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
        {isFollowing ? t("watching") : t("watchEvent")}
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
