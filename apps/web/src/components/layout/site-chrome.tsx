"use client";

import { useEffect, useState } from "react";

import { usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils/helpers";
import { SiteNavigationSidebar } from "@/components/layout/site-navigation-sidebar";
import { SiteTopbar } from "@/components/layout/site-topbar";
import { SiteUserSidebar } from "@/components/layout/site-user-sidebar";

export function SiteChrome() {
  const pathname = usePathname();
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [userSidebarOpen, setUserSidebarOpen] = useState(false);
  const hasOpenSidebar = navigationOpen || userSidebarOpen;

  const closeSidebars = () => {
    setNavigationOpen(false);
    setUserSidebarOpen(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    closeSidebars();
  }, [pathname]);

  useEffect(() => {
    if (!hasOpenSidebar) return;

    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeSidebars();
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [hasOpenSidebar]);

  useEffect(() => {
    document.body.style.overflow = hasOpenSidebar ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [hasOpenSidebar]);

  return (
    <>
      <SiteTopbar
        userSidebarOpen={userSidebarOpen}
        dimmed={hasOpenSidebar}
        onOpenNavigation={() => {
          setUserSidebarOpen(false);
          setNavigationOpen(true);
        }}
        onToggleUserSidebar={() => {
          setNavigationOpen(false);
          setUserSidebarOpen((value) => !value);
        }}
      />

      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
          hasOpenSidebar
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
        aria-hidden="true"
        onClick={closeSidebars}
      />

      <div
        aria-hidden={!navigationOpen}
        inert={!navigationOpen ? true : undefined}
        className={cn(
          "fixed inset-y-0 left-0 z-60 h-full transition-transform duration-300 ease-in-out",
          navigationOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <SiteNavigationSidebar onClose={() => setNavigationOpen(false)} />
      </div>

      <SiteUserSidebar
        open={userSidebarOpen}
        onClose={() => setUserSidebarOpen(false)}
      />
    </>
  );
}
