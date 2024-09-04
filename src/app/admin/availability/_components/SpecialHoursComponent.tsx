"use client"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import SpecialHoursForm from "./SpecialHoursForm"
import { faCalendar } from "@fortawesome/free-regular-svg-icons"
import { faList } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"
import { set } from "date-fns"
import SpecialHoursList from "./SpecialHoursList"
import DateRangeCalendar from "./DateRangeCalendar"

export default function SpecialHoursComponent() {
  const [viewCalendar, setViewCalendar] = useState<boolean>(true)
  const [addMultipleDays, setAddMultipleDays] = useState<boolean>(false)
  function viewAdd() {
    setViewCalendar(true)
  }

  function viewList() {
    setViewCalendar(false)
  }

  function handleCheckbox(e: React.ChangeEvent<HTMLInputElement>) {
    setAddMultipleDays(e.target.checked)
  }

  //create an input type of checkbox
  return (
    <div className="flex flex-col gap-4 mb-20">
      <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-gray-600"
            checked={addMultipleDays}
            onChange={handleCheckbox}
          />
          <span className="ml-2 text-gray-700">Add multiple days</span>
        </label>
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
      {viewCalendar ? (
        addMultipleDays ? (
          <DateRangeCalendar />
        ) : (
          <SpecialHoursForm />
        )
      ) : (
        <SpecialHoursList />
      )}
    </div>
  )
}
