/*
  Warnings:

  - You are about to drop the column `jobCategory` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `typeOfWork` on the `Post` table. All the data in the column will be lost.
  - Added the required column `workTypeID` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "jobCategory",
DROP COLUMN "typeOfWork",
ADD COLUMN     "workTypeID" TEXT NOT NULL;

-- DropEnum
DROP TYPE "JobCategory";

-- CreateTable
CREATE TABLE "JobCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "JobCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "jobCategoryID" TEXT NOT NULL,

    CONSTRAINT "WorkType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JobCategory_name_key" ON "JobCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "WorkType_name_key" ON "WorkType"("name");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_workTypeID_fkey" FOREIGN KEY ("workTypeID") REFERENCES "WorkType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkType" ADD CONSTRAINT "WorkType_jobCategoryID_fkey" FOREIGN KEY ("jobCategoryID") REFERENCES "JobCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
