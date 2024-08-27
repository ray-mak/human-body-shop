/*
  Warnings:

  - You are about to drop the column `therapistId` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the `Therapist` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `staffId` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_therapistId_fkey";

-- DropIndex
DROP INDEX "therapistId";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "therapistId",
ADD COLUMN     "staffId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Therapist";

-- CreateTable
CREATE TABLE "Staff" (
    "id" TEXT NOT NULL,
    "clerkStaffId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Staff_clerkStaffId_key" ON "Staff"("clerkStaffId");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_email_key" ON "Staff"("email");

-- CreateIndex
CREATE INDEX "staffId" ON "Appointment"("staffId");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("clerkStaffId") ON DELETE CASCADE ON UPDATE CASCADE;
