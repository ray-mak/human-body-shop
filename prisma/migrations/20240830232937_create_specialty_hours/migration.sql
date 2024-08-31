-- CreateTable
CREATE TABLE "SpecialAvailability" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "isFullDayOff" BOOLEAN NOT NULL,

    CONSTRAINT "SpecialAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "specialAvailability_staffId" ON "SpecialAvailability"("staffId");

-- CreateIndex
CREATE INDEX "availability_staffId" ON "Availability"("staffId");

-- AddForeignKey
ALTER TABLE "SpecialAvailability" ADD CONSTRAINT "SpecialAvailability_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("clerkStaffId") ON DELETE CASCADE ON UPDATE CASCADE;
