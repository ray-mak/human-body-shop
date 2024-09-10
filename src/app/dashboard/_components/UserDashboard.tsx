"use client"
import getUserInfo, { UserData } from "@/app/actions/user/getUserInfo"
import { useAuth, UserProfile } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { parsePhoneNumberFromString } from "libphonenumber-js"
import { format, parse, set } from "date-fns"
import deleteAppointment from "@/app/actions/appointments/deleteAppointment"
import { redirect } from "next/navigation"

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
  const [cancelModal, setCancelModal] = useState<boolean>(false)
  const [appointmentToCancel, setAppointmentToCancel] =
    useState<AppointmentData>()
  const [success, setSuccess] = useState<boolean>(false)

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

  useEffect(() => {
    if (success) {
      redirect("/dashboard")
    }
  }, [success])

  useEffect(() => {
    if (cancelModal) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [cancelModal])

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

  function openCancelModal(appointment: AppointmentData) {
    setCancelModal(true)
    setAppointmentToCancel(appointment)
  }

  function closeCancelModal() {
    setCancelModal(false)
    setAppointmentToCancel(undefined)
  }

  function confirmCancel() {
    if (appointmentToCancel) {
      const cancelAppointment = async (id: string) => {
        try {
          const { error, message } = await deleteAppointment(id)
          if (error) {
            console.error(error)
            return
          } else if (message) {
            setCancelModal(false)
            setAppointmentToCancel(undefined)
            setSuccess(true)
          }
        } catch (error) {
          console.error(error)
        }
      }
      cancelAppointment(appointmentToCancel.id)
    }
  }

  console.log(userData, appointmentToCancel)

  if (!userData) {
    return <p className="text-gray-600">Could not get user information.</p>
  }
  return (
    <div>
      {appointmentToCancel && (
        <div>
          <div className="absolute left-0 top-0 w-full bg-black h-full z-10 opacity-80"></div>
          <div className="absolute left-0 top-0 w-full h-full flex items-center justify-center">
            <div className="relative m-6 p-6 md:p-12 bg-white flex flex-col gap-8 items-center justify-center bg-white z-20 border rounded-lg">
              <h2 className="text-2xl font-semibold">Cancel Appointment</h2>
              <p className="text-gray-600">
                Are you sure you want to cancel your appointment on{" "}
                {format(new Date(appointmentToCancel?.date), "EEEE, MMMM d")} at{" "}
                {appointmentToCancel?.startTime}?
              </p>
              <div className="flex gap-4">
                <button
                  className="text-blue-600 border border-blue-600 px-4 py-2 rounded-lg"
                  onClick={() => closeCancelModal()}
                >
                  Keep Appointment
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                  onClick={() => confirmCancel()}
                >
                  Cancel Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
                  const parsedTime = parse(
                    appointment.startTime,
                    "HH:mm",
                    today
                  )
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
                          className="mt-4 bg-white text-red-500 border border-red-500 px-4 py-2 rounded-lg"
                          onClick={() => openCancelModal(appointment)}
                        >
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
                  const parsedTime = parse(
                    appointment.startTime,
                    "HH:mm",
                    today
                  )
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
    </div>
  )
}
