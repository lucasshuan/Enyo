"use client";

import { useTransition, useState, useEffect, useCallback } from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useAddLeagueSchema,
  type AddLeagueValues,
  LEAGUE_DEFAULT_SETTINGS,
} from "@/schemas/league";
import { createLeague, checkLeagueSlugAvailability } from "@/actions/game";
import { type SimpleGame } from "@/actions/get-games";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { GameSearchFieldset } from "./fieldsets/game-fieldset";
import { TypeFieldset } from "./fieldsets/type-fieldset";
import { FormatFieldset } from "./fieldsets/format-fieldset";
import { GeneralFieldset } from "./fieldsets/general-fieldset";
import { SettingsFieldset } from "./fieldsets/settings-fieldset";
import { StaffFieldset, type StaffMember } from "./fieldsets/staff-fieldset";
import {
  ParticipantsFieldset,
  type ParticipantEntry,
} from "./fieldsets/participants-fieldset";

export type AddEventSuccessData = {
  gameSlug?: string;
  eventSlug: string;
};

interface AddEventFormProps {
  gameId: string;
  onSuccess: (data: AddEventSuccessData) => void;
  onLoadingChange?: (loading: boolean) => void;
  onValidationChange?: (isValid: boolean) => void;
  onStepValidationChange?: (isValid: boolean) => void;
  formId: string;
  currentStep: number;
  initialGame?: SimpleGame;
  isGameFixed?: boolean;
  currentUserId?: string;
  staffMembers?: StaffMember[];
  onStaffChange?: (members: StaffMember[]) => void;
  participants?: ParticipantEntry[];
  onParticipantsChange?: (participants: ParticipantEntry[]) => void;
}

export function AddEventForm({
  gameId,
  onSuccess,
  onLoadingChange,
  onValidationChange,
  onStepValidationChange,
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
  const [selectedGameSlug, setSelectedGameSlug] = useState<string | undefined>(
    initialGame?.slug,
  );

  const handleGameSelect = useCallback((game: SimpleGame | null) => {
    setSelectedGameSlug(game?.slug);
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
      registrationStartDate: null,
      registrationEndDate: null,
      maxParticipants: null,
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
      valid = true; // participants step — optional
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
    isSlugChecking,
    hasSlugConflict,
    allowedFormats.length,
    getValues,
    schema,
    onStepValidationChange,
  ]);

  const onSubmit = async (values: AddLeagueValues) => {
    if (isSlugChecking || hasSlugConflict) return;

    startTransition(async () => {
      const isElo = values.ratingSystem === "ELO";

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
        registrationStartDate: values.registrationStartDate ?? null,
        registrationEndDate: values.registrationEndDate ?? null,
        maxParticipants: values.maxParticipants ?? null,
        officialLinks:
          values.officialLinks && values.officialLinks.length > 0
            ? values.officialLinks
            : null,
        classificationSystem: isElo ? "ELO" : "POINTS",
        allowDraw: values.allowDraw,
        allowedFormats: values.allowedFormats,
        config,
        staff: staffMembers
          ?.filter((m) => m.userId !== currentUserId)
          .map(({ userId, role }) => ({ userId, role })),
        participants: participants?.map(({ displayName, linkedUser }) => ({
          displayName,
          userId: linkedUser?.userId,
        })),
      });

      if (result.success) {
        toast.success(t("success"));
        onSuccess({
          gameSlug: selectedGameSlug,
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
            gameId={gameId}
            initialGame={initialGame}
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
        {currentStep === 2 && (
          <FormatFieldset />
        )}
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
