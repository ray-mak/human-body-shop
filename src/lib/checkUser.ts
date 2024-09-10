import { currentUser } from "@clerk/nextjs/server"
import { db } from "./db"
import { checkRole } from "../utils/roles"

//Check if user is an admin, if so, check if admin is in the db, if not, create a new admin. Do the same for users.

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
    const updatedUser = await db.user.update({
      where: {
        clerkUserId: user.id,
      },
      data: {
        email: user.emailAddresses[0].emailAddress,
        name: user.firstName,
      },
    })
    return updatedUser
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
