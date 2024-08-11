/*
  Warnings:

  - Added the required column `type` to the `Stock` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StockType" AS ENUM ('FOOD', 'MEDICATION', 'CONSTRUCTION', 'WATER', 'FEED_ACCESSORIES', 'HYGIENE_MATERIALS');

-- AlterTable
ALTER TABLE "Stock" ADD COLUMN     "type" "StockType" NOT NULL DEFAULT 'FOOD';

-- CreateTable
CREATE TABLE "vaccinations" (
    "id" TEXT NOT NULL,
    "cattleId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "vaccineType" TEXT NOT NULL,
    "vetId" TEXT,

    CONSTRAINT "vaccinations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "veterinarians" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "veterinarians_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inseminations" (
    "id" TEXT NOT NULL,
    "cattleId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "method" TEXT NOT NULL,
    "vetId" TEXT,

    CONSTRAINT "inseminations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "veterinarians_email_key" ON "veterinarians"("email");

-- AddForeignKey
ALTER TABLE "vaccinations" ADD CONSTRAINT "vaccinations_vetId_fkey" FOREIGN KEY ("vetId") REFERENCES "veterinarians"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inseminations" ADD CONSTRAINT "inseminations_vetId_fkey" FOREIGN KEY ("vetId") REFERENCES "veterinarians"("id") ON DELETE SET NULL ON UPDATE CASCADE;
