-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "numReviews" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "postPostID" TEXT;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_postPostID_fkey" FOREIGN KEY ("postPostID") REFERENCES "Post"("postID") ON DELETE SET NULL ON UPDATE CASCADE;
