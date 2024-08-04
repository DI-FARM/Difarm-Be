-- AlterTable
ALTER TABLE "inseminations" ADD COLUMN     "farmId" TEXT;

-- AlterTable
ALTER TABLE "vaccinations" ADD COLUMN     "farmId" TEXT;

-- AlterTable
ALTER TABLE "veterinarians" ADD COLUMN     "farmId" TEXT;

-- CreateIndex
CREATE INDEX "inseminations_farmId_idx" ON "inseminations"("farmId");

-- CreateIndex
CREATE INDEX "vaccinations_farmId_idx" ON "vaccinations"("farmId");

-- CreateIndex
CREATE INDEX "veterinarians_farmId_idx" ON "veterinarians"("farmId");

-- AddForeignKey
ALTER TABLE "vaccinations" ADD CONSTRAINT "vaccinations_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "veterinarians" ADD CONSTRAINT "veterinarians_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inseminations" ADD CONSTRAINT "inseminations_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE SET NULL ON UPDATE CASCADE;
