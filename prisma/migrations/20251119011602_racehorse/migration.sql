/*
  Warnings:

  - Added the required column `date` to the `Race` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Race" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Horse" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Horse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RaceHorse" (
    "raceId" INTEGER NOT NULL,
    "horseId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "RaceHorse_pkey" PRIMARY KEY ("raceId","horseId")
);

-- CreateIndex
CREATE INDEX "RaceHorse_raceId_idx" ON "RaceHorse"("raceId");

-- AddForeignKey
ALTER TABLE "RaceHorse" ADD CONSTRAINT "RaceHorse_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RaceHorse" ADD CONSTRAINT "RaceHorse_horseId_fkey" FOREIGN KEY ("horseId") REFERENCES "Horse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
