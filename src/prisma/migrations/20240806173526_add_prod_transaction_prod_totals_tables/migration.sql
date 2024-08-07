-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('MILK', 'MEAT', 'DUNG', 'LIQUIDMANURE');

-- CreateTable
CREATE TABLE "ProductionTransaction" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "productType" "ProductType" NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "consumer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductionTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductionTotals" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "productType" "ProductType" NOT NULL,
    "totalQuantity" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "pricePerUnit" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductionTotals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProductionTransaction_farmId_idx" ON "ProductionTransaction"("farmId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductionTotals_farmId_productType_key" ON "ProductionTotals"("farmId", "productType");

-- AddForeignKey
ALTER TABLE "ProductionTransaction" ADD CONSTRAINT "ProductionTransaction_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionTotals" ADD CONSTRAINT "ProductionTotals_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
