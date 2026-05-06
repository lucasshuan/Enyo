"use client";

import {
  History,
  Home,
  ListOrdered,
  MessageSquareText,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils/helpers";

type EventRouteTabId =
  | "overview"
  | "leaderboard"
  | "forum"
  | "players"
  | "matches";

type EventRouteTab = {
  id: EventRouteTabId;
  label: string;
  href: string;
  icon: LucideIcon;
  count?: number;
};

interface EventRouteTabsProps {
  gameSlug: string;
  eventSlug: string;
  participantCount: number;
}

function normalizePath(path: string) {
  return path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
}

export function EventRouteTabs({
  gameSlug,
  eventSlug,
  participantCount,
}: EventRouteTabsProps) {
  const t = useTranslations("EventPage");
  const pathname = normalizePath(usePathname());
  const basePath = `/games/${gameSlug}/events/${eventSlug}`;

  const tabs: EventRouteTab[] = [
    {
      id: "overview",
      label: t("sectionTabOverview"),
      href: basePath,
      icon: Home,
    },
    {
      id: "leaderboard",
      label: t("sectionTabLeaderboard"),
      href: `${basePath}/leaderboard`,
      icon: ListOrdered,
    },
    {
      id: "forum",
      label: t("sectionTabForum"),
      href: `${basePath}/forums`,
      icon: MessageSquareText,
    },
    {
      id: "players",
      label: t("sectionTabPlayers"),
      href: `${basePath}/players`,
      icon: UsersRound,
      count: participantCount,
    },
    {
      id: "matches",
      label: t("sectionTabMatches"),
      href: `${basePath}/matches`,
      icon: History,
    },
  ];

  const activeIndex = Math.max(
    tabs.findIndex((tab) => {
      if (tab.id === "overview") return pathname === tab.href;
      return pathname === tab.href || pathname.startsWith(`${tab.href}/`);
    }),
    0,
  );

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-6 lg:px-8">
        <div className="custom-scrollbar border-gold-dim/35 bg-card-strong/65 overflow-x-auto rounded-xl border shadow-[0_18px_60px_rgb(0_0_0/0.24),inset_0_1px_0_rgb(255_255_255/0.04)] backdrop-blur">
          <nav
            className="relative grid min-w-max overflow-hidden sm:min-w-0"
            style={{
              gridTemplateColumns: `repeat(${tabs.length}, minmax(9rem, 1fr))`,
            }}
            aria-label={t("sectionTabsAriaLabel")}
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

            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              const selected = index === activeIndex;

              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  aria-current={selected ? "page" : undefined}
                  className={cn(
                    "group focus-visible:ring-primary/50 relative z-10 flex min-h-12 items-center justify-center gap-2 px-3 text-sm font-semibold transition-all duration-300 outline-none focus-visible:ring-2 active:scale-[0.98]",
                    selected
                      ? "text-foreground"
                      : "text-secondary/65 hover:bg-gold-dim/10 hover:text-secondary",
                  )}
                >
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
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
