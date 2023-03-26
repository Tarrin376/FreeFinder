-- CreateEnum
CREATE TYPE "PackageType" AS ENUM ('BASIC', 'STANDARD', 'SUPERIOR');

-- CreateTable
CREATE TABLE "Package" (
    "postID" TEXT NOT NULL,
    "deliveryTime" TIMESTAMP(3) NOT NULL,
    "revisions" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "type" "PackageType" NOT NULL,

    CONSTRAINT "Package_pkey" PRIMARY KEY ("postID","type")
);

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_postID_fkey" FOREIGN KEY ("postID") REFERENCES "Post"("postID") ON DELETE CASCADE ON UPDATE CASCADE;
