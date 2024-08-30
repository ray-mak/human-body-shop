"use client"

import { isStartBeforeEnd } from "@/lib/validation/availabilityValidation"
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { format, set } from "date-fns"
import { useState } from "react"
import Calendar from "react-calendar"

type AvailableHours = {
  startTime: string
  endTime: string
}

export default function SpecialHoursForm() {
  const [selectedDate, setSelectedDate] = useState<Date | null>()
  const [timeModal, setTimeModal] = useState<boolean>(false)
  const [availableHours, setAvailableHours] = useState<AvailableHours[]>([])

  const tileClassName = ({ date }: { date: Date }) => {
    if (selectedDate && date.getDate() === selectedDate.getDate()) {
      return "selected-date"
    }
    return ""
  }

  function addTimes(date: Date) {
    setSelectedDate(date)
    setTimeModal(true)
  }

  const handleTimeChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newAvailibility = [...availableHours]
    const fieldName = event.target.name as "startTime" | "endTime"
    newAvailibility[index][fieldName] = event.target.value
    setAvailableHours(newAvailibility)
    // resetErrorMessages()
  }

  function deleteAvailibility(index: number) {
    const newAvailibility = [...availableHours]
    newAvailibility.splice(index, 1)
    setAvailableHours(newAvailibility)
  }

  function addAvailabilityHours() {
    const newAvailibility = [...availableHours]
    newAvailibility.push({ startTime: "", endTime: "" })
    setAvailableHours(newAvailibility)
  }

  console.log(selectedDate)
  return (
    <div className="flex flex-col items-center p-4">
      {timeModal && (
        <div>
          <div className="absolute left-0 top-0 w-full bg-white h-full z-10 opacity-80"></div>
          <div className="absolute left-0 top-0 w-full h-full flex items-center justify-center">
            <div className="p-8 bg-white flex flex-col gap-8 items-center justify-center bg-white z-20 border rounded-lg shadow-xl">
              <div className="w-full">
                <p className="text-left">
                  {selectedDate ? format(selectedDate, "EEEE, MMMM d") : ""}
                </p>
              </div>
              <div className="w-full flex flex-col sm:flex-row items-center gap-2">
                {availableHours.length === 0 ? (
                  <div className="w-full flex">
                    <p className="text-gray-600 text-base text-left">
                      Unavailable
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {availableHours.map((time, index) => {
                      const startBeforeEnd = isStartBeforeEnd(
                        availableHours[index].startTime,
                        availableHours[index].endTime
                      )
                      return (
                        <div key={index}>
                          <div className="flex gap-1 sm:gap-4 items-center">
                            <input
                              type="time"
                              name="startTime"
                              className="w-30 sm:w-32 p-2 border border-gray-400 rounded-lg text-sm sm:text-base"
                              onChange={(event) =>
                                handleTimeChange(index, event)
                              }
                              value={availableHours[index].startTime}
                            />
                            <p> - </p>
                            <input
                              type="time"
                              name="endTime"
                              className="w-30 sm:w-32 p-2 border border-gray-400 rounded-lg text-sm sm:text-base"
                              onChange={(event) =>
                                handleTimeChange(index, event)
                              }
                              value={availableHours[index].endTime}
                            />
                            <button
                              type="button"
                              className="py-2 px-4 rounded-md hover:bg-gray-100"
                              onClick={() => deleteAvailibility(index)}
                            >
                              <FontAwesomeIcon icon={faXmark} />
                            </button>
                          </div>
                          {!startBeforeEnd && (
                            <div>
                              <p className="mt-1 text-red-600">
                                Choose a start time earlier than the end time.
                              </p>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
                <button
                  type="button"
                  className={`h-12 py-2 px-4 rounded-md hover:bg-gray-100 self-center sm:self-start`}
                  onClick={() => addAvailabilityHours()}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
              <div className="w-full grid grid-cols-2 gap-6">
                <button
                  type="button"
                  className="py-2 px-8 rounded-3xl border border-gray-300 text-gray-700 hover:bg-gray-100"
                  onClick={() => setTimeModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="py-2 px-8 rounded-3xl bg-blue-600 text-white hover:bg-blue-700"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className=" flex flex-col items-center w-full">
        <Calendar
          minDate={new Date()}
          view="month"
          calendarType="gregory"
          tileClassName={tileClassName}
          onClickDay={(date) => addTimes(date)}
        />
      </div>
    </div>
  )
}
