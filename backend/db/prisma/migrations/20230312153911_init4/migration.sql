/*
  Warnings:

  - Made the column `profilePicURL` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "profilePicURL" SET NOT NULL,
ALTER COLUMN "profilePicURL" SET DEFAULT '';
