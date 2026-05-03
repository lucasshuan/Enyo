"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  EVENT_STAFF_CAPABILITIES,
  type EventStaffCapability,
} from "@bellona/core";
import {
  StaffManager,
  type StaffManagerCapability,
  type StaffManagerMember,
} from "@/components/ui/staff-manager";

/**
 * Draft shape for an event staff member. Extends the generic StaffManager
 * member with the explicit capability key type used across the event domain.
 */
export interface EventStaffDraft extends StaffManagerMember {
  capabilities: EventStaffCapability[];
}

interface StaffFieldsetProps {
  currentUserId: string;
  staffMembers: EventStaffDraft[];
  onStaffChange: (members: EventStaffDraft[]) => void;
}

export function StaffFieldset({
  currentUserId,
  staffMembers,
  onStaffChange,
}: StaffFieldsetProps) {
  const t = useTranslations("Modals.AddEvent.staff");

  const capabilities: StaffManagerCapability[] = useMemo(
    () =>
      EVENT_STAFF_CAPABILITIES.map((key) => ({
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
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <StaffManager
        currentUserId={currentUserId}
        members={staffMembers}
        onChange={(next) => onStaffChange(next as EventStaffDraft[])}
        capabilities={capabilities}
        labels={labels}
      />
    </div>
  );
}
