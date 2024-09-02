"use server"

import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { isSameDay } from "date-fns"

type DaysOffData = {
  start: Date
  end: Date
}
type DaysOffResponse = {
  error?: string
  message?: string
}

export default async function addMultipleDaysOff(
  data: DaysOffData
): Promise<DaysOffResponse> {
  const { userId } = auth()
  if (!userId) {
    return { error: "User not found" }
  }

  if (!data.start || !data.end) {
    return { error: "Dates cannot be empty" }
  }

  if (isSameDay(data.start, data.end)) {
    return { error: "Start and end dates cannot be the same" }
  }

  try {
    await db.extendedTimeOff.create({
      data: {
        startDate: data.start,
        endDate: data.end,
        staffId: userId,
      },
    })

    return { message: "Time off added " }
  } catch (error) {
    console.error(error)
    return { error: "Error adding time off" }
  }
}
