-- AlterTable
ALTER TABLE "Seller" ADD COLUMN     "skills" TEXT[] DEFAULT ARRAY[]::TEXT[];
