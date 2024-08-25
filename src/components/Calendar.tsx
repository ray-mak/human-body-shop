"use client"
import { useState } from "react"
import Calendar from "react-calendar"
import { add, format, isSameMinute } from "date-fns"

interface DateType {
  justDate: Date | null
  dateTime: Date | null
}

const CalendarComponent = () => {
  const [selectedDate, setSelectedDate] = useState<DateType>({
    justDate: null,
    dateTime: null,
  })

  const busyTimes = [
    new Date("2024-08-26T09:30:00"),
    new Date("2024-08-26T10:00:00"),
    new Date("2024-08-26T12:30:00"),
    new Date("2024-08-26T15:00:00"),
  ]

  const getTimes = () => {
    if (!selectedDate.justDate) return

    const { justDate } = selectedDate

    const beginning = add(justDate, { hours: 9 })
    const end = add(justDate, { hours: 17 })
    const interval = 30

    const times = []
    for (let i = beginning; i <= end; i = add(i, { minutes: interval })) {
      const isBusy = busyTimes.some((busyTime) => isSameMinute(i, busyTime))

      if (!isBusy) {
        times.push(i)
      }
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
    <div className="flex flex-col items-center p-4 ">
      {selectedDate.justDate ? (
        <div className=" flex flex-col items-center w-full">
          <Calendar
            minDate={new Date()}
            view="month"
            calendarType="gregory"
            tileClassName={tileClassName}
            onClickDay={(date) =>
              setSelectedDate((prev) => ({ ...prev, justDate: date }))
            }
          />
          <div
            className="flex flex-col gap-2 max-w-full overflow-auto mt-8"
            style={{ width: "720px" }}
          >
            <p className="mt-4">
              {format(selectedDate.justDate, "EEEE, MMMM d")}
            </p>
            <div className="flex gap-4 p-2 py-4 max-w-full overflow-auto text-xs md:text-base md:grid md:grid-cols-5 ">
              {times?.map((time, i) => (
                <div
                  key={`time-${i}`}
                  className="rounded-lg border-indigo-400 text-indigo-600 border-2 py-2 px-4 md:px-6 hover:bg-indigo-400 hover:text-white cursor-pointer"
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
        <div className="flex flex-col items-center w-full">
          <Calendar
            minDate={new Date()}
            view="month"
            calendarType="gregory"
            onClickDay={(date) =>
              setSelectedDate((prev) => ({ ...prev, justDate: date }))
            }
          />
        </div>
      )}
    </div>
  )
}

export default CalendarComponent
