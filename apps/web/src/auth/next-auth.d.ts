import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    error?: "AccessTokenExpired" | "SessionInvalid";
    user: {
      id: string;
      username: string;
      isAdmin: boolean;
      onboardingCompleted: boolean;
      permissions: string[];
      accessToken?: string;
      imagePath?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    username: string;
    isAdmin: boolean;
    onboardingCompleted: boolean;
    permissions?: string[];
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    isAdmin: boolean;
    onboardingCompleted: boolean;
    permissions?: string[];
    accessToken?: string;
    accessTokenExpires?: number;
    lastValidated?: number;
    error?: "AccessTokenExpired" | "SessionInvalid";
    imagePath?: string | null;
  }
}
