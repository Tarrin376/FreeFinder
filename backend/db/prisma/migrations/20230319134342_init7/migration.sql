/*
  Warnings:

  - The primary key for the `SavedPost` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userID` on the `SavedPost` table. All the data in the column will be lost.
  - Added the required column `username` to the `SavedPost` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SavedPost" DROP CONSTRAINT "SavedPost_userID_fkey";

-- AlterTable
ALTER TABLE "SavedPost" DROP CONSTRAINT "SavedPost_pkey",
DROP COLUMN "userID",
ADD COLUMN     "username" TEXT NOT NULL,
ADD CONSTRAINT "SavedPost_pkey" PRIMARY KEY ("username", "postID");

-- AddForeignKey
ALTER TABLE "SavedPost" ADD CONSTRAINT "SavedPost_username_fkey" FOREIGN KEY ("username") REFERENCES "User"("username") ON DELETE CASCADE ON UPDATE CASCADE;
