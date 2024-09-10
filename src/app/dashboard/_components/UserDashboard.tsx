"use client"
import getUserInfo, { UserData } from "@/app/actions/user/getUserInfo"
import { useAuth, UserProfile } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { parsePhoneNumberFromString } from "libphonenumber-js"
import { format, parse } from "date-fns"

type AppointmentData = {
  date: Date
  id: string
  serviceType: string | null
  userNote: string | null
  startTime: string
  endTime: string
  clientDuration: number | null
  totalDuration: number | null
}

export default function UserDashboard() {
  const { userId } = useAuth()

  const [userData, setUserData] = useState<UserData>()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserInfo()
        if (response.error) {
          console.error(response.error)
          return
        } else if (response.user) {
          setUserData(response.user)
        }
      } catch (error) {
        console.error(error)
      }
    }

    fetchUserData()
  }, [])

  function formatPhone(phone: string | null | undefined) {
    const phoneNumber = phone ? parsePhoneNumberFromString(phone) : undefined
    return phoneNumber ? phoneNumber.format("NATIONAL") : userData?.phone
  }

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
    userData?.appointments || []
  )

  console.log(userData)

  if (!userData) {
    return <p className="text-gray-600">Could not get user information.</p>
  }
  return (
    <div className="grid grid-cols-3 gap-12">
      <div>
        <div className="bg-white p-4 rounded-lg border shadow-md">
          <h2 className="text-lg font-semibold break-words">
            {userData.name ? userData.name : userData.email}
          </h2>
          <p className="mt-1 text-gray-500">
            {formatPhone(userData.phone) || userData.phone}
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <p className="font-semibold text-gray-600">Appointments</p>
            <p className="font-semibold text-gray-600">Manage account</p>
            <p className="font-semibold text-red-600">Logout</p>
            {/* <UserProfile /> */}
          </div>
        </div>
      </div>
      <div className="col-span-2">
        <h2 className="text-2xl font-semibold mb-4">Appointments</h2>
        <div>
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
                      <button className="mt-4 bg-white text-red-500 border border-red-500 px-4 py-2 rounded-lg">
                        Cancel Appointment
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
        <div>
          {pastAppointments.length > 0 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-bold">Upcoming Appointments</h3>
              {pastAppointments.map((appointment) => {
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

                      <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg">
                        Book Again
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
      </div>
    </div>
  )
}
