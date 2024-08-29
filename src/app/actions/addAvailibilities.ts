"use server"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import {
  findOverlaps,
  isStartBeforeEnd,
} from "@/lib/validation/availabilityValidation"

type AvailibilityTime = {
  start: string
  end: string
}

type AvailibilityData = {
  day: string
  availibility: AvailibilityTime[]
}

type AvailibilityResult = {
  message?: string
  error?: string
}

async function addAvailibilityServer(
  data: AvailibilityData[]
): Promise<AvailibilityResult> {
  const startTime = performance.now()
  const { userId } = auth()

  if (!userId) {
    return { error: "User not found" }
  }

  if (data.length !== 7) return { error: "Invalid number of days" }

  for (const datData of data) {
    const { day, availibility } = datData
    for (const timeSlot of availibility) {
      const { start, end } = timeSlot
      if (start === "" || end === "") {
        return { error: "Time values cannot be empty" }
      }
      if (end < start) {
        return { error: "End time cannot be before start time" }
      }
    }
  }

  function getDaysOfWeek(dayName: string) {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ]
    return days.indexOf(dayName)
  }

  const overlaps = findOverlaps(data)
  if (overlaps.length > 0) {
    return { error: "Availabilities overlap" }
  }

  const checkValidation = performance.now()

  const transaction = async () => {
    await db.availability.deleteMany({
      where: {
        staffId: userId,
      },
    })

    const createPromises = data.flatMap((dayData) => {
      const { day, availibility } = dayData
      const dayOfWeek = getDaysOfWeek(day)

      if (availibility.length === 0) {
        return [
          db.availability.create({
            data: {
              name: day,
              staffId: userId,
              dayOfWeek,
              startTime: "",
              endTime: "",
            },
          }),
        ]
      }

      return availibility.map((timeSlot) => {
        const { start, end } = timeSlot
        return db.availability.create({
          data: {
            name: day,
            staffId: userId,
            dayOfWeek,
            startTime: start,
            endTime: end,
          },
        })
      })
    })

    await Promise.all(createPromises)
  }

  try {
    await db.$transaction(transaction)
    const endTime = performance.now()
    console.log(
      checkValidation - startTime,
      endTime - checkValidation,
      endTime - startTime
    )
    return { message: "Availabilities updated successfully" }
  } catch (error) {
    console.error("Error uploading and deleting availabilties ", error)
    return { error: "Error updating availabilties" }
  }
}

export { addAvailibilityServer }
