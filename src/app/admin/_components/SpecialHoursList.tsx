"use client"

import deleteSpecialAvailibility from "@/app/actions/deleteSpecialAvailbility"
import getSpecialAvailabilities from "@/app/actions/getSpecialAvailibilities"
import { useAuth } from "@clerk/nextjs"
import { faPenToSquare, faTrashCan } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { format, parse } from "date-fns"
import { useEffect, useState } from "react"

type SpecialAvailability = {
  date: Date
  hours: { start: string; end: string }[]
  isFullDayOff: boolean
  id: string
}

//need to return ID in date to allow deletion
export default function SpecialHoursList() {
  const { isSignedIn } = useAuth()
  const [specialAvailabilities, setSpecialAvailabilities] = useState<
    SpecialAvailability[]
  >([])

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
    }
  }

  console.log(specialAvailabilities)
  return (
    <div>
      <h1>Special Hours List</h1>
      <div className="flex flex-col gap-8">
        {specialAvailabilities.map((availability) => {
          return (
            <div
              key={availability.id}
              className="grid grid-cols-3 gap-8 text-sm sm:text-base"
            >
              <h2>{format(availability.date, "MMM d yyyy")}</h2>
              {availability.isFullDayOff ? (
                <p className="text-gray-700">Unavailable</p>
              ) : (
                <ul className=" flex justify-center">
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
              <div className="flex gap-2 justify-end items-center">
                <button
                  className="w-8 py-1 px-4 flex justify-center hover:bg-gray-200 rounded-md"
                  aria-label="delete special hour"
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
  )
}
