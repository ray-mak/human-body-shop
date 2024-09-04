"use server"

import { db } from "@/lib/db"

type WeeklyAvalability = {
  day: string
  dayOfWeek: number
  availibility: TimeData[]
}

type TimeData = {
  start: string
  end: string
}

type SpecialAvailability = {
  date: Date
  hours: { start: string; end: string }[]
  isFullDayOff: boolean
  id: string
}

type MultiDayOff = {
  id: string
  startDate: Date
  endDate: Date
}

type ResponseData = {
  error?: string
  data?: {
    weeklyAvailabilities: WeeklyAvalability[]
    multipleDaysOff: MultiDayOff[]
    specialAvailabilities: SpecialAvailability[]
  }
}

export default async function getAllAvailabilities(
  staffId: string
): Promise<ResponseData> {
  if (!staffId) {
    return { error: "Staff ID required" }
  }

  const weeklyAvailabilities = await db.availability.findMany({
    where: {
      staffId,
    },
  })

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ]

  const formattedWeeklyAvailabilities: WeeklyAvalability[] = days.map(
    (day, index) => ({
      day,
      availibility: [],
      dayOfWeek: index,
    })
  )

  weeklyAvailabilities.forEach(({ dayOfWeek, startTime, endTime }) => {
    const day = days[dayOfWeek]

    const dayEntry = formattedWeeklyAvailabilities.find(
      (entry) => entry.day === day
    )
    if (dayEntry) {
      dayEntry.availibility.push({
        start: startTime,
        end: endTime,
      })
    }
  })

  formattedWeeklyAvailabilities.forEach((dayEntry) => {
    dayEntry.availibility.sort((a, b) => {
      if (a.start < b.start) {
        return -1
      } else {
        return 1
      }
    })
  })

  const multipleDaysOff = await db.extendedTimeOff.findMany({
    where: { staffId },
    orderBy: { startDate: "asc" },
  })

  const specialAvailabilities = await db.specialAvailability.findMany({
    where: { staffId },
    orderBy: { date: "asc" },
  })

  const formattedSpecialAvailabilities = specialAvailabilities.reduce<
    Record<string, SpecialAvailability>
  >((acc, availability) => {
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

      acc[dateKeyString].hours.sort((a, b) => a.start.localeCompare(b.start))
    } else {
      acc[dateKeyString].isFullDayOff = true
      acc[dateKeyString].hours = []
    }

    return acc
  }, {})

  return {
    data: {
      weeklyAvailabilities: formattedWeeklyAvailabilities,
      multipleDaysOff,
      specialAvailabilities: Object.values(formattedSpecialAvailabilities),
    },
  }
}
