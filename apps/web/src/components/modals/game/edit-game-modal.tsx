"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Modal } from "@/components/ui/modal";
import { EditGameForm } from "@/components/forms/game/edit-game-form";
import { type Game } from "@/lib/apollo/generated/graphql";

interface EditGameModalProps {
  game: Game;
  isOpen: boolean;
  onClose: () => void;
}

export function EditGameModal({ game, isOpen, onClose }: EditGameModalProps) {
  const t = useTranslations("Modals.EditGame");
  const [isPending, setIsPending] = useState(false);
  const [isValid, setIsValid] = useState(true);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("title")}
      description={t("description")}
      confirmText={isPending ? t("submitting") : t("submit")}
      cancelText={t("cancel") || "Cancelar"}
      formId="edit-game-form"
      isPending={isPending}
      disabled={!isValid}
    >
      <EditGameForm
        game={game}
        onSuccess={onClose}
        onLoadingChange={setIsPending}
        onValidationChange={setIsValid}
        formId="edit-game-form"
      />
    </Modal>
  );
}
