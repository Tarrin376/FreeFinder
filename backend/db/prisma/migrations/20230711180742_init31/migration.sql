/*
  Warnings:

  - A unique constraint covering the columns `[cloudinaryID]` on the table `PostImage` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PostImage_cloudinaryID_key" ON "PostImage"("cloudinaryID");
