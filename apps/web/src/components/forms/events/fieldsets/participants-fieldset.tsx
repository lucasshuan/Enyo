"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  Medal,
  Plus,
  X,
  LoaderCircle,
  Search,
  UserRoundPlus,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useLazyQuery } from "@apollo/client/react";
import { SEARCH_USERS } from "@/lib/apollo/queries/user";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import {
  useComboboxKeyboard,
  SearchComboboxDropdown,
} from "@/components/ui/search-combobox";
import { cn } from "@/lib/utils";
import type { SearchUsersQuery } from "@/lib/apollo/generated/graphql";
import { cdnUrl } from "@/lib/cdn";

export interface ParticipantEntry {
  localId: string;
  displayName: string;
  imagePath?: string | null;
  linkedUser?: {
    userId: string;
    name: string;
    username: string;
    imagePath?: string | null;
  } | null;
  claimStatus?: "PENDING" | "ACCEPTED" | "REJECTED" | null;
  hasMatches?: boolean;
}

type LinkedUser = NonNullable<ParticipantEntry["linkedUser"]>;

interface ParticipantsFieldsetProps {
  participants: ParticipantEntry[];
  onParticipantsChange: (participants: ParticipantEntry[]) => void;
}

function normalizeParticipantName(name: string): string {
  return name.trim().toLocaleLowerCase();
}

function genLocalId(): string {
  return `p_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function EntryAvatar({
  displayName,
  imagePath,
}: {
  displayName: string;
  imagePath?: string | null;
}) {
  if (imagePath) {
    return (
      <div className="relative size-9 shrink-0 overflow-hidden rounded-full">
        <Image src={cdnUrl(imagePath)!} alt={displayName} fill className="object-cover" />
      </div>
    );
  }
  return (
    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-[11px] font-bold text-white/50">
      {(displayName || "?").slice(0, 2).toUpperCase()}
    </div>
  );
}

const CLAIM_STATUS_STYLES = {
  PENDING: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  ACCEPTED: "bg-green-500/15 text-green-400 border-green-500/30",
  REJECTED: "bg-red-500/15 text-red-400 border-red-500/30",
} as const;

export function ParticipantsFieldset({
  participants,
  onParticipantsChange,
}: ParticipantsFieldsetProps) {
  const t = useTranslations("Modals.AddEvent.participants");

  const nameInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // User link state (shared - only one dropdown is open at a time)
  const [linkTargetId, setLinkTargetId] = useState<string | null>(null);
  const [linkQueries, setLinkQueries] = useState<Record<string, string>>({});
  const [linkQuery, setLinkQuery] = useState("");
  const [linkFocused, setLinkFocused] = useState(false);
  const linkInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  // Ref pointing to the currently-active link input for keyboard nav + positioning
  const activeInputRef = useRef<HTMLInputElement | null>(null);

  // Confirm-remove state (for entries with hasMatches=true)
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);

  // User search
  const [searchUsers, { data: searchData, loading: searchLoading }] =
    useLazyQuery<SearchUsersQuery>(SEARCH_USERS);

  useEffect(() => {
    if (!linkQuery.trim()) return;
    const id = window.setTimeout(() => {
      void searchUsers({
        variables: { query: linkQuery, pagination: { skip: 0, take: 8 } },
      });
    }, 300);
    return () => window.clearTimeout(id);
  }, [linkQuery, searchUsers]);

  const showLinkDropdown = linkFocused && linkQuery.trim().length > 0;

  const updateLinkCoords = useCallback((targetId: string) => {
    activeInputRef.current = linkInputRefs.current[targetId] ?? null;
  }, []);

  const duplicateNameIds = useMemo(() => {
    const counts = new Map<string, number>();

    for (const participant of participants) {
      const normalizedName = normalizeParticipantName(participant.displayName);

      if (!normalizedName) {
        continue;
      }

      counts.set(normalizedName, (counts.get(normalizedName) ?? 0) + 1);
    }

    return new Set(
      participants
        .filter((participant) => {
          const normalizedName = normalizeParticipantName(
            participant.displayName,
          );

          return normalizedName && (counts.get(normalizedName) ?? 0) > 1;
        })
        .map((participant) => participant.localId),
    );
  }, [participants]);

  const reservedLinkedUserIds = new Set(
    participants
      .filter((participant) => participant.localId !== linkTargetId)
      .map((participant) => participant.linkedUser?.userId)
      .filter(Boolean),
  );

  const searchResults =
    searchData?.searchUsers.nodes.filter(
      (user) => !reservedLinkedUserIds.has(user.id),
    ) ?? [];

  // --- Handlers ---

  const handleAddNew = () => {
    const localId = genLocalId();

    onParticipantsChange([
      ...participants,
      {
        localId,
        displayName: "",
        linkedUser: null,
        claimStatus: null,
      },
    ]);

    requestAnimationFrame(() => {
      nameInputRefs.current[localId]?.focus();
    });
  };

  const handleDisplayNameChange = (localId: string, displayName: string) => {
    onParticipantsChange(
      participants.map((participant) =>
        participant.localId === localId
          ? { ...participant, displayName }
          : participant,
      ),
    );
  };

  const handleRemove = (localId: string) => {
    const entry = participants.find((p) => p.localId === localId);
    if (entry?.hasMatches) {
      setConfirmRemoveId(localId);
    } else {
      onParticipantsChange(participants.filter((p) => p.localId !== localId));
      if (linkTargetId === localId) {
        setLinkTargetId(null);
        setLinkQuery("");
        setLinkFocused(false);
      }
      setLinkQueries((current) => {
        const next = { ...current };
        delete next[localId];
        return next;
      });
    }
  };

  const handleConfirmRemove = () => {
    if (!confirmRemoveId) return;
    onParticipantsChange(
      participants.filter((p) => p.localId !== confirmRemoveId),
    );
    if (linkTargetId === confirmRemoveId) {
      setLinkTargetId(null);
      setLinkQuery("");
      setLinkFocused(false);
    }
    setLinkQueries((current) => {
      const next = { ...current };
      delete next[confirmRemoveId];
      return next;
    });
    setConfirmRemoveId(null);
  };

  const handleLinkSearchFocus = (targetId: string) => {
    setLinkTargetId(targetId);
    setLinkQuery(linkQueries[targetId] ?? "");
    updateLinkCoords(targetId);
    setLinkFocused(true);
  };

  const handleLinkSearchChange = (targetId: string, value: string) => {
    setLinkTargetId(targetId);
    setLinkQuery(value);
    setLinkQueries((current) => ({
      ...current,
      [targetId]: value,
    }));
    updateLinkCoords(targetId);
  };

  const handleCloseLinkSearch = () => {
    setLinkFocused(false);
  };

  const handleOpenLink = (targetId: string) => {
    activeInputRef.current = linkInputRefs.current[targetId] ?? null;
    setLinkTargetId(targetId);
    setLinkQuery(linkQueries[targetId] ?? "");
    setLinkFocused(false);
    requestAnimationFrame(() => {
      linkInputRefs.current[targetId]?.focus();
    });
  };

  const handleCancelLink = (targetId: string) => {
    setLinkTargetId(null);
    setLinkQuery("");
    setLinkFocused(false);
    setLinkQueries((current) => {
      const next = { ...current };
      delete next[targetId];
      return next;
    });
  };

  const handleSelectLinkedUser = (user: {
    id: string;
    name: string;
    username: string;
      imagePath?: string | null;
    }) => {
    if (!linkTargetId) {
      return;
    }

    const linkedUser: LinkedUser = {
      userId: user.id,
      name: user.name,
      username: user.username,
      imagePath: user.imagePath,
    };

    onParticipantsChange(
      participants.map((participant) =>
        participant.localId === linkTargetId
          ? {
              ...participant,
              displayName: participant.displayName.trim()
                ? participant.displayName
                : user.name,
              linkedUser,
              claimStatus: null,
            }
          : participant,
      ),
    );
    setLinkQueries((current) => ({ ...current, [linkTargetId]: "" }));
    setLinkQuery("");
    setLinkFocused(false);
    setLinkTargetId(null);
  };

  const handleUnlinkUser = (localId: string) => {
    onParticipantsChange(
      participants.map((p) =>
        p.localId === localId
          ? { ...p, linkedUser: null, claimStatus: null }
          : p,
      ),
    );
  };

  const getNameError = (entry: ParticipantEntry): string | null => {
    if (!entry.displayName.trim()) {
      return t("inputEmpty");
    }

    if (duplicateNameIds.has(entry.localId)) {
      return t("duplicateName");
    }

    return null;
  };

  type SearchUser = NonNullable<SearchUsersQuery["searchUsers"]["nodes"]>[number];

  const { highlightedIndex, onInputKeyDown } = useComboboxKeyboard<SearchUser>({
    isOpen: showLinkDropdown,
    items: searchResults,
    onSelectItem: handleSelectLinkedUser,
    onClose: () => setLinkFocused(false),
    inputRef: activeInputRef,
  });

  return (
    <section className="animate-in fade-in slide-in-from-right-4 space-y-6 duration-500">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="border-primary/20 bg-primary/10 mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl border">
          <Medal className="text-primary size-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{t("title")}</p>
          <p className="text-muted mt-0.5 text-xs">{t("description")}</p>
        </div>
      </div>

      {/* Participant list */}
      {participants.length > 0 && (
        <ul className="space-y-2">
          {participants.map((entry) => {
            const nameError = getNameError(entry);
            const isLinkActive = linkTargetId === entry.localId;

            return (
              <li
                key={entry.localId}
                className="border-border/50 bg-card/40 rounded-2xl border p-3 transition-all"
              >
                <div className="flex items-start gap-3">
                  <EntryAvatar
                    displayName={entry.displayName}
                    imagePath={entry.linkedUser?.imagePath ?? entry.imagePath}
                  />
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="flex min-w-0 flex-col gap-1.5">
                      <input
                        ref={(node) => {
                          nameInputRefs.current[entry.localId] = node;
                        }}
                        type="text"
                        value={entry.displayName}
                        placeholder={t("inputPlaceholder")}
                        onChange={(e) =>
                          handleDisplayNameChange(entry.localId, e.target.value)
                        }
                        className={cn(
                          "field-base py-2 text-sm",
                          nameError
                            ? "field-border-error"
                            : "field-border-default",
                        )}
                      />
                      {nameError && (
                        <p className="text-xs text-red-400">{nameError}</p>
                      )}
                    </div>

                    {isLinkActive ? (
                      <div className="animate-in fade-in slide-in-from-top-1 flex items-center gap-2 duration-150">
                        <div className="relative flex-1">
                          <Search className="text-secondary/25 absolute top-1/2 left-3.5 size-3.5 -translate-y-1/2" />
                          <input
                            ref={(node) => {
                              linkInputRefs.current[entry.localId] = node;
                            }}
                            type="text"
                            value={linkQuery}
                            placeholder={t("searchPlaceholder")}
                            onChange={(e) =>
                              handleLinkSearchChange(
                                entry.localId,
                                e.target.value,
                              )
                            }
                            onFocus={() =>
                              handleLinkSearchFocus(entry.localId)
                            }
                            onBlur={handleCloseLinkSearch}
                            onKeyDown={onInputKeyDown}
                            className="field-base field-border-default py-2 pr-4 pl-9 text-sm"
                            autoFocus
                          />
                          {searchLoading && (
                            <LoaderCircle className="text-primary/40 absolute top-1/2 right-3 size-3.5 -translate-y-1/2 animate-spin" />
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCancelLink(entry.localId)}
                          className="text-muted hover:text-white flex size-7 shrink-0 items-center justify-center rounded-xl transition-colors"
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center gap-2">
                        {entry.linkedUser ? (
                          <>
                            <button
                              type="button"
                              title={t("changeUser")}
                              onClick={() => handleOpenLink(entry.localId)}
                              className="border-border/40 hover:border-primary/40 flex min-w-0 items-center gap-2 rounded-full border bg-black/20 px-2.5 py-1 transition-colors"
                            >
                              <div className="relative size-5 shrink-0 overflow-hidden rounded-full">
                                {entry.linkedUser.imagePath ? (
                                  <Image
                                    src={cdnUrl(entry.linkedUser.imagePath)!}
                                    alt={entry.linkedUser.name}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="flex size-full items-center justify-center bg-white/10 text-[8px] font-bold text-white/50">
                                    {entry.linkedUser.name
                                      .slice(0, 2)
                                      .toUpperCase()}
                                  </div>
                                )}
                              </div>
                              <span className="text-muted truncate text-xs">
                                @{entry.linkedUser.username}
                              </span>
                            </button>
                            <button
                              type="button"
                              title={t("unlinkUser")}
                              onClick={() => handleUnlinkUser(entry.localId)}
                              className="text-muted/50 hover:text-red-400 flex size-5 shrink-0 items-center justify-center rounded-full transition-colors"
                            >
                              <X className="size-3" />
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenLink(entry.localId)}
                            className="text-muted/60 hover:text-primary flex items-center gap-1.5 text-xs transition-colors"
                          >
                            <UserRoundPlus className="size-3.5" />
                            {t("linkUser")}
                          </button>
                        )}
                        {entry.claimStatus && (
                          <span
                            className={cn(
                              "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                              CLAIM_STATUS_STYLES[entry.claimStatus],
                            )}
                          >
                            {entry.claimStatus === "PENDING"
                              ? t("claimPending")
                              : entry.claimStatus === "ACCEPTED"
                                ? t("claimAccepted")
                                : t("claimRejected")}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-1 pt-1">
                    <button
                      type="button"
                      title={t("remove")}
                      onClick={() => handleRemove(entry.localId)}
                      className="text-muted flex size-7 items-center justify-center rounded-xl transition-colors hover:text-red-400"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Empty state */}
      {participants.length === 0 && (
        <div className="border-border/30 flex flex-col items-center gap-2 rounded-2xl border border-dashed px-6 py-8 text-center">
          <Users className="text-muted/30 size-8" />
          <p className="text-muted text-sm">{t("empty")}</p>
          <p className="text-muted/50 text-xs">{t("emptyHint")}</p>
        </div>
      )}

      {/* Add participant button */}
      <button
        type="button"
        onClick={handleAddNew}
        className="border-border/40 text-muted hover:border-primary/40 hover:text-primary flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed py-3 text-sm font-medium transition-all"
      >
        <Plus className="size-4" />
        {t("addButton")}
      </button>

      {/* User search dropdown */}
      <SearchComboboxDropdown<SearchUser>
        isOpen={showLinkDropdown}
        anchorRef={activeInputRef}
        items={searchResults}
        isLoading={searchLoading}
        showEmpty
        noResultsText={t("noResults")}
        highlightedIndex={highlightedIndex}
        maxHeight="max-h-56"
        renderItem={(user, highlighted) => (
          <button
            key={user.id}
            type="button"
            onClick={() => handleSelectLinkedUser(user)}
            className={cn(
              "group flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-all",
              highlighted ? "bg-card-strong/45" : "hover:bg-card-strong/45",
            )}
          >
            <div className="border-gold-dim/25 relative size-9 shrink-0 overflow-hidden rounded-full border bg-black/40">
              {user.imagePath ? (
                <Image
                  src={cdnUrl(user.imagePath)!}
                  alt={user.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="flex size-full items-center justify-center text-[10px] font-bold text-white/40">
                  {user.name.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex min-w-0 flex-col">
              <span
                className={cn(
                  "truncate text-sm font-bold text-white transition-colors",
                  highlighted ? "text-primary" : "group-hover:text-primary",
                )}
              >
                {user.name}
              </span>
              <span className="text-secondary/35 truncate text-[10px] tracking-widest uppercase">
                @{user.username}
              </span>
            </div>
          </button>
        )}
      />

      {/* Confirm-remove modal (for entries with recorded matches) */}
      <ConfirmModal
        isOpen={!!confirmRemoveId}
        onClose={() => setConfirmRemoveId(null)}
        onConfirm={handleConfirmRemove}
        title={t("removeConfirmTitle")}
        description={t("removeConfirmDesc")}
        confirmText={t("removeConfirmAction")}
        variant="danger"
      />
    </section>
  );
}
