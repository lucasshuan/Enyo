-- AlterTable
ALTER TABLE "users" ADD COLUMN     "onboarding_completed" BOOLEAN NOT NULL DEFAULT false;

-- Mark all existing users as onboarding-completed (they already have profiles)
UPDATE "users" SET "onboarding_completed" = true WHERE "onboarding_completed" = false;
