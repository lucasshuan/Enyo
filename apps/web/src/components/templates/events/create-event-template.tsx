"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Trophy, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { MultiStepFormLayout } from "@/components/ui/multi-step-form-layout";
import { AddEventForm } from "@/components/forms/events/add-event-form";
import type { AddEventSuccessData } from "@/components/forms/events/add-event-form";
import { useUser } from "@/components/providers";
import type { SimpleGame } from "@/actions/get-games";
import type { StaffMember } from "@/components/forms/events/fieldsets/staff-fieldset";
import type { ParticipantEntry } from "@/components/forms/events/fieldsets/participants-fieldset";

interface CreateEventTemplateProps {
  gameId?: string;
  initialGame?: SimpleGame;
  isGameFixed?: boolean;
}

const FORM_ID = "add-event-form";

export function CreateEventTemplate({
  gameId,
  initialGame,
  isGameFixed,
}: CreateEventTemplateProps) {
  const t = useTranslations("Modals.AddEvent");
  const router = useRouter();
  const { user } = useUser();

  const [isLoading, setIsLoading] = useState(false);
  const [isStepValid, setIsStepValid] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [participants, setParticipants] = useState<ParticipantEntry[]>([]);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(() =>
    user
      ? [
          {
            userId: user.id,
            role: "ORGANIZER" as const,
            name: user.name ?? user.username,
            username: user.username,
            imageUrl: user.image,
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

  const handleSuccess = (data: AddEventSuccessData) => {
    setIsConfirmOpen(false);
    if (data.gameSlug && data.eventSlug) {
      router.push(`/games/${data.gameSlug}/events/${data.eventSlug}`);
    } else if (initialGame?.slug && data.eventSlug) {
      router.push(`/games/${initialGame.slug}/events/${data.eventSlug}`);
    } else {
      router.push("/");
    }
  };

  const handleConfirmCreate = () => {
    const form = document.getElementById(FORM_ID);
    if (form instanceof HTMLFormElement) {
      form.requestSubmit();
    }
  };

  return (
    <>
      <MultiStepFormLayout
        title={t("title")}
        description={t("description")}
        steps={steps}
        initialStep={isGameFixed ? 1 : 0}
        isLoading={isLoading}
        isStepValid={isStepValid}
        labels={{ back: t("back"), next: t("next") }}
        renderSubmit={
          <Button
            type="button"
            onClick={() => setIsConfirmOpen(true)}
            disabled={!isStepValid || isLoading}
            intent="primary"
            className="rounded-2xl px-8"
          >
            {isLoading ? (
              <LoaderCircle className="mr-2 size-4 animate-spin" />
            ) : (
              <Trophy className="mr-2 size-4" />
            )}
            {isLoading ? t("submitting") : t("submit")}
          </Button>
        }
      >
        {(currentStep) => (
          <AddEventForm
            formId={FORM_ID}
            gameId={gameId ?? ""}
            initialGame={initialGame}
            isGameFixed={isGameFixed}
            currentStep={currentStep}
            onSuccess={handleSuccess}
            onLoadingChange={setIsLoading}
            onStepValidationChange={setIsStepValid}
            currentUserId={user?.id}
            participants={participants}
            onParticipantsChange={setParticipants}
            staffMembers={staffMembers}
            onStaffChange={setStaffMembers}
          />
        )}
      </MultiStepFormLayout>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmCreate}
        title={t("confirm.title")}
        description={t("confirm.description")}
        confirmText={isLoading ? t("submitting") : t("confirm.submit")}
        cancelText={t("confirm.cancel")}
        isPending={isLoading}
        icon={Trophy}
      />
    </>
  );
}
