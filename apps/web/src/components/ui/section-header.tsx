import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

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
      <div className="space-y-3">
        {eyebrow && (
          <p className="text-primary/90 font-mono text-xs font-medium tracking-[0.35em] uppercase">
            {eyebrow}
          </p>
        )}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-primary font-mono text-2xl font-bold tracking-tight uppercase sm:text-3xl lg:text-4xl">
              {title}
            </h2>
            {actions && (
              <div className="flex shrink-0 items-center gap-4">{actions}</div>
            )}
          </div>
          {description && (
            <div className="text-muted sm:text-md max-w-3xl text-base leading-relaxed">
              {description}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
