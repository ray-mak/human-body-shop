import { checkRole } from "@/utils/roles"
import { redirect } from "next/navigation"
import EditServiceForm from "../_components/EditServiceForm"
import { db } from "@/lib/db"

export default async function EditServicePage({
  params: { id },
}: {
  params: { id: string }
}) {
  if (!checkRole("admin")) {
    redirect("/")
  }

  const service = await db.serviceType.findUnique({
    where: {
      id,
    },
  })
  if (!service) {
    return (
      <div>
        <div className="flex flex-col gap-6 items-center">
          <div className="w-5/6 mt-24 flex flex-col gap-8">
            <h1 className="text-3xl font-semibold">Service not found</h1>
          </div>
        </div>
      </div>
    )
  }
  const serviceData = {
    id: service.id,
    name: service.name,
    description: service.description,
    clientDuration: service.clientDuration,
    price: service.price,
    totalDuration: service.totalDuration,
  }
  return (
    <div>
      <div className="flex flex-col gap-6 items-center">
        <div className="w-5/6 mt-24 flex flex-col gap-8">
          <h1 className="text-3xl font-semibold">Add Service</h1>
          <EditServiceForm {...serviceData} />
        </div>
      </div>
    </div>
  )
}
