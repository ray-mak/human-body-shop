"use client"

import getAppointments, {
  AppointmentData,
} from "@/app/actions/appointments/getAppointments"
import { useEffect, useState } from "react"
import "../../../styles/AdminScheduleCalendar.css"
import {
  addDays,
  differenceInMinutes,
  format,
  parse,
  startOfWeek,
} from "date-fns"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faList, faTimes } from "@fortawesome/free-solid-svg-icons"
import deleteAppointment from "@/app/actions/appointments/deleteAppointment"
import { redirect } from "next/navigation"
import CalendarView from "./CalendarView"
import { faCalendar } from "@fortawesome/free-regular-svg-icons"
import ListView from "./ListView"

export default function ScheduleComponent() {
  const [appointments, setAppointments] = useState<AppointmentData[]>()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [detailModal, setDetailModal] = useState<boolean>(false)
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentData>()
  const [listView, setListView] = useState<boolean>(false)
  const [deleteModal, setDeleteModal] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)

  useEffect(() => {
    if (success) {
      redirect("/admin/myschedule")
    }
  }, [success])

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

  useEffect(() => {
    if (detailModal) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [detailModal])

  function openDetailModal(id: string) {
    const appointment = appointments?.find(
      (appointment) => appointment.id === id
    )
    if (appointment) {
      setSelectedAppointment(appointment)
      setDetailModal(true)
    }
  }

  function closeDetailModal() {
    setDetailModal(false)
    setSelectedAppointment(undefined)
  }

  function openDeleteModal() {
    setDeleteModal(true)
  }

  function confirmDeleteAppointment() {
    const cancelAppointment = async (id: string) => {
      try {
        const response = await deleteAppointment(id)
        if (response.error) {
          console.error(response.error)
        } else if (response.message) {
          console.log(response.message)
          setSuccess(true)
        }
      } catch (error) {
        console.error(error)
      }
    }
    if (selectedAppointment) {
      cancelAppointment(selectedAppointment.id)
    }
  }

  const getDaysOfWeek = () => {
    const startDay = startOfWeek(selectedDate, { weekStartsOn: 0 })
    return Array.from({ length: 7 }, (_, i) => addDays(startDay, i))
  }

  const getHourlyTimes = () => {
    const times = []
    for (let hour = 8; hour < 20; hour++) {
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
    //24 hour time
    // const rowStart = startHour + startMinutes / 60

    const rowStart = startHour - 8 + startMinutes / 60
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
    <div className="w-full flex flex-col items-center">
      {selectedAppointment && detailModal && (
        <div>
          <div className="fixed left-0 top-0 w-full h-full bg-black h-full z-10 opacity-80"></div>
          <div className="fixed left-0 top-0 w-full h-full z-20 flex items-center justify-center p-4">
            {deleteModal ? (
              <div className="flex flex-col bg-white p-6 rounded-lg z-20">
                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-xl font-medium">Cancel Appointment</h1>
                  <button
                    onClick={() => setDeleteModal(false)}
                    className="ml-20"
                    aria-label="hide delete appointment modal"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
                <p className="text-gray-600">
                  Are you sure you want to cancel this appointment?
                </p>
                <div className="flex gap-4 mt-6 ml-auto">
                  <button
                    className="text-gray-600 border-2 border-gray-500 px-4 py-2 rounded-lg hover:bg-gray-100"
                    onClick={() => setDeleteModal(false)}
                  >
                    No, Go Back
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    onClick={confirmDeleteAppointment}
                  >
                    Yes, Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg z-20">
                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-xl font-medium">Appointment Details</h1>
                  <button
                    onClick={() => closeDetailModal()}
                    className="ml-20"
                    aria-label="hide appointment details"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-lg font-medium">
                      {selectedAppointment.serviceType}
                    </p>
                    <p className="text-sm text-gray-600">
                      {format(selectedAppointment.date, "EE, MMMM d")}
                    </p>
                    <p className="text-sm text-gray-600">
                      {format(
                        parse(
                          selectedAppointment.startTime,
                          "HH:mm",
                          new Date()
                        ),
                        "h:mm a"
                      )}{" "}
                      -{" "}
                      {format(
                        parse(selectedAppointment.endTime, "HH:mm", new Date()),
                        "h:mm a"
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-lg font-medium">Client Details</p>
                    <p className="text-sm text-gray-600">
                      {selectedAppointment.user.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedAppointment.user.email}
                    </p>
                  </div>
                  {selectedAppointment.userNote !== "" && (
                    <div>
                      <p className="text-lg font-medium">Client Notes</p>
                      <p className="text-sm text-gray-600">
                        {selectedAppointment.userNote}
                      </p>
                    </div>
                  )}
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4"
                    onClick={openDeleteModal}
                  >
                    Cancel Appointment
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="rounded-lg border-2 my-2">
        <button
          className={` py-2 px-3 rounded-l-lg ${
            listView
              ? "bg-gray-100 bg-gray-600"
              : "bg-blue-600 dark:bg-indigo-800 text-white"
          }`}
          onClick={() => setListView(false)}
        >
          <FontAwesomeIcon icon={faCalendar} className="mr-2" />
          Calendar View
        </button>
        <button
          className={` py-2 px-3 rounded-r-lg ${
            !listView
              ? "bg-gray-100 dark:bg-gray-600"
              : "bg-blue-600 dark:bg-indigo-800 text-white"
          }`}
          onClick={() => setListView(true)}
        >
          <FontAwesomeIcon icon={faList} className="mr-2" />
          List View
        </button>
      </div>

      {appointments && !listView && (
        <CalendarView
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          navigateWeek={navigateWeek}
          daysOfWeek={daysOfWeek}
          hourlyTimes={hourlyTimes}
          appointments={appointments}
          calculateRowPosition={calculateRowPosition}
          openDetailModal={openDetailModal}
        />
      )}
      {appointments && listView && (
        <ListView
          appointments={appointments}
          openDetailModal={openDetailModal}
        />
      )}
    </div>
  )
}
