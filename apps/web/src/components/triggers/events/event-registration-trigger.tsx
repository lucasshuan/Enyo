"use client";

import { useState } from "react";
import { CheckCircle2, LogIn, Swords, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/helpers";
import { EventRegistrationModal } from "@/components/modals/events/event-registration-modal";
import { AuthModal } from "@/components/modals/auth/auth-modal";

interface EventRegistrationTriggerProps {
  eventId: string;
  isRegistered: boolean;
  isLoggedIn: boolean;
  userId?: string;
  defaultDisplayName?: string;
  participantCount?: number;
  maxParticipants?: number | null;
  registrationsEnabled: boolean;
}

export function EventRegistrationTrigger({
  eventId,
  isRegistered,
  isLoggedIn,
  userId,
  defaultDisplayName = "",
  participantCount,
  maxParticipants,
  registrationsEnabled,
}: EventRegistrationTriggerProps) {
  const t = useTranslations("EventPage");
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const isFull =
    maxParticipants != null &&
    participantCount != null &&
    participantCount >= maxParticipants;

  if (isRegistered) {
    return (
      <div className="border-success/20 bg-success/5 flex items-center gap-3 rounded-2xl border px-5 py-4">
        <div className="bg-success/15 flex size-9 shrink-0 items-center justify-center rounded-xl">
          <CheckCircle2 className="text-success size-5" />
        </div>
        <div>
          <p className="text-success text-sm font-semibold">
            {t("alreadyRegistered")}
          </p>
          <p className="text-muted text-xs">{t("alreadyRegisteredHint")}</p>
        </div>
      </div>
    );
  }

  if (!registrationsEnabled) {
    return (
      <div className="border-border bg-card/40 flex items-center gap-3 rounded-2xl border px-5 py-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/5">
          <Swords className="size-5 text-white/30" />
        </div>
        <p className="text-muted text-sm">{t("registrationsClosed")}</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className={cn(
            "group relative w-full overflow-hidden rounded-2xl border px-6 py-5 text-left transition-all active:scale-[0.98]",
            "border-primary/20 from-primary/8 to-primary/3 hover:border-primary/40 hover:from-primary/12 hover:to-primary/6 bg-gradient-to-br",
          )}
        >
          <div className="flex items-center gap-4">
            <div className="bg-primary/15 group-hover:bg-primary/20 flex size-11 shrink-0 items-center justify-center rounded-xl transition-colors">
              <LogIn className="text-primary size-5" />
            </div>
            <div>
              <p className="text-foreground text-sm font-semibold">
                {t("loginToRegister")}
              </p>
              <p className="text-muted text-xs">{t("loginToRegisterHint")}</p>
            </div>
          </div>
        </button>
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          isPending={false}
        />
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => !isFull && setIsRegModalOpen(true)}
        disabled={isFull}
        className={cn(
          "group relative w-full overflow-hidden rounded-2xl border px-6 py-5 text-left transition-all active:scale-[0.98]",
          isFull
            ? "border-border bg-card/40 cursor-not-allowed opacity-60"
            : "border-gold/20 from-gold/8 to-gold/3 hover:border-gold/40 hover:from-gold/12 hover:to-gold/6 cursor-pointer bg-gradient-to-br",
        )}
      >
        {/* Decorative shimmer */}
        {!isFull && (
          <div className="from-gold/0 via-gold/6 to-gold/0 pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r transition-transform duration-700 group-hover:translate-x-full" />
        )}
        <div className="relative flex items-center gap-4">
          <div
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-xl transition-colors",
              isFull ? "bg-white/5" : "bg-gold/15 group-hover:bg-gold/20",
            )}
          >
            <Swords
              className={cn("size-5", isFull ? "text-white/30" : "text-gold")}
            />
          </div>
          <div className="min-w-0">
            <p className="text-foreground text-sm font-bold tracking-wide uppercase">
              {isFull ? t("eventFull") : t("register")}
            </p>
            {participantCount != null && maxParticipants != null ? (
              <p className="text-muted flex items-center gap-1 text-xs">
                <Users className="size-3" />
                {participantCount}/{maxParticipants} {t("participants")}
              </p>
            ) : participantCount != null ? (
              <p className="text-muted flex items-center gap-1 text-xs">
                <Users className="size-3" />
                {participantCount} {t("participants")}
              </p>
            ) : null}
          </div>
        </div>
      </button>

      {isRegModalOpen && (
        <EventRegistrationModal
          isOpen={isRegModalOpen}
          onClose={() => setIsRegModalOpen(false)}
          eventId={eventId}
          userId={userId!}
          defaultDisplayName={defaultDisplayName}
        />
      )}
    </>
  );
}
