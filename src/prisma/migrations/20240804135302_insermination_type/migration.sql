/*
  Warnings:

  - Added the required column `type` to the `inseminations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "inseminations" ADD COLUMN     "type" TEXT NOT NULL;
