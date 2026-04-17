import { getPathname, LOCALE_COOKIE_NAME, routing } from "./routing";

export type AppLocale = (typeof routing.locales)[number];

const localeSet = new Set<string>(routing.locales);

function isAppLocale(value: string): value is AppLocale {
  return localeSet.has(value);
}

function normalizeLocale(value: string) {
  return value.toLowerCase().split("-")[0];
}

export function getPreferredClientLocale(): AppLocale {
  if (typeof document !== "undefined") {
    const cookieValue = document.cookie
      .split(";")
      .map((entry) => entry.trim())
      .find((entry) => entry.startsWith(`${LOCALE_COOKIE_NAME}=`))
      ?.split("=")[1];

    if (cookieValue && isAppLocale(cookieValue)) {
      return cookieValue;
    }
  }

  if (typeof navigator !== "undefined") {
    for (const candidate of navigator.languages) {
      const locale = normalizeLocale(candidate);

      if (isAppLocale(locale)) {
        return locale;
      }
    }

    const locale = normalizeLocale(navigator.language);

    if (isAppLocale(locale)) {
      return locale;
    }
  }

  return routing.defaultLocale;
}

export function getLocalizedPathname(
  href: string | { pathname: string; query?: Record<string, string> },
  locale: AppLocale,
) {
  return getPathname({ href, locale });
}
