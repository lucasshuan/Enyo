"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ClipboardCheck,
  LoaderCircle,
  Lock,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import { useLazyQuery } from "@apollo/client/react";
import { SEARCH_USERS } from "@/lib/apollo/queries/user";
import {
  SearchComboboxDropdown,
  useComboboxKeyboard,
} from "@/components/ui/search-combobox";
import { cn } from "@/lib/utils";
import { cdnUrl } from "@/lib/cdn";
import { Tooltip } from "@/components/ui/tooltip";
import type { SearchUsersQuery } from "@/lib/apollo/generated/graphql";

/**
 * Domain-agnostic staff member draft used by the StaffManager.
 *
 * `capabilities` holds a list of domain-specific capability keys (see the
 * `capabilities` prop on {@link StaffManager}). When `isFullAccess` is true,
 * the member implicitly has every capability and the list is ignored.
 */
export interface StaffManagerMember {
  userId: string;
  name: string;
  username: string;
  imagePath?: string | null;
  capabilities: string[];
  isFullAccess: boolean;
}

export interface StaffManagerCapability {
  key: string;
  label: string;
  description: string;
}

export interface StaffManagerLabels {
  title: string;
  description: string;
  searchPlaceholder: string;
  noResults: string;
  you: string;
  remove: string;
  fullAccess: string;
  fullAccessDescription: string;
  capabilitiesHeader: string;
  emptyState?: string;
}

interface StaffManagerProps {
  currentUserId?: string;
  members: StaffManagerMember[];
  onChange: (members: StaffManagerMember[]) => void;
  capabilities: StaffManagerCapability[];
  /**
   * When true, the entry matching `currentUserId` is rendered locked: it
   * cannot be removed nor have its access changed. Useful for the resource
   * owner who must always retain full access.
   */
  lockCurrentUser?: boolean;
  labels: StaffManagerLabels;
}

type SearchUser = NonNullable<SearchUsersQuery["searchUsers"]["nodes"]>[number];

export function StaffManager({
  currentUserId,
  members,
  onChange,
  capabilities,
  lockCurrentUser = true,
  labels,
}: StaffManagerProps) {
  const [query, setQuery] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const showResults = isInputFocused && query.trim().length > 0;

  const [searchUsers, { data, loading }] =
    useLazyQuery<SearchUsersQuery>(SEARCH_USERS);

  useEffect(() => {
    if (!query.trim()) return;
    const id = window.setTimeout(() => {
      void searchUsers({
        variables: { query, pagination: { skip: 0, take: 8 } },
      });
    }, 300);
    return () => window.clearTimeout(id);
  }, [query, searchUsers]);

  const alreadyAdded = new Set(members.map((m) => m.userId));
  const results =
    data?.searchUsers.nodes.filter((u) => !alreadyAdded.has(u.id)) ?? [];

  const handleAdd = (user: SearchUser) => {
    if (alreadyAdded.has(user.id)) return;
    onChange([
      ...members,
      {
        userId: user.id,
        name: user.name,
        username: user.username,
        imagePath: user.imagePath,
        capabilities: [],
        isFullAccess: false,
      },
    ]);
    setQuery("");
    setIsInputFocused(false);
  };

  const handleRemove = (userId: string) => {
    onChange(members.filter((m) => m.userId !== userId));
  };

  const handleToggleFullAccess = (userId: string) => {
    onChange(
      members.map((m) =>
        m.userId === userId
          ? {
              ...m,
              isFullAccess: !m.isFullAccess,
              // Clear the granular list when full-access takes over
              capabilities: !m.isFullAccess ? [] : m.capabilities,
            }
          : m,
      ),
    );
  };

  const handleToggleCapability = (userId: string, capability: string) => {
    onChange(
      members.map((m) => {
        if (m.userId !== userId) return m;
        const has = m.capabilities.includes(capability);
        return {
          ...m,
          capabilities: has
            ? m.capabilities.filter((c) => c !== capability)
            : [...m.capabilities, capability],
        };
      }),
    );
  };

  const { highlightedIndex, onInputKeyDown } = useComboboxKeyboard<SearchUser>({
    isOpen: showResults,
    items: results,
    onSelectItem: handleAdd,
    onClose: () => setIsInputFocused(false),
    inputRef,
  });

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="border-primary/20 bg-primary/10 mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl border">
          <ShieldCheck className="text-primary size-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{labels.title}</p>
          <p className="text-muted mt-0.5 text-xs">{labels.description}</p>
        </div>
      </div>

      {/* User Search */}
      <div className="relative">
        <div className="relative">
          <Search className="text-secondary/25 absolute top-1/2 left-4 size-4 -translate-y-1/2" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            placeholder={labels.searchPlaceholder}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            onKeyDown={onInputKeyDown}
            className="field-base field-border-default py-3 pr-4 pl-11"
          />
          {loading && (
            <LoaderCircle className="text-primary/40 absolute top-1/2 right-4 size-4 -translate-y-1/2 animate-spin" />
          )}
        </div>

        <SearchComboboxDropdown<SearchUser>
          isOpen={showResults}
          anchorRef={inputRef}
          items={results}
          isLoading={loading}
          showEmpty={data !== undefined}
          noResultsText={labels.noResults}
          highlightedIndex={highlightedIndex}
          maxHeight="max-h-56"
          renderItem={(user, highlighted) => (
            <button
              key={user.id}
              type="button"
              onClick={() => handleAdd(user)}
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
      </div>

      {/* Member List */}
      {members.length === 0 && labels.emptyState ? (
        <p className="text-muted rounded-2xl border border-dashed border-white/10 bg-white/2 p-6 text-center text-xs">
          {labels.emptyState}
        </p>
      ) : (
        <ul className="space-y-3">
          {members.map((member) => {
            const isCurrentUser = member.userId === currentUserId;
            const isLocked = isCurrentUser && lockCurrentUser;
            return (
              <li
                key={member.userId}
                className={cn(
                  "rounded-2xl border p-4 transition-all",
                  isLocked
                    ? "border-primary/15 bg-primary/5"
                    : "border-white/5 bg-white/2",
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="border-gold-dim/25 relative size-10 shrink-0 overflow-hidden rounded-full border bg-black/40">
                    {member.imagePath ? (
                      <Image
                        src={cdnUrl(member.imagePath)!}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="flex size-full items-center justify-center text-xs font-bold text-white/40">
                        {member.name.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-semibold text-white">
                      {member.name}
                      {isCurrentUser && (
                        <span className="text-primary ml-1.5 text-xs font-normal">
                          ({labels.you})
                        </span>
                      )}
                    </span>
                    <span className="text-muted truncate text-xs">
                      @{member.username}
                    </span>
                  </div>

                  {/* Full-access toggle */}
                  <FullAccessToggle
                    label={labels.fullAccess}
                    checked={member.isFullAccess}
                    locked={isLocked}
                    onToggle={() => handleToggleFullAccess(member.userId)}
                  />

                  {!isLocked && (
                    <button
                      type="button"
                      onClick={() => handleRemove(member.userId)}
                      className="text-muted/50 hover:text-danger ml-1 shrink-0 rounded-lg p-1.5 transition-colors hover:bg-red-500/10"
                      aria-label={labels.remove}
                    >
                      <X className="size-4" />
                    </button>
                  )}
                </div>

                {/* Capabilities — compact chip toggles */}
                {!member.isFullAccess && !isLocked && (
                  <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-white/5 pt-3">
                    <span className="text-muted mr-1 text-[10px] font-semibold tracking-widest uppercase">
                      {labels.capabilitiesHeader}
                    </span>
                    {capabilities.map((cap) => {
                      const checked = member.capabilities.includes(cap.key);
                      return (
                        <Tooltip key={cap.key} content={cap.description}>
                          <button
                            type="button"
                            aria-pressed={checked}
                            onClick={() =>
                              handleToggleCapability(member.userId, cap.key)
                            }
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-all",
                              checked
                                ? "border-primary/40 bg-primary/10 text-primary hover:bg-primary/15"
                                : "text-muted hover:text-secondary border-white/10 bg-white/2 hover:border-white/20",
                            )}
                          >
                            <span
                              className={cn(
                                "flex size-3 shrink-0 items-center justify-center rounded-full border transition-all",
                                checked
                                  ? "border-primary bg-primary text-black"
                                  : "border-white/20",
                              )}
                            >
                              {checked && <ClipboardCheck className="size-2" />}
                            </span>
                            <span>{cap.label}</span>
                          </button>
                        </Tooltip>
                      );
                    })}
                  </div>
                )}

                {/* Full-access description hint */}
                {member.isFullAccess && (
                  <div className="text-muted mt-3 flex items-center gap-2 text-[11px]">
                    <ShieldCheck className="text-primary size-3.5 shrink-0" />
                    <span>{labels.fullAccessDescription}</span>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

interface FullAccessToggleProps {
  label: string;
  checked: boolean;
  locked: boolean;
  onToggle: () => void;
}

function FullAccessToggle({
  label,
  checked,
  locked,
  onToggle,
}: FullAccessToggleProps) {
  if (locked) {
    return (
      <div className="border-primary/20 bg-primary/10 flex items-center gap-1.5 rounded-xl border px-3 py-1.5">
        <Lock className="text-primary size-3 shrink-0" />
        <span className="text-primary text-[11px] font-semibold">{label}</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[11px] font-semibold transition-all",
        checked
          ? "border-primary/30 bg-primary/10 text-primary"
          : "text-muted border-white/10 bg-white/2 hover:border-white/20",
      )}
    >
      <ShieldCheck className="size-3 shrink-0" />
      <span>{label}</span>
    </button>
  );
}
