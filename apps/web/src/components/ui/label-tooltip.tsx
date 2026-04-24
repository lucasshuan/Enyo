"use client";

import { Info } from "lucide-react";
import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface LabelTooltipProps {
  label: string;
  tooltip?: string;
  className?: string; // Container className
  labelClassName?: string; // Label specific className
  htmlFor?: string;
  required?: boolean;
}

export function LabelTooltip({
  label,
  tooltip,
  className,
  labelClassName,
  htmlFor,
  required,
}: LabelTooltipProps) {
  const [show, setShow] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const updatePosition = useCallback(() => {
    if (triggerRef.current && show) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX + rect.width / 2,
      });
    }
  }, [show]);

  useLayoutEffect(() => {
    updatePosition();
  }, [show, updatePosition]);

  useEffect(() => {
    if (show) {
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
      return () => {
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [show, updatePosition]);

  return (
    <div
      ref={triggerRef}
      className={cn(
        "relative inline-flex w-fit items-center gap-1.5",
        className,
      )}
      onMouseEnter={() => tooltip && setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <div className="flex items-center gap-1">
        <label
          htmlFor={htmlFor}
          className={cn(
            "cursor-default text-sm font-medium text-secondary/70",
            labelClassName,
          )}
        >
          {label}
        </label>
        {required && <span className="text-primary ml-0.5 text-xs">*</span>}
      </div>

      {tooltip && (
        <div className="flex items-center">
          <Info
            className={cn(
              "size-3.5 cursor-default transition-colors",
              show ? "text-secondary/50" : "text-secondary/20",
            )}
          />
          {show &&
            createPortal(
              <div
                className="pointer-events-none absolute isolate z-9999 w-64 -translate-x-1/2 transform-gpu rounded-xl border border-gold-dim/35 bg-card-strong/90 p-3 text-[11px] leading-relaxed text-secondary/80 shadow-2xl"
                style={{
                  top: position.top,
                  left: position.left,
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                }}
              >
                <div className="absolute -top-1 left-1/2 size-2 -translate-x-1/2 rotate-45 border-t border-l border-gold-dim/35 bg-card-strong/90" />
                <div className="relative z-10">{tooltip}</div>
              </div>,
              document.body,
            )}
        </div>
      )}
    </div>
  );
}
