-- CreateIndex
CREATE INDEX "inseminations_cattleId_idx" ON "inseminations"("cattleId");

-- CreateIndex
CREATE INDEX "inseminations_vetId_idx" ON "inseminations"("vetId");

-- CreateIndex
CREATE INDEX "vaccinations_cattleId_idx" ON "vaccinations"("cattleId");

-- CreateIndex
CREATE INDEX "vaccinations_vetId_idx" ON "vaccinations"("vetId");

-- AddForeignKey
ALTER TABLE "vaccinations" ADD CONSTRAINT "vaccinations_cattleId_fkey" FOREIGN KEY ("cattleId") REFERENCES "Cattle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inseminations" ADD CONSTRAINT "inseminations_cattleId_fkey" FOREIGN KEY ("cattleId") REFERENCES "Cattle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
