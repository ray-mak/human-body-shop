"use server"

import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"

export type PreferenceData = {
  interval: number
  maxDays: number
}

export default async function updatePreferences(
  data: PreferenceData
): Promise<{ message?: string; error?: string }> {
  const { userId } = auth()
  if (!userId) {
    return { error: "Staff found" }
  }

  if (!data.interval) {
    return { error: "Intervals cannot be empty" }
  }

  try {
    const staffPreference = await db.staffPreferences.findFirst({
      where: {
        staffId: userId,
      },
    })

    if (!staffPreference) {
      await db.staffPreferences.create({
        data: {
          interval: data.interval,
          maxDays: data.maxDays,
          staffId: userId,
        },
      })
      return { message: "Preferences updated successfully" }
    }

    await db.staffPreferences.update({
      data: {
        interval: data.interval,
        maxDays: data.maxDays,
      },
      where: {
        staffId: userId,
      },
    })
    return { message: "Preferences updated successfully" }
  } catch (error) {
    console.error(error)
    return { error: "Failed to update preferences" }
  }
}
