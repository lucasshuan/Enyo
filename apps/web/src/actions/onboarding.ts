"use server";

import { getClient } from "@/lib/apollo/apollo-client";
import { UPDATE_PROFILE } from "@/lib/apollo/queries/user-mutations";
import { COMPLETE_ONBOARDING } from "@/lib/apollo/queries/onboarding-mutations";
import { getServerAuthSession } from "@/auth";
import { revalidatePath } from "next/cache";

import {
  UpdateProfileMutation,
  CompleteOnboardingMutation,
} from "@/lib/apollo/generated/graphql";
import { normalizeOptionalText } from "@/lib/utils";
import { createSafeAction } from "@/lib/action-utils";

export const completeOnboarding = createSafeAction(
  "completeOnboarding",
  async (formData: FormData) => {
    const session = await getServerAuthSession();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const data = {
      username: (formData.get("username") as string).trim(),
      name: (formData.get("name") as string).trim(),
      country: normalizeOptionalText(formData.get("country") as string),
    };

    // Update profile data
    await getClient().mutate<UpdateProfileMutation>({
      mutation: UPDATE_PROFILE,
      variables: { input: data },
    });

    // Mark onboarding as completed
    await getClient().mutate<CompleteOnboardingMutation>({
      mutation: COMPLETE_ONBOARDING,
    });

    revalidatePath("/");
    return data.username;
  },
);
