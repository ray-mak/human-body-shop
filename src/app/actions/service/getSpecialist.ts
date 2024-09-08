"use server"

import { db } from "@/lib/db"

export type Specialist = {
  clerkStaffId: string
  name: string | null
  appointments: Appointment[]
}

export type Appointment = {
  id: string
  date: Date
  startTime: string
  endTime: string
}

export default async function getSpecialist(): Promise<{
  specialists?: Specialist[]
  error?: string
}> {
  try {
    const specialists = await db.staff.findMany({
      select: {
        clerkStaffId: true,
        name: true,
        appointments: {
          select: {
            id: true,
            date: true,
            startTime: true,
            endTime: true,
          },
        },
      },
    })
    if (!specialists) {
      return { error: "No specialists found" }
    }
    return { specialists }
  } catch (error) {
    console.error(error)
    return { error: "Unable to fetch specialists" }
  }
}
