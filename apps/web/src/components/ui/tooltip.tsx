"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  /**
   * Delay (ms) before the tooltip appears on hover/focus. Defaults to 200.
   */
  openDelay?: number;
  /**
   * Optional className applied to the inline trigger wrapper.
   */
  className?: string;
  /**
   * Optional className applied to the floating tooltip card.
   */
  contentClassName?: string;
  /**
   * Disable the tooltip without removing it from the tree.
   */
  disabled?: boolean;
}

/**
 * Generic floating tooltip rendered through a portal. Matches the visual
 * language of `LabelTooltip` (blurred dark card with gold border) and is safe
 * to wrap around any inline trigger such as buttons, chips, or icons.
 */
export function Tooltip({
  content,
  children,
  openDelay = 200,
  className,
  contentClassName,
  disabled = false,
}: TooltipProps) {
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);
  const timeoutRef = useRef<number | null>(null);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPosition({
      top: rect.bottom + window.scrollY + 8,
      left: rect.left + window.scrollX + rect.width / 2,
    });
  }, []);

  const open = useCallback(() => {
    if (disabled || !content) return;
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setShow(true), openDelay);
  }, [content, disabled, openDelay]);

  const close = useCallback(() => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    setShow(false);
  }, []);

  useLayoutEffect(() => {
    if (show) updatePosition();
  }, [show, updatePosition]);

  useEffect(() => {
    if (!show) return;
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [show, updatePosition]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <span
      ref={triggerRef}
      className={cn("inline-flex", className)}
      onMouseEnter={open}
      onMouseLeave={close}
      onFocus={open}
      onBlur={close}
    >
      {children}
      {show &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            role="tooltip"
            className={cn(
              "border-gold-dim/35 bg-card-strong/90 text-secondary/80 pointer-events-none absolute isolate z-9999 w-56 -translate-x-1/2 transform-gpu rounded-xl border p-3 text-[11px] leading-relaxed shadow-2xl",
              contentClassName,
            )}
            style={{
              top: position.top,
              left: position.left,
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            <div className="border-gold-dim/35 bg-card-strong/90 absolute -top-1 left-1/2 size-2 -translate-x-1/2 rotate-45 border-t border-l" />
            <div className="relative z-10">{content}</div>
          </div>,
          document.body,
        )}
    </span>
  );
}
