import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      username: string;
      name: string;
      imageUrl?: string | null;
      bio?: string | null;
      profileColor?: string | null;
      isAdmin: boolean;
      onboardingCompleted: boolean;
      accessToken?: string;
      permissions: string[];
    };
  }

  interface User {
    id: string;
    username: string;
    isAdmin: boolean;
    onboardingCompleted: boolean;
    imageUrl?: string | null;
    accessToken?: string;
    permissions: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    imageUrl?: string | null;
    isAdmin: boolean;
    onboardingCompleted: boolean;
    accessToken?: string;
    permissions: string[];
  }
}
