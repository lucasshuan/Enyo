export const PERMISSION_KEYS = [
  "manage_games",
  "manage_events",
  "manage_users",
] as const;

export type PermissionKey = (typeof PERMISSION_KEYS)[number];

export const GAME_STATUSES = ["APPROVED", "PENDING"] as const;
export type GameStatus = (typeof GAME_STATUSES)[number];

export const EVENT_STATUSES = [
  "PENDING",
  "ACTIVE",
  "FINISHED",
  "CANCELLED",
] as const;
export type EventStatus = (typeof EVENT_STATUSES)[number];

export const EVENT_VISIBILITIES = ["PUBLIC", "PRIVATE"] as const;
export type EventVisibility = (typeof EVENT_VISIBILITIES)[number];

export const EVENT_TYPES = ["LEAGUE", "TOURNAMENT"] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export const CLASSIFICATION_SYSTEMS = ["ELO", "POINTS"] as const;
export type ClassificationSystem = (typeof CLASSIFICATION_SYSTEMS)[number];

export const PHASE_TYPES = [
  "ROUND_ROBIN",
  "ELO_RATING",
  "SWISS",
  "SINGLE_ELIMINATION",
  "DOUBLE_ELIMINATION",
  "GROUP_STAGE",
] as const;
export type PhaseType = (typeof PHASE_TYPES)[number];

export const MATCH_OUTCOMES = ["WIN", "DRAW", "LOSS"] as const;
export type MatchOutcome = (typeof MATCH_OUTCOMES)[number];

export const ATTACHMENT_TYPES = ["IMAGE", "VIDEO"] as const;
export type AttachmentType = (typeof ATTACHMENT_TYPES)[number];

export const VIDEO_PLATFORMS = ["TWITCH", "YOUTUBE", "OTHER"] as const;
export type VideoPlatform = (typeof VIDEO_PLATFORMS)[number];

export const MATCH_FORMATS = [
  "ONE_V_ONE",
  "TWO_V_TWO",
  "THREE_V_THREE",
  "FOUR_V_FOUR",
  "FIVE_V_FIVE",
  "SIX_V_SIX",
  "FREE_FOR_ALL",
] as const;
export type MatchFormat = (typeof MATCH_FORMATS)[number];

export const PARTICIPATION_MODES = ["SOLO", "TEAM"] as const;
export type ParticipationMode = (typeof PARTICIPATION_MODES)[number];

export const EVENT_STAFF_ROLES = [
  "ORGANIZER",
  "MODERATOR",
  "SCOREKEEPER",
] as const;
export type EventStaffRole = (typeof EVENT_STAFF_ROLES)[number];

export const CLAIM_INITIATORS = ["STAFF", "USER"] as const;
export type ClaimInitiator = (typeof CLAIM_INITIATORS)[number];

export const ENTRY_CLAIM_STATUSES = [
  "PENDING",
  "ACCEPTED",
  "REJECTED",
] as const;
export type EntryClaimStatus = (typeof ENTRY_CLAIM_STATUSES)[number];
