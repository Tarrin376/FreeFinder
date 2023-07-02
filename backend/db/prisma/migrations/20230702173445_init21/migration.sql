/*
  Warnings:

  - You are about to drop the column `imageNum` on the `PostImage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PostImage" DROP COLUMN "imageNum",
ADD COLUMN     "isThumbnail" BOOLEAN NOT NULL DEFAULT false;
