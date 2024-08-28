import { checkRole } from "@/utils/roles"
import Link from "next/link"
import { redirect } from "next/navigation"

export default function AdminDashboard() {
  if (!checkRole("admin")) {
    redirect("/dashboard")
  }
  return (
    <div className="flex">
      <div className="mt-20 w-full flex items-center justify-center">
        <h1>Dashboard</h1>
        <Link href="/admin/availibility">Manage Availibility</Link>
      </div>
    </div>
  )
}
