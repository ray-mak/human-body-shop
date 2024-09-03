"use client"

import addSpecialAvailibility from "@/app/actions/addSpecialAvailibility"
import deleteSpecialAvailibility from "@/app/actions/deleteSpecialAvailbility"
import getSpecialAvailabilities from "@/app/actions/getSpecialAvailibilities"
import {
  doTimesNotOverlap,
  isStartBeforeEnd,
} from "@/lib/validation/availabilityValidation"
import { useAuth } from "@clerk/nextjs"
import { faPenToSquare, faTrashCan } from "@fortawesome/free-regular-svg-icons"
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { format, parse } from "date-fns"
import { useEffect, useState } from "react"
import MultipleDaysList from "./MultipleDaysList"

type SpecialAvailability = {
  date: Date
  hours: { start: string; end: string }[]
  isFullDayOff: boolean
  id: string
}

type DateToEdit = {
  date: Date
  hours: { start: string; end: string }[]
  isFullDayOff: boolean
  id: string
  index: number
}

type DataProps = {
  date: Date
  hours: { start: string; end: string }[]
}

export default function SpecialHoursList() {
  const { isSignedIn } = useAuth()
  const [specialAvailabilities, setSpecialAvailabilities] = useState<
    SpecialAvailability[]
  >([])
  const [editModal, setEditModal] = useState<boolean>(false)
  const [dateToEdit, setDateToEdit] = useState<DateToEdit>()
  const [isValid, setIsValid] = useState({
    noEmptyInputs: true,
    noOverlaps: true,
    startBeforeEnd: true,
  })

  const [errorMessage, setErrorMessage] = useState({
    noEmptyInputs: false,
    noOverlaps: false,
    startBeforeEnd: false,
  })

  useEffect(() => {
    if (!dateToEdit) return
    const overlaps = []
    for (let i = 0; i < dateToEdit.hours.length; i++) {
      for (let j = i + 1; j < dateToEdit.hours.length; j++) {
        if (!doTimesNotOverlap(dateToEdit.hours[i], dateToEdit.hours[j])) {
          overlaps.push(i)
        }
      }
    }
    overlaps.length > 0
      ? setIsValid((prevState) => ({ ...prevState, noOverlaps: false }))
      : setIsValid((prevState) => ({ ...prevState, noOverlaps: true }))

    const emptyInputs = dateToEdit.hours.some(
      (time) => time.start === "" || time.end === ""
    )
    emptyInputs
      ? setIsValid((prevState) => ({ ...prevState, noEmptyInputs: false }))
      : setIsValid((prevState) => ({ ...prevState, noEmptyInputs: true }))

    const startBeforeEnd = dateToEdit.hours.some(
      (time) => !isStartBeforeEnd(time.start, time.end)
    )
    startBeforeEnd
      ? setIsValid((prevState) => ({ ...prevState, startBeforeEnd: false }))
      : setIsValid((prevState) => ({ ...prevState, startBeforeEnd: true }))
  }, [dateToEdit])

  useEffect(() => {
    const fetchSpecialAvailabilities = async () => {
      if (isSignedIn) {
        try {
          const response = await getSpecialAvailabilities()
          if (response.error) {
            console.error(response.error)
          } else if (response.response) {
            setSpecialAvailabilities(response.response)
            console.log(response.response)
          }
        } catch (error) {
          console.error("Error fetching special avalibilities", error)
        }
      }
    }
    fetchSpecialAvailabilities()
  }, [isSignedIn])

  async function deleteAvailibility(id: string) {
    const response = await deleteSpecialAvailibility(id)
    if (response.error) {
      console.error(response.error)
    } else {
      console.log(response.message)
      const updatedAvailabilities = specialAvailabilities.filter(
        (availability) => availability.id !== id
      )
      setSpecialAvailabilities(updatedAvailabilities)
    }
  }

  function editSpecialAvailability(index: number) {
    setEditModal(true)
    const tempDate = JSON.parse(JSON.stringify(specialAvailabilities[index]))
    setDateToEdit({ ...tempDate, index: index })
  }

  function closeModal() {
    setEditModal(false)
  }

  function handleTimeChange(
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    if (!dateToEdit) return
    const newHours = [...dateToEdit.hours]
    const fieldName = event.target.name as "start" | "end"
    newHours[index][fieldName] = event.target.value
    setDateToEdit({ ...dateToEdit, hours: newHours })
    resetErrors()
  }

  function deleteHours(index: number) {
    if (!dateToEdit) return
    const newAvailibility = [...dateToEdit.hours]
    newAvailibility.splice(index, 1)
    setDateToEdit({ ...dateToEdit, hours: newAvailibility })
    resetErrors()
  }

  function addAvailabilityHours() {
    if (!dateToEdit) return
    const newAvailibility = [...dateToEdit.hours]
    newAvailibility.push({ start: "", end: "" })
    setDateToEdit({ ...dateToEdit, hours: newAvailibility })
    resetErrors()
  }

  function handleSubmit(e: React.FormEvent<HTMLButtonElement>) {
    e.preventDefault()
    function updateErrors() {
      setErrorMessage({
        noEmptyInputs: !isValid.noEmptyInputs,
        noOverlaps: !isValid.noOverlaps,
        startBeforeEnd: !isValid.startBeforeEnd,
      })
    }
    updateErrors()
    if (isValid.noEmptyInputs && isValid.noOverlaps && isValid.startBeforeEnd) {
      if (!dateToEdit) return
      const dateObject = new Date(dateToEdit.date)
      if (dateToEdit.date && dateObject instanceof Date) {
        const clientAddSpecialAvailibility = async (data: DataProps) => {
          const { error, message } = await addSpecialAvailibility({
            ...data,
            date: dateObject,
          })
          if (error) {
            console.error(error)
          } else {
            console.log(message)
          }
        }

        const { index, ...updatedAvailability } = dateToEdit
        const { id, isFullDayOff, ...dataToSend } = dateToEdit
        clientAddSpecialAvailibility(dataToSend)
        setSpecialAvailabilities((prev) =>
          prev.map((availability, i) =>
            i === index ? updatedAvailability : availability
          )
        )
        setEditModal(false)
      }
    }
    return console.log("Form submitted")
  }

  function resetErrors() {
    setErrorMessage({
      noEmptyInputs: false,
      noOverlaps: false,
      startBeforeEnd: false,
    })
  }

  console.log(isValid)
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="border p-4 sm:p-6 rounded-lg">
        {editModal && dateToEdit && (
          <div>
            <div className="absolute left-0 top-0 w-full bg-white h-full z-10 opacity-80"></div>
            <div className="absolute left-0 top-0 w-full h-full flex items-center justify-center">
              <div className="p-8 bg-white flex flex-col gap-8 items-center justify-center bg-white z-20 border rounded-lg shadow-xl">
                <p>
                  Update availability for{" "}
                  <span className="font-semibold">
                    {format(dateToEdit.date, "MMM d, yyyy")}
                  </span>
                </p>
                <div className="w-full flex flex-col sm:flex-row items-center gap-2">
                  {dateToEdit.hours.length < 1 ? (
                    <div className="w-full flex">
                      <p className="text-gray-600 text-base text-left">
                        Unavailable
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {dateToEdit.hours.map((hour, index) => {
                        const startBeforeEnd = isStartBeforeEnd(
                          dateToEdit.hours[index].start,
                          dateToEdit.hours[index].end
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
                                value={dateToEdit.hours[index].start}
                              />
                              <p> - </p>
                              <input
                                type="time"
                                name="end"
                                className="w-30 sm:w-32 p-2 border border-gray-400 rounded-lg text-sm sm:text-base"
                                onChange={(event) =>
                                  handleTimeChange(index, event)
                                }
                                value={dateToEdit.hours[index].end}
                              />
                              <button
                                type="button"
                                className="py-2 px-4 rounded-md hover:bg-gray-100"
                                onClick={() => deleteHours(index)}
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
        <h2 className="text-lg font-semibold mb-6">Special Hours List</h2>
        <div className="flex flex-col gap-8">
          {specialAvailabilities.map((availability, index) => {
            return (
              <div
                key={availability.id}
                className="grid grid-cols-5 sm:grid-cols-3 gap-4 sm:gap-8 text-sm sm:text-base"
              >
                <h2>{format(availability.date, "MMM d, yyyy")}</h2>
                {availability.hours.length < 1 ? (
                  <p className="text-gray-700 col-span-3 sm:col-span-1">
                    Unavailable
                  </p>
                ) : (
                  <ul className=" flex flex-col gap-1 justify-center col-span-3 sm:col-span-1">
                    {availability.hours.map((hour, index) => {
                      const parsedStart = parse(hour.start, "HH:mm", new Date())
                      const parsedEnd = parse(hour.end, "HH:mm", new Date())
                      return (
                        <li key={index} className="text-gray-700">
                          {format(parsedStart, "h:mm a")} -{" "}
                          {format(parsedEnd, "h:mm a")}
                        </li>
                      )
                    })}
                  </ul>
                )}
                <div className="flex flex-col sm:flex-row gap-2 justify-end items-end sm:items-center self-start">
                  <button
                    className="w-8 py-1 px-4 flex justify-center hover:bg-gray-200 rounded-md"
                    aria-label="delete special hour"
                    onClick={() => editSpecialAvailability(index)}
                  >
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </button>
                  <button
                    className="w-8 py-1 px-4 flex justify-center hover:bg-gray-200 rounded-md"
                    aria-label="edit special hour"
                    onClick={() => deleteAvailibility(availability.id)}
                  >
                    <FontAwesomeIcon icon={faTrashCan} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <MultipleDaysList />
    </div>
  )
}
