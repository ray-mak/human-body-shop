"use server"

import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"

type ResponseData = {
  error?: string
  data?: {
    id: string
    startDate: Date
    endDate: Date
  }[]
}

export default async function getMultipleDaysOff(): Promise<ResponseData> {
  const { userId } = auth()
  if (!userId) {
    return { error: "User not found" }
  }

  const multipleDaysOff = await db.extendedTimeOff.findMany({
    where: { staffId: userId },
    orderBy: { startDate: "asc" },
  })

  if (!multipleDaysOff) {
    return { error: "No multiple days off found" }
  }

  return { data: multipleDaysOff }
}
