/*
  Warnings:

  - You are about to drop the column `image_url` on the `event_entries` table. All the data in the column will be lost.
  - You are about to drop the column `background_image_url` on the `games` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnail_image_url` on the `games` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `team_members` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "event_entries" DROP COLUMN "image_url",
ADD COLUMN     "image_path" TEXT;

-- AlterTable
ALTER TABLE "games" DROP COLUMN "background_image_url",
DROP COLUMN "thumbnail_image_url",
ADD COLUMN     "background_image_path" TEXT,
ADD COLUMN     "thumbnail_image_path" TEXT;

-- AlterTable
ALTER TABLE "team_members" DROP COLUMN "image_url",
ADD COLUMN     "image_path" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "image_url",
ADD COLUMN     "image_path" TEXT;
