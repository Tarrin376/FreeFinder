/*
  Warnings:

  - Added the required column `sellerCommunication` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceAsDescribed` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceDelivery` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "sellerCommunication" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "serviceAsDescribed" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "serviceDelivery" DOUBLE PRECISION NOT NULL;
