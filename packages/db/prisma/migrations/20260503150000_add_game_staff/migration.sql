-- Add GameStaff: granular admin/moderation roles for games.
-- Capability keys mirror GAME_STAFF_CAPABILITIES in @bellona/core:
-- MANAGE_DETAILS, MANAGE_EVENTS, MANAGE_STAFF.

CREATE TABLE "game_staff" (
    "id" TEXT NOT NULL,
    "game_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "capabilities" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "is_full_access" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "game_staff_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "game_staff_game_id_user_id_key" ON "game_staff"("game_id", "user_id");

ALTER TABLE "game_staff"
  ADD CONSTRAINT "game_staff_game_id_fkey"
  FOREIGN KEY ("game_id") REFERENCES "games"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "game_staff"
  ADD CONSTRAINT "game_staff_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
