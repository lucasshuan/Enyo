"use client";

import { useTransition, useState } from "react";
import { Plus } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { ActionButton } from "@/components/ui/action-button";
import { addRanking } from "@/server/game-actions";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface AddRankingModalProps {
  gameId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function AddRankingModal({
  gameId,
  isOpen,
  onClose,
}: AddRankingModalProps) {
  const t = useTranslations("Admin.addRanking");
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;

    startTransition(async () => {
      try {
        await addRanking({
          gameId,
          name,
          slug,
          description,
        });
        toast.success(t("success"));
        setName("");
        setSlug("");
        setDescription("");
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
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="rank_name"
            className="ml-1 text-sm font-medium text-white/70"
          >
            {t("nameLabel")}
          </label>
          <input
            id="rank_name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("namePlaceholder")}
            className="focus:border-primary/50 focus:ring-primary/10 w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white outline-hidden transition-all placeholder:text-white/20 focus:bg-white/[0.07] focus:ring-4"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="rank_slug"
            className="ml-1 text-sm font-medium text-white/70"
          >
            {t("slugLabel")}
          </label>
          <input
            id="rank_slug"
            type="text"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
            placeholder={t("slugPlaceholder")}
            className="focus:border-primary/50 focus:ring-primary/10 w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white outline-hidden transition-all placeholder:text-white/20 focus:bg-white/[0.07] focus:ring-4"
          />
          <p className="ml-1 text-[11px] text-white/40 italic">
            {t("slugDescription")}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="rank_description"
            className="ml-1 text-sm font-medium text-white/70"
          >
            {t("descriptionLabel")}
          </label>
          <textarea
            id="rank_description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("descriptionPlaceholder")}
            className="focus:border-primary/50 focus:ring-primary/10 min-h-[100px] w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white outline-hidden transition-all placeholder:text-white/20 focus:bg-white/[0.07] focus:ring-4"
          />
        </div>

        <ActionButton
          type="submit"
          intent="primary"
          icon={Plus}
          label={isPending ? t("submitting") : t("submit")}
          disabled={isPending || !name || !slug}
        />
      </form>
    </Modal>
  );
}
