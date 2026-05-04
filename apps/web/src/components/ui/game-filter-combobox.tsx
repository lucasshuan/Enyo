"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Gamepad2, X } from "lucide-react";
import Image from "next/image";
import { cdnUrl } from "@/lib/utils/cdn";
import { cn } from "@/lib/utils/helpers";
import {
  SearchComboboxDropdown,
  useComboboxKeyboard,
} from "@/components/ui/search-combobox";

export type GameOption = {
  slug: string;
  name: string;
  thumbnailImagePath?: string | null;
};

interface GameFilterComboboxProps {
  games: GameOption[];
  currentGame?: string;
  placeholder?: string;
  noResultsText?: string;
  className?: string;
  inputClassName?: string;
}

export function GameFilterCombobox({
  games,
  currentGame,
  placeholder = "Game",
  noResultsText = "No games found",
  className,
  inputClassName,
}: GameFilterComboboxProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const selected = useMemo(
    () => games.find((game) => game.slug === currentGame) ?? null,
    [currentGame, games],
  );

  const filtered = useMemo(
    () =>
      query
        ? games.filter((game) =>
            game.name.toLowerCase().includes(query.toLowerCase()),
          )
        : games,
    [games, query],
  );

  const select = useCallback(
    (slug: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (slug) {
        params.set("game", slug);
      } else {
        params.delete("game");
      }
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname);
      setIsOpen(false);
      setQuery("");
      setIsEditing(false);
    },
    [router, pathname, searchParams],
  );

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setIsEditing(false);
  }, []);

  const { highlightedIndex, onInputKeyDown } = useComboboxKeyboard<GameOption>({
    isOpen,
    items: filtered,
    onSelectItem: (game) => select(game.slug),
    onClose: close,
    inputRef,
  });

  const thumb = selected ? cdnUrl(selected.thumbnailImagePath) : null;
  const displayValue = isEditing ? query : (selected?.name ?? "");

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        {thumb && !isEditing ? (
          <div className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 overflow-hidden rounded-full">
            <Image
              src={thumb}
              alt=""
              fill
              className="object-cover"
              sizes="20px"
            />
          </div>
        ) : (
          <Gamepad2 className="text-secondary/35 pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
        )}

        <input
          ref={inputRef}
          type="text"
          value={displayValue}
          placeholder={placeholder}
          onFocus={() => {
            setIsEditing(true);
            setQuery("");
            setIsOpen(true);
          }}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onKeyDown={onInputKeyDown}
          className={cn(
            "field-base field-border-default h-9 w-full rounded-xl py-0 pr-10 pl-10 text-sm",
            inputClassName,
          )}
        />

        {selected && (
          <button
            type="button"
            onClick={() => {
              select(null);
              inputRef.current?.focus();
            }}
            tabIndex={-1}
            className="text-secondary/35 hover:text-foreground absolute top-1/2 right-3 flex size-5 -translate-y-1/2 items-center justify-center rounded-full transition-colors hover:bg-white/10"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      <SearchComboboxDropdown<GameOption>
        isOpen={isOpen}
        anchorRef={inputRef}
        items={filtered}
        noResultsText={noResultsText}
        showEmpty
        highlightedIndex={highlightedIndex}
        onClickOutside={close}
        renderItem={(game, highlighted) => {
          const imageSrc = cdnUrl(game.thumbnailImagePath);
          return (
            <button
              key={game.slug}
              type="button"
              onClick={() => select(game.slug)}
              className={cn(
                "hover:bg-card-strong/70 flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                highlighted || game.slug === currentGame
                  ? "bg-card-strong/45 text-foreground"
                  : "text-muted",
              )}
            >
              {imageSrc ? (
                <div className="relative size-7 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={imageSrc}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="28px"
                  />
                </div>
              ) : (
                <div className="size-7 shrink-0 rounded-lg bg-white/10" />
              )}
              <span className="min-w-0 truncate">{game.name}</span>
            </button>
          );
        }}
        containerClassName="border-gold-dim/35 fixed z-9999 flex max-h-72 flex-col overflow-hidden rounded-2xl border bg-card-strong shadow-2xl"
        listClassName="custom-scrollbar flex-1 overflow-y-auto p-1.5"
      />
    </div>
  );
}
