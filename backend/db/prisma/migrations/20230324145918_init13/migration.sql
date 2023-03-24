/*
  Warnings:

  - You are about to drop the column `postPostID` on the `Review` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_postPostID_fkey";

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "postPostID",
ADD COLUMN     "postID" TEXT;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_postID_fkey" FOREIGN KEY ("postID") REFERENCES "Post"("postID") ON DELETE SET NULL ON UPDATE CASCADE;
