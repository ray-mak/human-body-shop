import { checkRole } from "@/utils/roles"
import { redirect } from "next/navigation"

export default function UserDash() {
  if (checkRole("admin")) {
    redirect("/admin")
  }
  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  )
}
