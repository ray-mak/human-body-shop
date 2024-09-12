"use client"

import { AppointmentData } from "@/app/actions/appointments/getAppointments"
import { format, parse } from "date-fns"

type ListViewProps = {
  appointments: AppointmentData[]
  openDetailModal: (id: string) => void
}
export default function ListView({
  appointments,
  openDetailModal,
}: ListViewProps) {
  function sortAppointments(appointments: AppointmentData[]) {
    const now = new Date()

    const createAppointmentDateTime = (appointment: AppointmentData): Date => {
      const appointmentDateTime = new Date(appointment.date)
      const [hours, minutes] = appointment.startTime.split(":").map(Number)
      appointmentDateTime.setHours(hours, minutes)
      return appointmentDateTime
    }

    const upcomingAppointments = appointments
      .filter((appointment) => {
        const appointmentDateTime = createAppointmentDateTime(appointment)
        return appointmentDateTime > now
      })
      .sort(
        (a, b) =>
          createAppointmentDateTime(a).getTime() -
          createAppointmentDateTime(b).getTime()
      )

    const pastAppointments = appointments
      .filter((appointment) => {
        const appointmentDateTime = createAppointmentDateTime(appointment)
        return appointmentDateTime <= now
      })
      .sort(
        (a, b) =>
          createAppointmentDateTime(b).getTime() -
          createAppointmentDateTime(a).getTime()
      )

    return { upcomingAppointments, pastAppointments }
  }
  const { upcomingAppointments, pastAppointments } = sortAppointments(
    appointments || []
  )

  return (
    <div className="w-full max-w-2xl p-4">
      {upcomingAppointments.length > 0 && (
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold">Upcoming Appointments</h3>
          {upcomingAppointments.map((appointment) => {
            const today = new Date()
            const parsedTime = parse(appointment.startTime, "HH:mm", today)
            const formattedTime = format(parsedTime, "h:mm a")
            return (
              <div
                key={appointment.id}
                className="grid grid-cols-4 p-4 rounded-lg shadow-lg border"
              >
                <div className="col-span-3">
                  <p className="font-bold">{appointment.serviceType}</p>
                  <p className="text-gray-500 mt-1">
                    {appointment.clientDuration} minutes
                  </p>
                  <button
                    onClick={() => openDetailModal(appointment.id)}
                    className="mt-4 text-white bg-blue-600 px-2 py-1 sm:px-4 rounded-lg text-sm sm:text-base"
                  >
                    View Details
                  </button>
                </div>
                <div className="flex flex-col items-center justify-center border-l">
                  <p className="text-sm text-gray-500">
                    {format(new Date(appointment.date), "MMM")}
                  </p>
                  <p className="text-2xl my-1">
                    {format(new Date(appointment.date), "d")}
                  </p>
                  <p className="text-gray-500 text-sm">{formattedTime}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
