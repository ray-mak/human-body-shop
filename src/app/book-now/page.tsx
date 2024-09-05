"use client"

import { useEffect, useState } from "react"
import getServices from "../actions/service/getServices"
import SelectService from "./_components/SelectService"
import getAllAvailabilities from "../actions/availabilities/getAllAvailabilities"
import SelectDateTime from "./_components/SelectDateTime"
import "../../components/Calendar.css"
import { set } from "date-fns"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons"

type ServiceData = {
  id: string
  name: string
  description: string | null
  clientDuration: number
  price: number
  totalDuration: number
}

export type Availability = {
  weeklyAvailabilities: WeeklyAvalability[]
  multipleDaysOff: MultiDayOff[]
  specialAvailabilities: SpecialAvailability[]
}

export type SpecialAvailability = {
  date: Date
  hours: { start: string; end: string }[]
  isFullDayOff: boolean
  id: string
}

export type MultiDayOff = {
  id: string
  startDate: Date
  endDate: Date
}

export type WeeklyAvalability = {
  day: string
  dayOfWeek: number
  availibility: TimeData[]
}

export type TimeData = {
  start: string
  end: string
}

interface DateType {
  justDate: Date | null
  dateTime: Date | null
}

export default function BookNowPage() {
  const [services, setServices] = useState<ServiceData[]>([])
  const [availabilities, setAvailabilities] = useState<Availability>()
  const [step, setStep] = useState<number>(0)
  const [title, setTitle] = useState<string[]>([
    "Services",
    "Select Date & Time",
  ])
  const [bookingInfo, setBookingInfo] = useState({
    serviceId: "",
  })
  const [selectedDate, setSelectedDate] = useState<DateType>({
    justDate: null,
    dateTime: null,
  })

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getServices()
        if (response.error) {
          console.error(response.error)
        } else if (response.services) {
          setServices(response.services)
        }
      } catch (error) {
        console.error(error)
      }
    }
    fetchServices()
  }, [])

  useEffect(() => {
    const fetchAvailabilities = async () => {
      try {
        const response = await getAllAvailabilities(
          "user_2lDYOChTXgLXkwMLfvgXUzlY0eC"
        )
        if (response.error) {
          console.error(response.error)
        } else if (response.data) {
          setAvailabilities(response.data)
        }
      } catch (error) {
        console.error(error)
      }
    }

    fetchAvailabilities()
  }, [bookingInfo])

  function chooseService(serviceId: string) {
    setBookingInfo({
      ...bookingInfo,
      serviceId,
    })
    setStep(1)
  }

  function goBack() {
    setStep(0)
    setBookingInfo({
      serviceId: "",
    })
    setSelectedDate({
      justDate: null,
      dateTime: null,
    })
  }

  function chooseDate(date: Date) {
    setSelectedDate((prev) => ({ ...prev, justDate: date }))
  }

  function chooseTime(time: Date) {
    setSelectedDate((prev) => ({ ...prev, dateTime: time }))
  }

  console.log(bookingInfo, selectedDate)
  return (
    <div className="flex">
      <div className="mt-20 md:mt-28 w-full flex flex-col gap-4 items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="flex items-center mb-4 md:mb-8">
            <h1 className="text-xl sm:text-2xl md:text-4xl font-semibold ">
              {title[step]}
            </h1>
            {step === 1 && (
              <button
                onClick={goBack}
                className="text-blue-600 font-medium hover:underline ml-auto"
              >
                <FontAwesomeIcon icon={faChevronLeft} className="mr-2" />
                Back
              </button>
            )}
          </div>
          {step === 0 && (
            <SelectService services={services} chooseService={chooseService} />
          )}
          {step === 1 && availabilities && (
            <SelectDateTime
              availabilities={availabilities}
              selectedDate={selectedDate}
              chooseDate={chooseDate}
              chooseTime={chooseTime}
            />
          )}
        </div>
      </div>
    </div>
  )
}
