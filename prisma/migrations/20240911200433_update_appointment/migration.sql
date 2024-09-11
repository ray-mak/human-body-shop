/*
  Warnings:

  - Made the column `serviceType` on table `Appointment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userNote` on table `Appointment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `clientDuration` on table `Appointment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `totalDuration` on table `Appointment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Appointment" ALTER COLUMN "serviceType" SET NOT NULL,
ALTER COLUMN "userNote" SET NOT NULL,
ALTER COLUMN "clientDuration" SET NOT NULL,
ALTER COLUMN "totalDuration" SET NOT NULL;
