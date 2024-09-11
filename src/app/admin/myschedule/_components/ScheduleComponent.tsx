"use client"

import getAppointments, {
  AppointmentData,
} from "@/app/actions/appointments/getAppointments"
import { useAuth } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import Calendar from "react-calendar"
import "../../../../styles/AdminScheduleCalendar.css"
import { addDays, format, startOfWeek } from "date-fns"

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

  console.log(appointments, selectedDate)
  return (
    <div className="w-full p-6 flex gap-4">
      <div className="w-[280px]">
        <Calendar
          view="month"
          calendarType="gregory"
          tileClassName={tileClassName}
          onClickDay={(date) => setSelectedDate(date)}
        />
      </div>
      <div className="w-full grid">
        <div className="grid grid-cols-8">
          <div className="empty-cell"></div>
          {daysOfWeek.map((day, index) => (
            <div
              key={index}
              className="text-center py-2 border-l border-gray-300 border-b"
            >
              <span className="block font-medium">{format(day, "EEE")}</span>{" "}
              <span className="block text-sm text-gray-600">
                {format(day, "MMM d")}
              </span>{" "}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-8">
          <div className="grid grid-rows-24 grid-cols-2">
            {hourlyTimes.map((time, index) => (
              <div
                key={index}
                className="text-right h-12 border-gray-300 text-xs col-span-2 grid grid-cols-4"
              >
                <div className="col-span-3 relative">
                  <p className="absolute -top-2 right-1">{time}</p>
                </div>
                <div className="border-t border-gray-300"></div>
              </div>
            ))}
          </div>
          {daysOfWeek.map((day, index) => (
            <div key={index} className="grid grid-rows-24">
              {hourlyTimes.map((time, index) => (
                <div
                  key={index}
                  className="border-l border-t border-gray-300 h-12 text-xs"
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
