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
  const [authModalOpen, setAuthModalOpen] = useState(false);

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
      await toggleFollow({ variables: { eventId } });
    } catch {
      setOptimisticFollowing(!nextState);
      setLocalCount(
        (prev) => (prev ?? serverCount ?? followCount) + (nextState ? -1 : 1),
      );
    }
  };

  return (
    <>
      <button
        onClick={handleToggle}
        disabled={loading}
        aria-pressed={isFollowing}
        className={cn(
          "group relative flex h-10 w-60 items-center gap-2.5 overflow-hidden rounded-xl border px-3 font-medium shadow-[inset_0_1px_0_rgb(255_255_255/0.10),0_10px_24px_-16px_rgb(0_0_0/0.9)] transition-all duration-300 focus-visible:ring-2 focus-visible:outline-none active:scale-[0.99]",
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
          {isFollowing ? t("watching") : t("watchEvent")}
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
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        isPending={false}
      />
    </>
  );
}
