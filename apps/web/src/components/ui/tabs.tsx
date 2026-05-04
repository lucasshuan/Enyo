"use client";

import { cn } from "@/lib/utils/helpers";
import { type LucideIcon } from "lucide-react";

interface ProfileTabsProps {
  tabs: {
    id: string;
    label: string;
    icon: LucideIcon;
    active?: boolean;
  }[];
  className?: string;
}

export function ProfileTabs({ tabs, className }: ProfileTabsProps) {
  return (
    <div className={cn("border-b-2 border-white/10", className)}>
      <nav className="relative -mb-0.5 flex space-x-10" aria-label="Tabs">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={cn(
              "flex items-center gap-3 border-b-2 pt-4 pb-3 text-lg font-bold whitespace-nowrap transition-all",
              tab.active
                ? "border-primary text-primary"
                : "border-transparent text-white/40 hover:text-white/60",
            )}
          >
            <tab.icon
              className={cn(
                "size-6",
                tab.active ? "opacity-100" : "opacity-50",
              )}
            />
            {tab.label}
          </div>
        ))}
      </nav>
    </div>
  );
}

export interface SegmentedTabItem<T extends string = string> {
  id: T;
  label: string;
  count?: number;
  icon?: LucideIcon;
}

interface SegmentedTabsProps<T extends string = string> {
  tabs: SegmentedTabItem<T>[];
  activeTab: T;
  onChange: (tab: T) => void;
  ariaLabel?: string;
  className?: string;
}

export function SegmentedTabs<T extends string>({
  tabs,
  activeTab,
  onChange,
  ariaLabel,
  className,
}: SegmentedTabsProps<T>) {
  const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);
  const isFirst = activeIndex === 0;
  const isLast = activeIndex === tabs.length - 1;

  return (
    <div
      className={cn(
        "custom-scrollbar -mx-1 overflow-x-auto px-1 pb-1",
        className,
      )}
    >
      <div
        className="border-gold-dim/35 bg-card-strong/55 relative grid overflow-hidden rounded-2xl border shadow-xl shadow-black/20 backdrop-blur"
        style={{
          gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))`,
        }}
        role="tablist"
        aria-label={ariaLabel}
      >
        <span
          aria-hidden="true"
          className={cn(
            "border-primary/35 bg-primary/12 shadow-primary/15 pointer-events-none absolute inset-y-0 left-0 z-0 overflow-hidden border-y shadow-lg transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
            isFirst
              ? "rounded-l-2xl border-l"
              : isLast
                ? "rounded-r-2xl border-r"
                : "",
          )}
          style={{
            width: `${100 / tabs.length}%`,
            transform: `translateX(${activeIndex * 100}%)`,
          }}
        >
          <span className="animate-slash-sheen absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-linear-to-r from-transparent via-white/20 to-transparent" />
          <span className="via-gold absolute inset-x-5 bottom-0 h-px bg-linear-to-r from-transparent to-transparent opacity-80" />
        </span>

        {tabs.map((tab) => {
          const Icon = tab.icon;
          const selected = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              type="button"
              id={`${tab.id}-tab`}
              role="tab"
              aria-selected={selected}
              aria-controls={`${tab.id}-panel`}
              onClick={() => onChange(tab.id)}
              className={cn(
                "group focus-visible:ring-primary/50 relative z-10 flex min-h-14 items-center justify-center gap-2.5 px-3 text-sm font-semibold transition-all duration-300 outline-none focus-visible:ring-2 active:scale-[0.98]",
                selected
                  ? "text-foreground"
                  : "text-muted hover:text-secondary",
              )}
            >
              {Icon && (
                <span
                  className={cn(
                    "relative flex size-7 shrink-0 items-center justify-center rounded-lg border transition-all duration-300",
                    selected
                      ? "border-primary/35 bg-primary/15 text-primary"
                      : "group-hover:border-gold-dim/40 group-hover:text-secondary border-white/8 bg-white/3 text-white/45",
                  )}
                >
                  <Icon className="size-4 transition-transform duration-300 group-hover:scale-110" />
                </span>
              )}
              <span className="truncate">{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={cn(
                    "min-w-6 rounded-full border px-1.5 py-0.5 text-center text-[10px] leading-none font-bold tabular-nums transition-all duration-300",
                    selected
                      ? "border-primary/35 bg-primary/20 text-primary"
                      : "group-hover:text-secondary border-white/8 bg-white/5 text-white/50",
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
