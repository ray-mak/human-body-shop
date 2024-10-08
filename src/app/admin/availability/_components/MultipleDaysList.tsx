"use client"

import deleteMultipleDaysOff from "@/app/actions/availabilities/deleteMultipleDaysOff"
import getMultipleDaysOff from "@/app/actions/availabilities/getMultipleDaysOff"
import { useAuth } from "@clerk/nextjs"
import { faTrashCan } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { format } from "date-fns"
import { useEffect, useState } from "react"

type DaysOffData = {
  id: string
  startDate: Date
  endDate: Date
}

export default function MultipleDaysList() {
  const { isSignedIn } = useAuth()
  const [daysOff, setDaysOff] = useState<DaysOffData[]>([])

  useEffect(() => {
    const fetchDaysOff = async () => {
      if (isSignedIn) {
        try {
          const response = await getMultipleDaysOff()
          if (response.error) {
            console.error(response.error)
          } else if (response.data) {
            setDaysOff(response.data)
          }
        } catch (error) {
          console.error(error)
        }
      }
    }
    fetchDaysOff()
  }, [isSignedIn])

  async function handleDelete(id: string) {
    const updatedDaysOff = daysOff.filter((day) => day.id !== id)
    setDaysOff(updatedDaysOff)
    try {
      const reponse = await deleteMultipleDaysOff(id)
      if (reponse.error) {
        console.error(reponse.error)
      } else if (reponse.message) {
        console.log(reponse.message)
      }
    } catch (error) {
      console.error(error)
    }
  }

  console.log(daysOff)
  return (
    <div className="border p-4 sm:p-6 rounded-lg flex flex-col gap-4">
      <h2 className="text-lg font-semibold mb-6">Extended Days Off List</h2>
      {daysOff.length === 0 && (
        <p className="text-gray-700 italic">No upcoming extended days off.</p>
      )}
      {daysOff.map((day) => {
        const start = format(day.startDate, "MMM d, yyyy")
        const end = format(day.endDate, "MMM d, yyyy")
        return (
          <div key={day.id} className="grid grid-cols-3">
            <p className="col-span-2">
              {start} - {end}
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                aria-label="delete"
                className="px-2 rounded-md hover:bg-gray-200"
                onClick={() => handleDelete(day.id)}
              >
                <FontAwesomeIcon icon={faTrashCan} />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
