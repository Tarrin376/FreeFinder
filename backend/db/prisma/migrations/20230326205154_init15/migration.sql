/*
  Warnings:

  - Changed the type of `deliveryTime` on the `Package` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Package" DROP COLUMN "deliveryTime",
ADD COLUMN     "deliveryTime" INTEGER NOT NULL,
ALTER COLUMN "revisions" SET DATA TYPE TEXT;
