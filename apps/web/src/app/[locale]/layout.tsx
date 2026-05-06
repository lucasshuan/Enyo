import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { SiteChrome } from "@/components/layout/site-chrome";
import { SiteFooter } from "@/components/layout/site-footer";
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

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);

  const [session, messages] = await Promise.all([
    getServerAuthSession(),
    getMessages(),
  ]);

  return (
    <NextIntlClientProvider messages={messages}>
      <ApolloWrapper>
        <Providers session={session}>
          <div className="relative flex h-screen overflow-hidden">
            <SiteChrome />
            <div className="app-scroll-shell relative flex flex-1 flex-col">
              <div className="flex-1">{children}</div>
              <SiteFooter />
            </div>
          </div>
        </Providers>
      </ApolloWrapper>
    </NextIntlClientProvider>
  );
}
