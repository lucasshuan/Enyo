"use server";

import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { ilike, or } from "drizzle-orm";
import { getServerAuthSession } from "@/server/auth";

export async function searchUsers(query: string) {
  const session = await getServerAuthSession();
  if (!session?.user) return [];

  const results = await db
    .select({
      id: users.id,
      name: users.name,
      username: users.username,
      image: users.image,
    })
    .from(users)
    .where(
      or(ilike(users.name, `%${query}%`), ilike(users.username, `%${query}%`)),
    )
    .limit(10);

  return results;
}
