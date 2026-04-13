"use server";

import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const session = await getServerAuthSession();
  if (!session?.user) throw new Error("Unauthorized");

  const bio = formData.get("bio") as string;
  const name = formData.get("name") as string;

  await db
    .update(users)
    .set({
      bio,
      name,
    })
    .where(eq(users.id, session.user.id));

  revalidatePath("/");
  revalidatePath(`/profile/${session.user.id}`);
  if (session.user.username) {
    revalidatePath(`/profile/${session.user.username}`);
  }
  
  return { success: true };
}
