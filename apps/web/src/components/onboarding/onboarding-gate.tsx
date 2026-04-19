"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { OnboardingWizard } from "./onboarding-wizard";

export function OnboardingGate() {
  const { data: session, status } = useSession();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;
  if (status !== "authenticated") return null;
  if (!session?.user) return null;
  if (session.user.onboardingCompleted) return null;

  return (
    <OnboardingWizard
      username={session.user.username ?? session.user.name ?? ""}
      userId={session.user.id}
      onFinish={() => setDismissed(true)}
    />
  );
}
