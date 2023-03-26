-- DropForeignKey
ALTER TABLE "Seller" DROP CONSTRAINT "Seller_userID_fkey";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_userID_fkey" FOREIGN KEY ("userID") REFERENCES "Seller"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;
