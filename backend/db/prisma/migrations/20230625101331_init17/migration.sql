/*
  Warnings:

  - The primary key for the `PostImage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `PostImage` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnailPostID` on the `PostImage` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_postID_fkey";

-- DropIndex
DROP INDEX "PostImage_thumbnailPostID_key";

-- AlterTable
ALTER TABLE "PostImage" DROP CONSTRAINT "PostImage_pkey",
DROP COLUMN "id",
DROP COLUMN "thumbnailPostID",
ADD COLUMN     "isThumbnail" BOOLEAN NOT NULL DEFAULT false,
ADD CONSTRAINT "PostImage_pkey" PRIMARY KEY ("postID", "url");
