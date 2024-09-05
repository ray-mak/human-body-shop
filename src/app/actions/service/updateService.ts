"use server"

import { db } from "@/lib/db"
import { checkRole } from "@/utils/roles"

type FormData = {
  name: string
  price: number
  clientTime: number
  bookingTime: number
  description?: string
  id: string
}

export default async function updateService(
  data: FormData
): Promise<{ message?: string; error?: string }> {
  if (!checkRole("admin")) {
    return { error: "Unauthorized" }
  }

  if (!data.name || !data.price || !data.clientTime || !data.bookingTime) {
    return {
      error: "Name, price, client time and booking time are required",
    }
  }

  const duplicateName = await db.serviceType.findFirst({
    where: {
      name: data.name,
      id: { not: data.id },
    },
  })

  if (duplicateName) {
    return { error: "Service with same name already exists" }
  }

  try {
    await db.serviceType.update({
      data: {
        name: data.name,
        price: data.price,
        clientDuration: data.clientTime,
        totalDuration: data.bookingTime,
        description: data.description,
      },
      where: {
        id: data.id,
      },
    })
    return { message: "Service updated successfully" }
  } catch (error) {
    console.error(error)
    return { error: "Failed to update service" }
  }
}
