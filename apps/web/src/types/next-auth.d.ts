import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      username: string;
      name: string;
      imagePath?: string | null;
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
    imagePath?: string | null;
    accessToken?: string;
    permissions: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    imagePath?: string | null;
    isAdmin: boolean;
    onboardingCompleted: boolean;
    accessToken?: string;
    permissions: string[];
  }
}
