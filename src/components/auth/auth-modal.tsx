"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { signIn } from "next-auth/react";
import { LoaderCircle, X } from "lucide-react";
import { SiDiscord } from "react-icons/si";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  isPending: boolean;
};

export function AuthModal({ isOpen, onClose, isPending }: AuthModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === modalRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      ref={modalRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
    >
      <div className="glass-panel w-full max-w-sm rounded-[1.8rem] p-8 mx-4 animate-in fade-in-0 zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.04em]">
              Sign in or sign up
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-white/8 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-3">
          <button
            onClick={() =>
              signIn("discord", { callbackUrl: "/" })
            }
            disabled={isPending}
            className="w-full flex items-center justify-center gap-3 rounded-full border border-[#5865F2] bg-[#5865F2] text-white hover:bg-[#4752C4] transition-all px-6 py-3 font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <LoaderCircle className="size-5 animate-spin" />
            ) : (
              <SiDiscord className="size-5" />
            )}
            {isPending ? "Signing in..." : "Continue with Discord"}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
