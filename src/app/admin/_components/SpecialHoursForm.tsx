"use client"

import addSpecialAvailibility from "@/app/actions/addSpecialAvailibility"
import {
  doTimesNotOverlap,
  isStartBeforeEnd,
} from "@/lib/validation/availabilityValidation"
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { format, set } from "date-fns"
import { useEffect, useState } from "react"
import Calendar from "react-calendar"

type AvailableHours = {
  start: string
  end: string
}

type SpecialAvailability = {
  date: Date
  hours: AvailableHours[]
}

export default function SpecialHoursForm() {
  const [selectedDate, setSelectedDate] = useState<Date | null>()
  const [timeModal, setTimeModal] = useState<boolean>(false)
  const [availableHours, setAvailableHours] = useState<AvailableHours[]>([])
  const [isValid, setIsValid] = useState({
    noEmptyInputs: true,
    noOverlaps: true,
    startBeforeEnd: true,
  })
  const [errorMessage, setErrorMessage] = useState({
    noEmptyInputs: true,
    noOverlaps: true,
    startBeforeEnd: true,
  })

  const tileClassName = ({ date }: { date: Date }) => {
    if (selectedDate && date.getDate() === selectedDate.getDate()) {
      return "selected-date"
    }
    return ""
  }

  useEffect(() => {
    const overlaps = []
    for (let i = 0; i < availableHours.length; i++) {
      for (let j = i + 1; j < availableHours.length; j++) {
        if (!doTimesNotOverlap(availableHours[i], availableHours[j])) {
          overlaps.push(i)
        }
      }
    }
    if (overlaps.length > 0) {
      setIsValid((prevState) => ({ ...prevState, noOverlaps: false }))
    } else {
      setIsValid((prevState) => ({ ...prevState, noOverlaps: true }))
    }

    if (availableHours.length > 0) {
      const emptyInputs = availableHours.some(
        (time) => time.start === "" || time.end === ""
      )
      if (emptyInputs) {
        setIsValid((prevState) => ({ ...prevState, noEmptyInputs: false }))
      } else {
        setIsValid((prevState) => ({ ...prevState, noEmptyInputs: true }))
      }
    } else {
      setIsValid((prevState) => ({ ...prevState, noEmptyInputs: true }))
    }

    if (availableHours.length > 0) {
      const startBeforeEnd = availableHours.some(
        (time) => !isStartBeforeEnd(time.start, time.end)
      )
      if (startBeforeEnd) {
        setIsValid((prevState) => ({ ...prevState, startBeforeEnd: false }))
      } else {
        setIsValid((prevState) => ({ ...prevState, startBeforeEnd: true }))
      }
    }
  }, [availableHours])

  function handleSubmit(e: React.FormEvent<HTMLButtonElement>) {
    e.preventDefault()
    console.log(isValid)
    function updateErrors() {
      setErrorMessage({
        noEmptyInputs: !isValid.noEmptyInputs,
        noOverlaps: !isValid.noOverlaps,
        startBeforeEnd: !isValid.startBeforeEnd,
      })
    }
    updateErrors()
    if (isValid.noEmptyInputs && isValid.noOverlaps && isValid.startBeforeEnd) {
      const hoursData = {
        date: selectedDate,
        hours: availableHours,
      }
      console.log(hoursData)
      if (hoursData.date && hoursData.date instanceof Date) {
        const formattedDate = new Date(hoursData.date)
        console.log(formattedDate)
        const clientAddSpecialAvailibility = async (
          data: SpecialAvailability
        ) => {
          const { error, message } = await addSpecialAvailibility({
            ...data,
            date: formattedDate,
          })

          if (error) {
            console.error("Error adding special hours")
          } else {
            console.log(message)
            setTimeModal(false)
            setAvailableHours([])
          }
        }
        clientAddSpecialAvailibility({ ...hoursData, date: formattedDate })
      }
    }
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
    const fieldName = event.target.name as "start" | "end"
    newAvailibility[index][fieldName] = event.target.value
    setAvailableHours(newAvailibility)
    resetErrorMessages()
  }

  function deleteAvailibility(index: number) {
    const newAvailibility = [...availableHours]
    newAvailibility.splice(index, 1)
    setAvailableHours(newAvailibility)
    resetErrorMessages()
  }

  function addAvailabilityHours() {
    const newAvailibility = [...availableHours]
    newAvailibility.push({ start: "", end: "" })
    setAvailableHours(newAvailibility)
    resetErrorMessages()
  }

  function closeModal() {
    setTimeModal(false)
    setAvailableHours([])
    resetErrorMessages()
  }

  function resetErrorMessages() {
    setErrorMessage({
      noEmptyInputs: false,
      noOverlaps: false,
      startBeforeEnd: false,
    })
  }

  return (
    <div className="flex flex-col items-center p-4">
      {timeModal && (
        <div>
          <div className="absolute left-0 top-0 w-full bg-white h-full z-10 opacity-80"></div>
          <div className="absolute left-0 top-0 w-full h-full flex items-center justify-center">
            <div className="p-8 bg-white flex flex-col gap-8 items-center justify-center bg-white z-20 border rounded-lg shadow-xl">
              <div className="w-full">
                <p>What hours are you available?</p>
                <p className="text-left mt-2 font-semibold">
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
                        availableHours[index].start,
                        availableHours[index].end
                      )
                      return (
                        <div key={index}>
                          <div className="flex gap-1 sm:gap-4 items-center">
                            <input
                              type="time"
                              name="start"
                              className="w-30 sm:w-32 p-2 border border-gray-400 rounded-lg text-sm sm:text-base"
                              onChange={(event) =>
                                handleTimeChange(index, event)
                              }
                              value={availableHours[index].start}
                            />
                            <p> - </p>
                            <input
                              type="time"
                              name="end"
                              className="w-30 sm:w-32 p-2 border border-gray-400 rounded-lg text-sm sm:text-base"
                              onChange={(event) =>
                                handleTimeChange(index, event)
                              }
                              value={availableHours[index].end}
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
                    {errorMessage.noEmptyInputs && (
                      <p className="mt-1 text-red-600">
                        Time inputs cannot be empty.
                      </p>
                    )}
                    {errorMessage.noOverlaps && (
                      <p className="mt-1 text-red-600">
                        Please choose times that do not overlap.
                      </p>
                    )}
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
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-6">
                <button
                  type="button"
                  className="py-2 px-8 rounded-3xl border border-gray-300 text-gray-700 hover:bg-gray-100 order-2 sm:order-1"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="py-2 px-8 rounded-3xl bg-blue-600 text-white hover:bg-blue-700 order-1 sm:order-2"
                  onClick={handleSubmit}
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
