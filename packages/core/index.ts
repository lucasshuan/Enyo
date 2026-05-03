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
  "REGISTRATION",
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

/**
 * Granular capabilities a staff member can hold for an event.
 *
 * Staff with `isFullAccess` bypass these checks entirely (treated as owners).
 * Otherwise, each capability gates a specific surface:
 * - MANAGE_DETAILS: edit event metadata, descriptions, dates, official links
 * - MANAGE_PARTICIPANTS: manage entries, registrations, claims, approvals
 * - MANAGE_MATCHES: schedule, edit and record outcomes of matches
 * - MANAGE_STAFF: add/remove staff and edit their capabilities
 */
export const EVENT_STAFF_CAPABILITIES = [
  "MANAGE_DETAILS",
  "MANAGE_PARTICIPANTS",
  "MANAGE_MATCHES",
  "MANAGE_STAFF",
] as const;
export type EventStaffCapability = (typeof EVENT_STAFF_CAPABILITIES)[number];

export function hasEventStaffCapability(
  staff: { capabilities: readonly string[]; isFullAccess: boolean } | null | undefined,
  capability: EventStaffCapability,
): boolean {
  if (!staff) return false;
  if (staff.isFullAccess) return true;
  return staff.capabilities.includes(capability);
}

/**
 * Granular capabilities a staff member can hold for a game.
 *
 * Staff with `isFullAccess` bypass these checks entirely (treated as owners).
 * Otherwise, each capability gates a specific surface:
 * - MANAGE_DETAILS: edit game metadata, descriptions, images, links
 * - MANAGE_EVENTS: moderate events created under the game
 * - MANAGE_STAFF: add/remove staff and edit their capabilities
 */
export const GAME_STAFF_CAPABILITIES = [
  "MANAGE_DETAILS",
  "MANAGE_EVENTS",
  "MANAGE_STAFF",
] as const;
export type GameStaffCapability = (typeof GAME_STAFF_CAPABILITIES)[number];

export function hasGameStaffCapability(
  staff: { capabilities: readonly string[]; isFullAccess: boolean } | null | undefined,
  capability: GameStaffCapability,
): boolean {
  if (!staff) return false;
  if (staff.isFullAccess) return true;
  return staff.capabilities.includes(capability);
}

export const CLAIM_INITIATORS = ["STAFF", "USER"] as const;
export type ClaimInitiator = (typeof CLAIM_INITIATORS)[number];

export const ENTRY_CLAIM_STATUSES = [
  "PENDING",
  "ACCEPTED",
  "REJECTED",
] as const;
export type EntryClaimStatus = (typeof ENTRY_CLAIM_STATUSES)[number];

export const ENTRY_STATUSES = [
  "CONFIRMED",
  "PENDING_APPROVAL",
  "WAITLISTED",
  "REJECTED",
] as const;
export type EntryStatus = (typeof ENTRY_STATUSES)[number];
