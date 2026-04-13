import "server-only";

import { eq } from "drizzle-orm";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import type { NextAuthOptions } from "next-auth";
import type { Adapter } from "next-auth/adapters";
import DiscordProvider, {
  type DiscordProfile,
} from "next-auth/providers/discord";

import { env } from "@/env";
import { db } from "@/server/db";
import {
  accounts,
  permissions,
  sessions,
  userPermissions,
  users,
  verificationTokens,
  type User,
} from "@/server/db/schema";

export const hasDiscordAuth =
  !!env.AUTH_DISCORD_ID && !!env.AUTH_DISCORD_SECRET;

const providers: NextAuthOptions["providers"] = [];

import { generateUniqueUsername } from "@/server/user-utils";

if (hasDiscordAuth) {
  const clientId = env.AUTH_DISCORD_ID!;
  const clientSecret = env.AUTH_DISCORD_SECRET!;

  providers.push(
    DiscordProvider({
      clientId,
      clientSecret,
      profile: async (profile: DiscordProfile) => {
        const username = await generateUniqueUsername(profile.username);
        const avatarUrl = profile.avatar
          ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${profile.avatar.startsWith("a_") ? "gif" : "png"}`
          : `https://cdn.discordapp.com/embed/avatars/${parseInt(profile.discriminator || "0") % 5}.png`;

        return {
          id: profile.id,
          name: profile.global_name ?? profile.username,
          email: profile.email,
          image: avatarUrl,
          username,
          isAdmin: false,
        };
      },
    }),
  );
}

export const authOptions = {
  secret: env.AUTH_SECRET,
  session: {
    strategy: "database",
  },
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  } as never) as Adapter,
  pages: {
    error: "/?error=Callback",
  },
  providers,
  callbacks: {
    async session({ session, user }) {
      const dbUser = user as User;

      if (session.user) {
        const permissionRows = await db
          .select({
            id: permissions.id,
            key: permissions.key,
            name: permissions.name,
          })
          .from(userPermissions)
          .innerJoin(
            permissions,
            eq(permissions.id, userPermissions.permissionId),
          )
          .where(eq(userPermissions.userId, user.id));

        session.user.id = user.id;
        session.user.username = dbUser.username;
        session.user.name = dbUser.name;
        session.user.bio = dbUser.bio ?? null;
        session.user.isAdmin = dbUser.isAdmin;
        session.user.permissions = permissionRows;
      }

      return session;
    },
  },
} satisfies NextAuthOptions;
