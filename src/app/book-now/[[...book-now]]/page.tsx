"use client"

import { useEffect, useState } from "react"
import getServices from "../../actions/service/getServices"
import SelectService from "../_components/SelectService"
import getAllAvailabilities from "../../actions/availabilities/getAllAvailabilities"
import SelectDateTime from "../_components/SelectDateTime"
import "../../../components/Calendar.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons"
import { SignIn, useAuth } from "@clerk/nextjs"
import ConfirmBooking from "../_components/ConfirmBooking"
import { isPossiblePhoneNumber } from "react-phone-number-input"
import { set } from "date-fns"
import { error } from "console"

export type ServiceData = {
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

export type DateType = {
  justDate: Date | null
  dateTime: Date | null
}

export type ConfirmationData = {
  notes: string
  phoneNumber: string | undefined
  cancellation: boolean
}

export type ErrorMessages = {
  phone: boolean
  cancellation: boolean
}

export default function BookNowPage() {
  const { isSignedIn } = useAuth()
  const [services, setServices] = useState<ServiceData[]>([])
  const [availabilities, setAvailabilities] = useState<Availability>()
  const [step, setStep] = useState<number>(0)
  const title = ["Services", "Select Date & Time"]
  const [selectedService, setSelectedService] = useState<ServiceData>()
  const [selectedDate, setSelectedDate] = useState<DateType>({
    justDate: null,
    dateTime: null,
  })
  const [confirmationData, setConfirmationData] = useState<ConfirmationData>({
    notes: "",
    phoneNumber: "",
    cancellation: false,
  })
  const [isValid, setIsValid] = useState<ErrorMessages>({
    phone: false,
    cancellation: false,
  })
  const [errorMessages, setErrorMessages] = useState<ErrorMessages>({
    phone: false,
    cancellation: false,
  })

  useEffect(() => {
    if (
      !confirmationData.phoneNumber ||
      !isPossiblePhoneNumber(confirmationData.phoneNumber)
    ) {
      setIsValid((prev) => ({ ...prev, phone: false }))
    }
    if (
      confirmationData.phoneNumber &&
      isPossiblePhoneNumber(confirmationData.phoneNumber)
    ) {
      setIsValid((prev) => ({ ...prev, phone: true }))
    }

    if (!confirmationData.cancellation) {
      setIsValid((prev) => ({ ...prev, cancellation: false }))
    } else if (confirmationData.cancellation) {
      setIsValid((prev) => ({ ...prev, cancellation: true }))
    }
  }, [confirmationData])

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
    const storedServiceId = sessionStorage.getItem("serviceId")
    const storedStep = sessionStorage.getItem("step")
    const storedSelectedDate = sessionStorage.getItem("selectedDate")

    if (storedServiceId) {
      setSelectedDate(JSON.parse(storedServiceId))
      sessionStorage.removeItem("serviceId")
    }

    if (storedStep) {
      setStep(parseInt(storedStep))
      sessionStorage.removeItem("step")
    }

    if (storedSelectedDate) {
      setSelectedDate(JSON.parse(storedSelectedDate))
      sessionStorage.removeItem("selectedDate")
    }
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
  }, [selectedService])

  function chooseService(index: number) {
    setSelectedService(services[index])
    setStep(1)
  }

  function goBack() {
    setStep(0)
    setSelectedService(undefined)
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
    setStep(2)
    if (!isSignedIn) {
      sessionStorage.setItem("selectedService", JSON.stringify(selectedService))
      sessionStorage.setItem("step", "2")
      sessionStorage.setItem("selectedDate", JSON.stringify(selectedDate))
    }
  }

  function handleNumberChange(value: string | undefined) {
    setConfirmationData({ ...confirmationData, phoneNumber: value })
    setErrorMessages({ ...errorMessages, phone: false })
  }

  function handleNotesChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setConfirmationData({ ...confirmationData, notes: event.target.value })
  }

  function handleCancellationChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setConfirmationData((prev) => ({
      ...prev,
      cancellation: event.target.checked,
    }))
    setErrorMessages({ ...errorMessages, cancellation: false })
  }

  function returnToDateTime() {
    setStep(1)
    setSelectedDate({
      justDate: null,
      dateTime: null,
    })
  }

  function handleConfirm() {
    setErrorMessages({
      phone: !isValid.phone,
      cancellation: !isValid.cancellation,
    })

    console.log(isValid, errorMessages, confirmationData.phoneNumber)
  }

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
                className="back-button text-blue-600 font-medium hover:underline ml-auto"
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
          {step === 2 && !isSignedIn && (
            <div className="flex justify-center">
              <SignIn
                path="/book-now"
                routing="path"
                signUpUrl="/sign-up"
                transferable={true}
                forceRedirectUrl="/book-now"
                signUpForceRedirectUrl="/book-now"
              />
            </div>
          )}
          {step == 2 && isSignedIn && selectedService && (
            <ConfirmBooking
              selectedDate={selectedDate}
              selectedService={selectedService}
              confirmationData={confirmationData}
              handleNumberChange={handleNumberChange}
              handleNotesChange={handleNotesChange}
              handleCancellationChange={handleCancellationChange}
              returnToDateTime={returnToDateTime}
              errorMessages={errorMessages}
              handleConfirm={handleConfirm}
            />
          )}
        </div>
      </div>
    </div>
  )
}
