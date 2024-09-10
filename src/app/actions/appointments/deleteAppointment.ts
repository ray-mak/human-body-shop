"use server"

import { db } from "@/lib/db"

export default async function deleteAppointment(
  id: string
): Promise<{ message?: string; error?: string }> {
  if (!id) {
    return { error: "Appointment ID required" }
  }
  try {
    const deletedAppointment = await db.appointment.delete({
      where: { id },
    })
    if (deletedAppointment) {
      return { message: "Appointment deleted" }
    } else {
      return { error: "Error deleting appointment" }
    }
  } catch (error) {
    console.error(error)
    return { error: "Error deleting appointment" }
  }
}
