/*
  Warnings:

  - A unique constraint covering the columns `[nextLevelID]` on the table `SellerLevel` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "SellerLevel" ADD COLUMN     "nextLevelID" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "SellerLevel_nextLevelID_key" ON "SellerLevel"("nextLevelID");

-- AddForeignKey
ALTER TABLE "SellerLevel" ADD CONSTRAINT "SellerLevel_nextLevelID_fkey" FOREIGN KEY ("nextLevelID") REFERENCES "SellerLevel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
