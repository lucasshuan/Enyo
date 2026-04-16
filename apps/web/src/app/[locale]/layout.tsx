import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteNavbar } from "@/components/layout/site-navbar";
import { routing } from "@/i18n/routing";

import { Providers } from "@/components/providers";
import { ApolloWrapper } from "@/lib/apollo/apollo-provider";
import { getServerAuthSession } from "@/auth";

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const session = await getServerAuthSession();

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <ApolloWrapper>
        <Providers session={session}>
          <div className="app-scroll-shell relative h-screen">
            <div className="grid-surface pointer-events-none fixed inset-0 -z-50" />
            <SiteNavbar />
            <div className="min-h-[calc(100vh-137px)]">{children}</div>
            <SiteFooter />
          </div>
        </Providers>
      </ApolloWrapper>
    </NextIntlClientProvider>
  );
}
