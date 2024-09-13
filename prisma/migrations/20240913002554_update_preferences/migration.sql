/*
  Warnings:

  - Made the column `maxDays` on table `StaffPreferences` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "StaffPreferences" ALTER COLUMN "maxDays" SET NOT NULL;
