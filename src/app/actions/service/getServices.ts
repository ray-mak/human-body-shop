"use server"

import { db } from "@/lib/db"

type ServiceData = {
  id: string
  name: string
  description: string | null
  clientDuration: number
  price: number
  totalDuration: number
}

export default async function getServices(): Promise<{
  services?: ServiceData[]
  error?: string
}> {
  try {
    const services = await db.serviceType.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        clientDuration: true,
        price: true,
        totalDuration: true,
      },
    })
    return { services }
  } catch (error) {
    console.error(error)
    return { error: "Unable to fetch services" }
  }
}
