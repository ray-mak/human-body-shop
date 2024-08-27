import { currentUser } from "@clerk/nextjs/server"
import { db } from "./db"
import { checkRole } from "../utils/roles"

export const checkUser = async () => {
  if (checkRole("admin")) {
    const admin = await currentUser()
    if (!admin) {
      return null
    }

    const loggedInAdmin = await db.staff.findUnique({
      where: {
        clerkStaffId: admin.id,
      },
    })

    if (loggedInAdmin) {
      return loggedInAdmin
    }

    const newAdmin = await db.staff.create({
      data: {
        clerkStaffId: admin.id,
        email: admin.emailAddresses[0].emailAddress,
        name: admin.firstName,
      },
    })
    return newAdmin
  }

  const user = await currentUser()
  if (!user) {
    return null
  }

  const loggedInUser = await db.user.findUnique({
    where: {
      clerkUserId: user.id,
    },
  })

  if (loggedInUser) {
    return loggedInUser
  }

  if (!loggedInUser && !checkRole("admin")) {
    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        email: user.emailAddresses[0].emailAddress,
        name: user.firstName,
      },
    })

    return newUser
  }
}
