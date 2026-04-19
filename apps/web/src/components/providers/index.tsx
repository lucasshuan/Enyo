"use client";

import {
  useEffect,
  useRef,
  createContext,
  useContext,
  ReactNode,
  Suspense,
} from "react";
import { type Session } from "next-auth";
import {
  SessionProvider as NextAuthSessionProvider,
  signOut,
  useSession,
} from "next-auth/react";
import { toast, Toaster } from "sonner";

import { LoginErrorHandler } from "@/components/auth/login-error-handler";
import { OnboardingGate } from "@/components/onboarding/onboarding-gate";
import {
  canManageGames,
  canManagePlayers,
  canManageLeagues,
  canEditGame as libCanEditGame,
} from "@/lib/permissions";

type UserContextType = {
  user: Session["user"] | null;
  isLoading: boolean;
  isAdmin: boolean;
  canManageGames: boolean;
  canManagePlayers: boolean;
  canManageLeagues: boolean;
  canEditGame: (authorId: string | null | undefined) => boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  const user = session?.user ?? null;
  const isLoading = status === "loading";

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        isAdmin: !!user?.isAdmin,
        canManageGames: canManageGames(session),
        canManagePlayers: canManagePlayers(session),
        canManageLeagues: canManageLeagues(session),
        canEditGame: (authorId) => libCanEditGame(session, authorId),
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

const SESSION_ERROR_MESSAGES: Record<string, string> = {
  AccessTokenExpired: "Your session has expired. Please sign in again.",
  SessionInvalid: "Your session is no longer valid. Please sign in again.",
};

function SessionGuard() {
  const { data: session } = useSession();
  const handledRef = useRef<string | null>(null);

  useEffect(() => {
    const error = session?.error;
    if (!error || handledRef.current === error) return;

    handledRef.current = error;
    toast.error(
      SESSION_ERROR_MESSAGES[error] ?? "Session error. Please sign in again.",
    );
    void signOut({ callbackUrl: "/" });
  }, [session?.error]);

  return null;
}

export function Providers({
  children,
  session,
}: {
  children: ReactNode;
  session?: Session | null;
}) {
  return (
    <NextAuthSessionProvider session={session} refetchInterval={5 * 60}>
      <UserProvider>
        {children}
        <OnboardingGate />
        <SessionGuard />
        <Suspense fallback={null}>
          <LoginErrorHandler />
        </Suspense>
        <Toaster theme="dark" position="top-center" richColors closeButton />
      </UserProvider>
    </NextAuthSessionProvider>
  );
}
