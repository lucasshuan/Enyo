import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { MATCH_FORMATS } from "@bellona/core";

type TFunction = (
  key: string,
  values?: Record<string, string | number | Date>,
) => string;

export const getAddLeagueSchema = (t: TFunction) => {
  return z
    .object({
      name: z
        .string()
        .min(2, t("nameMin", { count: 2 }))
        .max(50, t("nameMax", { count: 50 })),
      slug: z
        .string()
        .min(2, t("min", { count: 2 }))
        .max(50, t("max", { count: 50 }))
        .regex(/^[a-z0-9_-]+$/, t("slugFormat")),
      description: z
        .string()
        .max(500, t("descMax", { count: 500 }))
        .optional(),
      about: z.string().optional(),
      thumbnailImagePath: z
        .union([z.instanceof(File), z.string()])
        .optional()
        .nullable(),
      allowDraw: z.boolean(),
      gameId: z.string().optional(),
      gameName: z.string().optional(),
      ratingSystem: z.enum(["ELO", "POINTS"]).optional(),
      // Elo fields (optional in base object, required by superRefine)
      initialElo: z.number().min(0).optional(),
      kFactor: z.number().min(1).max(100).optional(),
      scoreRelevance: z.number().min(0).max(1).optional(),
      inactivityDecay: z.number().min(0).optional(),
      inactivityThresholdHours: z.number().min(1).optional(),
      inactivityDecayFloor: z.number().min(0).optional(),
      // Points fields
      pointsPerWin: z.number().min(0).optional(),
      pointsPerDraw: z.number().min(0).optional(),
      pointsPerLoss: z.number().min(0).optional(),
      allowedFormats: z
        .array(z.string())
        .refine(
          (formats) =>
            formats.every((format) =>
              MATCH_FORMATS.includes(format as (typeof MATCH_FORMATS)[number]),
            ),
          t("required"),
        )
        .min(1, t("required")),
      // Event settings
      status: z
        .enum(["PENDING", "REGISTRATION", "ACTIVE", "FINISHED", "CANCELLED"])
        .optional(),
      visibility: z.enum(["PUBLIC", "PRIVATE"]).optional(),
      startDate: z.date().optional().nullable(),
      endDate: z.date().optional().nullable(),
      registrationsEnabled: z.boolean().optional(),
      registrationStartDate: z.date().optional().nullable(),
      registrationEndDate: z.date().optional().nullable(),
      maxParticipants: z.number().int().min(1).optional().nullable(),
      requiresApproval: z.boolean().optional(),
      waitlistEnabled: z.boolean().optional(),
      officialLinks: z
        .array(
          z.object({
            label: z.string().min(1),
            url: z.string().url(t("invalidUrl")),
          }),
        )
        .optional(),
    })
    .superRefine((data, ctx) => {
      if (!data.gameId && !data.gameName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("required"),
          path: ["gameId"],
        });
      }

      if (!data.ratingSystem) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("required"),
          path: ["ratingSystem"],
        });
        return;
      }

      if (data.ratingSystem === "ELO") {
        if (data.initialElo === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("required"),
            path: ["initialElo"],
          });
        }
        if (data.kFactor === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("required"),
            path: ["kFactor"],
          });
        }
        if (data.scoreRelevance === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("required"),
            path: ["scoreRelevance"],
          });
        }
        if (data.inactivityDecay === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("required"),
            path: ["inactivityDecay"],
          });
        }
        if (
          data.inactivityDecay !== undefined &&
          data.inactivityDecay > 0 &&
          data.inactivityThresholdHours === undefined
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("required"),
            path: ["inactivityThresholdHours"],
          });
        }
        if (
          data.inactivityDecay !== undefined &&
          data.inactivityDecay > 0 &&
          data.inactivityDecayFloor === undefined
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("required"),
            path: ["inactivityDecayFloor"],
          });
        }
      } else {
        if (data.pointsPerWin === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("required"),
            path: ["pointsPerWin"],
          });
        }
        if (data.allowDraw && data.pointsPerDraw === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("required"),
            path: ["pointsPerDraw"],
          });
        }
        if (data.pointsPerLoss === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("required"),
            path: ["pointsPerLoss"],
          });
        }
      }
    });
};

export const getEditLeagueSchema = (t: TFunction) => {
  return z
    .object({
      name: z
        .string()
        .min(2, t("nameMin", { count: 2 }))
        .max(50, t("nameMax", { count: 50 })),
      slug: z
        .string()
        .min(2, t("min", { count: 2 }))
        .max(50, t("max", { count: 50 }))
        .regex(/^[a-z0-9_-]+$/, t("slugFormat")),
      description: z
        .string()
        .max(500, t("descMax", { count: 500 }))
        .optional(),
      about: z.string().optional(),
      thumbnailImagePath: z
        .union([z.instanceof(File), z.string()])
        .optional()
        .nullable(),
      allowDraw: z.boolean(),
      ratingSystem: z.enum(["ELO", "POINTS"]),
      // Elo fields
      initialElo: z.number().min(0).optional(),
      kFactor: z.number().min(1).max(100).optional(),
      scoreRelevance: z.number().min(0).max(1).optional(),
      inactivityDecay: z.number().min(0).optional(),
      inactivityThresholdHours: z.number().min(1).optional(),
      inactivityDecayFloor: z.number().min(0).optional(),
      // Points fields
      pointsPerWin: z.number().min(0).optional(),
      pointsPerDraw: z.number().min(0).optional(),
      pointsPerLoss: z.number().min(0).optional(),
      allowedFormats: z
        .array(z.string())
        .refine(
          (formats) =>
            formats.every((format) =>
              MATCH_FORMATS.includes(format as (typeof MATCH_FORMATS)[number]),
            ),
          t("required"),
        )
        .min(1, t("required")),
      // Event settings
      status: z
        .enum(["PENDING", "REGISTRATION", "ACTIVE", "FINISHED", "CANCELLED"])
        .optional(),
      visibility: z.enum(["PUBLIC", "PRIVATE"]).optional(),
      startDate: z.date().optional().nullable(),
      endDate: z.date().optional().nullable(),
      registrationsEnabled: z.boolean().optional(),
      registrationStartDate: z.date().optional().nullable(),
      registrationEndDate: z.date().optional().nullable(),
      maxParticipants: z.number().int().min(1).optional().nullable(),
      requiresApproval: z.boolean().optional(),
      waitlistEnabled: z.boolean().optional(),
      officialLinks: z
        .array(
          z.object({
            label: z.string().min(1),
            url: z.string().url(t("invalidUrl")),
          }),
        )
        .optional(),
    })
    .superRefine((data, ctx) => {
      if (data.ratingSystem === "ELO") {
        if (data.initialElo === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("required"),
            path: ["initialElo"],
          });
        }
        if (data.kFactor === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("required"),
            path: ["kFactor"],
          });
        }
        if (data.scoreRelevance === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("required"),
            path: ["scoreRelevance"],
          });
        }
        if (data.inactivityDecay === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("required"),
            path: ["inactivityDecay"],
          });
        }
        if (
          data.inactivityDecay !== undefined &&
          data.inactivityDecay > 0 &&
          data.inactivityThresholdHours === undefined
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("required"),
            path: ["inactivityThresholdHours"],
          });
        }
        if (
          data.inactivityDecay !== undefined &&
          data.inactivityDecay > 0 &&
          data.inactivityDecayFloor === undefined
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("required"),
            path: ["inactivityDecayFloor"],
          });
        }
      } else {
        if (data.pointsPerWin === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("required"),
            path: ["pointsPerWin"],
          });
        }
        if (data.allowDraw && data.pointsPerDraw === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("required"),
            path: ["pointsPerDraw"],
          });
        }
        if (data.pointsPerLoss === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("required"),
            path: ["pointsPerLoss"],
          });
        }
      }
    });
};

// Hooks para o Cliente
export const useAddLeagueSchema = () => {
  const t = useTranslations("Validations");
  return useMemo(() => getAddLeagueSchema(t), [t]);
};

export const useEditLeagueSchema = () => {
  const t = useTranslations("Validations");
  return useMemo(() => getEditLeagueSchema(t), [t]);
};

// Tipagem "Achatada" para o react-hook-form não reclamar das uniões
export type AddLeagueValues = z.infer<ReturnType<typeof getAddLeagueSchema>>;
export type EditLeagueValues = z.infer<ReturnType<typeof getEditLeagueSchema>>;

// Subset used by shared fieldsets (GeneralFieldset, SettingsFieldset)
export type EventSharedFormValues = Pick<
  AddLeagueValues,
  | "name"
  | "slug"
  | "description"
  | "about"
  | "thumbnailImagePath"
  | "officialLinks"
  | "status"
  | "visibility"
  | "startDate"
  | "endDate"
  | "registrationsEnabled"
  | "registrationStartDate"
  | "registrationEndDate"
  | "maxParticipants"
  | "requiresApproval"
  | "waitlistEnabled"
>;

export const LEAGUE_DEFAULT_SETTINGS = {
  initialElo: 1000,
  kFactor: 20,
  scoreRelevance: 0,
  inactivityDecay: 0,
  inactivityThresholdHours: 120,
  inactivityDecayFloor: 1000,
  pointsPerWin: 3,
  pointsPerDraw: 1,
  pointsPerLoss: 0,
  allowedFormats: ["ONE_V_ONE"] as const,
  status: "DRAFT" as const,
  visibility: "PUBLIC" as const,
  registrationsEnabled: false,
  requiresApproval: false,
  waitlistEnabled: false,
} as const;
