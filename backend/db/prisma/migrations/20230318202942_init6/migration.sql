-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_customerID_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_sellerID_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_reviewerID_fkey";

-- DropForeignKey
ALTER TABLE "SavedPost" DROP CONSTRAINT "SavedPost_postID_fkey";

-- DropForeignKey
ALTER TABLE "SavedPost" DROP CONSTRAINT "SavedPost_userID_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_userID_fkey";

-- AddForeignKey
ALTER TABLE "Seller" ADD CONSTRAINT "Seller_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedPost" ADD CONSTRAINT "SavedPost_postID_fkey" FOREIGN KEY ("postID") REFERENCES "Post"("postID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedPost" ADD CONSTRAINT "SavedPost_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_sellerID_fkey" FOREIGN KEY ("sellerID") REFERENCES "Seller"("sellerID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_reviewerID_fkey" FOREIGN KEY ("reviewerID") REFERENCES "User"("userID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerID_fkey" FOREIGN KEY ("customerID") REFERENCES "User"("userID") ON DELETE CASCADE ON UPDATE CASCADE;
