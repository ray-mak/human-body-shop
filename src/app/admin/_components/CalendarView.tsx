"use client"

import { AppointmentData } from "@/app/actions/appointments/getAppointments"
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { format, parse } from "date-fns"
import Calendar from "react-calendar"

type CalendarViewProps = {
  selectedDate: Date
  setSelectedDate: (date: Date) => void
  navigateWeek: (direction: "prev" | "next") => void
  daysOfWeek: Date[]
  hourlyTimes: string[]
  appointments: AppointmentData[]
  calculateRowPosition: (
    startTime: string,
    endTime: string
  ) => { rowStart: number; rowSpan: number }
  openDetailModal: (id: string) => void
}

export default function CalendarView({
  selectedDate,
  setSelectedDate,
  navigateWeek,
  daysOfWeek,
  hourlyTimes,
  appointments,
  calculateRowPosition,
  openDetailModal,
}: CalendarViewProps) {
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
          <button
            onClick={() => navigateWeek("prev")}
            className="flex items-center px-4 py-2 text-xs md:text-base"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="mr-2" />
            Previous Week
          </button>
          <h1 className="md:text-2xl font-medium text-center">
            {format(daysOfWeek[0], "MMMM yyyy")}
          </h1>
          <button
            onClick={() => navigateWeek("next")}
            className="flex items-center px-4 py-2 text-xs md:text-base"
          >
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
                <span className="block text-sm text-gray-600 dark:text-gray-300">
                  {format(day, "MMM d")}
                </span>{" "}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-8 overflow-y-auto max-h-[75vh] relative scrollbar-hide">
            <div className="grid grid-rows-12 grid-cols-3 sticky left-0">
              {hourlyTimes.map((time, index) => (
                <div
                  key={index}
                  className="text-right h-16 border-gray-300 text-xs col-span-3 grid grid-cols-4"
                >
                  <div className="col-span-2 relative">
                    <p className="absolute -top-2 right-1">
                      {index !== 0 ? time : ""}
                    </p>
                  </div>
                  <div className="border-t col-span-2 border-gray-300"></div>
                </div>
              ))}
            </div>

            {daysOfWeek.map((day, index) => (
              <div key={index} className="relative grid grid-rows-24">
                {hourlyTimes.map((time, index) => (
                  <div
                    key={index}
                    className="border-l border-t border-gray-300 h-16 text-xs"
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
                          className="absolute w-full bg-blue-500 text-white text-xs p-1 rounded-lg border border-blue-800 cursor-pointer"
                          style={{
                            top: `${rowStart * 4}rem`,
                            height: `${rowSpan * 4}rem`,
                          }}
                          onClick={() => openDetailModal(appointment.id)}
                          aria-label="show appointment details"
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
