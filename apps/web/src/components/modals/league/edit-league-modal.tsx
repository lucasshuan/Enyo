"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { useTranslations } from "next-intl";
import { type League } from "@/lib/apollo/generated/graphql";
import { EditLeagueForm } from "@/components/forms/league/edit-league-form";

interface EditLeagueModalProps {
  league: League;
  isOpen: boolean;
  onClose: () => void;
}

export function EditLeagueModal({
  league,
  isOpen,
  onClose,
}: EditLeagueModalProps) {
  const t = useTranslations("Modals");
  const [isPending, setIsPending] = useState(false);
  const [isValid, setIsValid] = useState(true); // Default to true since it's an edit

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("EditLeague.title")}
      description={t("EditLeague.description")}
      confirmText={
        isPending ? t("EditLeague.submitting") : t("EditLeague.submit")
      }
      cancelText={t("EditLeague.cancel") || "Cancelar"}
      formId="edit-league-form"
      isPending={isPending}
      disabled={!isValid}
      className="max-w-3xl"
    >
      <EditLeagueForm
        league={league}
        onSuccess={onClose}
        onLoadingChange={setIsPending}
        onValidationChange={setIsValid}
        formId="edit-league-form"
      />
    </Modal>
  );
}
