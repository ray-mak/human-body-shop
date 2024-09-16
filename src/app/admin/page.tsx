import { checkRole } from "@/utils/roles"
import Link from "next/link"
import { redirect } from "next/navigation"
import ScheduleComponent from "./myschedule/_components/ScheduleComponent"

export default function AdminDashboard() {
  if (!checkRole("admin")) {
    redirect("/dashboard")
  }
  return (
    <div className="flex">
      <div className="mt-4 w-full flex flex-col gap-4 items-center justify-center">
        <ScheduleComponent />
      </div>
    </div>
  )
}
