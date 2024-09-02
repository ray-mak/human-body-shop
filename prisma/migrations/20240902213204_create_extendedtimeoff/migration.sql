-- CreateTable
CREATE TABLE "ExtendedTimeOff" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "staffId" TEXT NOT NULL,

    CONSTRAINT "ExtendedTimeOff_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "extendedTimeOff_staffId" ON "ExtendedTimeOff"("staffId");

-- AddForeignKey
ALTER TABLE "ExtendedTimeOff" ADD CONSTRAINT "ExtendedTimeOff_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("clerkStaffId") ON DELETE RESTRICT ON UPDATE CASCADE;
