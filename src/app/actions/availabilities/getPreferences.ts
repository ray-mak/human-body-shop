"use server"

import { db } from "@/lib/db"
import { PreferenceData } from "./updatePreferences"

export default async function getPreferences(
  id: string
): Promise<{ error?: string; staffPreference?: PreferenceData }> {
  if (!id) {
    return { error: "Staff id required" }
  }

  try {
    const staffPreference = await db.staffPreferences.findFirst({
      where: {
        staffId: id,
      },
      select: {
        interval: true,
        maxDays: true,
      },
    })
    if (staffPreference) {
      return { staffPreference }
    } else {
      return { error: "Preferences not found" }
    }
  } catch (error) {
    console.error(error)
    return { error: "Failed to fetch preferences" }
  }
}
