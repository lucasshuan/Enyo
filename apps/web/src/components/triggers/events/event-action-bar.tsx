"use client";

import { useState, useCallback } from "react";
import { Check, Share2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils/helpers";
import { EventWatchButton } from "@/components/triggers/events/event-watch-button";

interface EventActionBarProps {
  eventId: string;
  followCount: number;
}

export function EventActionBar({ eventId, followCount }: EventActionBarProps) {
  const t = useTranslations("EventPage");
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    if (copied) return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — fail silently
    }
  }, [copied]);

  return (
    <div className="flex items-center justify-end gap-2">
      <EventWatchButton eventId={eventId} followCount={followCount} />

      <button
        onClick={handleShare}
        className={cn(
          "group focus-visible:ring-gold/40 relative flex h-10 w-36 items-center justify-center gap-2 overflow-hidden rounded-xl font-medium transition-all duration-300 focus-visible:ring-2 focus-visible:outline-none",
          copied
            ? "border border-emerald-500/50 bg-emerald-500/15 text-emerald-400 shadow-[0_0_14px_0px_color-mix(in_srgb,#10b981_30%,transparent)]"
            : "border-gold-dim/50 bg-card-strong/80 text-gold/80 hover:border-gold/60 hover:text-gold border",
        )}
      >
        {/* Hover glow tint */}
        {!copied && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_50%,color-mix(in_srgb,var(--gold)_8%,transparent),transparent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        )}
        <span className="relative">
          {copied ? (
            <Check className="size-4" />
          ) : (
            <Share2 className="size-4" />
          )}
        </span>
        <span className="relative text-sm">
          {copied ? t("copied") : t("share")}
        </span>
      </button>
    </div>
  );
}
