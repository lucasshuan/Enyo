"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Save, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MultiStepFormLayout } from "@/components/ui/multi-step-form-layout";
import { EditEventForm } from "@/components/forms/events/edit-event-form";
import { useUser } from "@/components/providers";
import type { EventStaffDraft } from "@/components/forms/events/fieldsets/staff-fieldset";
import type { ParticipantEntry } from "@/components/forms/events/fieldsets/participants-fieldset";

type LeagueForEdit = {
  eventId: string;
  gameId: string;
  name: string;
  slug: string;
  description?: string | null;
  about?: string | null;
  thumbnailImagePath?: string | null;
  type: "LEAGUE" | "TOURNAMENT";
  participationMode: "SOLO" | "TEAM";
  classificationSystem: "ELO" | "POINTS";
  allowDraw: boolean;
  config: Record<string, unknown>;
  allowedFormats: string[];
  status?: string | null;
  visibility?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  registrationsEnabled?: boolean | null;
  registrationStartDate?: string | null;
  registrationEndDate?: string | null;
  maxParticipants?: number | null;
  requiresApproval?: boolean | null;
  waitlistEnabled?: boolean | null;
  officialLinks?: Array<{ label: string; url: string }> | null;
  game: {
    name: string;
    slug: string;
    thumbnailImagePath?: string | null;
    description?: string | null;
  };
};

interface EditEventTemplateProps {
  league: LeagueForEdit;
  gameSlug: string;
  eventSlug: string;
}

const FORM_ID = "edit-event-form";

export function EditEventTemplate({
  league,
  gameSlug,
  eventSlug,
}: EditEventTemplateProps) {
  const t = useTranslations("Modals.EditEvent");
  const router = useRouter();
  const { user } = useUser();

  const [isPending, setIsPending] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [isStepValid, setIsStepValid] = useState(true);
  const [participants, setParticipants] = useState<ParticipantEntry[]>([]);
  const [staffMembers, setStaffMembers] = useState<EventStaffDraft[]>(() =>
    user
      ? [
          {
            userId: user.id,
            name: user.name ?? user.username,
            username: user.username,
            imagePath: user.imagePath,
            capabilities: [],
            isFullAccess: true,
          },
        ]
      : [],
  );

  const steps = [
    { label: t("steps.game") },
    { label: t("steps.structure") },
    { label: t("steps.format") },
    { label: t("steps.details") },
    { label: t("steps.access") },
    { label: t("steps.participants") },
    { label: t("steps.staff") },
  ];

  const handleSuccess = () => {
    router.push(`/games/${gameSlug}/events/${eventSlug}`);
  };

  return (
    <MultiStepFormLayout
      title={t("title")}
      description={t("description")}
      steps={steps}
      isLoading={isPending}
      isStepValid={isStepValid && isValid}
      labels={{ back: t("back"), next: t("next") }}
      renderSubmit={
        <Button
          type="submit"
          form={FORM_ID}
          disabled={!isStepValid || !isValid || isPending}
          intent="primary"
          className="rounded-2xl px-8"
        >
          {isPending ? (
            <LoaderCircle className="mr-2 size-4 animate-spin" />
          ) : (
            <Save className="mr-2 size-4" />
          )}
          {isPending ? t("submitting") : t("submit")}
        </Button>
      }
    >
      {(currentStep) => (
        <EditEventForm
          league={league}
          onSuccess={handleSuccess}
          onLoadingChange={setIsPending}
          onValidationChange={setIsValid}
          onStepValidationChange={setIsStepValid}
          currentStep={currentStep}
          formId={FORM_ID}
          participants={participants}
          onParticipantsChange={setParticipants}
          currentUserId={user?.id}
          staffMembers={staffMembers}
          onStaffChange={setStaffMembers}
        />
      )}
    </MultiStepFormLayout>
  );
}
