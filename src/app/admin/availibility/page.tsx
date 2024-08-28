"use client"
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"
import { render } from "react-dom"

export default function ManageAvailibilityPage() {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ]
  //an array of objects for each day of the week. Each object has a day property and an availibility property which is an array of objects with a start and end property. Initially, monday through friday are set to have a start and end time of 9:00am and 5:00pm. Saturday and sunday are empty. Create a state for this array and a function to update the state.
  const [availibility, setAvailibility] = useState([
    { day: "Sunday", availibility: [] },
    { day: "Monday", availibility: [{ start: "09:00", end: "17:00" }] },
    { day: "Tuesday", availibility: [{ start: "09:00", end: "17:00" }] },
    { day: "Wednesday", availibility: [{ start: "09:00", end: "17:00" }] },
    { day: "Thursday", availibility: [{ start: "09:00", end: "17:00" }] },
    { day: "Friday", availibility: [{ start: "09:00", end: "17:00" }] },
    { day: "Saturday", availibility: [] },
  ])

  const addAvailibility = (index: number) => {
    const newAvailibility = [...availibility]
    newAvailibility[index].availibility.push({ start: "", end: "" })
    setAvailibility(newAvailibility)
  }

  const deleteAvailibility = (dayIndex: number, timeIndex: number) => {
    const newAvailibility = [...availibility]
    newAvailibility[dayIndex].availibility.splice(timeIndex, 1)
    setAvailibility(newAvailibility)
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
  }

  console.log(availibility)

  return (
    <div className="flex">
      <div className="mt-20 w-full flex items-center justify-center">
        <div className="flex flex-col gap-4">
          <h1>Manage Availibility</h1>
          <div className="flex flex-col gap-8">
            {availibility.map((day, dayIndex) => {
              return (
                <div
                  key={dayIndex}
                  className="grid grid-cols-5 gap-4 items-center"
                >
                  <div
                    className={`${
                      day.availibility.length === 0
                        ? "self-center"
                        : "self-start"
                    } flex items-center h-12`}
                  >
                    <p>{day.day}</p>
                  </div>
                  <div className="col-span-3 flex flex-col gap-2">
                    {day.availibility.length === 0 ? (
                      <p className="text-gray-600">Unavailable</p>
                    ) : (
                      day.availibility.map((time, timeIndex) => {
                        return (
                          <div
                            key={timeIndex}
                            className="flex gap-4 items-center"
                          >
                            <input
                              type="time"
                              name="start"
                              className="w-32 p-2 border border-gray-400 rounded-lg "
                              onChange={(event) =>
                                handleTimeChange(dayIndex, timeIndex, event)
                              }
                              value={
                                availibility[dayIndex].availibility[timeIndex]
                                  .start
                              }
                            />
                            <p> - </p>
                            <input
                              type="time"
                              name="end"
                              className="w-32 p-2 border border-gray-400 rounded-lg"
                              onChange={(event) =>
                                handleTimeChange(dayIndex, timeIndex, event)
                              }
                              value={
                                availibility[dayIndex].availibility[timeIndex]
                                  .end
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
                        )
                      })
                    )}
                  </div>
                  <button
                    type="button"
                    className={`h-12 py-2 px-4 rounded-md hover:bg-gray-100 ${
                      day.availibility.length === 0
                        ? "self-center"
                        : "self-start"
                    }`}
                    onClick={() => addAvailibility(dayIndex)}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
