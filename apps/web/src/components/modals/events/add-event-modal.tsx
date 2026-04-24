"use client";

import { useState, useEffect, useRef } from "react";
import { MultiStepModal } from "@/components/ui/multi-step-modal";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { AddEventForm } from "@/components/forms/events/add-event-form";
import { useLocale, useTranslations } from "next-intl";
import type { SimpleGame } from "@/actions/get-games";
import { Trophy } from "lucide-react";
import { useUser } from "@/components/providers";
import type { StaffMember } from "@/components/forms/events/fieldsets/staff-fieldset";

interface AddEventModalProps {
  gameId: string;
  initialGame?: SimpleGame;
  isOpen: boolean;
  onClose: () => void;
  isGameFixed?: boolean;
}

export function AddEventModal({
  gameId,
  initialGame,
  isOpen,
  onClose,
  isGameFixed,
}: AddEventModalProps) {
  const t = useTranslations("Modals.AddEvent");
  const locale = useLocale();
  const { user } = useUser();

  const confirmFallbacks =
    locale === "pt"
      ? {
          title: "Confirmar Criação",
          description: "Deseja criar este evento com as configurações definidas?",
          submit: "Confirmar Criação",
          cancel: "Cancelar",
        }
      : {
          title: "Confirm Creation",
          description:
            "Do you want to create this event with the current settings?",
          submit: "Confirm Creation",
          cancel: "Cancel",
        };

  const getConfirmText = (
    key: "title" | "description" | "submit" | "cancel",
  ) => {
    try {
      return t(`confirm.${key}`);
    } catch {
      return confirmFallbacks[key];
    }
  };

  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isStepValid, setIsStepValid] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);

  const maxReachedStepRef = useRef(gameId ? 1 : 0);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Render-time state adjustment when isOpen or gameId changes
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [prevGameId, setPrevGameId] = useState(gameId);
  if (prevIsOpen !== isOpen || prevGameId !== gameId) {
    setPrevIsOpen(isOpen);
    setPrevGameId(gameId);
    if (isOpen) {
      setCurrentStep(gameId ? 1 : 0);
      if (!prevIsOpen && user) {
        setStaffMembers([
          {
            userId: user.id,
            role: "ORGANIZER",
            name: user.name ?? user.username,
            username: user.username,
            imageUrl: user.image,
          },
        ]);
      }
    }
  }

  // Sync ref after isOpen/gameId change (ref-only, no setState)
  useEffect(() => {
    if (isOpen) {
      maxReachedStepRef.current = gameId ? 1 : 0;
    }
  }, [isOpen, gameId]);

  useEffect(() => {
    if (currentStep > maxReachedStepRef.current) {
      maxReachedStepRef.current = currentStep;
    }
  }, [currentStep]);

  const steps = [
    { label: t("steps.game") },
    { label: t("steps.type") },
    { label: t("steps.format") },
    { label: t("steps.general") },
    { label: t("steps.staff") },
  ];

  const handleClose = () => {
    setIsConfirmOpen(false);
    onClose();
    setTimeout(() => {
      if (isMounted.current) {
        setCurrentStep(0);
        maxReachedStepRef.current = 0;
        setIsLoading(false);
        setStaffMembers(
          user
            ? [
                {
                  userId: user.id,
                  role: "ORGANIZER",
                  name: user.name ?? user.username,
                  username: user.username,
                  imageUrl: user.image,
                },
              ]
            : [],
        );
      }
    }, 300);
  };

  const handleConfirmCreate = () => {
    const form = document.getElementById("add-event-form");
    if (form instanceof HTMLFormElement) {
      form.requestSubmit();
    }
  };

  const isStepUnlocked = (step: number) => {
    if (step <= currentStep) return true;
    return step <= maxReachedStepRef.current && isStepValid;
  };

  return (
    <>
      <MultiStepModal
        isOpen={isOpen}
        title={t("title")}
        description={t("description")}
        onClose={handleClose}
        onNext={() => setCurrentStep((s) => s + 1)}
        onBack={() => setCurrentStep((s) => s - 1)}
        onStepClick={setCurrentStep}
        isStepUnlocked={isStepUnlocked}
        onConfirm={() => setIsConfirmOpen(true)}
        steps={steps}
        currentStep={currentStep}
        formId="add-event-form"
        isPending={isLoading}
        disabledNext={!isStepValid}
        nextText={t("next")}
        backText={t("back")}
        confirmText={t("submit")}
        submitOnConfirm={false}
      >
        <AddEventForm
          formId="add-event-form"
          gameId={gameId}
          initialGame={initialGame}
          isGameFixed={isGameFixed}
          currentStep={currentStep}
          onSuccess={handleClose}
          onLoadingChange={setIsLoading}
          onStepValidationChange={setIsStepValid}
          currentUserId={user?.id}
          staffMembers={staffMembers}
          onStaffChange={setStaffMembers}
        />
      </MultiStepModal>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmCreate}
        title={getConfirmText("title")}
        description={getConfirmText("description")}
        confirmText={isLoading ? t("submitting") : getConfirmText("submit")}
        cancelText={getConfirmText("cancel")}
        isPending={isLoading}
        icon={Trophy}
        variant="success"
      />
    </>
  );
}
