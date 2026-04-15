"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  placeholder?: string;
  unit?: string;
}

export function NumberInput({
  value,
  onChange,
  min,
  max,
  step = 1,
  className,
  placeholder,
  unit,
}: NumberInputProps) {
  const handleDecrement = () => {
    const newValue = value - step;
    if (min !== undefined && newValue < min) return;
    onChange(newValue);
  };

  const handleIncrement = () => {
    const newValue = value + step;
    if (max !== undefined && newValue > max) return;
    onChange(newValue);
  };

  return (
    <div
      className={cn(
        "relative flex items-center overflow-hidden rounded-2xl border border-white/10 bg-white/5",
        className,
      )}
    >
      <button
        type="button"
        onMouseDown={handleDecrement}
        disabled={min !== undefined && value <= min}
        className="text-primary hover:bg-primary/10 absolute left-0 z-10 flex h-full w-10 items-center justify-center transition-all active:scale-90 disabled:opacity-20"
      >
        <ChevronLeft className="size-5" />
      </button>

      <div className="relative flex-1">
        <input
          type="number"
          value={value}
          onChange={(e) => {
            const val = Number(e.target.value);
            if (isNaN(val)) return;
            onChange(val);
          }}
          placeholder={placeholder}
          className="focus:ring-primary/10 h-10 w-full bg-transparent px-10 text-center text-sm font-bold text-white transition-all outline-none placeholder:text-white/20 focus:bg-white/[0.04] focus:ring-4"
        />
        {unit && (
          <span className="pointer-events-none absolute top-1/2 right-12 -translate-y-1/2 text-[10px] font-bold text-white/20 uppercase">
            {unit}
          </span>
        )}
      </div>

      <button
        type="button"
        onMouseDown={handleIncrement}
        disabled={max !== undefined && value >= max}
        className="text-primary hover:bg-primary/10 absolute right-0 z-10 flex h-full w-10 items-center justify-center transition-all active:scale-90 disabled:opacity-20"
      >
        <ChevronRight className="size-5" />
      </button>
    </div>
  );
}
