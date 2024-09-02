"use client"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import SpecialHoursForm from "./SpecialHoursForm"
import { faCalendar } from "@fortawesome/free-regular-svg-icons"
import { faList } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"
import { set } from "date-fns"
import SpecialHoursList from "./SpecialHoursList"

export default function SpecialHoursComponent() {
  const [viewCalendar, setViewCalendar] = useState<boolean>(true)
  function viewAdd() {
    setViewCalendar(true)
  }

  function viewList() {
    setViewCalendar(false)
  }
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
        <p>Add multiple dates</p>
        <div className="flex p-1 border rounded-lg bg-gray-200 sm:ml-20">
          <button
            type="button"
            aria-label="add special hours"
            className={`border p-2 rounded-lg font-medium text-sm ${
              viewCalendar ? "bg-white shadow-lg" : ""
            }`}
            onClick={viewAdd}
          >
            <FontAwesomeIcon icon={faCalendar} className="mr-2" /> Add Hours
          </button>
          <button
            type="button"
            aria-label="add special hours"
            className={`border p-2 rounded-lg font-medium text-sm ${
              viewCalendar ? "" : "bg-white shadow-lg"
            }`}
            onClick={viewList}
          >
            <FontAwesomeIcon icon={faList} className="mr-2" /> View Hours
          </button>
        </div>
      </div>
      {viewCalendar ? <SpecialHoursForm /> : <SpecialHoursList />}
    </div>
  )
}
