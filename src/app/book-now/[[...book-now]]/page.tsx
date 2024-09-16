"use client"

import { useEffect, useState } from "react"
import getServices from "../../actions/service/getServices"
import SelectService from "../_components/SelectService"
import getAllAvailabilities from "../../actions/availabilities/getAllAvailabilities"
import SelectDateTime from "../_components/SelectDateTime"
import "../../../styles/BookingCalendar.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons"
import { SignIn, useAuth } from "@clerk/nextjs"
import ConfirmBooking from "../_components/ConfirmBooking"
import { isPossiblePhoneNumber } from "react-phone-number-input"
import createAppointment, {
  AppointmentData,
} from "@/app/actions/appointments/createAppointment"
import { redirect } from "next/navigation"
import { format } from "date-fns"
import getSpecialist, {
  Appointment,
  Specialist,
} from "@/app/actions/service/getSpecialist"
import Footer from "@/components/Footer"
import { FadeLoader } from "react-spinners"

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
  const [specialistList, setSpecialistList] = useState<Specialist[]>([])
  const [selectedSpecialist, setSelectedSpecialist] = useState<string>()
  const [selectedService, setSelectedService] = useState<ServiceData>()
  const [specialistAppointments, setSpecialistAppointments] =
    useState<Appointment[]>()
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
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [loading])

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
        } else if (response.services) {
          setServices(response.services)
          setLoading(false)
        }
      } catch (error) {}
    }

    const fetchSpecialists = async () => {
      try {
        const response = await getSpecialist()
        if (response.error) {
        } else if (response.specialists) {
          setSpecialistList(response.specialists)
          if (response.specialists.length === 1) {
            setSelectedSpecialist(response.specialists[0].clerkStaffId)
          }
        }
      } catch (error) {}
    }

    fetchServices()
    fetchSpecialists()
  }, [])

  function handleSpecialistChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedSpecialist(event.target.value)
  }

  useEffect(() => {
    const storedServiceId = sessionStorage.getItem("serviceId")
    const storedStep = sessionStorage.getItem("step")
    const storedSelectedDate = sessionStorage.getItem("selectedDate")
    const storedSpecialist = sessionStorage.getItem("selectedSpecialist")

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

    if (storedSpecialist) {
      setSelectedSpecialist(storedSpecialist)
      sessionStorage.removeItem("selectedSpecialist")
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    const fetchAvailabilities = async () => {
      try {
        if (selectedSpecialist) {
          const response = await getAllAvailabilities(selectedSpecialist)
          if (response.error) {
          } else if (response.data) {
            setAvailabilities(response.data)
            setLoading(false)
          }
        }
      } catch (error) {}
    }

    fetchAvailabilities()
  }, [selectedService])

  useEffect(() => {
    if (selectedSpecialist) {
      const specialist = specialistList.find(
        (specialist) => specialist.clerkStaffId === selectedSpecialist
      )
      if (specialist) {
        setSpecialistAppointments(specialist.appointments)
      }
    }
  }, [selectedSpecialist])

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
      sessionStorage.setItem("selectedSpecialist", selectedSpecialist || "")
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
    setError(null)
  }

  function handleConfirm() {
    setErrorMessages({
      phone: !isValid.phone,
      cancellation: !isValid.cancellation,
    })

    if (
      selectedService?.name &&
      selectedService.clientDuration &&
      selectedService.totalDuration &&
      selectedDate.justDate &&
      selectedDate.dateTime &&
      confirmationData.phoneNumber !== ""
    ) {
      setLoading(true)
      const addAppointment = async (data: AppointmentData) => {
        const { error, message } = await createAppointment(data)
        if (error) {
          setError(error)
        } else if (message) {
          setLoading(false)
          setSuccess(true)
        }
      }
      const timeString = format(selectedDate.dateTime, "HH:mm")
      const appointmentData = {
        serviceType: selectedService.name,
        date: selectedDate.justDate,
        time: timeString,
        notes: confirmationData.notes,
        phoneNumber: confirmationData.phoneNumber || "",
        clientDuration: selectedService.clientDuration,
        totalDuration: selectedService.totalDuration,
      }

      addAppointment(appointmentData)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-90 z-50 flex items-center justify-center">
          <div>
            <FadeLoader color="#29325B" />
          </div>
        </div>
      )}

      <div className="flex-grow mt-20 md:mt-28 w-full flex flex-col gap-4 items-center justify-center p-4">
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
            <SelectService
              services={services}
              chooseService={chooseService}
              specialistList={specialistList}
              handleSpecialistChange={handleSpecialistChange}
              selectedSpecialist={selectedSpecialist}
            />
          )}
          {step === 1 && availabilities && (
            <SelectDateTime
              availabilities={availabilities}
              selectedDate={selectedDate}
              chooseDate={chooseDate}
              chooseTime={chooseTime}
              specialistAppointments={specialistAppointments}
              totalDuration={selectedService?.totalDuration}
              selectedSpecialist={selectedSpecialist ? selectedSpecialist : ""}
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
              error={error}
              success={success}
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
