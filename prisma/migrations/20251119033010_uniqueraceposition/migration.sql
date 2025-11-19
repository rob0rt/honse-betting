/*
  Warnings:

  - A unique constraint covering the columns `[raceId,position]` on the table `RaceHorse` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RaceHorse_raceId_position_key" ON "RaceHorse"("raceId", "position");
