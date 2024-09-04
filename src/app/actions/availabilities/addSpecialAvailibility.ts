"use server"
import { db } from "@/lib/db"
import { doTimesNotOverlap } from "@/lib/validation/availabilityValidation"
import { checkRole } from "@/utils/roles"
import { auth } from "@clerk/nextjs/server"

type SpecialAvailibility = {
  date: Date
  hours: {
    start: string
    end: string
  }[]
}

export default async function addSpecialAvailibility(
  data: SpecialAvailibility
): Promise<{ error?: string; message?: string }> {
  const { userId } = auth()
  if (!userId) {
    return { error: "User not found" }
  }
  if (!checkRole("admin")) {
    return { error: "User not authorized" }
  }

  if (data.hours.length > 0) {
    for (const timeSlot of data.hours) {
      if (timeSlot.end < timeSlot.start) {
        return { error: "End time cannot be before start time" }
      }
      if (timeSlot.start === "" || timeSlot.end === "") {
        return { error: "Time values cannot be empty" }
      }

      const overlaps = []
      for (let i = 0; i < data.hours.length; i++) {
        for (let j = i + 1; j < data.hours.length; j++) {
          if (!doTimesNotOverlap(data.hours[i], data.hours[j])) {
            overlaps.push(i)
          }
        }
      }
      if (overlaps.length > 0) {
        return { error: "Time slots cannot overlap" }
      }
    }
  }

  const transaction = async () => {
    await db.specialAvailability.deleteMany({
      where: {
        date: data.date,
        staffId: userId,
      },
    })

    if (data.hours.length === 0) {
      await db.specialAvailability.create({
        data: {
          date: data.date,
          startTime: "",
          endTime: "",
          staffId: userId,
          isFullDayOff: true,
        },
      })
    } else {
      const createPromises = data.hours.map((timeSlot) => {
        return db.specialAvailability.create({
          data: {
            date: data.date,
            startTime: timeSlot.start,
            endTime: timeSlot.end,
            staffId: userId,
            isFullDayOff: false,
          },
        })
      })
      await Promise.all(createPromises)
    }
  }
  try {
    await db.$transaction(transaction)
    return { message: "Special hours added!" }
  } catch (error) {
    console.error("Error uploading and deleting special availabilties ", error)
    return { error: "Error adding special hours" }
  }
}
