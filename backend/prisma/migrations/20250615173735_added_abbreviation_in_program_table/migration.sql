/*
  Warnings:

  - A unique constraint covering the columns `[abbreviation]` on the table `program` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `abbreviation` to the `program` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "program" ADD COLUMN     "abbreviation" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "program_abbreviation_key" ON "program"("abbreviation");
