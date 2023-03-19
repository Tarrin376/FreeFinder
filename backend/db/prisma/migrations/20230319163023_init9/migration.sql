/*
  Warnings:

  - The primary key for the `SavedPost` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `username` on the `SavedPost` table. All the data in the column will be lost.
  - Added the required column `userID` to the `SavedPost` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SavedPost" DROP CONSTRAINT "SavedPost_username_fkey";

-- AlterTable
ALTER TABLE "SavedPost" DROP CONSTRAINT "SavedPost_pkey",
DROP COLUMN "username",
ADD COLUMN     "userID" TEXT NOT NULL,
ADD CONSTRAINT "SavedPost_pkey" PRIMARY KEY ("userID", "postID");

-- AddForeignKey
ALTER TABLE "SavedPost" ADD CONSTRAINT "SavedPost_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE CASCADE ON UPDATE CASCADE;
