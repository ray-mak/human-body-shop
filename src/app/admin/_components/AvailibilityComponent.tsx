"use client"
import "../../../components/Calendar.css"
import { useState } from "react"
import WeeklyHoursForm from "./WeeklyHoursForm"
import SpecialHoursForm from "./SpecialHoursForm"

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
      <div className="mt-28 flex justify-center">
        <div className="flex p-1 border rounded-lg bg-gray-200">
          <button
            type="button"
            aria-label="weekly hours"
            className={`border p-2 rounded-lg font-semibold ${
              viewWeeklyHours ? "bg-white shadow-lg" : ""
            }`}
            onClick={viewWeekly}
          >
            Weekly Hours
          </button>
          <button
            type="button"
            aria-label="special hours"
            className={`border p-2 rounded-lg font-semibold ${
              viewWeeklyHours ? "" : "bg-white shadow-lg"
            }`}
            onClick={viewSpecial}
          >
            Special Hours
          </button>
        </div>
      </div>
      {viewWeeklyHours ? <WeeklyHoursForm /> : <SpecialHoursForm />}
    </div>
  )
}
