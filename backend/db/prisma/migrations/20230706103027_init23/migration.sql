/*
  Warnings:

  - Added the required column `summary` to the `Seller` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Seller" ADD COLUMN     "summary" TEXT NOT NULL;
