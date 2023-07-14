/*
  Warnings:

  - Added the required column `jobCategory` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeOfWork` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "JobCategory" AS ENUM ('DevelopmentAndIT', 'DesignAndCreative', 'FinanceAndAccounting', 'AdminAndCustomerSupport', 'EngineeringAndArchitecture', 'SalesAndMarketing', 'WritingAndTranslation', 'Legal');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "jobCategory" "JobCategory" NOT NULL,
ADD COLUMN     "typeOfWork" TEXT NOT NULL;
