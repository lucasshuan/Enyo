"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils/helpers";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Large title overlaid on the hero area. */
  title: string;
  /** Smaller descriptor shown below the title (e.g. @slug or subtitle). */
  subtitle?: string;
  /** CDN URL of a hero image shown at the top. */
  heroImageSrc?: string;
  /** CDN URL of a thumbnail shown at its native aspect ratio (368/178) in front of the hero background. */
  heroThumbnailSrc?: string;
  /** Tailwind gradient classes used when no heroImageSrc is provided. */
  heroGradientClass?: string;
  children: ReactNode;
  /** Override the modal max-width. Defaults to `sm:max-w-xl`. */
  className?: string;
  /** Node rendered to the right of the title, inside the hero overlay. */
  headerAction?: ReactNode;
}

/**
 * InfoModal — pioneer read-only info modal.
 *
 * Features a hero banner (image or gradient), overlaid title + subtitle,
 * a sticky X close button, and a scrollable content area.
 *
 * Use `InfoSection` and `InfoField` to structure the content.
 */
export function InfoModal({
  isOpen,
  onClose,
  heroImageSrc,
  heroThumbnailSrc,
  heroGradientClass = "from-primary/20 to-primary/5",
  title,
  subtitle,
  children,
  className,
  headerAction,
}: InfoModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current) onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={containerRef}
      onClick={handleBackdrop}
      className="animate-modal-overlay fixed inset-0 z-100 flex items-end justify-center bg-black/50 p-0 will-change-[opacity,backdrop-filter] sm:items-center sm:p-4"
    >
      <div
        className={cn(
          "glass-panel no-hover corner-round animate-modal-content relative flex max-h-[95dvh] w-full flex-col overflow-hidden bg-[#0a080f] will-change-[transform,opacity]",
          "rounded-t-3xl sm:rounded-3xl",
          className ?? "sm:max-w-2xl lg:max-w-3xl",
        )}
      >
        {/* X close — absolute, above hero */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-20 flex size-8 items-center justify-center rounded-xl bg-black/50 text-white/50 backdrop-blur-sm transition-colors hover:bg-black/70 hover:text-white"
        >
          <X className="size-4" />
        </button>

        {/* Hero */}
        <div
          className={cn(
            "relative flex h-52 shrink-0 items-end overflow-hidden",
            !heroImageSrc && `bg-linear-to-br ${heroGradientClass}`,
          )}
        >
          {heroImageSrc && (
            <Image
              src={heroImageSrc}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 768px"
            />
          )}
          {/* Heavy dark overlay so any image is just a subtle texture */}
          <div className="absolute inset-0 bg-black/70" />
          {/* Bottom-to-top gradient for title legibility */}
          <div className="absolute inset-0 bg-linear-to-t from-[#0a080f] via-transparent to-transparent" />

          {/* Thumbnail — floats over background, top-left, above the title */}
          {heroThumbnailSrc && (
            <div
              className="absolute top-4 left-6 z-10 w-52 overflow-hidden rounded-xl border border-white/10 shadow-2xl"
              style={{ aspectRatio: "368/178" }}
            >
              <Image
                src={heroThumbnailSrc}
                alt=""
                fill
                className="object-cover"
                sizes="144px"
              />
            </div>
          )}

          {/* Title overlay */}
          <div className="relative z-10 flex w-full items-end justify-between gap-4 p-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white drop-shadow-lg">
                {title}
              </h2>
              {subtitle && (
                <p className="text-secondary/60 mt-0.5 text-xs tracking-widest uppercase">
                  {subtitle}
                </p>
              )}
            </div>
            {headerAction && (
              <div className="shrink-0 pb-0.5">{headerAction}</div>
            )}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="custom-scrollbar flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
