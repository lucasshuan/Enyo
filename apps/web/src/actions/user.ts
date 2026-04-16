"use server";

import { getClient } from "@/lib/apollo/apollo-client";
import { UPDATE_PROFILE } from "@/lib/apollo/queries/user-mutations";
import { getServerAuthSession } from "@/auth";
import { revalidatePath } from "next/cache";

import { UpdateProfileMutation } from "@/lib/apollo/generated/graphql";
import { normalizeOptionalText } from "@/lib/utils";

export async function updateProfile(formData: FormData) {
  const session = await getServerAuthSession();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const data = {
    name: (formData.get("name") as string).trim(),
    username: (formData.get("username") as string).trim(),
    bio: normalizeOptionalText(formData.get("bio") as string),
    profileColor: formData.get("profileColor") as string,
    country: normalizeOptionalText(formData.get("country") as string),
  };

  try {
    const { data: result } = await getClient().mutate<UpdateProfileMutation>({
      mutation: UPDATE_PROFILE,
      variables: { input: data },
    });

    if (result?.updateProfile) {
      const updatedUsername = result.updateProfile.username;
      revalidatePath("/");
      revalidatePath(`/profile/${session.user.id}`);
      revalidatePath(`/profile/${updatedUsername}`);
      return { success: true, slug: updatedUsername };
    }

    return { success: false, errors: { username: "update.failed" } };
  } catch (error) {
    if (error instanceof Error && error.message.includes("Username taken")) {
      return { success: false, errors: { username: "username.taken" } };
    }
    throw error;
  }
}
