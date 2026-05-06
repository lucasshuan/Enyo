import "server-only";

import type { NextAuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { env } from "@/env";
import { logger } from "@/lib/server/logger";

const SESSION_REVALIDATION_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

type BackendJwtPayload = {
  sub: string;
  username: string;
  imageUrl?: string | null;
  isAdmin: boolean;
  onboardingCompleted: boolean;
  permissions?: string[];
  exp?: number;
};

type SessionData = {
  id: string;
  username: string;
  imageUrl: string | null;
  isAdmin: boolean;
  onboardingCompleted: boolean;
  permissions: string[];
};

type SessionUpdatePayload = {
  username?: string;
  imagePath?: string | null;
  name?: string;
  onboardingCompleted?: boolean;
};

function parseJwtPayload(token: string): BackendJwtPayload | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(""),
    );
    return JSON.parse(jsonPayload) as BackendJwtPayload;
  } catch {
    return null;
  }
}

type FetchSessionResult =
  | { ok: true; data: SessionData }
  | { ok: false; invalidated: boolean };

// NEXT_PUBLIC_API_URL may point to the GraphQL endpoint (e.g. /graphql).
// REST endpoints live on the base URL, so strip the path component.
function getApiBaseUrl(): string {
  const url = new URL(env.NEXT_PUBLIC_API_URL);
  return url.origin;
}

async function fetchSessionData(
  accessToken: string,
): Promise<FetchSessionResult> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    if (response.status === 401 || response.status === 403) {
      logger.warn({ status: response.status }, "Session invalidated by API");
      return { ok: false, invalidated: true };
    }

    if (!response.ok) {
      logger.warn(
        { status: response.status },
        "Non-OK response from /auth/me — keeping session",
      );
      return { ok: false, invalidated: false };
    }

    return { ok: true, data: (await response.json()) as SessionData };
  } catch (err) {
    // Network error / API down — don't invalidate session
    logger.warn(
      { err },
      "Network error during session revalidation — keeping session",
    );
    return { ok: false, invalidated: false };
  }
}

export const authOptions = {
  secret: env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    error: "/?error=Callback",
    signIn: "/",
  },
  providers: [
    CredentialsProvider({
      name: "Backend Token",
      credentials: {
        token: { label: "Token", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.token) return null;

        const payload = parseJwtPayload(credentials.token);
        if (!payload) return null;

        return {
          id: payload.sub,
          username: payload.username,
          name: payload.username,
          image: payload.imageUrl,
          imagePath: payload.imageUrl,
          isAdmin: payload.isAdmin || false,
          onboardingCompleted: payload.onboardingCompleted ?? true,
          permissions: payload.permissions || [],
          accessToken: credentials.token,
        } as NextAuthUser;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign-in: seed token fields from the fresh backend JWT
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.imagePath = user.image ?? null;
        token.isAdmin = user.isAdmin;
        token.onboardingCompleted = user.onboardingCompleted;
        token.permissions = user.permissions ?? [];
        token.error = undefined;
        if (user.accessToken) {
          token.accessToken = user.accessToken;
          const payload = parseJwtPayload(user.accessToken);
          if (payload?.exp) {
            token.accessTokenExpires = payload.exp * 1000;
          }
        }
        token.lastValidated = Date.now();
        return token;
      }

      // Client-side profile update (edit-profile-form)
      if (trigger === "update" && session) {
        const sessionUpdate = session as SessionUpdatePayload;
        if (sessionUpdate.username) token.username = sessionUpdate.username;
        if (sessionUpdate.imagePath !== undefined)
          token.imagePath = sessionUpdate.imagePath;
        if (sessionUpdate.name) token.name = sessionUpdate.name;
        if (sessionUpdate.onboardingCompleted !== undefined)
          token.onboardingCompleted = sessionUpdate.onboardingCompleted;
        return token;
      }

      // Backend token has expired — force re-login
      if (token.accessTokenExpires && Date.now() > token.accessTokenExpires) {
        token.error = "AccessTokenExpired";
        return token;
      }

      // Periodic revalidation: refresh user data from the DB.
      // Always revalidate when onboarding is incomplete — that state is
      // transient and we must confirm the user still exists in the DB.
      const shouldRevalidate =
        !token.lastValidated ||
        Date.now() - token.lastValidated > SESSION_REVALIDATION_INTERVAL_MS ||
        !token.onboardingCompleted;

      if (shouldRevalidate && token.accessToken) {
        const result = await fetchSessionData(token.accessToken);

        if (!result.ok) {
          if (result.invalidated) {
            token.error = "SessionInvalid";
          }
          // Transient error: keep session, retry on next interval
          return token;
        }

        token.id = result.data.id;
        token.username = result.data.username;
        token.imagePath = result.data.imageUrl;
        token.isAdmin = result.data.isAdmin;
        token.onboardingCompleted = result.data.onboardingCompleted;
        token.permissions = result.data.permissions;
        token.error = undefined;
        token.lastValidated = Date.now();
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.imagePath = token.imagePath ?? null;
        session.user.isAdmin = token.isAdmin;
        session.user.onboardingCompleted = token.onboardingCompleted;
        session.user.accessToken = token.accessToken;
        session.user.permissions = token.permissions ?? [];
      }

      session.error = token.error;

      return session;
    },
  },
} satisfies NextAuthOptions;
