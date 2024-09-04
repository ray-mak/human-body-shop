import { checkRole } from "@/utils/roles"
import Link from "next/link"
import { redirect } from "next/navigation"

export default function AdminDashboard() {
  if (!checkRole("admin")) {
    redirect("/dashboard")
  }
  return (
    <div className="flex">
      <div className="mt-20 w-full flex flex-col gap-4 items-center justify-center">
        <h1>Dashboard</h1>
        <Link href="/admin/availability" className="underline">
          Manage Availability
        </Link>
        <Link href="/admin/preferences" className="underline">
          Manage Preferences
        </Link>
        <Link href="/admin/services" className="underline">
          Manage Services
        </Link>
      </div>
    </div>
  )
}
