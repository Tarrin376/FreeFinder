/*
  Warnings:

  - Added the required column `sellerLevelID` to the `Seller` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Seller" ADD COLUMN     "sellerLevelID" TEXT NOT NULL,
ADD COLUMN     "sellerXP" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "SellerLevel" (
    "id" TEXT NOT NULL,
    "xpRequired" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "SellerLevel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Seller" ADD CONSTRAINT "Seller_sellerLevelID_fkey" FOREIGN KEY ("sellerLevelID") REFERENCES "SellerLevel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
