-- CreateEnum
CREATE TYPE "BirthOrign" AS ENUM ('OnFarm', 'Purchased');

-- AlterTable
ALTER TABLE "Cattle" ADD COLUMN     "birthOrigin" "BirthOrign",
ADD COLUMN     "motherId" TEXT,
ADD COLUMN     "previousOwner" TEXT;

-- AddForeignKey
ALTER TABLE "Cattle" ADD CONSTRAINT "Cattle_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES "Cattle"("id") ON DELETE SET NULL ON UPDATE CASCADE;
