"use client";

import Image from "next/image";
import { Bell, Menu } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils/helpers";
import { LocaleSwitcher } from "@/components/ui/locale-switcher";
import { SiteUserSidebarTrigger } from "@/components/layout/site-user-sidebar";

type SiteTopbarProps = {
  userSidebarOpen: boolean;
  dimmed: boolean;
  onOpenNavigation: () => void;
  onToggleUserSidebar: () => void;
};

export function SiteTopbar({
  userSidebarOpen,
  dimmed,
  onOpenNavigation,
  onToggleUserSidebar,
}: SiteTopbarProps) {
  const t = useTranslations("Sidebar");

  return (
    <header
      className={cn(
        "border-border fixed top-0 right-0 left-0 z-50 h-12 border-b shadow-[0_14px_36px_rgb(0_0_0/0.28)] backdrop-blur-xl transition-[background-color,opacity] duration-300",
        dimmed ? "bg-black/70 opacity-60" : "bg-background/80 opacity-100",
      )}
    >
      <div className="relative flex h-full items-center justify-between gap-3 px-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            onClick={onOpenNavigation}
            aria-label={t("openMenu")}
            title={t("openMenu")}
            className="text-secondary/70 hover:bg-gold-dim/10 hover:text-secondary focus-visible:ring-gold/40 flex size-8 shrink-0 items-center justify-center rounded-lg bg-transparent transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            <Menu className="size-4" />
          </button>

          <Link
            href="/"
            className="group flex min-w-0 items-center gap-2 overflow-hidden"
          >
            <Image
              src="/logo-compact.svg"
              alt="Bellona"
              width={22}
              height={22}
              className="size-5 shrink-0 object-contain"
            />
            <span className="text-secondary group-hover:text-gold font-display hidden text-[11px] font-black tracking-[0.24em] whitespace-nowrap uppercase transition-colors sm:inline">
              Bellona
            </span>
          </Link>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <LocaleSwitcher className="h-8 max-w-34 rounded-lg border-0 px-2 text-xs hover:border-transparent sm:max-w-none sm:px-3" />

          <button
            type="button"
            disabled
            aria-disabled="true"
            aria-label={t("notifications")}
            title={t("notifications")}
            className="text-secondary/35 relative flex size-8 cursor-default items-center justify-center rounded-lg bg-transparent opacity-55 transition-colors disabled:pointer-events-none"
          >
            <Bell className="size-4" />
          </button>

          <SiteUserSidebarTrigger
            accountLabel={t("account")}
            open={userSidebarOpen}
            onClick={onToggleUserSidebar}
          />
        </div>
      </div>
    </header>
  );
}
