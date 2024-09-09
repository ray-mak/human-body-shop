import { checkRole } from "@/utils/roles"
import { redirect } from "next/navigation"
import UserDashboard from "./_components/UserDashboard"

export default function UserDash() {
  if (checkRole("admin")) {
    redirect("/admin")
  }

  return (
    <div className="flex">
      <div className="mt-20 md:mt-28 w-full flex flex-col gap-4 items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <UserDashboard />
        </div>
      </div>
    </div>
  )
}
