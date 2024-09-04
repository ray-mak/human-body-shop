import { checkRole } from "@/utils/roles"
import Link from "next/link"
import { redirect } from "next/navigation"

export default function ManageAvailibilityPage() {
  if (!checkRole("admin")) {
    redirect("/")
  }
  return (
    <div>
      <div className="flex flex-col gap-6 items-center">
        <div className="w-5/6 mt-20">
          <div className="flex items-center">
            <h1 className="text-3xl font-semibold">Services</h1>
            <Link
              href="/admin/services/add"
              className="bg-slate-700 text-white rounded-lg py-2 px-4 mt-2 ml-auto hover:opacity-80"
            >
              Add Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
