"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import {
  Search,
  UserPlus,
  Globe,
  LoaderCircle,
  Check,
  ChevronDown,
  X,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { ActionButton } from "@/components/ui/action-button";
import { addPlayerToGame } from "@/server/actions/game";
import { searchUsers } from "@/server/actions/user-search";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { COUNTRIES } from "@/lib/countries";

interface AddPlayerModalProps {
  gameId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface SearchUser {
  id: string;
  name: string;
  username: string;
  image: string | null;
}

export function AddPlayerModal({
  gameId,
  isOpen,
  onClose,
}: AddPlayerModalProps) {
  const t = useTranslations("Admin.addPlayer");
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<SearchUser | null>(null);
  const [username, setUsername] = useState("");
  const [country, setCountry] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Country Search State
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Localized and sorted countries
  const localizedCountries = COUNTRIES.map((c) => {
    try {
      const displayNames = new Intl.DisplayNames([locale], { type: "region" });
      return {
        code: c.code,
        name: displayNames.of(c.code) || c.name,
      };
    } catch {
      return c;
    }
  }).sort((a, b) => a.name.localeCompare(b.name, locale));

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsCountryDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.length < 2) return;

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const results = (await searchUsers(searchQuery)) as SearchUser[];
      setSearchResults(results);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const displayResults = searchQuery.length < 2 ? [] : searchResults;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;

    startTransition(async () => {
      try {
        const result = await addPlayerToGame(gameId, {
          username,
          country,
          userId: selectedUser?.id ?? null,
        });

        if (result.success) {
          if (result.wasAddedToExisting) {
            toast.success(t("successExisting"));
          } else {
            toast.success(t("success"));
          }
          onClose();
          // Reset form
          setUsername("");
          setSelectedUser(null);
          setCountry(null);
          setSearchQuery("");
        }
      } catch {
        toast.error(t("error"));
      }
    });
  };

  const filteredCountries = localizedCountries.filter(
    (c) =>
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.code.toLowerCase().includes(countrySearch.toLowerCase()),
  );

  const selectedCountryData = localizedCountries.find(
    (c) => c.code === country,
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("title")}
      description={t("description")}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {/* Username Input */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="p_username"
              className="ml-1 text-sm font-medium text-white/70"
            >
              {t("usernameLabel")}
            </label>
            <input
              id="p_username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t("usernamePlaceholder")}
              className="focus:border-primary/50 focus:ring-primary/10 w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white outline-hidden transition-all placeholder:text-white/20 focus:bg-white/[0.07] focus:ring-4"
            />
          </div>

          {/* Country Selection - NEW SEARCHABLE DROPDOWN */}
          <div className="flex flex-col gap-2">
            <label className="ml-1 text-sm font-medium text-white/70">
              {t("countryLabel")}
            </label>
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                className="focus:border-primary/50 focus:ring-primary/10 flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white outline-hidden transition-all hover:bg-white/[0.07] focus:ring-4"
              >
                <div className="flex items-center gap-3">
                  {country ? (
                    <>
                      <div className="flex size-5 items-center justify-center overflow-hidden rounded-sm">
                        <span
                          className={cn(
                            "fi",
                            `fi-${country.toLowerCase()} fis`,
                            "h-full w-full object-cover",
                          )}
                        />
                      </div>
                      <span className="font-medium text-white">
                        {selectedCountryData?.name}
                      </span>
                    </>
                  ) : (
                    <>
                      <Globe className="size-5 text-white/30" />
                      <span className="text-white/30">
                        {t("unknownCountry")}
                      </span>
                    </>
                  )}
                </div>
                <ChevronDown
                  className={cn(
                    "size-4 text-white/30 transition-transform",
                    isCountryDropdownOpen && "rotate-180",
                  )}
                />
              </button>

              {isCountryDropdownOpen && (
                <div className="glass-panel absolute bottom-full left-0 z-30 mb-2 flex max-h-[250px] w-full flex-col overflow-hidden rounded-2xl shadow-2xl">
                  {/* Search inside dropdown */}
                  <div className="relative border-b border-white/10 p-2">
                    <Search className="absolute top-5 left-5 size-4 text-white/30" />
                    <input
                      autoFocus
                      type="text"
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      placeholder="Search country..."
                      className="w-full rounded-xl border-none bg-white/5 py-3 pr-4 pl-10 text-sm text-white outline-hidden focus:bg-white/10"
                    />
                    {countrySearch && (
                      <button
                        onClick={() => setCountrySearch("")}
                        className="absolute top-5 right-5 text-white/30 hover:text-white"
                      >
                        <X className="size-4" />
                      </button>
                    )}
                  </div>

                  {/* Results list */}
                  <div className="overflow-y-auto px-1 py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setCountry(null);
                        setIsCountryDropdownOpen(false);
                        setCountrySearch("");
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors hover:bg-white/10",
                        country === null && "bg-white/5",
                      )}
                    >
                      <Globe className="size-5 text-white/30" />
                      <span className="text-sm text-white">
                        {t("unknownCountry")}
                      </span>
                    </button>

                    {filteredCountries.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => {
                          setCountry(c.code);
                          setIsCountryDropdownOpen(false);
                          setCountrySearch("");
                        }}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors hover:bg-white/10",
                          country === c.code && "bg-white/5",
                        )}
                      >
                        <div className="flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-sm">
                          <span
                            className={cn(
                              "fi",
                              `fi-${c.code.toLowerCase()} fis`,
                              "h-full w-full object-cover",
                            )}
                          />
                        </div>
                        <span className="truncate text-sm text-white">
                          {c.name}
                        </span>
                        {country === c.code && (
                          <Check className="text-primary ml-auto size-4" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Autocomplete User Link */}
          <div className="flex flex-col gap-2">
            <label className="ml-1 text-sm font-medium text-white/70">
              {t("linkUserLabel")}
            </label>
            <div className="relative">
              {!selectedUser ? (
                <>
                  <Search className="absolute top-3 left-4 size-4 text-white/30" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t("searchUserPlaceholder")}
                    className="focus:border-primary/50 focus:ring-primary/10 w-full rounded-2xl border border-white/10 bg-white/5 pt-3 pr-4 pb-3 pl-11 text-sm text-white outline-hidden transition-all placeholder:text-white/20 focus:bg-white/[0.07] focus:ring-4"
                  />
                  {isSearching && (
                    <LoaderCircle className="absolute top-3 right-4 size-4 animate-spin text-white/30" />
                  )}
                  {displayResults.length > 0 && (
                    <div className="glass-panel absolute top-full left-0 z-20 mt-2 max-h-60 w-full overflow-y-auto rounded-2xl p-1 shadow-2xl">
                      {displayResults.map((user) => (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() => {
                            setSelectedUser(user);
                            if (!username) setUsername(user.username);
                            setSearchResults([]);
                            setSearchQuery("");
                          }}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-white/10"
                        >
                          <div className="relative size-8 shrink-0 overflow-hidden rounded-full bg-white/10">
                            {user.image ? (
                              <Image
                                src={user.image}
                                alt={user.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <span className="text-xs">{user.name[0]}</span>
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-white">
                              {user.name}
                            </p>
                            <p className="truncate text-xs text-white/40">
                              @{user.username}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="border-primary/30 bg-primary/5 flex items-center justify-between rounded-2xl border px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative size-8 shrink-0 overflow-hidden rounded-full">
                      {selectedUser.image ? (
                        <Image
                          src={selectedUser.image}
                          alt={selectedUser.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-white/10">
                          <span className="text-xs">
                            {selectedUser.name[0]}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {selectedUser.name}
                      </p>
                      <p className="text-xs text-white/40">
                        @{selectedUser.username}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedUser(null)}
                    className="text-xs text-white/40 hover:text-white"
                  >
                    {t("removeLink")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <ActionButton
          type="submit"
          intent="primary"
          icon={UserPlus}
          label={isPending ? t("submitting") : t("submit")}
          disabled={isPending || !username}
        />
      </form>
    </Modal>
  );
}
