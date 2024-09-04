"use client"

import addMultipleDaysOff from "@/app/actions/availabilities/addMultipleDaysOff"
import { format, isSameDay } from "date-fns"
import { useEffect, useState } from "react"
import Calendar from "react-calendar"

type TileClassNameProps = {
  date: Date
  view: string
}
type ValuePiece = Date | null
type Value = ValuePiece | [ValuePiece, ValuePiece]

type DaysOffData = {
  start: Date
  end: Date
}

export default function DateRangeCalendar() {
  const [dateRange, setDateRange] = useState<Date[] | undefined>(undefined)
  const [validRange, setValidRange] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)

  useEffect(() => {
    if (!dateRange) {
      setValidRange(false)
    }

    if (dateRange && dateRange.length === 2) {
      if (isSameDay(dateRange[0], dateRange[1])) {
        setValidRange(false)
      } else {
        setValidRange(true)
      }
    }
  }, [dateRange])

  function handleSubmit(e: React.FormEvent<HTMLButtonElement>) {
    e.preventDefault()
    if (validRange && dateRange) {
      const addDaysOff = async (data: DaysOffData) => {
        const { error, message } = await addMultipleDaysOff(data)
        if (error) {
          console.error(error)
        } else if (message) {
          setSuccess(true)
          setDateRange(undefined)
        }
      }
      const start = new Date(dateRange[0])
      const end = new Date(dateRange[1])
      addDaysOff({ start, end })
    }
  }

  const tileClassName = ({ date, view }: TileClassNameProps) => {
    if (view === "month" && dateRange) {
      const [start, end] = dateRange
      if (date.toDateString() === start.toDateString()) {
        return "selected-date"
      }
      if (date.toDateString() === end.toDateString()) {
        return "selected-date"
      }

      if (date > start && date < end) {
        return "selected-range"
      }
    }
    return ""
  }

  const handleDataChange = (
    value: Value,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (Array.isArray(value)) {
      const validDates = value.filter((date): date is Date => date !== null)
      setDateRange(validDates.length > 0 ? validDates : undefined)
    } else {
      setDateRange(undefined)
    }
  }

  console.log(dateRange)
  return (
    <div className="flex flex-col items-center p-4 gap-4">
      <h1 className="text-xl font-semibold">Add Multiple Days Off</h1>
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded relative text-center text-sm sm:text-base">
          <strong className="font-bold">Success!</strong>
          <span> Your dates have been saved.</span>
        </div>
      )}
      <div className=" flex flex-col items-center w-full">
        <Calendar
          minDate={new Date()}
          view="month"
          calendarType="gregory"
          selectRange={true}
          onChange={handleDataChange}
          tileClassName={tileClassName}
        />
      </div>
      <div className="w-72 flex flex-col items-center relative">
        <p className="font-semibold">Set Unavailable Dates:</p>
        {validRange && dateRange && (
          <p className="absolute top-6">
            {format(dateRange[0], "MMM d, yyy")} -{" "}
            {format(dateRange[1], "MMM d, yyy")}
          </p>
        )}
      </div>
      <button
        className={`mt-6 py-2 px-8 rounded-md  ${
          validRange
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
        aria-label="save dates"
        disabled={!validRange}
        onClick={handleSubmit}
      >
        Save Dates
      </button>
    </div>
  )
}
