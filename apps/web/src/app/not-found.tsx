import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import { SiteChrome } from "@/components/layout/site-chrome";
import { SiteFooter } from "@/components/layout/site-footer";
import { Providers } from "@/components/providers";
import { NotFoundPage } from "@/components/errors/not-found-page";
import { ApolloWrapper } from "@/lib/apollo/apollo-provider";

export default async function GlobalNotFoundPage() {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <ApolloWrapper>
        <Providers>
          <div className="relative flex h-screen overflow-hidden">
            <SiteChrome />
            <div className="app-scroll-shell flex flex-1 flex-col">
              <div className="flex-1 pt-12">
                <NotFoundPage />
              </div>
              <SiteFooter />
            </div>
          </div>
        </Providers>
      </ApolloWrapper>
    </NextIntlClientProvider>
  );
}
