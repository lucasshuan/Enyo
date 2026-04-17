"use client";

import { Suspense, useEffect, useRef } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  getLocalizedPathname,
  getPreferredClientLocale,
} from "@/i18n/locale";
import { getApiUrl } from "@/lib/api";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const processing = useRef(false);

  const redirectWithLocale = (
    href: string | { pathname: string; query?: Record<string, string> },
  ) => {
    const locale = getPreferredClientLocale();
    router.replace(getLocalizedPathname(href, locale));
  };

  useEffect(() => {
    const code = searchParams.get("code");

    if (!code) {
      console.error("[AuthCallback] No code found in search params");
      redirectWithLocale({
        pathname: "/",
        query: { error: "Callback" },
      });
      return;
    }

    if (processing.current) return;
    processing.current = true;

    console.log("[AuthCallback] Starting code exchange...", { code });

    void (async () => {
      try {
        const response = await fetch(getApiUrl("/auth/exchange"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          const errorData = (await response.json().catch(() => ({}))) as Record<
            string,
            unknown
          >;
          console.error("[AuthCallback] Exchange failed", {
            status: response.status,
            errorData,
          });
          redirectWithLocale({
            pathname: "/",
            query: { error: "Callback" },
          });
          return;
        }

        const { token } = (await response.json()) as { token: string };
        console.log("[AuthCallback] Exchange successful, signing in...");

        const result = await signIn("credentials", {
          token,
          redirect: false,
        });

        if (result?.ok) {
          console.log(
            "[AuthCallback] Sign in successful, redirecting to /profile",
          );
          redirectWithLocale("/profile");
          return;
        }

        console.error("[AuthCallback] Sign in failed", result?.error);
        redirectWithLocale({
          pathname: "/",
          query: { error: "Callback" },
        });
      } catch (error) {
        console.error(
          "[AuthCallback] Unexpected error",
          error instanceof Error ? error.message : error,
        );
        redirectWithLocale({
          pathname: "/",
          query: { error: "Callback" },
        });
      }
    })();
  }, [router, searchParams]);

  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
        <p className="text-muted-foreground animate-pulse">Autenticando...</p>
      </div>
    </div>
  );
}

export function AuthCallbackPage() {
  return (
    <Suspense fallback={null}>
      <AuthCallbackContent />
    </Suspense>
  );
}
