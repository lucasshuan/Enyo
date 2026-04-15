"use client";

import { HttpLink, ApolloLink } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import {
  ApolloNextAppProvider,
  ApolloClient,
  InMemoryCache,
} from "@apollo/client-integration-nextjs";
import { getSession } from "next-auth/react";
import { env } from "@/env";

function makeClient() {
  const httpLink = new HttpLink({
    uri: env.NEXT_PUBLIC_API_URL,
    fetchOptions: { cache: "no-store" },
  });

  const authLink = new SetContextLink(async ({ headers }) => {
    const session = await getSession();
    const token = session?.user?.accessToken;

    return {
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([authLink, httpLink]),
    devtools: {
      enabled: true,
    },
  });

  return client;
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
