/*
  Warnings:

  - Added the required column `packageTitle` to the `Package` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Package" ADD COLUMN     "packageTitle" TEXT NOT NULL;
