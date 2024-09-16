"use client"
import getUserInfo, { UserData } from "@/app/actions/user/getUserInfo"
import { useAuth } from "@clerk/nextjs"
import { useEffect, useState } from "react"

import { format, parse, set } from "date-fns"
import deleteAppointment from "@/app/actions/appointments/deleteAppointment"
import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { FadeLoader } from "react-spinners"

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
    return (
      <div>
        <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-90 z-50 flex items-center justify-center">
          <div>
            <FadeLoader color="#29325B" />
          </div>
        </div>
      </div>
    )
  }
  return (
    <div>
      {appointmentToCancel && (
        <div>
          <div className="fixed left-0 top-0 w-full h-full bg-black h-full z-10 opacity-80"></div>
          <div className="fixed left-0 top-0 w-full h-full z-20 flex items-center justify-center">
            <div className="relative m-6 p-6 md:p-12 bg-white flex flex-col gap-8 items-center justify-center bg-white dark:bg-gray-800 z-20 border rounded-lg">
              <h2 className="text-2xl font-semibold">Cancel Appointment</h2>
              <p className="text-gray-600 dark:text-gray-200">
                Are you sure you want to cancel your appointment on{" "}
                {format(new Date(appointmentToCancel?.date), "EEEE, MMMM d")} at{" "}
                {appointmentToCancel?.startTime}?
              </p>
              <div className="flex gap-4">
                <button
                  className="text-blue-600 border border-blue-600 dark:text-blue-300 px-4 py-2 rounded-lg"
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
      <div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Appointments</h2>
          {userData.appointments.length == 0 && (
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg">
              <Image
                src="/images/calendaricon.png"
                width={250}
                height={250}
                alt="icon of a calendar"
              />
              <p className="text-gray-600 text-center mt-4">
                You have no upcoming appointments scheduled. Click the button
                below to schedule an appointment!
              </p>
              <Link href="/book-now">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-6">
                  Book Now
                </button>
              </Link>
            </div>
          )}
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
                          className="mt-4 bg-white dark:bg-gray-800 text-red-500 border border-red-500 px-2 py-1 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base"
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
          <div className="mt-6">
            {pastAppointments.length > 0 && (
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-bold">Past Appointments</h3>
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
                        <div className="mt-6">
                          <Link
                            href="/book-now"
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                          >
                            Book Again
                          </Link>
                        </div>
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
