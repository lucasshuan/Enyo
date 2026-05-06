"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  CalendarPlus,
  ChevronRight,
  ChevronsLeft,
  Crown,
  Gamepad2,
  History,
  LayoutDashboard,
  ListOrdered,
  Network,
  Plus,
  Shield,
  Table,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils/helpers";
import type { SessionUser } from "@/components/layout/session-user";

type NavItemDef = {
  href: string;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
  soon?: boolean;
};

type SectionDef = {
  titleKey: string;
  items: NavItemDef[];
};

function NavItem({
  item,
  onClose,
}: {
  item: NavItemDef;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const t = useTranslations("Sidebar");
  const Icon = item.icon;
  const isActive =
    item.href === "/"
      ? pathname === "/"
      : pathname === item.href || pathname.startsWith(item.href + "/");

  if (item.soon) {
    return (
      <div className="text-secondary/28 mx-2 flex cursor-default items-center gap-3 rounded-lg px-2.5 py-1.5 text-[13px] tracking-wide select-none">
        <Icon className="size-3.5 shrink-0" />
        <span className="min-w-0 flex-1 truncate">
          {t(item.labelKey as Parameters<typeof t>[0])}
        </span>
        <span className="bg-secondary/5 text-secondary/25 rounded-md px-1.5 py-0.5 text-[10px] leading-none font-medium">
          {t("soon")}
        </span>
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onClose}
      className={cn(
        "relative mx-2 flex items-center gap-3 rounded-lg px-2.5 py-1.5 text-[13px] tracking-wide",
        "transition-[background-color,color,border-color] duration-200",
        isActive
          ? "border-border bg-primary/55 text-white"
          : "text-secondary/55 hover:bg-primary/10 hover:text-secondary/95",
      )}
    >
      <span
        className={cn(
          "bg-primary-strong absolute top-1/2 left-0 h-4 w-0.5 -translate-y-1/2 rounded-r-full transition-transform duration-200",
          isActive ? "scale-y-100" : "scale-y-0",
        )}
      />
      <Icon className="size-3.5 shrink-0" />
      <span className="min-w-0 flex-1 truncate">
        {t(item.labelKey as Parameters<typeof t>[0])}
      </span>
    </Link>
  );
}

function Section({
  section,
  defaultOpen = true,
  onClose,
}: {
  section: SectionDef;
  defaultOpen?: boolean;
  onClose?: () => void;
}) {
  const t = useTranslations("Sidebar");
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-8 w-full items-center gap-2 px-4 text-left"
      >
        <span className="text-gold/65 min-w-0 flex-1 truncate text-[10px] font-normal tracking-[0.18em] uppercase">
          {t(section.titleKey as Parameters<typeof t>[0])}
        </span>
        <ChevronRight
          className={cn(
            "text-gold/50 size-3 shrink-0 transition-transform duration-200",
            open && "rotate-90",
          )}
        />
      </button>

      <div
        className={cn(
          "space-y-0.5 overflow-hidden transition-[max-height,opacity] duration-200",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        {section.items.map((item) => (
          <NavItem key={item.href} item={item} onClose={onClose} />
        ))}
      </div>
    </section>
  );
}

export function SiteNavigationSidebar({ onClose }: { onClose?: () => void }) {
  const { data: session } = useSession();
  const user = session?.user as SessionUser | undefined;
  const t = useTranslations("Sidebar");

  const sections = useMemo<SectionDef[]>(
    () => [
      ...(user
        ? [
            {
              titleKey: "mySpace",
              items: [
                {
                  href: "/dashboard",
                  labelKey: "dashboard",
                  icon: LayoutDashboard,
                },
                {
                  href: "/teams",
                  labelKey: "myTeams",
                  icon: Crown,
                  soon: true,
                },
                {
                  href: "/history",
                  labelKey: "matchHistory",
                  icon: History,
                  soon: true,
                },
              ],
            },
            {
              titleKey: "create",
              items: [
                {
                  href: "/games/new",
                  labelKey: "newGame",
                  icon: Plus,
                },
                {
                  href: "/events/new",
                  labelKey: "newEvent",
                  icon: CalendarPlus,
                },
              ],
            },
          ]
        : []),
      {
        titleKey: "discover",
        items: [
          { href: "/games", labelKey: "games", icon: Gamepad2 },
          { href: "/leagues", labelKey: "leagues", icon: Table },
          { href: "/clans", labelKey: "clans", icon: Network, soon: true },
          {
            href: "/leaderboards",
            labelKey: "leaderboards",
            icon: ListOrdered,
            soon: true,
          },
        ],
      },
    ],
    [user],
  );

  return (
    <aside className="border-border bg-card/95 flex h-full w-72 max-w-[calc(100vw-2rem)] flex-col overflow-hidden border-r shadow-2xl backdrop-blur-xl">
      <div className="flex h-14 shrink-0 items-center justify-between gap-3 px-3">
        <Link
          href="/"
          onClick={onClose}
          className="group flex min-w-0 items-center gap-2 overflow-hidden"
        >
          <Image
            src="/logo-compact.svg"
            alt="Bellona"
            width={24}
            height={24}
            className="size-6 shrink-0 object-contain"
          />
          <span className="text-secondary group-hover:text-gold font-display text-[11px] font-black tracking-[0.22em] whitespace-nowrap uppercase transition-colors">
            Bellona
          </span>
        </Link>

        <button
          type="button"
          onClick={onClose}
          aria-label={t("closeMenu")}
          className="hover:bg-primary/10 hover:text-secondary focus-visible:ring-gold/40 flex size-6 shrink-0 items-center justify-center rounded-sm text-[color-mix(in_srgb,var(--secondary)_45%,var(--background))] transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          <ChevronsLeft className="size-3.5" />
        </button>
      </div>

      <nav className="custom-scrollbar flex-1 space-y-2 overflow-x-hidden overflow-y-auto py-2">
        {user?.isAdmin && (
          <div className="px-2 pb-1">
            <Link
              href="/admin"
              onClick={onClose}
              className="border-border from-primary/35 via-card-strong/85 to-gold/12 text-secondary hover:border-gold/65 hover:from-primary/45 hover:to-gold/20 hover:text-foreground flex items-center gap-3 rounded-lg border bg-linear-to-br px-2.5 py-1.5 text-[13px] font-medium tracking-wide shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_10px_28px_-18px_color-mix(in_srgb,var(--gold)_50%,transparent)] transition-all"
            >
              <Shield className="text-gold/85 size-3.5 shrink-0" />
              <span className="min-w-0 flex-1 truncate">{t("adminPanel")}</span>
            </Link>
          </div>
        )}

        {sections.map((section) => (
          <Section key={section.titleKey} section={section} onClose={onClose} />
        ))}
      </nav>
    </aside>
  );
}
