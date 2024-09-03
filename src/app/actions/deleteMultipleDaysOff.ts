"use server"

import { db } from "@/lib/db"
import { checkRole } from "@/utils/roles"

type ResponseData = {
  error?: string
  message?: string
}

export default async function deleteMultipleDaysOff(
  id: string
): Promise<ResponseData> {
  if (!checkRole("admin")) {
    return { error: "Unauthorized" }
  }
  if (!id) {
    return { error: "ID required" }
  }

  const deletedDaysOff = await db.extendedTimeOff.delete({
    where: { id },
  })

  if (!deletedDaysOff) {
    return { error: "Days off not found" }
  } else {
    return { message: "Days off deleted" }
  }
}
