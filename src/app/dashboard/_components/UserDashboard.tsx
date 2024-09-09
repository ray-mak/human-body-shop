"use client"
import getUserInfo, { UserData } from "@/app/actions/user/getUserInfo"
import { useAuth } from "@clerk/nextjs"
import { useEffect, useState } from "react"

export default function UserDashboard() {
  const { userId } = useAuth()

  const [userData, setUserData] = useState<UserData>()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserInfo()
        if (response.error) {
          console.error(response.error)
          return
        } else if (response.user) {
          setUserData(response.user)
        }
      } catch (error) {
        console.error(error)
      }
    }

    fetchUserData()
  }, [])

  console.log(userData)
  return (
    <div className="grid grid-cols-3">
      <div className="p-4">
        <div className="bg-white p-4 rounded-lg border shadow-md">
          <h2 className="text-2xl font-semibold">My Profile</h2>
          <p className="text-gray-500">View and edit your profile</p>
        </div>
      </div>
    </div>
  )
}
