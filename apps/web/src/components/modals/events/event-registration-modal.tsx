"use client";

import { useState } from "react";
import { Trophy } from "lucide-react";
import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { ADD_EVENT_ENTRY } from "@/lib/apollo/queries/event-entries-mutations";
import type {
  AddEventEntryMutation,
  AddEventEntryMutationVariables,
} from "@/lib/apollo/generated/graphql";

interface EventRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  userId: string;
  defaultDisplayName: string;
}

export function EventRegistrationModal({
  isOpen,
  onClose,
  eventId,
  userId,
  defaultDisplayName,
}: EventRegistrationModalProps) {
  const t = useTranslations("Modals.EventRegistration");
  const router = useRouter();
  const [displayName, setDisplayName] = useState(defaultDisplayName);

  const [addEntry, { loading }] = useMutation<
    AddEventEntryMutation,
    AddEventEntryMutationVariables
  >(ADD_EVENT_ENTRY);

  const handleConfirm = async () => {
    if (!displayName.trim()) return;

    try {
      await addEntry({
        variables: {
          input: {
            eventId,
            displayName: displayName.trim(),
            userId,
          },
        },
      });
      toast.success(t("successToast"));
      onClose();
      router.refresh();
    } catch {
      toast.error(t("errorToast"));
    }
  };

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title={t("title")}
      description={t("description")}
      confirmText={loading ? t("submitting") : t("submit")}
      cancelText={t("cancel")}
      isPending={loading}
      confirmDisabled={!displayName.trim() || loading}
      icon={Trophy}
      variant="success"
    >
      <div className="space-y-2 text-left">
        <label
          htmlFor="display-name"
          className="text-foreground text-sm font-medium"
        >
          {t("displayNameLabel")}
        </label>
        <input
          id="display-name"
          type="text"
          value={displayName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setDisplayName(e.target.value)
          }
          placeholder={t("displayNamePlaceholder")}
          maxLength={50}
          autoFocus
          className="field-base field-border-default w-full"
        />
        <p className="text-muted text-xs">{t("displayNameHint")}</p>
      </div>
    </ConfirmModal>
  );
}
