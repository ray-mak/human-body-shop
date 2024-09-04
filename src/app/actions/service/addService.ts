"use server"

import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"

type FormData = {
  name: string
  price: number
  clientTime: number
  bookingTime: number
  description?: string
}

export default async function addService(
  data: FormData
): Promise<{ message?: string; error?: string }> {
  const { userId } = auth()
  if (!userId) {
    return { error: "User not found" }
  }

  if (!data.name || !data.price || !data.clientTime || !data.bookingTime) {
    return {
      error: "Name, price, client time and booking time are required",
    }
  }

  const duplicateName = await db.serviceType.findFirst({
    where: { name: data.name },
  })

  if (duplicateName) {
    return { error: "Service with same name already exists" }
  }

  try {
    await db.serviceType.create({
      data: {
        name: data.name,
        price: data.price,
        clientDuration: data.clientTime,
        totalDuration: data.bookingTime,
        description: data.description,
      },
    })
    return { message: "Service added successfully" }
  } catch (error) {
    console.error(error)
    return { error: "Failed to add service" }
  }
}
