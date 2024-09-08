"use client"

import { Specialist } from "@/app/actions/service/getSpecialist"

type ServiceData = {
  id: string
  name: string
  description: string | null
  clientDuration: number
  price: number
  totalDuration: number
}

type SelectServiceProps = {
  services: ServiceData[]
  chooseService: (index: number) => void
  specialistList: Specialist[]
  handleSpecialistChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
  selectedSpecialist: string | undefined
}

export default function SelectService({
  services,
  chooseService,
  specialistList,
  handleSpecialistChange,
  selectedSpecialist,
}: SelectServiceProps) {
  return (
    <div>
      <div className="my-6">
        <label htmlFor="specialist" className="font-medium">
          Select a Specialist
        </label>
        <select
          name="specialist"
          id="specialist"
          className="w-full p-2 border rounded mt-2"
          onChange={handleSpecialistChange}
          value={selectedSpecialist}
        >
          {specialistList.map((specialist) => (
            <option
              key={specialist.clerkStaffId}
              value={specialist.clerkStaffId}
            >
              {specialist.name}
            </option>
          ))}
        </select>
      </div>
      <h2 className="text-2xl font-semibold my-4">Select a Service</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((object, index) => {
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
              <div className="mt-4 ml-auto"></div>
              <button
                type="button"
                onClick={() => chooseService(index)}
                className="mt-4 ml-auto py-2 px-4 bg-blue-600 rounded text-white hover:opacity-80"
              >
                Select Service
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
