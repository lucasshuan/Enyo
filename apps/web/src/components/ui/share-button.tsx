"use client";

import { useState, useCallback } from "react";
import { Check, Share2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils/helpers";

export function ShareButton() {
  const t = useTranslations("Common");
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
    <button
      onClick={handleShare}
      className={cn(
        "group relative flex h-10 w-36 items-center justify-center gap-2 overflow-hidden rounded-xl border font-medium text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.12),0_10px_24px_-16px_rgb(0_0_0/0.9)] transition-all duration-300 focus-visible:ring-2 focus-visible:outline-none active:scale-[0.99]",
        copied
          ? "border-emerald-400/45 bg-[linear-gradient(180deg,#047857_0%,#064e3b_100%)] hover:border-emerald-300/60 hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.16),0_0_16px_rgb(16_185_129/0.25)] focus-visible:ring-emerald-400/40"
          : "border-gold-dim/55 hover:border-gold/55 focus-visible:ring-gold/35 bg-[linear-gradient(180deg,#214657_0%,#111b25_100%)] hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.15),0_0_16px_rgb(56_189_248/0.18)]",
      )}
    >
      <span className="relative">
        {copied ? <Check className="size-4" /> : <Share2 className="size-4" />}
      </span>
      <span className="relative text-sm">
        {copied ? t("copied") : t("share")}
      </span>
    </button>
  );
}
