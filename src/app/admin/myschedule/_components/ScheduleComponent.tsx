"use client"

import getAppointments, {
  AppointmentData,
} from "@/app/actions/appointments/getAppointments"
import { useEffect, useState } from "react"
import Calendar from "react-calendar"
import "../../../../styles/AdminScheduleCalendar.css"
import {
  addDays,
  differenceInMinutes,
  format,
  parse,
  startOfWeek,
} from "date-fns"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons"

export default function ScheduleComponent() {
  const [appointments, setAppointments] = useState<AppointmentData[]>()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await getAppointments()
        if (response.error) {
          console.error(response.error)
        } else if (response.data) {
          console.log(response.data)
          setAppointments(response.data)
        }
      } catch (error) {
        console.error(error)
      }
    }
    fetchAppointments()
  }, [])

  const tileClassName = ({ date }: { date: Date }) => {
    if (
      selectedDate &&
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth()
    ) {
      return "selected-date"
    }
    return ""
  }

  const getDaysOfWeek = () => {
    const startDay = startOfWeek(selectedDate, { weekStartsOn: 0 })
    return Array.from({ length: 7 }, (_, i) => addDays(startDay, i))
  }

  const getHourlyTimes = () => {
    const times = []
    for (let hour = 0; hour < 24; hour++) {
      const timeString = format(new Date().setHours(hour, 0, 0), "h a")
      times.push(timeString)
    }
    return times
  }

  const daysOfWeek = getDaysOfWeek()
  const hourlyTimes = getHourlyTimes()

  const calculateRowPosition = (startTime: string, endTime: string) => {
    const startHour = parseInt(startTime.split(":")[0], 10)
    const startMinutes = parseInt(startTime.split(":")[1], 10)

    const rowStart = startHour + startMinutes / 60
    const rowSpan =
      differenceInMinutes(
        new Date(`1970-01-01T${endTime}:00`),
        new Date(`1970-01-01T${startTime}:00`)
      ) / 60

    return { rowStart, rowSpan }
  }

  function navigateWeek(direction: "next" | "prev") {
    setSelectedDate((prev) =>
      direction === "next" ? addDays(prev, 7) : addDays(prev, -7)
    )
  }

  console.log(appointments, selectedDate)
  return (
    <div className="w-full p-2 lg:p-6 flex flex-col lg:flex-row">
      <div className="w-full lg:w-[280px] hidden lg:block">
        <Calendar
          view="month"
          calendarType="gregory"
          tileClassName={tileClassName}
          onClickDay={(date) => setSelectedDate(date)}
        />
      </div>
      <div>
        <div className="flex justify-between items-center mb-4 lg:hidden">
          <button onClick={() => navigateWeek("prev")} className="px-4 py-2">
            <FontAwesomeIcon icon={faChevronLeft} className="mr-2" />
            Previous Week
          </button>
          <h1 className="text-2xl font-medium">
            {format(daysOfWeek[0], "MMMM yyyy")}
          </h1>
          <button onClick={() => navigateWeek("next")} className="px-4 py-2">
            Next Week
            <FontAwesomeIcon icon={faChevronRight} className="ml-2" />
          </button>
        </div>
      </div>
      <div className="w-full overflow-x-auto">
        <div className="grid min-w-[640px] ">
          <div className="grid grid-cols-8">
            <div className="empty-cell"></div>
            {daysOfWeek.map((day, index) => (
              <div
                key={index}
                className="text-center py-2 border-l border-gray-300 border-b sticky top-0"
              >
                <span className="block font-medium">{format(day, "EEE")}</span>{" "}
                <span className="block text-sm text-gray-600">
                  {format(day, "MMM d")}
                </span>{" "}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-8 overflow-y-auto max-h-[75vh] relative scrollbar-hide">
            <div className="grid grid-rows-24 grid-cols-2 sticky left-0">
              {hourlyTimes.map((time, index) => (
                <div
                  key={index}
                  className="text-right h-12 border-gray-300 text-xs col-span-2 grid grid-cols-4"
                >
                  <div className="col-span-3 relative">
                    <p className="absolute -top-2 right-1">
                      {index !== 0 ? time : ""}
                    </p>
                  </div>
                  <div className="border-t border-gray-300"></div>
                </div>
              ))}
            </div>

            {daysOfWeek.map((day, index) => (
              <div key={index} className="relative grid grid-rows-24">
                {hourlyTimes.map((time, index) => (
                  <div
                    key={index}
                    className="border-l border-t border-gray-300 h-12 text-xs"
                  ></div>
                ))}
                {appointments &&
                  appointments
                    .filter(
                      (appointment) =>
                        format(new Date(appointment.date), "EEE MMM d yyyy") ===
                        format(day, "EEE MMM d yyyy")
                    )
                    .map((appointment, index) => {
                      const { rowStart, rowSpan } = calculateRowPosition(
                        appointment.startTime,
                        appointment.endTime
                      )

                      return (
                        <div
                          key={index}
                          className="absolute w-full bg-blue-500 text-white text-xs p-1 rounded-lg border border-blue-800"
                          style={{
                            top: `${rowStart * 3}rem`,
                            height: `${rowSpan * 3}rem`,
                          }}
                        >
                          <p className="whitespace-nowrap overflow-hidden text-ellipses">
                            {appointment.serviceType}
                          </p>
                          <p className="whitespace-nowrap overflow-hidden text-ellipses">
                            {format(
                              parse(appointment.startTime, "HH:mm", new Date()),
                              "h a"
                            )}{" "}
                            -
                            {format(
                              parse(appointment.endTime, "HH:mm", new Date()),
                              "h a"
                            )}
                          </p>
                        </div>
                      )
                    })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
