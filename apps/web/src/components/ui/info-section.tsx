import { type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InfoSectionProps {
  /** Section heading label (uppercased automatically). */
  title: string;
  /** Optional Lucide icon displayed before the title. */
  icon?: ElementType;
  children: ReactNode;
  className?: string;
}

/**
 * InfoSection — a labeled content block for use inside InfoModal.
 *
 * Renders a small caps title with a divider line, then the children below.
 * Suitable for grouping related InfoField rows or any custom content.
 */
export function InfoSection({
  title,
  icon: Icon,
  children,
  className,
}: InfoSectionProps) {
  return (
    <section className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="text-primary/50 size-3.5 shrink-0" />}
        <span className="text-muted text-[10px] font-semibold tracking-widest uppercase">
          {title}
        </span>
        <div className="bg-border h-px flex-1" />
      </div>
      {children}
    </section>
  );
}
