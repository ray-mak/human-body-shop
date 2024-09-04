"use client"

import getServices from "@/app/actions/service/getServices"
import { useEffect, useState } from "react"

type ServiceData = {
  id: string
  name: string
  description: string | null
  clientDuration: number
  price: number
  totalDuration: number
}

export default function ServiceList() {
  const [services, setServices] = useState<ServiceData[]>([])

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getServices()
        if (response.error) {
          console.error(response.error)
        } else if (response.services) {
          setServices(response.services)
        }
      } catch (error) {
        console.error(error)
      }
    }
    fetchServices()
  }, [])

  const serviceCards = services.map((object) => {
    return (
      <div
        key={object.id}
        className="flex flex-col p-4 border rounded-md bg-gray-100"
      >
        <div className="flex">
          <p className="font-medium">{object.name}</p>
          <p className="ml-auto">${object.price}</p>
        </div>
        <p className="text-gray-500">{object.clientDuration} Minutes</p>
        <p className="mt-4">{object.description}</p>
        <div className="mt-4 ml-auto">
          <button className="bg-white rounded-md px-4 py-2 border border-gray-300 hover:bg-gray-200">
            Edit
          </button>
          <button className="bg-red-500 text-white rounded-md px-4 py-2 ml-2 hover:opacity-80">
            Delete
          </button>
        </div>
      </div>
    )
  })

  return (
    <div>
      <h1>Service List</h1>
      <div className="grid grid-cols-2 gap-6">{serviceCards}</div>
    </div>
  )
}
