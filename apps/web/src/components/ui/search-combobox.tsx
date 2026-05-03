"use client";

import { useState, useEffect, useLayoutEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface UseComboboxKeyboardOptions<T> {
  /** Controls whether keydown events are processed. */
  isOpen: boolean;
  items: T[];
  /** Whether a prepended (non-data) item occupies index 0 in the list. */
  hasPrependItem?: boolean;
  onSelectItem: (item: T) => void;
  onSelectPrepend?: () => void;
  onClose: () => void;
  /** Ref to the search input so focus can return when ArrowUp goes past index 0. */
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export function useComboboxKeyboard<T>({
  isOpen,
  items,
  hasPrependItem = false,
  onSelectItem,
  onSelectPrepend,
  onClose,
  inputRef,
}: UseComboboxKeyboardOptions<T>) {
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const prependOffset = hasPrependItem ? 1 : 0;
  const totalItems = prependOffset + items.length;

  // Reset highlight whenever the dropdown closes or items change.
  useEffect(() => {
    if (!isOpen) setHighlightedIndex(-1);
  }, [isOpen]);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [items]);

  const onInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((i) => (i < totalItems - 1 ? i + 1 : i));
          break;
        case "ArrowUp":
          e.preventDefault();
          if (highlightedIndex <= 0) {
            setHighlightedIndex(-1);
            inputRef?.current?.focus();
          } else {
            setHighlightedIndex((i) => i - 1);
          }
          break;
        case "Enter":
          if (highlightedIndex === -1) break;
          e.preventDefault();
          if (hasPrependItem && highlightedIndex === 0) {
            onSelectPrepend?.();
          } else {
            const item = items[highlightedIndex - prependOffset];
            if (item !== undefined) onSelectItem(item);
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isOpen, highlightedIndex, totalItems, hasPrependItem, prependOffset],
  );

  const resetHighlight = useCallback(() => setHighlightedIndex(-1), []);

  return { highlightedIndex, onInputKeyDown, resetHighlight };
}

// ─── Dropdown Component ────────────────────────────────────────────────────────

interface SearchComboboxDropdownProps<T> {
  isOpen: boolean;
  /** Ref to the element used to position the dropdown (the input or trigger button). */
  anchorRef: { readonly current: HTMLElement | null };
  items: T[];
  isLoading?: boolean;
  noResultsText?: string;
  /** Show the empty state when items=[] and not loading. */
  showEmpty?: boolean;
  highlightedIndex: number;
  renderItem: (item: T, highlighted: boolean) => React.ReactNode;
  /** Optional item rendered before the data items (keyboard-navigable, index 0). */
  prependItem?: {
    render: (highlighted: boolean) => React.ReactNode;
  };
  /**
   * Rendered above the items list; NOT keyboard-navigable.
   * Use for a search input placed inside the dropdown (e.g., country selector).
   */
  header?: React.ReactNode;
  /** Called when the user clicks outside the dropdown and anchor. */
  onClickOutside?: () => void;
  /** Tailwind class(es) that override the outer container's className. */
  containerClassName?: string;
  /** Tailwind class(es) that override the scrollable list's className. */
  listClassName?: string;
  /** Max-height Tailwind class applied to the list (ignored when listClassName is set). */
  maxHeight?: string;
}

export function SearchComboboxDropdown<T>({
  isOpen,
  anchorRef,
  items,
  isLoading = false,
  noResultsText,
  showEmpty = false,
  highlightedIndex,
  renderItem,
  prependItem,
  header,
  onClickOutside,
  containerClassName,
  listClassName,
  maxHeight = "max-h-60",
}: SearchComboboxDropdownProps<T>) {
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const [isPositioned, setIsPositioned] = useState(false);
  const portalRef = useRef<HTMLDivElement | null>(null);
  const prependRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prependOffset = prependItem ? 1 : 0;

  // Compute position synchronously before paint so the dropdown never
  // flashes at (0,0) in the corner of the viewport.
  useLayoutEffect(() => {
    if (!isOpen || !anchorRef.current) {
      setIsPositioned(false);
      return;
    }
    const rect = anchorRef.current.getBoundingClientRect();
    setCoords({
      top: rect.bottom + window.scrollY + 8,
      left: rect.left + window.scrollX,
      width: rect.width,
    });
    setIsPositioned(true);
  }, [isOpen, anchorRef]);

  // Reposition on scroll / resize while open.
  useEffect(() => {
    if (!isOpen) return;
    const reposition = () => {
      if (!anchorRef.current) return;
      const rect = anchorRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    };
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [isOpen, anchorRef]);

  // Scroll highlighted item into view.
  useEffect(() => {
    if (highlightedIndex === -1) return;
    if (prependItem && highlightedIndex === 0) {
      prependRef.current?.scrollIntoView({ block: "nearest" });
    } else {
      itemRefs.current[highlightedIndex - prependOffset]?.scrollIntoView({
        block: "nearest",
      });
    }
  }, [highlightedIndex, prependItem, prependOffset]);

  // Click-outside handler (used by button-triggered dropdowns like country).
  useEffect(() => {
    if (!isOpen || !onClickOutside) return;
    const handleDown = (e: MouseEvent) => {
      const portal = portalRef.current;
      const anchor = anchorRef.current;
      if (
        portal &&
        !portal.contains(e.target as Node) &&
        anchor &&
        !anchor.contains(e.target as Node)
      ) {
        onClickOutside();
      }
    };
    document.addEventListener("mousedown", handleDown);
    return () => document.removeEventListener("mousedown", handleDown);
  }, [isOpen, onClickOutside, anchorRef]);

  if (!isOpen || !isPositioned || typeof document === "undefined") return null;

  const showEmptyState =
    showEmpty && !isLoading && items.length === 0 && !prependItem;

  // Animation classes are applied to every dropdown regardless of whether
  // the consumer passed a custom containerClassName. `origin-top` ensures
  // the zoom/scale animation grows downward from the anchor.
  const animationClasses =
    "animate-in fade-in-0 zoom-in-95 slide-in-from-top-1 duration-150 ease-out origin-top";

  return createPortal(
    <div
      ref={portalRef}
      onMouseDown={(e) => e.preventDefault()}
      className={cn(
        animationClasses,
        containerClassName ??
          "border-gold-dim/35 fixed z-9999 overflow-hidden rounded-3xl border bg-black/60 shadow-2xl backdrop-blur-xl",
      )}
      style={{ top: coords.top, left: coords.left, width: coords.width }}
    >
      {header}
      <div
        className={
          listClassName ?? `custom-scrollbar overflow-y-auto p-2 ${maxHeight}`
        }
      >
        {isLoading && (
          <div className="flex items-center justify-center gap-2 px-3 py-4">
            <LoaderCircle className="text-primary/50 size-4 animate-spin" />
          </div>
        )}

        {!isLoading && prependItem && (
          <div
            ref={(el) => {
              prependRef.current = el;
            }}
          >
            {prependItem.render(highlightedIndex === 0)}
          </div>
        )}

        {!isLoading &&
          items.map((item, idx) => (
            <div
              key={idx}
              ref={(el) => {
                itemRefs.current[idx] = el;
              }}
            >
              {renderItem(item, highlightedIndex === idx + prependOffset)}
            </div>
          ))}

        {showEmptyState && noResultsText && (
          <p className="text-muted px-3 py-4 text-center text-sm">
            {noResultsText}
          </p>
        )}
      </div>
    </div>,
    document.body,
  );
}
