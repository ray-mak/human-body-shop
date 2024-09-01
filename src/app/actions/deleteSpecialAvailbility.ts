"use server"

import { db } from "@/lib/db"
import { checkRole } from "@/utils/roles"

export default async function deleteSpecialAvailibility(id: string) {
  if (!checkRole("admin")) {
    return { error: "Unauthorized" }
  }
  if (!id) {
    return { error: "Availability ID required" }
  }

  const deletedAvailability = await db.specialAvailability.delete({
    where: { id },
  })

  if (!deletedAvailability) {
    return { error: "Availability not found" }
  } else {
    return { message: "Availability deleted" }
  }
}
