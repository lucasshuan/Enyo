"use client";

import { Layers, Table, User, Users, Trophy } from "lucide-react";
import { useTranslations } from "next-intl";
import { LabelTooltip } from "@/components/ui/label-tooltip";
import { MatchFormatsFieldset } from "./match-formats-fieldset";
import { cn } from "@/lib/utils/helpers";

interface TypeFieldsetProps {
  participationMode: "SOLO" | "TEAM" | null;
  onParticipationModeChange: (mode: "SOLO" | "TEAM") => void;
  eventType: "LEAGUE" | "TOURNAMENT" | null;
  onEventTypeChange: (type: "LEAGUE" | "TOURNAMENT") => void;
  readonly?: boolean;
}

export function TypeFieldset({
  participationMode,
  onParticipationModeChange,
  eventType,
  onEventTypeChange,
  readonly = false,
}: TypeFieldsetProps) {
  const t = useTranslations("Modals.AddEvent");

  return (
    <section className="animate-in fade-in slide-in-from-right-4 space-y-8 duration-500">
      <div className="flex items-start gap-3">
        <div className="border-primary/20 bg-primary/10 mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl border">
          <Layers className="text-primary size-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">
            {t("structure.title")}
          </p>
          <p className="text-muted mt-0.5 text-xs">
            {t("structure.description")}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {/* Event Type */}
        <div className="flex flex-col gap-4">
          <LabelTooltip label={t("eventType.label")} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => !readonly && onEventTypeChange("LEAGUE")}
              disabled={readonly}
              className={cn(
                "flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-all",
                readonly && "cursor-default",
                eventType === "LEAGUE"
                  ? "border-primary/50 bg-primary/10 text-primary shadow-primary/10 shadow-lg"
                  : "border-gold-dim/25 bg-card-strong/45 text-secondary/45",
                !readonly &&
                  eventType !== "LEAGUE" &&
                  "hover:bg-card-strong/70",
              )}
            >
              <div className="flex items-center gap-2">
                <Table className="size-4" />
                <span className="text-sm font-bold">
                  {t("eventType.league")}
                </span>
              </div>
              <span className="text-secondary/55 text-xs leading-relaxed">
                {t("eventType.league_description")}
              </span>
            </button>
            <button
              type="button"
              disabled
              className="border-gold-dim/25 bg-card-strong/45 flex cursor-not-allowed flex-col items-start gap-2 rounded-2xl border p-4 text-left opacity-50"
            >
              <div className="flex w-full items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Trophy className="text-secondary/45 size-4" />
                  <span className="text-secondary/45 text-sm font-bold">
                    {t("eventType.tournament")}
                  </span>
                </div>
                <span className="text-secondary/25 text-[9px] font-bold tracking-[0.2em] uppercase">
                  {t("soon")}
                </span>
              </div>
              <span className="text-secondary/35 text-xs leading-relaxed">
                {t("eventType.tournament_description")}
              </span>
            </button>
          </div>
        </div>

        {eventType !== null && (
          <div className="animate-in fade-in slide-in-from-top-3 flex flex-col gap-4 duration-400">
            <LabelTooltip label={t("participationMode.label")} />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => !readonly && onParticipationModeChange("SOLO")}
                disabled={readonly}
                className={cn(
                  "flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-all",
                  readonly && "cursor-default",
                  participationMode === "SOLO"
                    ? "border-primary/50 bg-primary/10 text-primary shadow-primary/10 shadow-lg"
                    : "border-gold-dim/25 bg-card-strong/45 text-secondary/45",
                  !readonly &&
                    participationMode !== "SOLO" &&
                    "hover:bg-card-strong/70",
                )}
              >
                <div className="flex items-center gap-2">
                  <User className="size-4" />
                  <span className="text-sm font-bold">
                    {t("participationMode.solo")}
                  </span>
                </div>
                <span className="text-secondary/55 text-xs leading-relaxed">
                  {t("participationMode.solo_description")}
                </span>
              </button>
              <button
                type="button"
                disabled
                className="border-gold-dim/25 bg-card-strong/45 flex cursor-not-allowed flex-col items-start gap-2 rounded-2xl border p-4 text-left opacity-50"
              >
                <div className="flex w-full items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Users className="text-secondary/45 size-4" />
                    <span className="text-secondary/45 text-sm font-bold">
                      {t("participationMode.team")}
                    </span>
                  </div>
                  <span className="text-secondary/25 text-[9px] font-bold tracking-[0.2em] uppercase">
                    {t("soon")}
                  </span>
                </div>
                <span className="text-secondary/35 text-xs leading-relaxed">
                  {t("participationMode.team_description")}
                </span>
              </button>
            </div>
          </div>
        )}

        {!readonly && eventType === "LEAGUE" && participationMode !== null && (
          <div className="animate-in fade-in slide-in-from-top-3 duration-400">
            <MatchFormatsFieldset />
          </div>
        )}
      </div>
    </section>
  );
}
