"use client"

import { addAvailibilityServer } from "@/app/actions/addAvailibilities"
import getAvailabilities from "@/app/actions/getAvailabilities"
import {
  findOverlaps,
  isStartBeforeEnd,
} from "@/lib/validation/availabilityValidation"
import { useAuth } from "@clerk/nextjs"
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { ClipLoader } from "react-spinners"

type Availibility = { start: string; end: string }
type AvailibilityDay = { day: string; availibility: Availibility[] }
type Day = { day: string; availibility: Availibility[] }
type IsValid = {
  day: string
  isValid: {
    noEmptyInputs: boolean
    noOverlaps: boolean
    startBeforeEnd: boolean
  }
}
type ErrorMessage = {
  day: string
  error: { emptyInputs: boolean; overlaps: boolean; startBeforeEnd: boolean }
}
export default function AvalibilityForm() {
  const { isSignedIn } = useAuth()

  const [availibility, setAvailibility] = useState<AvailibilityDay[]>([])

  const [success, setSuccess] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchAvailabilities = async () => {
      if (isSignedIn) {
        try {
          const result = await getAvailabilities()
          if (result.error) {
            setAvailibility([
              { day: "Sunday", availibility: [] },
              {
                day: "Monday",
                availibility: [{ start: "09:00", end: "17:00" }],
              },
              {
                day: "Tuesday",
                availibility: [{ start: "09:00", end: "17:00" }],
              },
              {
                day: "Wednesday",
                availibility: [{ start: "09:00", end: "17:00" }],
              },
              {
                day: "Thursday",
                availibility: [{ start: "09:00", end: "17:00" }],
              },
              {
                day: "Friday",
                availibility: [{ start: "09:00", end: "17:00" }],
              },
              { day: "Saturday", availibility: [] },
            ])
            console.error("Error fetching availabilities")
          } else if (result.availabilities) {
            setAvailibility(result.availabilities)
          }
        } catch (error) {
          console.error("Error fetching availabilities")
        }
      }
    }
    fetchAvailabilities()
  }, [isSignedIn])

  const [isValid, setIsValid] = useState<IsValid[]>([
    {
      day: "Sunday",
      isValid: { noEmptyInputs: true, noOverlaps: true, startBeforeEnd: true },
    },
    {
      day: "Monday",
      isValid: { noEmptyInputs: true, noOverlaps: true, startBeforeEnd: true },
    },
    {
      day: "Tuesday",
      isValid: { noEmptyInputs: true, noOverlaps: true, startBeforeEnd: true },
    },
    {
      day: "Wednesday",
      isValid: { noEmptyInputs: true, noOverlaps: true, startBeforeEnd: true },
    },
    {
      day: "Thursday",
      isValid: { noEmptyInputs: true, noOverlaps: true, startBeforeEnd: true },
    },
    {
      day: "Friday",
      isValid: { noEmptyInputs: true, noOverlaps: true, startBeforeEnd: true },
    },
    {
      day: "Saturday",
      isValid: { noEmptyInputs: true, noOverlaps: true, startBeforeEnd: true },
    },
  ])

  const [errorMessage, setErrorMessage] = useState<ErrorMessage[]>([
    {
      day: "Sunday",
      error: { emptyInputs: false, overlaps: false, startBeforeEnd: true },
    },
    {
      day: "Monday",
      error: { emptyInputs: false, overlaps: false, startBeforeEnd: true },
    },
    {
      day: "Tuesday",
      error: { emptyInputs: false, overlaps: false, startBeforeEnd: true },
    },
    {
      day: "Wednesday",
      error: { emptyInputs: false, overlaps: false, startBeforeEnd: true },
    },
    {
      day: "Thursday",
      error: { emptyInputs: false, overlaps: false, startBeforeEnd: true },
    },
    {
      day: "Friday",
      error: { emptyInputs: false, overlaps: false, startBeforeEnd: true },
    },
    {
      day: "Saturday",
      error: { emptyInputs: false, overlaps: false, startBeforeEnd: true },
    },
  ])

  useEffect(() => {
    const overlaps = findOverlaps(availibility)
    if (overlaps.length > 0) {
      overlaps.forEach((overlap) => {
        setIsValid((prev) => {
          const newIsValid = [...prev]
          newIsValid[overlap.dayIndex].isValid.noOverlaps = false
          return newIsValid
        })
      })
    } else if (overlaps.length === 0) {
      setIsValid((prev) => {
        const newIsValid = [...prev]
        newIsValid.forEach((day) => {
          day.isValid.noOverlaps = true
        })
        return newIsValid
      })
    }

    const emptyInputs = availibility
      .map((day, index) => {
        const hasEmptyTimes = day.availibility.some(
          (time) => time.start === "" || time.end === ""
        )
        return hasEmptyTimes ? index : -1
      })
      .filter((index) => index !== -1)

    if (emptyInputs.length > 0) {
      emptyInputs.forEach((index) => {
        setIsValid((prev) => {
          const newIsValid = [...prev]
          newIsValid[index].isValid.noEmptyInputs = false
          return newIsValid
        })
      })
    } else if (emptyInputs.length === 0) {
      setIsValid((prev) => {
        const newIsValid = [...prev]
        newIsValid.forEach((day) => {
          day.isValid.noEmptyInputs = true
        })
        return newIsValid
      })
    }

    const endBeforeStart = availibility
      .map((day, index) => {
        const hasInvalidTimes = day.availibility.some(
          (time) => time.start >= time.end
        )
        return hasInvalidTimes ? index : -1
      })
      .filter((index) => index !== -1)

    if (endBeforeStart.length > 0) {
      endBeforeStart.forEach((index) => {
        setIsValid((prev) => {
          const newIsValid = [...prev]
          newIsValid[index].isValid.startBeforeEnd = false
          return newIsValid
        })
      })
    } else if (endBeforeStart.length === 0) {
      setIsValid((prev) => {
        const newIsValid = [...prev]
        newIsValid.forEach((day) => {
          day.isValid.startBeforeEnd = true
        })
        return newIsValid
      })
    }
  }, [availibility])

  const addAvailibility = (index: number) => {
    const newAvailibility = [...availibility]
    newAvailibility[index].availibility.push({ start: "", end: "" })
    setAvailibility(newAvailibility)
    resetErrorMessages()
  }

  const deleteAvailibility = (dayIndex: number, timeIndex: number) => {
    const newAvailibility = [...availibility]
    newAvailibility[dayIndex].availibility.splice(timeIndex, 1)
    setAvailibility(newAvailibility)
    resetErrorMessages()
  }

  const handleTimeChange = (
    dayIndex: number,
    timeIndex: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newAvailibility = [...availibility]
    const fieldName = event.target.name as "start" | "end"
    newAvailibility[dayIndex].availibility[timeIndex][fieldName] =
      event.target.value
    setAvailibility(newAvailibility)
    resetErrorMessages()
  }

  function handleSubmit(e: React.FormEvent<HTMLButtonElement>) {
    e.preventDefault()
    function updateErrors() {
      const updatedErrorMessages = isValid.map((object) => {
        return {
          day: object.day,
          error: {
            emptyInputs: object.isValid.noEmptyInputs ? false : true,
            overlaps: object.isValid.noOverlaps ? false : true,
            startBeforeEnd: object.isValid.startBeforeEnd ? false : true,
          },
        }
      })
      setErrorMessage(updatedErrorMessages)
    }
    updateErrors()

    const allValid = (): boolean => {
      return isValid.every((day) =>
        Object.values(day.isValid).every((value) => value)
      )
    }
    console.log(isValid)
    if (allValid()) {
      const clientAddAvailibility = async (availibility: AvailibilityDay[]) => {
        setLoading(true)
        const { message, error } = await addAvailibilityServer(availibility)
        if (error) {
          console.error("Error updating availabilities")
          setLoading(false)
        } else {
          console.log(message)
          setSuccess(true)
          setLoading(false)
        }
      }
      clientAddAvailibility(availibility)
    }
  }

  function resetErrorMessages() {
    const errorMessages = errorMessage.map((object) => {
      return {
        day: object.day,
        error: {
          emptyInputs: false,
          overlaps: false,
          startBeforeEnd: true,
        },
      }
    })
    setErrorMessage(errorMessages)
    setSuccess(false)
  }
  return (
    <div className="flex">
      {loading && (
        <div>
          <div className="loading-screen absolute w-full bg-white h-full z-10 opacity-80"></div>
          <div className="loading-screen absolute w-full h-full  flex items-center justify-center">
            <div className="p-12 bg-white flex flex-col gap-8 items-center justify-center bg-white z-20 border-2 border-blue-500 rounded-lg shadow-xl">
              <ClipLoader size={100} color={"rgb(59 130 246)"} />
              <p className="italic text-neutral-600">Updating...</p>
            </div>
          </div>
        </div>
      )}
      <div className="mt-20 w-full flex items-center justify-center">
        <form className="flex flex-col gap-4 p-4 border mb-20">
          <h1 className="text-xl font-semibold text-center">
            Manage Availability
          </h1>
          {success && (
            <div className="w-full bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-md">
              <p className="text-center">Availabilities updated successfully</p>
            </div>
          )}
          <div className="flex flex-col gap-2 sm:gap-8">
            {availibility.map((day, dayIndex) => {
              return (
                <div
                  key={dayIndex}
                  className="flex flex-col sm:grid sm:grid-cols-5 gap-4 items-center"
                >
                  <div
                    className={`${
                      day.availibility.length === 0
                        ? "self-start sm:self-center"
                        : "self-start"
                    } flex items-center h-12`}
                  >
                    <p>{day.day}</p>
                  </div>
                  <div className="w-full col-span-3 flex flex-col gap-2">
                    {day.availibility.length === 0 ? (
                      <p className="w-full text-gray-600 text-base">
                        Unavailable
                      </p>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {day.availibility.map((time, timeIndex) => {
                          const startBeforeEnd = isStartBeforeEnd(
                            availibility[dayIndex].availibility[timeIndex]
                              .start,
                            availibility[dayIndex].availibility[timeIndex].end
                          )
                          return (
                            <div key={timeIndex}>
                              <div className="flex gap-1 sm:gap-4 items-center">
                                <input
                                  type="time"
                                  name="start"
                                  className="w-30 sm:w-32 p-2 border border-gray-400 rounded-lg text-sm sm:text-base"
                                  onChange={(event) =>
                                    handleTimeChange(dayIndex, timeIndex, event)
                                  }
                                  value={
                                    availibility[dayIndex].availibility[
                                      timeIndex
                                    ].start
                                  }
                                />
                                <p> - </p>
                                <input
                                  type="time"
                                  name="end"
                                  className="w-30 sm:w-32 p-2 border border-gray-400 rounded-lg text-sm sm:text-base"
                                  onChange={(event) =>
                                    handleTimeChange(dayIndex, timeIndex, event)
                                  }
                                  value={
                                    availibility[dayIndex].availibility[
                                      timeIndex
                                    ].end
                                  }
                                />
                                <button
                                  type="button"
                                  className="py-2 px-4 rounded-md hover:bg-gray-100"
                                  onClick={() =>
                                    deleteAvailibility(dayIndex, timeIndex)
                                  }
                                >
                                  <FontAwesomeIcon icon={faXmark} />
                                </button>
                              </div>
                              {!startBeforeEnd && (
                                <div>
                                  <p className="mt-1 text-red-600">
                                    Choose a start time earlier than the end
                                    time.
                                  </p>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                    {errorMessage[dayIndex].error.overlaps && (
                      <div>
                        <p className="mt-1 text-red-600">
                          Please choose times that do not overlap.
                        </p>
                      </div>
                    )}
                    {errorMessage[dayIndex].error.emptyInputs && (
                      <div>
                        <p className="mt-1 text-red-600">
                          Time inputs cannot be empty.
                        </p>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    className={`h-12 py-2 px-4 rounded-md hover:bg-gray-100 ${
                      day.availibility.length === 0
                        ? "self-center"
                        : "self-center sm:self-start"
                    }`}
                    onClick={() => addAvailibility(dayIndex)}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
              )
            })}
          </div>
          <div className="w-screen sm:w-full fixed sm:relative bottom-0 left-0 p-2 bg-white py-4 sm:py-0 border-t">
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-md bg-blue-500 text-white hover:bg-blue-600"
              onClick={handleSubmit}
            >
              Save Availibilities
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
