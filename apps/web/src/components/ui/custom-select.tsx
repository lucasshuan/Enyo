"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils/helpers";

interface CustomSelectProps<T extends string | number> {
  value: T;
  onChange: (value: T) => void;
  options: { label: string; value: T }[];
  className?: string;
  triggerClassName?: string;
}

export function CustomSelect<T extends string | number>({
  value,
  onChange,
  options,
  className,
  triggerClassName,
}: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [coords, setCoords] = React.useState({ top: 0, left: 0, width: 0 });
  const containerRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom,
        left: rect.left,
        width: rect.width,
      });
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        className={cn(
          "border-gold-dim/35 bg-card-strong/50 text-secondary hover:border-gold-dim/60 hover:bg-card-strong/75 flex items-center justify-between gap-2 rounded-xl border px-3 py-1.5 text-[11px] font-semibold transition-all active:scale-[0.98]",
          isOpen && "ring-gold/10 border-gold/45 bg-card-strong/80 ring-4",
          triggerClassName,
        )}
      >
        <span className="truncate">{selectedOption?.label}</span>
        <ChevronDown
          className={cn(
            "text-gold/55 size-3.5 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            // Stop mousedown from reaching the document listener so the
            // dropdown stays mounted until onClick fires on the option
            onMouseDown={(e) => e.stopPropagation()}
            className="custom-scrollbar animate-in fade-in zoom-in-95 border-gold-dim/35 bg-card-strong fixed z-9999 mt-2 max-h-64 min-w-25 overflow-y-auto rounded-xl border py-1 shadow-2xl duration-100"
            style={{
              top: coords.top,
              left: coords.left,
              width: coords.width,
            }}
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "text-secondary/70 hover:bg-gold/8 hover:text-foreground flex w-full items-center justify-between gap-4 px-3 py-2 text-left text-[11px] font-medium transition-colors",
                  option.value === value && "bg-primary/12 text-primary",
                )}
              >
                {option.label}
                {option.value === value && <Check className="size-3" />}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </div>
  );
}
