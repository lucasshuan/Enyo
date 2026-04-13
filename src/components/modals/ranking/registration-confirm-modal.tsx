"use client";

import { useTransition } from "react";
import { Trophy } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { ActionButton } from "@/components/ui/action-button";
import { registerSelfToRanking } from "@/server/actions/game";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface RegisterConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  rankingId: string;
  initialElo: number;
}

export function RegisterConfirmModal({
  isOpen,
  onClose,
  rankingId,
  initialElo,
}: RegisterConfirmModalProps) {
  const t = useTranslations("GamePage");
  const [isPending, startTransition] = useTransition();

  const onConfirm = () => {
    startTransition(async () => {
      try {
        const result = await registerSelfToRanking(rankingId);
        if (result.success) {
          toast.success(t("registerConfirmTitle"));
          onClose();
        }
      } catch {
        toast.error("Error registering.");
      }
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("registerConfirmTitle")}
      description={t("registerConfirmDescription", { elo: initialElo })}
    >
      <div className="flex flex-col gap-4">
        <ActionButton
          intent="primary"
          icon={Trophy}
          label={isPending ? "Registrando..." : "Confirmar Inscrição"}
          onClick={onConfirm}
          disabled={isPending}
          className="w-full"
        />
      </div>
    </Modal>
  );
}
