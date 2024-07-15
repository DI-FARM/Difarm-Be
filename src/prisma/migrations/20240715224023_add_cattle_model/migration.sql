-- CreateEnum
CREATE TYPE "CattleStatus" AS ENUM ('HEALTHY', 'SICK', 'SOLD');

-- CreateTable
CREATE TABLE "Cattle" (
    "id" TEXT NOT NULL,
    "tagNumber" TEXT NOT NULL,
    "breed" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "DOB" TIMESTAMP(3) NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "status" "CattleStatus" NOT NULL,
    "location" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "lastCheckupDate" TIMESTAMP(3),
    "vaccineHistory" TEXT,
    "purchaseDate" TIMESTAMP(3),
    "price" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cattle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cattle_tagNumber_key" ON "Cattle"("tagNumber");

-- CreateIndex
CREATE INDEX "Cattle_farmId_idx" ON "Cattle"("farmId");

-- CreateIndex
CREATE INDEX "Farm_ownerId_idx" ON "Farm"("ownerId");

-- AddForeignKey
ALTER TABLE "Cattle" ADD CONSTRAINT "Cattle_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
