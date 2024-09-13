"use client"

import getPreferences from "@/app/actions/availabilities/getPreferences"
import updatePreferences, {
  PreferenceData,
} from "@/app/actions/availabilities/updatePreferences"
import { useAuth } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"

export default function PreferenceForm() {
  const { userId } = useAuth()
  const [preferences, setPreferences] = useState<PreferenceData>({
    interval: 30,
    maxDays: 7,
  })

  const [success, setSuccess] = useState(false)
  useEffect(() => {
    const fetchPreferences = async (id: string) => {
      try {
        const response = await getPreferences(id)
        if (response.error) {
          console.error(response.error)
        } else if (response.staffPreference) {
          setPreferences(response.staffPreference)
        }
      } catch (error) {
        console.error(error)
      }
    }
    if (userId) {
      fetchPreferences(userId)
    }
  }, [userId])

  useEffect(() => {
    if (success) {
      redirect("/admin")
    }
  }, [success])

  function submitPreferences() {
    if (preferences.interval && preferences.maxDays) {
      const updateStaffPreferences = async (data: PreferenceData) => {
        try {
          const { error, message } = await updatePreferences(data)
          if (error) {
            console.error(error)
          } else {
            console.log(message)
            setSuccess(true)
          }
        } catch (error) {
          console.error(error)
        }
      }
      const data = {
        interval: parseInt(preferences.interval.toString()),
        maxDays: parseInt(preferences.maxDays.toString()),
      }
      updateStaffPreferences(data)
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setPreferences((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  console.log(preferences)
  return (
    <div className="flex">
      <div className="mt-20 w-full flex flex-col gap-4 items-center justify-center p-4">
        <h1 className="text-2xl font-semibold">Manage Preferences</h1>
        <p className="text-gray-500 text-center">
          Set the time interval and maximum days on your availability calendar.
        </p>
        <label htmlFor="interval">
          <p>Time Interval in Minutes</p>
          <input
            type="number"
            name="interval"
            value={preferences.interval}
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-2"
            step={1}
          />
        </label>
        <label htmlFor="maxDays">
          <p>Max Days</p>
          <input
            type="number"
            name="maxDays"
            value={preferences.maxDays}
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-2"
            step={1}
          />
        </label>
        <button
          className="bg-blue-500 text-white p-2 rounded-md mt-6"
          onClick={submitPreferences}
        >
          Save Preferences
        </button>
      </div>
    </div>
  )
}
