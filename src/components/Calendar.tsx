"use client"
import { useEffect, useState } from "react"
import Calendar from "react-calendar"
import { add, format, isSameMinute } from "date-fns"
import getAllAvailabilities from "@/app/actions/getAllAvailabilities"

interface DateType {
  justDate: Date | null
  dateTime: Date | null
}
type WeeklyAvalability = {
  day: string
  dayOfWeek: number
  availibility: TimeData[]
}

type TimeData = {
  start: string
  end: string
}

type SpecialAvailability = {
  date: Date
  hours: { start: string; end: string }[]
  isFullDayOff: boolean
  id: string
}

type MultiDayOff = {
  id: string
  startDate: Date
  endDate: Date
}

type Availability = {
  weeklyAvailabilities: WeeklyAvalability[]
  multipleDaysOff: MultiDayOff[]
  specialAvailabilities: SpecialAvailability[]
}

type DisabledTileProps = {
  date: Date
  view: string
}

const CalendarComponent = () => {
  const [availabilities, setAvailabilities] = useState<Availability>()
  const [selectedDate, setSelectedDate] = useState<DateType>({
    justDate: null,
    dateTime: null,
  })

  useEffect(() => {
    const fetchAvailabilities = async () => {
      try {
        const response = await getAllAvailabilities(
          "user_2lDYOChTXgLXkwMLfvgXUzlY0eC"
        )
        if (response.error) {
          console.error(response.error)
        } else if (response.data) {
          setAvailabilities(response.data)
        }
      } catch (error) {
        console.error(error)
      }
    }

    fetchAvailabilities()
  }, [])

  console.log(availabilities)

  const tileDisabled = ({ date, view }: DisabledTileProps) => {
    if (view === "month") {
      if (!availabilities) return false
      for (let timeOff of availabilities?.multipleDaysOff) {
        const startDate = new Date(timeOff.startDate)
        const endDate = new Date(timeOff.endDate)
        if (date >= startDate && date <= endDate) {
          return true
        }
      }

      for (let day of availabilities.specialAvailabilities) {
        const specialDate = new Date(day.date)
        if (
          specialDate.getFullYear() === date.getFullYear() &&
          specialDate.getMonth() === date.getMonth() &&
          specialDate.getDate() === date.getDate() &&
          day.isFullDayOff
        ) {
          return true
        }
      }

      const dayOfWeek = date.getDay()
      for (let day of availabilities.weeklyAvailabilities) {
        if (day.dayOfWeek === dayOfWeek) {
          for (const availability of day.availibility) {
            if (availability.start === "" && availability.end === "") {
              return true
            }
          }
        }
      }
    }
    return false
  }

  const getTimes = () => {
    if (!selectedDate.justDate) return

    const { justDate } = selectedDate

    const beginning = add(justDate, { hours: 9 })
    const end = add(justDate, { hours: 17 })
    const interval = 30

    const times = []
    for (let i = beginning; i <= end; i = add(i, { minutes: interval })) {
      times.push(i)
      // const isBusy = busyTimes.some((busyTime) => isSameMinute(i, busyTime))

      // if (!isBusy) {
      //   times.push(i)
      // }
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
  console.log("test")
  return (
    <div className="flex flex-col items-center p-4 ">
      <div className=" flex flex-col items-center w-full">
        <Calendar
          minDate={new Date()}
          view="month"
          calendarType="gregory"
          tileClassName={tileClassName}
          tileDisabled={tileDisabled}
          onClickDay={(date) =>
            setSelectedDate((prev) => ({ ...prev, justDate: date }))
          }
        />
        {selectedDate.justDate && (
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
        )}
      </div>
    </div>
  )
}

export default CalendarComponent
