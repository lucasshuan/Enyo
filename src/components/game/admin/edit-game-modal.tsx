"use client";

import { useTransition } from "react";
import { Save } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { ActionButton } from "@/components/ui/action-button";
import { updateGame } from "@/server/game-actions";
import { toast } from "sonner";
import { type Game } from "@/server/db/schema";
import { useTranslations } from "next-intl";

interface EditGameModalProps {
  game: Game;
  isOpen: boolean;
  onClose: () => void;
}

export function EditGameModal({ game, isOpen, onClose }: EditGameModalProps) {
  const t = useTranslations("Admin.editGame");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      backgroundImageUrl: formData.get("backgroundImage") as string,
      thumbnailImageUrl: formData.get("thumbnailImage") as string,
      steamUrl: formData.get("steamUrl") as string,
    };

    startTransition(async () => {
      try {
        await updateGame(game.id, data);
        toast.success(t("success"));
        onClose();
      } catch {
        toast.error(t("error"));
      }
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("title")}
      description={t("description")}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="name"
            className="ml-1 text-sm font-medium text-white/70"
          >
            {t("nameLabel")}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={game.name}
            placeholder={t("namePlaceholder")}
            className="focus:border-primary/50 focus:ring-primary/10 w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white outline-hidden transition-all placeholder:text-white/20 focus:bg-white/[0.07] focus:ring-4"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="description"
            className="ml-1 text-sm font-medium text-white/70"
          >
            {t("descriptionLabel")}
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={game.description ?? ""}
            placeholder={t("descriptionPlaceholder")}
            className="focus:border-primary/50 focus:ring-primary/10 w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white outline-hidden transition-all placeholder:text-white/20 focus:bg-white/[0.07] focus:ring-4"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="backgroundImage"
            className="ml-1 text-sm font-medium text-white/70"
          >
            {t("backgroundImageLabel")}
          </label>
          <input
            id="backgroundImage"
            name="backgroundImage"
            type="text"
            defaultValue={game.backgroundImageUrl ?? ""}
            className="focus:border-primary/50 focus:ring-primary/10 w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white outline-hidden transition-all placeholder:text-white/20 focus:bg-white/[0.07] focus:ring-4"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="thumbnailImage"
            className="ml-1 text-sm font-medium text-white/70"
          >
            {t("thumbnailImageLabel")}
          </label>
          <input
            id="thumbnailImage"
            name="thumbnailImage"
            type="text"
            defaultValue={game.thumbnailImageUrl ?? ""}
            className="focus:border-primary/50 focus:ring-primary/10 w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white outline-hidden transition-all placeholder:text-white/20 focus:bg-white/[0.07] focus:ring-4"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="steamUrl"
            className="ml-1 text-sm font-medium text-white/70"
          >
            {t("steamUrlLabel")}
          </label>
          <input
            id="steamUrl"
            name="steamUrl"
            type="text"
            defaultValue={game.steamUrl ?? ""}
            className="focus:border-primary/50 focus:ring-primary/10 w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white outline-hidden transition-all placeholder:text-white/20 focus:bg-white/[0.07] focus:ring-4"
          />
        </div>

        <div className="pt-2">
          <ActionButton
            type="submit"
            intent="primary"
            icon={Save}
            label={isPending ? t("saving") : t("saveChanges")}
            disabled={isPending}
          />
        </div>
      </form>
    </Modal>
  );
}
