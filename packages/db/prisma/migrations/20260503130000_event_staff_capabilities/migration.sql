-- Switch EventStaff from a single role enum to granular capabilities + isFullAccess flag.
-- Capability keys mirror EVENT_STAFF_CAPABILITIES in @bellona/core:
-- MANAGE_DETAILS, MANAGE_PARTICIPANTS, MANAGE_MATCHES, MANAGE_STAFF.

-- 1. Add new columns with safe defaults.
ALTER TABLE "event_staff"
  ADD COLUMN "capabilities" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "is_full_access" BOOLEAN NOT NULL DEFAULT false;

-- 2. Backfill from the legacy role:
--    ORGANIZER  -> isFullAccess=true (acts as owner)
--    MODERATOR  -> MANAGE_DETAILS, MANAGE_PARTICIPANTS, MANAGE_MATCHES
--    SCOREKEEPER-> MANAGE_MATCHES
UPDATE "event_staff" SET "is_full_access" = true WHERE "role" = 'ORGANIZER';
UPDATE "event_staff"
  SET "capabilities" = ARRAY['MANAGE_DETAILS', 'MANAGE_PARTICIPANTS', 'MANAGE_MATCHES']
  WHERE "role" = 'MODERATOR';
UPDATE "event_staff"
  SET "capabilities" = ARRAY['MANAGE_MATCHES']
  WHERE "role" = 'SCOREKEEPER';

-- 3. Drop the legacy column and the now-unused enum.
ALTER TABLE "event_staff" DROP COLUMN "role";
DROP TYPE "EventStaffRole";
