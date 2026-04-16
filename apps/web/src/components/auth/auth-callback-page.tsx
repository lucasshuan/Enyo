"use client";

import { Suspense, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

import { env } from "@/env";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");

    if (!code) {
      router.replace("/?error=Callback");
      return;
    }

    void (async () => {
      try {
        const response = await fetch(
          `${env.NEXT_PUBLIC_API_URL}/auth/exchange`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code }),
          },
        );

        if (!response.ok) {
          router.replace("/?error=Callback");
          return;
        }

        const { token } = await response.json();

        const result = await signIn("credentials", {
          token,
          redirect: false,
        });

        if (result?.ok) {
          router.replace("/profile");
          return;
        }

        router.replace("/?error=Callback");
      } catch {
        router.replace("/?error=Callback");
      }
    })();
  }, [router, searchParams]);

  return null;
}

export function AuthCallbackPage() {
  return (
    <Suspense fallback={null}>
      <AuthCallbackContent />
    </Suspense>
  );
}
