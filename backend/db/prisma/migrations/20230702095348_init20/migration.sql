-- AlterTable
ALTER TABLE "Seller" ADD COLUMN     "languages" TEXT[] DEFAULT ARRAY[]::TEXT[];
