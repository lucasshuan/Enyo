"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Save, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MultiStepFormLayout } from "@/components/ui/multi-step-form-layout";
import { EditEventForm } from "@/components/forms/events/edit-event-form";

type LeagueForEdit = {
  eventId: string;
  gameId: string;
  name: string;
  slug: string;
  description?: string | null;
  about?: string | null;
  classificationSystem: "ELO" | "POINTS";
  allowDraw: boolean;
  config: Record<string, unknown>;
  allowedFormats: string[];
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

  const [isPending, setIsPending] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [isStepValid, setIsStepValid] = useState(true);

  const steps = [
    { label: t("steps.game") },
    { label: t("steps.format") },
    { label: t("steps.general") },
    { label: t("steps.matchFormats") },
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
        />
      )}
    </MultiStepFormLayout>
  );
}
