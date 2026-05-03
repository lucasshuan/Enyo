"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Search,
  X,
  LoaderCircle,
  ShieldCheck,
  Shield,
  ClipboardList,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useLazyQuery } from "@apollo/client/react";
import { SEARCH_USERS } from "@/lib/apollo/queries/user";
import { CustomSelect } from "@/components/ui/custom-select";
import {
  useComboboxKeyboard,
  SearchComboboxDropdown,
} from "@/components/ui/search-combobox";
import { cn } from "@/lib/utils";
import type { SearchUsersQuery } from "@/lib/apollo/generated/graphql";

export interface StaffMember {
  userId: string;
  role: "ORGANIZER" | "MODERATOR" | "SCOREKEEPER";
  name: string;
  username: string;
  imagePath?: string | null;
}

interface StaffFieldsetProps {
  currentUserId: string;
  staffMembers: StaffMember[];
  onStaffChange: (members: StaffMember[]) => void;
}

const ROLE_OPTIONS = [
  { value: "ORGANIZER" as const, labelKey: "roleOrganizer" },
  { value: "MODERATOR" as const, labelKey: "roleModeratorShort" },
  { value: "SCOREKEEPER" as const, labelKey: "roleScorekeeperShort" },
];

export function StaffFieldset({
  currentUserId,
  staffMembers,
  onStaffChange,
}: StaffFieldsetProps) {
  const t = useTranslations("Modals.AddEvent.staff");
  const [query, setQuery] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const showResults = isInputFocused && query.trim().length > 0;

  const roleOptions = ROLE_OPTIONS.map((r) => ({
    value: r.value,
    label: t(r.labelKey),
  }));

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

  const alreadyAdded = new Set(staffMembers.map((m) => m.userId));
  const results =
    data?.searchUsers.nodes.filter((u) => !alreadyAdded.has(u.id)) ?? [];

  type SearchUser = NonNullable<
    SearchUsersQuery["searchUsers"]["nodes"]
  >[number];

  const handleAdd = (user: SearchUser) => {
    if (alreadyAdded.has(user.id)) return;
    onStaffChange([
      ...staffMembers,
      {
        userId: user.id,
        role: "MODERATOR",
        name: user.name,
        username: user.username,
        imagePath: user.imagePath,
      },
    ]);
    setQuery("");
    setIsInputFocused(false);
  };

  const handleRemove = (userId: string) => {
    onStaffChange(staffMembers.filter((m) => m.userId !== userId));
  };

  const handleRoleChange = (
    userId: string,
    role: "ORGANIZER" | "MODERATOR" | "SCOREKEEPER",
  ) => {
    onStaffChange(
      staffMembers.map((m) => (m.userId === userId ? { ...m, role } : m)),
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
    <section className="animate-in fade-in slide-in-from-right-4 space-y-6 duration-500">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="border-primary/20 bg-primary/10 mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl border">
          <ShieldCheck className="text-primary size-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{t("title")}</p>
          <p className="text-muted mt-0.5 text-xs">{t("description")}</p>
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
            placeholder={t("searchPlaceholder")}
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
          noResultsText={t("noResults")}
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
                    src={user.imagePath}
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

      {/* Role Legend */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            icon: ShieldCheck,
            label: t("roleOrganizer"),
            desc: t("organizerDesc"),
            color: "text-primary",
            bg: "bg-primary/10",
          },
          {
            icon: Shield,
            label: t("roleModerator"),
            desc: t("moderatorDesc"),
            color: "text-secondary/70",
            bg: "bg-secondary/8",
          },
          {
            icon: ClipboardList,
            label: t("roleScorekeeper"),
            desc: t("scorekeeperDesc"),
            color: "text-gold/70",
            bg: "bg-gold/8",
          },
        ].map(({ icon: Icon, label, desc, color, bg }) => (
          <div key={label} className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <div
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-md",
                  bg,
                )}
              >
                <Icon className={cn("size-3", color)} />
              </div>
              <span className={cn("text-[11px] font-semibold", color)}>
                {label}
              </span>
            </div>
            <p className="text-muted text-[10px] leading-snug">{desc}</p>
          </div>
        ))}
      </div>

      {/* Staff List */}
      <div className="space-y-2">
        {staffMembers.map((member) => {
          const isCurrentUser = member.userId === currentUserId;
          return (
            <div
              key={member.userId}
              className={cn(
                "flex items-center gap-3 rounded-2xl border p-3 transition-all",
                isCurrentUser
                  ? "border-primary/15 bg-primary/5"
                  : "border-white/5 bg-white/2",
              )}
            >
              {/* Avatar */}
              <div className="relative size-9 shrink-0 overflow-hidden rounded-full bg-white/10">
                {member.imagePath ? (
                  <Image
                    src={member.imagePath}
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

              {/* Name */}
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-semibold text-white">
                  {member.name}
                  {isCurrentUser && (
                    <span className="text-primary ml-1.5 text-xs font-normal">
                      ({t("you")})
                    </span>
                  )}
                </span>
                <span className="text-muted truncate text-xs">
                  @{member.username}
                </span>
              </div>

              {/* Role Select */}
              {isCurrentUser ? (
                <div className="border-primary/20 bg-primary/10 flex items-center gap-1.5 rounded-xl border px-3 py-1.5">
                  <ShieldCheck className="text-primary size-3.5 shrink-0" />
                  <span className="text-primary text-[11px] font-semibold">
                    {t("roleOrganizer")}
                  </span>
                </div>
              ) : (
                <CustomSelect
                  value={member.role}
                  onChange={(val) =>
                    handleRoleChange(
                      member.userId,
                      val as "ORGANIZER" | "MODERATOR" | "SCOREKEEPER",
                    )
                  }
                  options={roleOptions}
                />
              )}

              {/* Remove */}
              {!isCurrentUser && (
                <button
                  type="button"
                  onClick={() => handleRemove(member.userId)}
                  className="text-muted/50 hover:text-danger ml-1 shrink-0 rounded-lg p-1 transition-colors hover:bg-red-500/10"
                  aria-label={t("remove")}
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
