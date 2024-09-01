"use server"

import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"

type ResData = {
  date: Date
  hours: { start: string; end: string }[]
  isFullDayOff: boolean
  id: string
}

type Response = {
  error?: string
  response?: ResData[]
}

export default async function getSpecialAvailabilities(): Promise<Response> {
  const { userId } = auth()

  if (!userId) {
    return { error: "User not found" }
  }

  const specialAvailabilities = await db.specialAvailability.findMany({
    where: { staffId: userId },
    orderBy: { date: "asc" },
  })

  if (!specialAvailabilities) {
    return { error: "No special availabilities found" }
  }

  const formattedData = specialAvailabilities.reduce<Record<string, ResData>>(
    (acc, availability) => {
      const dateKey = availability.date
      const dateKeyString = dateKey.toISOString().split("T")[0]

      if (!acc[dateKeyString]) {
        acc[dateKeyString] = {
          date: dateKey,
          hours: [],
          isFullDayOff: false,
          id: availability.id,
        }
      }

      if (!availability.isFullDayOff) {
        acc[dateKeyString].hours.push({
          start: availability.startTime,
          end: availability.endTime,
        })
      } else {
        acc[dateKeyString].isFullDayOff = true
        acc[dateKeyString].hours = []
      }

      return acc
    },
    {}
  )
  return { response: Object.values(formattedData) }
}
