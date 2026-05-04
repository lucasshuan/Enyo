import type { ReactNode } from "react";
import { cn } from "@/lib/utils/helpers";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
        <div>
          {eyebrow && (
            <p className="text-primary/90 mb-0.5 font-mono text-xs font-medium tracking-[0.35em] uppercase">
              {eyebrow}
            </p>
          )}
          <div className="flex items-center gap-3">
            <h2 className="font-display text-foreground text-xl font-bold tracking-[0.06em] uppercase sm:text-2xl">
              {title}
            </h2>
            <div className="bg-primary h-px w-8 shrink-0 rounded-full" />
          </div>
          {description && (
            <p className="text-muted/45 mt-0.5 max-w-3xl text-sm leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex shrink-0 items-center gap-4">{actions}</div>
        )}
      </div>
    </div>
  );
}
