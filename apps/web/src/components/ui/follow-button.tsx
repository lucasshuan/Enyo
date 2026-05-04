"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { useTranslations } from "next-intl";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils/helpers";
import { useUser } from "@/components/providers";
import {
  IsFollowingGameDocument,
  IsFollowingEventDocument,
  ToggleGameFollowDocument,
  ToggleEventFollowDocument,
  GameFollowCountDocument,
  EventFollowCountDocument,
} from "@/lib/apollo/generated/graphql";

interface FollowButtonProps {
  targetId: string;
  targetType: "GAME" | "EVENT";
  followCount: number;
  className?: string;
}

export function FollowButton({
  targetId,
  targetType,
  followCount,
  className,
}: FollowButtonProps) {
  const t = useTranslations("FollowButton");
  const { user } = useUser();
  const isLoggedIn = !!user;

  const [optimisticFollowing, setOptimisticFollowing] = useState<
    boolean | null
  >(null);
  const [localCount, setLocalCount] = useState<number | null>(null);

  const { data: followGameData } = useQuery(IsFollowingGameDocument, {
    variables: { gameId: targetId },
    skip: !isLoggedIn || targetType !== "GAME",
    fetchPolicy: "cache-and-network",
  });

  const { data: followEventData } = useQuery(IsFollowingEventDocument, {
    variables: { eventId: targetId },
    skip: !isLoggedIn || targetType !== "EVENT",
    fetchPolicy: "cache-and-network",
  });

  const { data: gameCountData } = useQuery(GameFollowCountDocument, {
    variables: { gameId: targetId },
    skip: targetType !== "GAME",
    fetchPolicy: "network-only",
  });

  const { data: eventCountData } = useQuery(EventFollowCountDocument, {
    variables: { eventId: targetId },
    skip: targetType !== "EVENT",
    fetchPolicy: "network-only",
  });

  const serverFollowing =
    targetType === "GAME"
      ? (followGameData?.isFollowingGame ?? null)
      : (followEventData?.isFollowingEvent ?? null);

  const isFollowing = optimisticFollowing ?? serverFollowing ?? false;

  const serverCount =
    targetType === "GAME"
      ? gameCountData?.gameFollowCount
      : eventCountData?.eventFollowCount;

  const displayCount = localCount ?? serverCount ?? followCount;

  const [toggleGameFollow, { loading: gameLoading }] = useMutation(
    ToggleGameFollowDocument,
  );
  const [toggleEventFollow, { loading: eventLoading }] = useMutation(
    ToggleEventFollowDocument,
  );

  const isLoading = gameLoading || eventLoading;

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn || isLoading) return;

    const nextState = !isFollowing;
    setOptimisticFollowing(nextState);
    setLocalCount((prev) => (prev ?? serverCount ?? followCount) + (nextState ? 1 : -1));

    try {
      if (targetType === "GAME") {
        await toggleGameFollow({ variables: { gameId: targetId } });
      } else {
        await toggleEventFollow({ variables: { eventId: targetId } });
      }
    } catch {
      // revert
      setOptimisticFollowing(!nextState);
      setLocalCount((prev) => (prev ?? serverCount ?? followCount) + (nextState ? -1 : 1));
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={!isLoggedIn || isLoading}
      title={isLoggedIn ? undefined : t("follow")}
      className={cn(
        "flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-all",
        isFollowing
          ? "border-primary/40 bg-primary/15 text-primary hover:border-primary/60 hover:bg-primary/25"
          : "border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:bg-white/10 hover:text-white/80",
        !isLoggedIn && "cursor-default opacity-60",
        isLoading && "opacity-70",
        className,
      )}
    >
      <Heart className={cn("size-3", isFollowing && "fill-primary")} />
      <span>{displayCount}</span>
    </button>
  );
}
