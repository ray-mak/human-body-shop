/*
  Warnings:

  - You are about to drop the column `role` on the `Therapist` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Therapist" DROP COLUMN "role";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role";
