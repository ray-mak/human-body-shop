"use server"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"

export type UserData = {
  id: string
  email: string
  name?: string | null
  phone?: string | null
  clerkUserId: string
  appointments: AppointmentData[]
}

type AppointmentData = {
  id: string
  date: Date
  startTime: string
  endTime: string
  serviceType: string | null
  userNote: string | null
  clientDuration: number | null
  totalDuration: number | null
}

export default async function getUserInfo(): Promise<{
  error?: string
  user?: UserData
}> {
  const { userId } = auth()
  if (!userId) {
    return { error: "User not found" }
  }

  try {
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        clerkUserId: true,
        appointments: {
          select: {
            id: true,
            date: true,
            startTime: true,
            endTime: true,
            serviceType: true,
            userNote: true,
            totalDuration: true,
            clientDuration: true,
          },
        },
      },
    })

    if (!user) {
      return { error: "User not found" }
    }
    return { user }
  } catch (error) {
    console.error(error)
    return { error: "Unable to find user" }
  }
}
