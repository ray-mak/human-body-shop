"use client"

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
  chooseService: (serviceId: string) => void
}

export default function SelectService({
  services,
  chooseService,
}: SelectServiceProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {services.map((object) => {
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
              onClick={() => chooseService(object.id)}
              className="mt-4 ml-auto py-2 px-4 bg-blue-600 rounded text-white hover:opacity-80"
            >
              Select Service
            </button>
          </div>
        )
      })}
    </div>
  )
}
