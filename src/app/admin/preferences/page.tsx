import { checkRole } from "@/utils/roles"
import { redirect } from "next/navigation"

export default function PreferencesPage() {
  if (!checkRole("admin")) {
    redirect("/")
  }
  return (
    <div>
      <h1>Preferences</h1>
    </div>
  )
}
