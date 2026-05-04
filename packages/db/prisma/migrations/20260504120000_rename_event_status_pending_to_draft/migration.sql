-- Rename EventStatus enum value PENDING → DRAFT
ALTER TYPE "EventStatus" RENAME VALUE 'PENDING' TO 'DRAFT';

-- Drop the approvedAt column (events no longer require approval)
ALTER TABLE "events" DROP COLUMN IF EXISTS "approved_at";
