import { checkRole } from "@/utils/roles"
import AvalibilityForm from "../_components/AvailibilitiesForm"
import { redirect } from "next/navigation"

type Availibility = { start: string; end: string }
type AvailibilityDay = { day: string; availibility: Availibility[] }
type Day = { day: string; availibility: Availibility[] }
type IsValid = {
  day: string
  isValid: {
    noEmptyInputs: boolean
    noOverlaps: boolean
    startBeforeEnd: boolean
  }
}
type ErrorMessage = {
  day: string
  error: { emptyInputs: boolean; overlaps: boolean; startBeforeEnd: boolean }
}

export default function ManageAvailibilityPage() {
  if (!checkRole("admin")) {
    redirect("/")
  }
  return (
    <div>
      <AvalibilityForm />
    </div>
  )
}
