import type { Metadata } from "next";

import { getLocale } from "next-intl/server";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { routing } from "@/i18n/routing";

import "./[locale]/globals.css";
import "flag-icons/css/flag-icons.min.css";

export const metadata: Metadata = {
  title: {
    default: "Ares",
    template: "%s | Ares",
  },
  description: "Plataforma de ranking e torneios para jogos.",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Ares",
    description: "Plataforma de ranking e torneios para jogos.",
    images: [
      {
        url: "/icon.svg",
        alt: "Ares",
        width: 120,
        height: 120,
        type: "image/svg+xml",
      },
    ],
  },
};

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale().catch(() => routing.defaultLocale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
