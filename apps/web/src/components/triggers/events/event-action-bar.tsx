"use client";

import { ShareButton } from "@/components/ui/share-button";
import { EventWatchButton } from "@/components/triggers/events/event-watch-button";

interface EventActionBarProps {
  eventId: string;
  followCount: number;
}

export function EventActionBar({ eventId, followCount }: EventActionBarProps) {
  return (
    <div className="flex items-center justify-end gap-2">
      <EventWatchButton eventId={eventId} followCount={followCount} />
      <ShareButton />
    </div>
  );
}
