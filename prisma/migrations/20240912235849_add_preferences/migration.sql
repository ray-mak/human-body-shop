-- DropForeignKey
ALTER TABLE "ExtendedTimeOff" DROP CONSTRAINT "ExtendedTimeOff_staffId_fkey";

-- CreateTable
CREATE TABLE "StaffPreferences" (
    "id" TEXT NOT NULL,
    "interval" INTEGER NOT NULL DEFAULT 30,
    "maxDays" INTEGER DEFAULT 7,
    "staffId" TEXT NOT NULL,

    CONSTRAINT "StaffPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StaffPreferences_staffId_key" ON "StaffPreferences"("staffId");

-- AddForeignKey
ALTER TABLE "ExtendedTimeOff" ADD CONSTRAINT "ExtendedTimeOff_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("clerkStaffId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffPreferences" ADD CONSTRAINT "StaffPreferences_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("clerkStaffId") ON DELETE CASCADE ON UPDATE CASCADE;
