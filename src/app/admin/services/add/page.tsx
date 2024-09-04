import { checkRole } from "@/utils/roles"
import { redirect } from "next/navigation"
import AddServiceForm from "./_components/AddServiceForm"

export default function AddServicePage() {
  if (!checkRole("admin")) {
    redirect("/")
  }

  return (
    <div>
      <div className="flex flex-col gap-6 items-center">
        <div className="w-5/6 mt-24 flex flex-col gap-8">
          <h1 className="text-3xl font-semibold">Add Service</h1>
          <AddServiceForm />
        </div>
      </div>
    </div>
  )
}
