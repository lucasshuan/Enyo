/*
  Warnings:

  - You are about to drop the column `event_id` on the `tournament_phases` table. All the data in the column will be lost.
  - Added the required column `tournament_id` to the `tournament_phases` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EventVisibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- DropForeignKey
ALTER TABLE "tournament_phases" DROP CONSTRAINT "tournament_phases_event_id_fkey";

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "max_participants" INTEGER,
ADD COLUMN     "official_links" JSONB,
ADD COLUMN     "registrations_enabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "visibility" "EventVisibility" NOT NULL DEFAULT 'PUBLIC';

-- AlterTable
ALTER TABLE "tournament_phases" DROP COLUMN "event_id",
ADD COLUMN     "tournament_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "tournaments" (
    "event_id" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "custom_field_schema" JSONB,

    CONSTRAINT "tournaments_pkey" PRIMARY KEY ("event_id")
);

-- AddForeignKey
ALTER TABLE "tournaments" ADD CONSTRAINT "tournaments_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournament_phases" ADD CONSTRAINT "tournament_phases_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("event_id") ON DELETE CASCADE ON UPDATE CASCADE;
