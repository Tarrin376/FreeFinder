/*
  Warnings:

  - You are about to drop the column `isThumbnail` on the `PostImage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PostImage" DROP COLUMN "isThumbnail",
ADD COLUMN     "imageNum" INTEGER NOT NULL DEFAULT 0;
