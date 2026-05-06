"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils/helpers";
import { type LucideIcon } from "lucide-react";

interface ProfileTabsProps {
  tabs: {
    id: string;
    label: string;
    icon: ReactNode;
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
            <span
              className={cn(
                "size-6",
                tab.active ? "opacity-100" : "opacity-50",
              )}
            >
              {tab.icon}
            </span>
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
                "group focus-visible:ring-primary/50 relative z-10 flex min-h-11 items-center justify-center gap-2 px-3 text-sm font-semibold transition-all duration-300 outline-none focus-visible:ring-2 active:scale-[0.98]",
                selected
                  ? "text-foreground"
                  : "text-muted hover:text-secondary",
              )}
            >
              {Icon && (
                <span
                  className={cn(
                    "transition-colors duration-300",
                    selected
                      ? "text-primary"
                      : "text-muted group-hover:text-secondary opacity-55 group-hover:opacity-100",
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

export interface SectionTabItem<T extends string = string> {
  id: T;
  label: string;
  count?: number;
  icon?: LucideIcon;
}

interface SectionTabsProps<T extends string = string> {
  tabs: SectionTabItem<T>[];
  activeTab: T;
  onChange: (tab: T) => void;
  ariaLabel?: string;
  className?: string;
}

export function SectionTabs<T extends string>({
  tabs,
  activeTab,
  onChange,
  ariaLabel,
  className,
}: SectionTabsProps<T>) {
  const activeIndex = Math.max(
    tabs.findIndex((tab) => tab.id === activeTab),
    0,
  );

  return (
    <div className={cn("w-full", className)}>
      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-6 lg:px-8">
        <div className="custom-scrollbar border-gold-dim/35 bg-card-strong/65 overflow-x-auto rounded-xl border shadow-[0_18px_60px_rgb(0_0_0/0.24),inset_0_1px_0_rgb(255_255_255/0.04)] backdrop-blur">
          <div
            className="relative grid min-w-max overflow-hidden sm:min-w-0"
            style={{
              gridTemplateColumns: `repeat(${tabs.length}, minmax(9rem, 1fr))`,
            }}
            role="tablist"
            aria-label={ariaLabel}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 z-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
              style={{
                width: `${100 / tabs.length}%`,
                transform: `translateX(${activeIndex * 100}%)`,
              }}
            >
              <span className="border-primary/45 from-primary/35 to-primary-strong/45 shadow-primary/15 relative block h-full overflow-hidden border-x bg-linear-to-b shadow-lg">
                <span className="animate-slash-sheen absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-linear-to-r from-transparent via-white/24 to-transparent motion-reduce:hidden" />
                <span className="via-gold absolute inset-x-5 bottom-0 h-px bg-linear-to-r from-transparent to-transparent opacity-90" />
              </span>
            </span>

            {tabs.map((tab) => {
              const Icon = tab.icon;
              const selected = tab.id === activeTab;

              return (
                <button
                  key={tab.id}
                  type="button"
                  id={`${tab.id}-section-tab`}
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`${tab.id}-section-panel`}
                  onClick={() => onChange(tab.id)}
                  className={cn(
                    "group focus-visible:ring-primary/50 relative z-10 flex min-h-12 items-center justify-center gap-2 px-3 text-sm font-semibold transition-all duration-300 outline-none focus-visible:ring-2 active:scale-[0.98]",
                    selected
                      ? "text-foreground"
                      : "text-secondary/65 hover:bg-gold-dim/10 hover:text-secondary",
                  )}
                >
                  {Icon && (
                    <span
                      className={cn(
                        "flex size-7 shrink-0 items-center justify-center transition-colors duration-300",
                        selected
                          ? "text-primary"
                          : "text-secondary/55 group-hover:text-secondary",
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
                          : "border-gold-dim/25 bg-gold-dim/10 text-secondary/50 group-hover:text-secondary",
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
      </div>
    </div>
  );
}
