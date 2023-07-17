/*
  Warnings:

  - You are about to drop the `_FoundHelpful` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_FoundHelpful" DROP CONSTRAINT "_FoundHelpful_A_fkey";

-- DropForeignKey
ALTER TABLE "_FoundHelpful" DROP CONSTRAINT "_FoundHelpful_B_fkey";

-- DropTable
DROP TABLE "_FoundHelpful";

-- CreateTable
CREATE TABLE "HelpfulReview" (
    "userID" TEXT NOT NULL,
    "reviewID" TEXT NOT NULL,

    CONSTRAINT "HelpfulReview_pkey" PRIMARY KEY ("userID","reviewID")
);

-- AddForeignKey
ALTER TABLE "HelpfulReview" ADD CONSTRAINT "HelpfulReview_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HelpfulReview" ADD CONSTRAINT "HelpfulReview_reviewID_fkey" FOREIGN KEY ("reviewID") REFERENCES "Review"("reviewID") ON DELETE CASCADE ON UPDATE CASCADE;
