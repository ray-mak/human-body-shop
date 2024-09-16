"use server"

import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import {
  addMinutes,
  format,
  getDay,
  isAfter,
  isBefore,
  parse,
  set,
} from "date-fns"
import { sendSMS } from "@/lib/twilio"

export type AppointmentData = {
  serviceType: string
  date: Date
  time: string
  notes?: string
  phoneNumber: string
  clientDuration: number
  totalDuration: number
}

export default async function createAppointment(
  appointmentData: AppointmentData
): Promise<{ message?: string; error?: string }> {
  const { userId } = auth()
  if (!userId) {
    return { error: "User not found" }
  }

  const {
    serviceType,
    date,
    time,
    notes,
    phoneNumber,
    clientDuration,
    totalDuration,
  } = appointmentData

  if (
    !serviceType ||
    !date ||
    !time ||
    !phoneNumber ||
    !clientDuration ||
    !totalDuration
  ) {
    return { error: "Service type, date, time and phone number are required" }
  }

  const appointmentDates = await db.appointment.findMany({
    where: {
      date: date,
    },
  })

  const appointmentStartTime = parse(time, "HH:mm", new Date(date))
  const appointmentEndTime = addMinutes(appointmentStartTime, clientDuration)

  const conflictingAppointments = appointmentDates.some((appointment) => {
    const existingAppointmentStartTime = parse(
      appointment.startTime,
      "HH:mm",
      new Date(date)
    )

    const existingAppointmentEndTime = parse(
      appointment.endTime,
      "HH:mm",
      new Date(date)
    )

    const startsBeforeEnd = isBefore(
      appointmentStartTime,
      existingAppointmentEndTime
    )
    const endsAfterStart = isAfter(
      appointmentEndTime,
      existingAppointmentStartTime
    )

    return startsBeforeEnd && endsAfterStart
  })

  if (conflictingAppointments) {
    return { error: "Appointment time conflicts with existing appointment" }
  }

  const now = new Date()
  const appointmentDateTime = set(new Date(date), {
    hours: appointmentStartTime.getHours(),
    minutes: appointmentStartTime.getMinutes(),
  })
  if (isBefore(appointmentDateTime, now)) {
    return { error: "Appointment date is in the past" }
  }

  const extendedTimeOffs = await db.extendedTimeOff.findMany({
    where: {
      OR: [{ startDate: { lte: date }, endDate: { gte: date } }],
    },
  })
  if (extendedTimeOffs.length > 0) {
    return { error: "Appointment date is during time off" }
  }

  const specialHours = await db.specialAvailability.findMany({
    where: {
      date: date,
    },
  })

  if (specialHours.length > 0) {
    const isFullDayOff = specialHours.some((hours) => hours.isFullDayOff)
    if (isFullDayOff) {
      return { error: "Appointment date is during full day off" }
    }

    const isWithinSpecialHours = specialHours.some((hours) => {
      const specialStartTime = parse(hours.startTime, "HH:mm", new Date(date))
      const specialEndTime = parse(hours.endTime, "HH:mm", new Date(date))

      return (
        isBefore(appointmentStartTime, specialEndTime) &&
        isAfter(appointmentEndTime, specialStartTime)
      )
    })
    if (!isWithinSpecialHours) {
      return { error: "Appointment time is not within special hours" }
    }
  } else {
    const dayOfWeek = getDay(new Date(date))

    const regularHours = await db.availability.findMany({
      where: {
        dayOfWeek: dayOfWeek,
      },
    })

    const isWithinRegularHours = regularHours.some((hours) => {
      const regularStartTime = parse(hours.startTime, "HH:mm", new Date(date))
      const regularEndTime = parse(hours.endTime, "HH:mm", new Date(date))

      return (
        isBefore(appointmentStartTime, regularEndTime) &&
        isAfter(appointmentEndTime, regularStartTime)
      )
    })
    if (!isWithinRegularHours) {
      return { error: "Appointment time is not within regular hours" }
    }
  }

  const appointmentEndTimeTotal = addMinutes(
    appointmentStartTime,
    totalDuration
  )
  const endTimeString = format(appointmentEndTimeTotal, "HH:mm")
  const newNotes = notes || ""
  try {
    await db.appointment.create({
      data: {
        serviceType,
        date,
        startTime: time,
        endTime: endTimeString,
        clientDuration,
        totalDuration,
        userNote: newNotes,
        staffId: "user_2lDYOChTXgLXkwMLfvgXUzlY0eC",
        userId,
      },
    })

    await db.user.update({
      where: {
        clerkUserId: userId,
      },
      data: {
        phone: phoneNumber,
      },
    })

    const appointmentDate = new Date(date)
    const [hours, minutes] = time.split(":").map(Number)
    appointmentDate.setHours(hours, minutes)
    const formattedAppointmentDate = format(
      appointmentDate,
      "M/d/yyyy 'at' h:mm a"
    )

    // await sendSMS(
    //   phoneNumber,
    //   `Your appointment with The Human Body Shop has been scheduled for ${formattedAppointmentDate}.`
    // )

    // await sendSMS(
    //   "9519903113",
    //   `You have a new appointment scheduled for ${formattedAppointmentDate}.`
    // )

    return {
      message: "Appointment created successfully and user phone updated",
    }
  } catch (error) {
    console.error(error)
    return { error: "Failed to create appointment" }
  }
}
