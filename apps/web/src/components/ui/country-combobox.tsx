"use client";

import { useState, useRef, useMemo } from "react";
import { Globe, X, Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { COUNTRIES } from "@/lib/countries";
import {
  useComboboxKeyboard,
  SearchComboboxDropdown,
} from "@/components/ui/search-combobox";

type LocalizedCountry = { code: string; name: string };

interface CountryComboboxProps {
  value: string | null;
  onChange: (v: string | null) => void;
  locale: string;
  placeholder?: string;
  /** Label for the "clear" prepend option shown at the top of the list. */
  clearLabel?: string;
  className?: string;
}

export function CountryCombobox({
  value,
  onChange,
  locale,
  placeholder = "Search country…",
  clearLabel,
  className,
}: CountryComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const localizedCountries = useMemo<LocalizedCountry[]>(
    () =>
      COUNTRIES.map((c) => {
        try {
          const dn = new Intl.DisplayNames([locale], { type: "region" });
          return { code: c.code, name: dn.of(c.code) || c.name };
        } catch {
          return c;
        }
      }).sort((a, b) => a.name.localeCompare(b.name, locale)),
    [locale],
  );

  const selected = useMemo(
    () => localizedCountries.find((c) => c.code === value) ?? null,
    [localizedCountries, value],
  );

  const filtered = useMemo(
    () =>
      searchText
        ? localizedCountries.filter(
            (c) =>
              c.name.toLowerCase().includes(searchText.toLowerCase()) ||
              c.code.toLowerCase().includes(searchText.toLowerCase()),
          )
        : localizedCountries,
    [localizedCountries, searchText],
  );

  const close = () => {
    setIsOpen(false);
    setIsEditing(false);
    setSearchText("");
  };

  const { highlightedIndex, onInputKeyDown } =
    useComboboxKeyboard<LocalizedCountry>({
      isOpen,
      items: filtered,
      hasPrependItem: !!clearLabel,
      onSelectItem: (c) => {
        onChange(c.code);
        close();
      },
      onSelectPrepend: () => {
        onChange(null);
        close();
      },
      onClose: close,
      inputRef,
    });

  const displayValue = isEditing ? searchText : (selected?.name ?? "");

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        {/* Left icon: flag when selected, globe when empty.
            The flag-icons `.fi` class sets `position: relative` and
            `display: inline-block`, which fights Tailwind's `absolute`.
            Wrap it in a positioned span so the library styles only
            control the flag image itself. */}
        {selected ? (
          <span className="pointer-events-none absolute top-1/2 left-4 flex h-3 w-4 -translate-y-1/2 items-center justify-center overflow-hidden rounded-xs leading-none">
            <span
              className={cn(
                "fi",
                `fi-${selected.code.toLowerCase()}`,
                "block h-full w-full leading-none before:content-none",
              )}
            />
          </span>
        ) : (
          <Globe className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-secondary/35" />
        )}

        <input
          ref={inputRef}
          type="text"
          value={displayValue}
          placeholder={placeholder}
          onFocus={() => {
            setIsEditing(true);
            setSearchText("");
            setIsOpen(true);
          }}
          onChange={(e) => {
            setSearchText(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={onInputKeyDown}
          className={cn(
            "field-base field-border-default w-full py-3 pr-10 pl-10",
          )}
        />

        {/* Right: clear button when selected, nothing when empty */}
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange(null);
              close();
              inputRef.current?.focus();
            }}
            tabIndex={-1}
            className="absolute top-1/2 right-3.5 -translate-y-1/2 text-secondary/35 transition-colors hover:text-white"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <SearchComboboxDropdown<LocalizedCountry>
        isOpen={isOpen}
        anchorRef={inputRef}
        items={filtered}
        highlightedIndex={highlightedIndex}
        onClickOutside={close}
        containerClassName="fixed z-9999 flex max-h-[280px] flex-col overflow-hidden rounded-2xl border border-gold-dim/35 bg-card-strong shadow-2xl"
        listClassName="custom-scrollbar flex-1 overflow-y-auto px-1 py-1"
        prependItem={
          clearLabel
            ? {
                render: (highlighted) => (
                  <button
                    type="button"
                    onClick={() => {
                      onChange(null);
                      close();
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors hover:bg-card-strong/70",
                      highlighted || value === null ? "bg-card-strong/45" : "",
                    )}
                  >
                    <Globe className="size-5 text-secondary/35" />
                    <span className="text-sm text-white">{clearLabel}</span>
                  </button>
                ),
              }
            : undefined
        }
        renderItem={(c, highlighted) => (
          <button
            key={c.code}
            type="button"
            onClick={() => {
              onChange(c.code);
              close();
            }}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors hover:bg-card-strong/70",
              highlighted || value === c.code ? "bg-card-strong/45" : "",
            )}
          >
            <div className="flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-sm">
              <span
                className={cn(
                  "fi",
                  `fi-${c.code.toLowerCase()}`,
                  "h-3 w-4 rounded-xs object-cover",
                )}
              />
            </div>
            <span className="truncate text-sm text-white">{c.name}</span>
            {value === c.code && (
              <Check className="text-primary ml-auto size-4 shrink-0" />
            )}
          </button>
        )}
        showEmpty
        noResultsText="No results"
      />
    </div>
  );
}
