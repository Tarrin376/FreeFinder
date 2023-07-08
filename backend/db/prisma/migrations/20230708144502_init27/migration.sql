/*
  Warnings:

  - You are about to drop the column `packageTitle` on the `Package` table. All the data in the column will be lost.
  - You are about to drop the column `numReviews` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `numReviews` on the `Seller` table. All the data in the column will be lost.
  - Added the required column `title` to the `Package` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Package" DROP COLUMN "packageTitle",
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "numReviews";

-- AlterTable
ALTER TABLE "Seller" DROP COLUMN "numReviews";
