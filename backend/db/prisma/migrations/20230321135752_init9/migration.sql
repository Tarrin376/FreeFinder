/*
  Warnings:

  - You are about to drop the column `thumbnailPicURL` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "thumbnailPicURL";

-- CreateTable
CREATE TABLE "PostImage" (
    "imageID" TEXT NOT NULL,
    "postID" TEXT NOT NULL,

    CONSTRAINT "PostImage_pkey" PRIMARY KEY ("imageID")
);

-- AddForeignKey
ALTER TABLE "PostImage" ADD CONSTRAINT "PostImage_postID_fkey" FOREIGN KEY ("postID") REFERENCES "Post"("postID") ON DELETE CASCADE ON UPDATE CASCADE;
