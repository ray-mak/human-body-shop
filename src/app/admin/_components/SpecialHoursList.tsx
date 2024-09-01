"use client"

import getSpecialAvailabilities from "@/app/actions/getSpecialAvailibilities"
import { useAuth } from "@clerk/nextjs"
import { useEffect } from "react"

//need to return ID in date to allow deletion
export default function SpecialHoursList() {
  const { isSignedIn } = useAuth()

  useEffect(() => {
    const fetchSpecialAvailabilities = async () => {
      if (isSignedIn) {
        try {
          const response = await getSpecialAvailabilities()
          if (response.error) {
            console.error(response.error)
          } else if (response.response) {
            console.log(response.response)
          }
        } catch (error) {
          console.error("Error fetching special avalibilities", error)
        }
      }
    }
    fetchSpecialAvailabilities()
  }, [isSignedIn])
  return (
    <div>
      <h1>Special Hours List</h1>
    </div>
  )
}
