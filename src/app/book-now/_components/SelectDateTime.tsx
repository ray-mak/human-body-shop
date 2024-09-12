"use client"

import Calendar from "react-calendar"
import { Availability } from "../[[...book-now]]/page"
import { useState } from "react"
import { add, format, isSameDay, set } from "date-fns"
import { Appointment } from "@/app/actions/service/getSpecialist"

type AvailabilityProp = {
  availabilities: Availability
  selectedDate: DateType
  chooseDate: (date: Date) => void
  chooseTime: (time: Date) => void
  specialistAppointments: Appointment[] | undefined
  totalDuration: number | undefined
}

interface DateType {
  justDate: Date | null
  dateTime: Date | null
}

type DisabledTileProps = {
  date: Date
  view: string
}

export default function SelectDateTime({
  availabilities,
  selectedDate,
  chooseDate,
  chooseTime,
  specialistAppointments,
  totalDuration,
}: AvailabilityProp) {
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
          specialDate.getDate() === date.getDate()
        ) {
          if (day.isFullDayOff) {
            return true
          } else {
            return false
          }
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

  console.log(specialistAppointments)

  const tileClassName = ({ date }: { date: Date }) => {
    if (
      selectedDate.justDate &&
      date.getDate() === selectedDate.justDate.getDate() &&
      date.getMonth() === selectedDate.justDate.getMonth()
    ) {
      return "selected-date"
    }
    return ""
  }

  const getTimes = () => {
    if (!selectedDate.justDate) return

    const { justDate } = selectedDate
    const interval = 30
    const today = new Date()
    const isToday = isSameDay(today, justDate)

    const specialAvailabilities = availabilities.specialAvailabilities.find(
      (availability) => isSameDay(availability.date, justDate)
    )

    const appointmentsForDate = specialistAppointments?.filter((appointment) =>
      isSameDay(appointment.date, justDate)
    )

    if (specialAvailabilities) {
      const times: Date[] = []

      specialAvailabilities.hours.forEach(({ start, end }) => {
        const startTime = set(justDate, {
          hours: parseInt(start.split(":")[0]),
          minutes: parseInt(start.split(":")[1]),
        })
        const endTime = set(justDate, {
          hours: parseInt(end.split(":")[0]),
          minutes: parseInt(end.split(":")[1]),
        })

        for (
          let i = startTime;
          i <= endTime;
          i = add(i, { minutes: interval })
        ) {
          const serviceEndTime = add(i, { minutes: totalDuration })

          if ((!isToday || i > today) && appointmentsForDate) {
            const isSlotAvailable = !appointmentsForDate.some((appointment) => {
              const appointmentStartTime = set(justDate, {
                hours: parseInt(appointment.startTime.split(":")[0], 10),
                minutes: parseInt(appointment.startTime.split(":")[1], 10),
              })
              const appointmentEndTime = set(justDate, {
                hours: parseInt(appointment.endTime.split(":")[0], 10),
                minutes: parseInt(appointment.endTime.split(":")[1], 10),
              })
              return (
                (i >= appointmentStartTime && i < appointmentEndTime) ||
                (i < appointmentStartTime &&
                  serviceEndTime > appointmentStartTime)
              )
            })

            if (isSlotAvailable) {
              times.push(i)
            }
          }
        }
      })
      return times
    }

    const dayOfWeek = justDate.getDay()
    const regularAvailabilities = availabilities.weeklyAvailabilities.find(
      (availability) => availability.dayOfWeek === dayOfWeek
    )

    const times: Date[] = []
    regularAvailabilities?.availibility.forEach(({ start, end }) => {
      const startTime = set(justDate, {
        hours: parseInt(start.split(":")[0]),
        minutes: parseInt(start.split(":")[1]),
      })
      const endTime = set(justDate, {
        hours: parseInt(end.split(":")[0]),
        minutes: parseInt(end.split(":")[1]),
      })

      for (let i = startTime; i <= endTime; i = add(i, { minutes: interval })) {
        const serviceEndTime = add(i, { minutes: totalDuration })

        if ((!isToday || i > today) && appointmentsForDate) {
          const isSlotAvailable = !appointmentsForDate.some((appointment) => {
            const appointmentStartTime = set(justDate, {
              hours: parseInt(appointment.startTime.split(":")[0], 10),
              minutes: parseInt(appointment.startTime.split(":")[1], 10),
            })
            const appointmentEndTime = set(justDate, {
              hours: parseInt(appointment.endTime.split(":")[0], 10),
              minutes: parseInt(appointment.endTime.split(":")[1], 10),
            })
            return (
              (i >= appointmentStartTime && i < appointmentEndTime) ||
              (i < appointmentStartTime &&
                serviceEndTime > appointmentStartTime)
            )
          })

          if (isSlotAvailable) {
            times.push(i)
          }
        }
      }
    })
    return times
  }

  const categorizeTimes = (times: Date[]) => {
    const morning: Date[] = []
    const afternoon: Date[] = []
    const evening: Date[] = []

    times.forEach((time) => {
      const hour = time.getHours()
      if (hour < 12) {
        morning.push(time)
      } else if (hour < 17) {
        afternoon.push(time)
      } else {
        evening.push(time)
      }
    })
    return { morning, afternoon, evening }
  }

  const timesList = () => {
    const times = getTimes()
    if (!times) return null

    const { morning, afternoon, evening } = categorizeTimes(times)

    if (
      morning.length === 0 &&
      afternoon.length === 0 &&
      evening.length === 0
    ) {
      return (
        <p className="text-gray-600">No more availabilities for this day</p>
      )
    }

    return (
      <div className="flex flex-col gap-2">
        <div>
          <h3 className="font-semibold">Morning</h3>
          <div className="flex gap-4 py-4 max-w-full overflow-auto text-xs sm:text-base sm:grid sm:grid-cols-5 whitespace-nowrap">
            {morning.map((time, i) => (
              <button
                type="button"
                key={`morning-${i}`}
                className="rounded text-white bg-indigo-600 py-2 px-4 md:px-6 hover:bg-indigo-500"
                onClick={() => chooseTime(time)}
              >
                {format(time, "h:mm a")}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold">Afternoon</h3>
          <div className="flex gap-4 py-4 max-w-full overflow-auto text-xs sm:text-base sm:grid sm:grid-cols-5 ">
            {afternoon.map((time, i) => (
              <button
                type="button"
                key={`morning-${i}`}
                className="rounded text-white bg-indigo-600 py-2 px-4 md:px-6 hover:bg-indigo-500 whitespace-nowrap"
                onClick={() => chooseTime(time)}
              >
                {format(time, "h:mm a")}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold">Evening</h3>
          <div className="flex gap-4 py-4 max-w-full overflow-auto text-xs sm:text-base sm:grid sm:grid-cols-5 whitespace-nowrap">
            {evening.map((time, i) => (
              <button
                type="button"
                key={`morning-${i}`}
                className="rounded text-white bg-indigo-600 py-2 px-4 md:px-6 hover:bg-indigo-500"
                onClick={() => chooseTime(time)}
              >
                {format(time, "h:mm a")}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="flex flex-col items-center p-4 ">
      <div className="flex flex-col items-center w-full">
        <Calendar
          minDate={new Date()}
          view="month"
          calendarType="gregory"
          tileClassName={tileClassName}
          tileDisabled={tileDisabled}
          onClickDay={(date) => chooseDate(date)}
        />
        {selectedDate.justDate && (
          <div
            className="flex flex-col gap-2 max-w-full overflow-auto mt-4"
            style={{ width: "720px" }}
          >
            <h2 className="mt-4 text-lg font-semibold">
              {format(selectedDate.justDate, "EEEE, MMMM d")}
            </h2>
            {timesList()}
          </div>
        )}
      </div>
    </div>
  )
}
