"use server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

type AvailabilityResult = {
  error?: string
  availabilities?: AvailibilityData[]
}

type AvailibilityData = {
  day: string
  availibility: TimeData[]
}

type TimeData = {
  start: string
  end: string
}

export default async function getAvailabilities(): Promise<AvailabilityResult> {
  const { userId } = auth()

  if (!userId) {
    return { error: "User not found" }
  }

  const availabilities = await db.availability.findMany({
    where: {
      staffId: userId,
    },
  })

  if (!availabilities) {
    return { error: "No availabilities found" }
  }

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ]

  const formattedData: AvailibilityData[] = days.map((day) => ({
    day,
    availibility: [],
  }))

  availabilities.forEach(({ dayOfWeek, startTime, endTime }) => {
    const day = days[dayOfWeek]

    const dayEntry = formattedData.find((entry) => entry.day === day)
    if (dayEntry) {
      dayEntry.availibility.push({
        start: startTime,
        end: endTime,
      })
    }
  })

  formattedData.forEach((dayEntry) => {
    dayEntry.availibility.sort((a, b) => {
      if (a.start < b.start) {
        return -1
      } else {
        return 1
      }
    })
  })

  return { availabilities: formattedData }
}
