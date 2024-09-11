"use client"

import getAppointments, {
  AppointmentData,
} from "@/app/actions/appointments/getAppointments"
import { useAuth } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import Calendar from "react-calendar"
import "../../../../styles/AdminScheduleCalendar.css"

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

  console.log(appointments, selectedDate)
  return (
    <div className="flex">
      <Calendar
        view="month"
        calendarType="gregory"
        tileClassName={tileClassName}
        onClickDay={(date) => setSelectedDate(date)}
      />
    </div>
  )
}
