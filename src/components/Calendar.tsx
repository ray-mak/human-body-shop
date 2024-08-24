"use client"
import { useState } from "react"
import Calendar from "react-calendar"
import { add, format } from "date-fns"

interface DateType {
  justDate: Date | null
  dateTime: Date | null
}

const CalendarComponent = () => {
  const [selectedDate, setSelectedDate] = useState<DateType>({
    justDate: null,
    dateTime: null,
  })

  const getTimes = () => {
    if (!selectedDate.justDate) return

    const { justDate } = selectedDate

    const beginning = add(justDate, { hours: 9 })
    const end = add(justDate, { hours: 17 })
    const interval = 30

    const times = []
    for (let i = beginning; i <= end; i = add(i, { minutes: interval })) {
      times.push(i)
    }

    return times
  }

  const times = getTimes()

  const tileClassName = ({ date }: { date: Date }) => {
    if (
      selectedDate.justDate &&
      date.getDate() === selectedDate.justDate.getDate()
    ) {
      return "selected-date"
    }
    return ""
  }

  console.log(selectedDate)
  return (
    <div className="p-6">
      {selectedDate.justDate ? (
        <div className="flex flex-col md:flex-row gap-6">
          <Calendar
            minDate={new Date()}
            view="month"
            calendarType="gregory"
            tileClassName={tileClassName}
            onClickDay={(date) =>
              setSelectedDate((prev) => ({ ...prev, justDate: date }))
            }
          />
          <div>
            <p className="mb-4">Date Selected</p>
            <div
              className="flex md:flex-col gap-4 p-2 overflow-y-auto"
              style={{ maxHeight: "380px" }}
            >
              {times?.map((time, i) => (
                <div
                  key={`time-${i}`}
                  className="rounded-lg border-indigo-400 text-indigo-600 border-2 py-2 px-8 hover:bg-indigo-400 hover:text-white cursor-pointer"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedDate((prev) => ({ ...prev, dateTime: time }))
                    }
                    className="whitespace-nowrap"
                  >
                    {format(time, "h:mm a")}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <Calendar
          minDate={new Date()}
          view="month"
          calendarType="gregory"
          onClickDay={(date) =>
            setSelectedDate((prev) => ({ ...prev, justDate: date }))
          }
        />
      )}
    </div>
  )
}

export default CalendarComponent
