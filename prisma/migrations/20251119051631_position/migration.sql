/*
  Warnings:

  - You are about to drop the column `position` on the `RaceHorse` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[raceId,saddleNumber]` on the table `RaceHorse` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `saddleNumber` to the `RaceHorse` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "RaceHorse_raceId_position_key";

-- AlterTable
ALTER TABLE "RaceHorse" DROP COLUMN "position",
ADD COLUMN     "place" INTEGER,
ADD COLUMN     "saddleNumber" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "RaceHorse_raceId_saddleNumber_key" ON "RaceHorse"("raceId", "saddleNumber");
