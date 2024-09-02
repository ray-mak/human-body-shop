"use client"

import { useState } from "react"
import Calendar from "react-calendar"

type TileClassNameProps = {
  date: Date
  view: string
}
type ValuePiece = Date | null
type Value = ValuePiece | [ValuePiece, ValuePiece]

export default function DateRangeCalendar() {
  const [dateRange, setDateRange] = useState<Date[] | undefined>(undefined)

  const tileClassName = ({ date, view }: TileClassNameProps) => {
    if (view === "month" && dateRange) {
      const [start, end] = dateRange
      if (date.toString() === start.toString()) {
        return "selected-date"
      }
      if (date.toString() === end.toString()) {
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
    <div className="flex flex-col items-center p-4">
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
      <h1>DateRangeCalendar</h1>
    </div>
  )
}
