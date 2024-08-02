-- CreateEnum
CREATE TYPE "WasteType" AS ENUM ('DUNG', 'LIQUIDMANURE');

-- CreateTable
CREATE TABLE "WastesLog" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "type" "WasteType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WastesLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WastesLog_farmId_idx" ON "WastesLog"("farmId");

-- AddForeignKey
ALTER TABLE "WastesLog" ADD CONSTRAINT "WastesLog_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
