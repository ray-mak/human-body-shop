"use server"

import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"

export type AppointmentData = {
  clientDuration: number
  date: Date
  endTime: string
  id: string
  serviceType: string
  staffId: string
  startTime: string
  userNote: string
  user: {
    id: string
    clerkUserId: string
    email: string
    name: string | null
    phone: string | null
  }
}

export default async function getAppointments(): Promise<{
  data?: AppointmentData[]
  error?: string
}> {
  const { userId } = auth()
  if (!userId) {
    return { error: "Staff not required" }
  }

  try {
    const appointments = await db.appointment.findMany({
      where: {
        staffId: userId,
      },
      select: {
        clientDuration: true,
        date: true,
        endTime: true,
        id: true,
        serviceType: true,
        staffId: true,
        startTime: true,
        userNote: true,
        user: {
          select: {
            id: true,
            clerkUserId: true,
            email: true,
            name: true,
            phone: true,
          },
        },
      },
    })
    return { data: appointments }
  } catch (error) {
    console.error(error)
    return { error: "An error occurred while fetching appointments" }
  }
}
