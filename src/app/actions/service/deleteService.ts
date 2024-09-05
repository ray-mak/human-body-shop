"use server"

import { db } from "@/lib/db"
import { checkRole } from "@/utils/roles"

export default async function deleteService(
  id: string
): Promise<{ message?: string; error?: string }> {
  if (!checkRole("admin")) {
    return { error: "Unauthorized" }
  }

  if (!id) {
    return { error: "Service ID required" }
  }

  const deletedService = await db.serviceType.delete({
    where: { id },
  })

  if (!deletedService) {
    return { error: "Service not found" }
  } else {
    return { message: "Service deleted" }
  }
}
