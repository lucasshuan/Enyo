"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { CheckCircle2, LoaderCircle, Save, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MultiStepFormLayout } from "@/components/ui/multi-step-form-layout";
import { EditEventForm } from "@/components/forms/events/edit-event-form";
import { useUser } from "@/components/providers";
import { cn } from "@/lib/utils/helpers";
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
  participants?: ParticipantEntry[];
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
}: EditEventTemplateProps) {
  const t = useTranslations("Modals.EditEvent");
  const router = useRouter();
  const { user } = useUser();

  const [isPending, setIsPending] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [isStepValid, setIsStepValid] = useState(true);
  const [dirtyFieldCount, setDirtyFieldCount] = useState(0);
  const [participants, setParticipants] = useState<ParticipantEntry[]>(
    () => league.participants ?? [],
  );
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

  const handleSuccess = (updatedEventSlug: string) => {
    router.push(`/games/${gameSlug}/events/${updatedEventSlug}`);
  };

  const canFinish = isValid && isStepValid;
  const saveState = isPending
    ? "saving"
    : !canFinish
      ? "invalid"
      : dirtyFieldCount > 0
        ? "dirty"
        : "clean";
  const SaveIcon =
    saveState === "saving"
      ? LoaderCircle
      : saveState === "invalid"
        ? TriangleAlert
        : saveState === "clean"
          ? CheckCircle2
          : Save;
  const saveLabel =
    saveState === "saving"
      ? t("submitting")
      : saveState === "invalid"
        ? t("saveButton.invalid")
        : saveState === "clean"
          ? t("saveButton.clean")
          : t("saveButton.dirty", { count: dirtyFieldCount });
  const isSaveDisabled = isPending || !canFinish || dirtyFieldCount === 0;

  const renderSaveButton = (compact = false) => (
    <Button
      type="submit"
      form={FORM_ID}
      disabled={isSaveDisabled}
      intent="primary"
      className={cn(
        "group/save relative min-w-46 overflow-hidden rounded-2xl border px-5 py-2.5 text-sm font-bold tracking-wide shadow-lg disabled:opacity-100",
        "before:absolute before:inset-y-0 before:-left-1/2 before:w-1/2 before:skew-x-[-18deg] before:bg-linear-to-r before:from-transparent before:via-white/25 before:to-transparent before:opacity-0 before:transition-all before:duration-700",
        !isSaveDisabled &&
          "hover:-translate-y-0.5 hover:before:left-full hover:before:opacity-100 active:translate-y-0",
        saveState === "dirty" &&
          "border-gold/65 from-primary via-primary/90 to-gold/45 shadow-primary/30 hover:border-gold/85 bg-linear-to-br text-white",
        saveState === "saving" &&
          "border-gold/65 from-primary via-primary/90 to-gold/45 shadow-primary/25 bg-linear-to-br text-white",
        saveState === "clean" &&
          "border-success/45 bg-success/10 text-success shadow-success/10",
        saveState === "invalid" &&
          "border-warning/50 bg-warning/10 text-warning shadow-warning/10",
        compact ? "px-8" : "",
      )}
    >
      <span className="relative z-10 flex items-center gap-2">
        <SaveIcon
          className={cn(
            "size-4",
            saveState === "saving" && "animate-spin",
            saveState === "dirty" &&
              "transition-transform group-hover/save:-rotate-6",
          )}
        />
        {saveLabel}
      </span>
      {saveState === "dirty" && (
        <span className="via-gold/70 absolute inset-x-3 bottom-1 h-px bg-linear-to-r from-transparent to-transparent" />
      )}
    </Button>
  );

  return (
    <MultiStepFormLayout
      title={t("title")}
      description={t("description")}
      steps={steps}
      initialMaxReachedStep={steps.length - 1}
      isLoading={isPending}
      isStepValid={isStepValid && isValid}
      labels={{ back: t("back"), next: t("next") }}
      headerAction={renderSaveButton()}
      renderSubmit={renderSaveButton(true)}
    >
      {(currentStep) => (
        <EditEventForm
          league={league}
          onSuccess={handleSuccess}
          onLoadingChange={setIsPending}
          onValidationChange={setIsValid}
          onDirtyFieldCountChange={setDirtyFieldCount}
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
