import { checkRole } from "@/utils/roles"
import { redirect } from "next/navigation"
import AvailibilityComponent from "../_components/AvailibilityComponent"

export default function ManageAvailibilityPage() {
  if (!checkRole("admin")) {
    redirect("/")
  }
  return (
    <div>
      <AvailibilityComponent />
    </div>
  )
}
