import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteSidebar } from "@/components/layout/site-sidebar";
import { LocaleSwitcher } from "@/components/ui/locale-switcher";
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
          <div className="relative flex h-screen overflow-hidden">
            <SiteSidebar />
            <div className="app-scroll-shell relative flex flex-1 flex-col">
              {/* Locale switcher — absolute top-right, scrolls with page */}
              <div className="absolute top-5 right-5 z-40 hidden lg:block">
                <LocaleSwitcher />
              </div>
              <div className="flex-1 pt-12 lg:pt-0">{children}</div>
              <SiteFooter />
            </div>
          </div>
        </Providers>
      </ApolloWrapper>
    </NextIntlClientProvider>
  );
}
