import { type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InfoFieldProps {
  /** Field label shown on the left (or above when stacked). */
  label: string;
  /** Optional Lucide icon shown beside the label. */
  icon?: ElementType;
  /** Value node — or use `children` instead. */
  value?: ReactNode;
  children?: ReactNode;
  className?: string;
  /**
   * When true, renders the label above the value (useful for longer values).
   * Defaults to false (inline side-by-side layout).
   */
  stacked?: boolean;
}

/**
 * InfoField — a labeled key-value row for use inside InfoSection / InfoModal.
 *
 * Default layout: label on the left, value on the right (space-between).
 * Stacked layout: label above the value (good for multi-line values).
 */
export function InfoField({
  label,
  icon: Icon,
  value,
  children,
  className,
  stacked = false,
}: InfoFieldProps) {
  const content = children ?? value;

  if (stacked) {
    return (
      <div className={cn("flex flex-col gap-1", className)}>
        <div className="flex items-center gap-1.5">
          {Icon && <Icon className="text-muted size-3 shrink-0" />}
          <span className="text-muted text-[10px] font-semibold tracking-widest uppercase">
            {label}
          </span>
        </div>
        <div className="text-secondary text-sm leading-snug">{content}</div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div className="flex shrink-0 items-center gap-1.5">
        {Icon && <Icon className="text-muted size-3.5 shrink-0" />}
        <span className="text-muted text-[11px] font-medium">{label}</span>
      </div>
      <div className="text-secondary text-right text-sm leading-snug">
        {content}
      </div>
    </div>
  );
}
