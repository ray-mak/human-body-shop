"use client"
import "../../../../styles/Calendar.css"
import { useState } from "react"
import WeeklyHoursForm from "./WeeklyHoursForm"
import SpecialHoursForm from "./SpecialHoursForm"
import SpecialHoursComponent from "./SpecialHoursComponent"
import Link from "next/link"

export default function AvailibilityComponent() {
  const [viewWeeklyHours, setViewWeeklyHours] = useState<boolean>(true)
  function viewWeekly() {
    setViewWeeklyHours(true)
  }
  function viewSpecial() {
    setViewWeeklyHours(false)
  }
  return (
    <div className="flex flex-col gap-6">
      <div className="mt-6 md:mt-12 flex justify-center items-center">
        <div className="flex p-1 border rounded-lg bg-gray-200 dark:bg-gray-950">
          <button
            type="button"
            aria-label="weekly hours"
            className={`p-2 rounded-lg font-semibold ${
              viewWeeklyHours ? "bg-white shadow-lg dark:bg-gray-800" : ""
            }`}
            onClick={viewWeekly}
          >
            Weekly Hours
          </button>
          <button
            type="button"
            aria-label="special hours"
            className={` p-2 rounded-lg font-semibold ${
              viewWeeklyHours ? "" : "bg-white shadow-lg  dark:bg-gray-800"
            }`}
            onClick={viewSpecial}
          >
            Special Hours
          </button>
        </div>
      </div>
      <Link
        href="/admin/availability/preferences"
        className="text-center underline"
      >
        Manage Preferences
      </Link>
      {viewWeeklyHours ? <WeeklyHoursForm /> : <SpecialHoursComponent />}
    </div>
  )
}
