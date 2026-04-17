import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const LOCALE_COOKIE_NAME = "ARES_LOCALE";

export const routing = defineRouting({
  locales: ["en", "pt"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeCookie: {
    name: LOCALE_COOKIE_NAME,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  },
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
