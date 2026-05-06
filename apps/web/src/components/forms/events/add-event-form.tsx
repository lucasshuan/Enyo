"use client";

import { useTransition, useState, useEffect, useCallback } from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useAddLeagueSchema,
  type AddLeagueValues,
  LEAGUE_DEFAULT_SETTINGS,
} from "@/schemas/league";
import { createLeague, checkLeagueSlugAvailability } from "@/actions/event";
import { type SimpleGame } from "@/actions/game";
import { resolveImageValue } from "@/lib/utils/upload";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { GameSearchFieldset } from "./fieldsets/game-fieldset";
import { TypeFieldset } from "./fieldsets/type-fieldset";
import { FormatFieldset } from "./fieldsets/format-fieldset";
import { GeneralFieldset } from "./fieldsets/general-fieldset";
import { SettingsFieldset } from "./fieldsets/settings-fieldset";
import {
  StaffFieldset,
  type EventStaffDraft,
} from "./fieldsets/staff-fieldset";
import {
  ParticipantsFieldset,
  type ParticipantEntry,
} from "./fieldsets/participants-fieldset";

export type AddEventSuccessData = {
  gameSlug?: string;
  eventSlug: string;
};

function normalizeParticipantName(name: string): string {
  return name.trim().toLocaleLowerCase();
}

function areParticipantsValid(
  participants: ParticipantEntry[] | undefined,
): boolean {
  if (!participants || participants.length === 0) {
    return true;
  }

  const counts = new Map<string, number>();

  for (const participant of participants) {
    const normalizedName = normalizeParticipantName(participant.displayName);

    if (!normalizedName) {
      return false;
    }

    counts.set(normalizedName, (counts.get(normalizedName) ?? 0) + 1);
  }

  return [...counts.values()].every((count) => count === 1);
}

interface AddEventFormProps {
  gameId: string;
  onSuccess: (data: AddEventSuccessData) => void;
  onLoadingChange?: (loading: boolean) => void;
  onValidationChange?: (isValid: boolean) => void;
  onStepValidationChange?: (isValid: boolean) => void;
  onUnknownGameSelectionChange?: (requiresConfirmation: boolean) => void;
  formId: string;
  currentStep: number;
  initialGame?: SimpleGame;
  isGameFixed?: boolean;
  currentUserId?: string;
  staffMembers?: EventStaffDraft[];
  onStaffChange?: (members: EventStaffDraft[]) => void;
  participants?: ParticipantEntry[];
  onParticipantsChange?: (participants: ParticipantEntry[]) => void;
}

export function AddEventForm({
  gameId,
  onSuccess,
  onLoadingChange,
  onValidationChange,
  onStepValidationChange,
  onUnknownGameSelectionChange,
  formId,
  currentStep,
  initialGame,
  isGameFixed,
  currentUserId,
  staffMembers,
  onStaffChange,
  participants,
  onParticipantsChange,
}: AddEventFormProps) {
  const t = useTranslations("Modals.AddEvent");
  const schema = useAddLeagueSchema();
  const [isPending, startTransition] = useTransition();
  const [participationMode, setParticipationMode] = useState<
    "SOLO" | "TEAM" | null
  >(null);
  const [eventType, setEventType] = useState<"LEAGUE" | "TOURNAMENT" | null>(
    null,
  );
  const [isSlugChecking, setIsSlugChecking] = useState(false);
  const [hasSlugConflict, setHasSlugConflict] = useState(false);
  const [selectedGame, setSelectedGame] = useState<SimpleGame | null>(
    initialGame ?? null,
  );

  const handleGameSelect = useCallback((game: SimpleGame | null) => {
    setSelectedGame(game);
  }, []);

  const methods = useForm<AddLeagueValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      gameId: gameId || undefined,
      gameName: undefined,
      name: "",
      slug: "",
      description: "",
      about: "",
      thumbnailImagePath: null,
      ratingSystem: undefined,
      initialElo: LEAGUE_DEFAULT_SETTINGS.initialElo,
      allowDraw: false,
      kFactor: LEAGUE_DEFAULT_SETTINGS.kFactor,
      scoreRelevance: LEAGUE_DEFAULT_SETTINGS.scoreRelevance,
      inactivityDecay: LEAGUE_DEFAULT_SETTINGS.inactivityDecay,
      inactivityThresholdHours:
        LEAGUE_DEFAULT_SETTINGS.inactivityThresholdHours,
      inactivityDecayFloor: LEAGUE_DEFAULT_SETTINGS.inactivityDecayFloor,
      pointsPerWin: LEAGUE_DEFAULT_SETTINGS.pointsPerWin,
      pointsPerDraw: LEAGUE_DEFAULT_SETTINGS.pointsPerDraw,
      pointsPerLoss: LEAGUE_DEFAULT_SETTINGS.pointsPerLoss,
      allowedFormats: [...LEAGUE_DEFAULT_SETTINGS.allowedFormats],
      status: LEAGUE_DEFAULT_SETTINGS.status,
      visibility: LEAGUE_DEFAULT_SETTINGS.visibility,
      registrationsEnabled: LEAGUE_DEFAULT_SETTINGS.registrationsEnabled,
      startDate: null,
      endDate: null,
      registrationStartDate: null,
      registrationEndDate: null,
      maxParticipants: null,
      requiresApproval: LEAGUE_DEFAULT_SETTINGS.requiresApproval,
      waitlistEnabled: LEAGUE_DEFAULT_SETTINGS.waitlistEnabled,
      officialLinks: [],
    },
    mode: "onChange",
  });

  const {
    control,
    handleSubmit,
    formState: { isValid },
    getValues,
  } = methods;

  const watchGameId = useWatch({ control, name: "gameId" });
  const watchGameName = useWatch({ control, name: "gameName" });
  const watchName = useWatch({ control, name: "name" }) ?? "";
  const watchSlug = useWatch({ control, name: "slug" }) ?? "";
  const allowedFormats = useWatch({ control, name: "allowedFormats" }) ?? [];
  const watchRatingSystem = useWatch({ control, name: "ratingSystem" });
  const requiresUnknownGameConfirmation =
    !watchGameId && !!watchGameName?.trim();

  const handleSlugStatusChange = useCallback(
    (checking: boolean, conflict: boolean) => {
      setIsSlugChecking(checking);
      setHasSlugConflict(conflict);
    },
    [],
  );

  const checkSlugAvailability = useCallback(
    (slug: string) => checkLeagueSlugAvailability(watchGameId ?? "", slug),
    [watchGameId],
  );

  useEffect(() => {
    onLoadingChange?.(isPending);
  }, [isPending, onLoadingChange]);

  const isFormValid = isValid && !isSlugChecking && !hasSlugConflict;

  useEffect(() => {
    onValidationChange?.(isFormValid);
  }, [isFormValid, onValidationChange]);

  useEffect(() => {
    onUnknownGameSelectionChange?.(requiresUnknownGameConfirmation);
  }, [requiresUnknownGameConfirmation, onUnknownGameSelectionChange]);

  useEffect(() => {
    let valid = false;

    if (currentStep === 0) {
      valid = !!watchGameId || !!watchGameName;
    } else if (currentStep === 1) {
      valid =
        eventType !== null &&
        participationMode !== null &&
        (eventType !== "LEAGUE" || allowedFormats.length > 0);
    } else if (currentStep === 2) {
      valid = eventType !== "LEAGUE" || !!watchRatingSystem;
    } else if (currentStep === 3) {
      const values = getValues();
      const parseResult = schema.safeParse(values);
      if (parseResult.success) {
        valid = true;
      } else {
        const stepFields = ["name", "slug", "officialLinks"];
        const hasErrors = parseResult.error.issues.some((issue) =>
          stepFields.includes(issue.path[0] as string),
        );
        valid = !hasErrors;
      }
      if (valid) valid = !isSlugChecking && !hasSlugConflict;
    } else if (currentStep === 4) {
      valid = true; // access step — all optional
    } else if (currentStep === 5) {
      valid = areParticipantsValid(participants);
    } else if (currentStep === 6) {
      valid = true; // staff step — optional
    }

    onStepValidationChange?.(valid);
  }, [
    currentStep,
    eventType,
    participationMode,
    watchGameId,
    watchGameName,
    watchName,
    watchSlug,
    watchRatingSystem,
    requiresUnknownGameConfirmation,
    isSlugChecking,
    hasSlugConflict,
    allowedFormats.length,
    participants,
    getValues,
    schema,
    onStepValidationChange,
  ]);

  const onSubmit = async (values: AddLeagueValues) => {
    if (isSlugChecking || hasSlugConflict) return;

    startTransition(async () => {
      const isElo = values.ratingSystem === "ELO";

      let thumbnailImagePath: string | null;
      try {
        thumbnailImagePath = await resolveImageValue(values.thumbnailImagePath);
      } catch {
        toast.error(t("uploadError"));
        return;
      }

      const config = isElo
        ? {
            initialElo: values.initialElo ?? LEAGUE_DEFAULT_SETTINGS.initialElo,
            kFactor: values.kFactor ?? LEAGUE_DEFAULT_SETTINGS.kFactor,
            scoreRelevance:
              values.scoreRelevance ?? LEAGUE_DEFAULT_SETTINGS.scoreRelevance,
            inactivityDecay:
              values.inactivityDecay ?? LEAGUE_DEFAULT_SETTINGS.inactivityDecay,
            inactivityThresholdHours:
              values.inactivityThresholdHours ??
              LEAGUE_DEFAULT_SETTINGS.inactivityThresholdHours,
            inactivityDecayFloor:
              values.inactivityDecayFloor ??
              LEAGUE_DEFAULT_SETTINGS.inactivityDecayFloor,
          }
        : {
            pointsPerWin:
              values.pointsPerWin ?? LEAGUE_DEFAULT_SETTINGS.pointsPerWin,
            pointsPerDraw:
              values.pointsPerDraw ?? LEAGUE_DEFAULT_SETTINGS.pointsPerDraw,
            pointsPerLoss:
              values.pointsPerLoss ?? LEAGUE_DEFAULT_SETTINGS.pointsPerLoss,
          };

      const result = await createLeague({
        gameId: values.gameId,
        gameName: values.gameName,
        name: values.name,
        slug: values.slug,
        description: values.description ?? null,
        about: values.about ?? null,
        participationMode: participationMode ?? "SOLO",
        status: values.status ?? "PENDING",
        visibility: values.visibility ?? "PUBLIC",
        registrationsEnabled: values.registrationsEnabled ?? false,
        startDate: values.startDate ?? null,
        endDate: values.endDate ?? null,
        registrationStartDate: values.registrationStartDate ?? null,
        registrationEndDate: values.registrationEndDate ?? null,
        maxParticipants: values.maxParticipants ?? null,
        requiresApproval: values.requiresApproval ?? false,
        waitlistEnabled: values.waitlistEnabled ?? false,
        officialLinks:
          values.officialLinks && values.officialLinks.length > 0
            ? values.officialLinks
            : null,
        thumbnailImagePath,
        classificationSystem: isElo ? "ELO" : "POINTS",
        allowDraw: values.allowDraw,
        allowedFormats: values.allowedFormats,
        config,
        staff: staffMembers
          ?.filter((m) => m.userId !== currentUserId)
          .map(({ userId, capabilities, isFullAccess }) => ({
            userId,
            capabilities,
            isFullAccess,
          })),
        participants: participants?.map(({ displayName, linkedUser }) => ({
          displayName,
          userId: linkedUser?.userId,
        })),
      });

      if (result.success) {
        toast.success(t("success"));
        onSuccess({
          gameSlug: selectedGame?.slug,
          eventSlug: values.slug,
        });
      } else {
        toast.error(result.error || t("error"));
      }
    });
  };

  return (
    <FormProvider {...methods}>
      <form
        id={formId}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-10"
      >
        {currentStep === 0 && (
          <GameSearchFieldset
            gameId={watchGameId ?? gameId}
            initialGame={selectedGame ?? undefined}
            isGameFixed={isGameFixed}
            onGameSelect={handleGameSelect}
          />
        )}
        {currentStep === 1 && (
          <TypeFieldset
            eventType={eventType}
            onEventTypeChange={setEventType}
            participationMode={participationMode}
            onParticipationModeChange={setParticipationMode}
          />
        )}
        {currentStep === 2 && <FormatFieldset />}
        {currentStep === 3 && (
          <GeneralFieldset
            onSlugStatusChange={handleSlugStatusChange}
            checkSlugAvailability={checkSlugAvailability}
          />
        )}
        {currentStep === 4 && <SettingsFieldset />}
        {currentStep === 5 && participants && onParticipantsChange && (
          <ParticipantsFieldset
            participants={participants}
            onParticipantsChange={onParticipantsChange}
          />
        )}
        {currentStep === 6 &&
          currentUserId &&
          staffMembers &&
          onStaffChange && (
            <StaffFieldset
              currentUserId={currentUserId}
              staffMembers={staffMembers}
              onStaffChange={onStaffChange}
            />
          )}
      </form>
    </FormProvider>
  );
}
