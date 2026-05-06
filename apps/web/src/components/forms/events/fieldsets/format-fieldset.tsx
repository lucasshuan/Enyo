"use client";

import { Layers } from "lucide-react";
import { useTranslations } from "next-intl";
import { LeagueConfigFieldset } from "./league-config-fieldset";

interface FormatFieldsetProps {
  disableRatingSystemChange?: boolean;
}

export function FormatFieldset({
  disableRatingSystemChange,
}: FormatFieldsetProps) {
  const t = useTranslations("Modals.AddEvent");

  return (
    <section className="animate-in fade-in slide-in-from-right-4 space-y-8 duration-500">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="border-primary/20 bg-primary/10 mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl border">
          <Layers className="text-primary size-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">
            {t("format.title")}
          </p>
          <p className="text-muted mt-0.5 text-xs">{t("format.description")}</p>
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-top-3 space-y-10 duration-400">
        <LeagueConfigFieldset
          disableRatingSystemChange={disableRatingSystemChange}
        />
      </div>
    </section>
  );
}
