"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  GAME_STAFF_CAPABILITIES,
  type GameStaffCapability,
} from "@bellona/core";
import {
  StaffManager,
  type StaffManagerCapability,
  type StaffManagerMember,
} from "@/components/ui/staff-manager";

/**
 * Draft shape for a game staff member. Extends the generic StaffManager
 * member with the explicit capability key type used across the game domain.
 */
export interface GameStaffDraft extends StaffManagerMember {
  capabilities: GameStaffCapability[];
}

interface GameStaffFieldsetProps {
  currentUserId: string;
  staffMembers: GameStaffDraft[];
  onStaffChange: (members: GameStaffDraft[]) => void;
}

export function GameStaffFieldset({
  currentUserId,
  staffMembers,
  onStaffChange,
}: GameStaffFieldsetProps) {
  const t = useTranslations("Modals.EditGame.staff");

  const capabilities: StaffManagerCapability[] = useMemo(
    () =>
      GAME_STAFF_CAPABILITIES.map((key) => ({
        key,
        label: t(`capabilities.${key}.label`),
        description: t(`capabilities.${key}.description`),
      })),
    [t],
  );

  const labels = {
    title: t("title"),
    description: t("description"),
    searchPlaceholder: t("searchPlaceholder"),
    noResults: t("noResults"),
    you: t("you"),
    remove: t("remove"),
    fullAccess: t("fullAccess"),
    fullAccessDescription: t("fullAccessDescription"),
    capabilitiesHeader: t("capabilitiesHeader"),
    emptyState: t("emptyState"),
  };

  return (
    <StaffManager
      currentUserId={currentUserId}
      members={staffMembers}
      onChange={(next) => onStaffChange(next as GameStaffDraft[])}
      capabilities={capabilities}
      // Game owner isn't auto-staff: don't lock anyone in this fieldset.
      lockCurrentUser={false}
      labels={labels}
    />
  );
}
