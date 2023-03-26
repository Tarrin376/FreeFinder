-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_customerID_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_reviewerID_fkey";

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_reviewerID_fkey" FOREIGN KEY ("reviewerID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerID_fkey" FOREIGN KEY ("customerID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;
