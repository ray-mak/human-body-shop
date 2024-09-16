import { checkRole } from "@/utils/roles"
import { redirect } from "next/navigation"
import PreferenceForm from "./_components/PreferenceForm"

export default function PreferencesPage() {
  if (!checkRole("admin")) {
    redirect("/")
  }
  return (
    <div>
      <PreferenceForm />
    </div>
  )
}
