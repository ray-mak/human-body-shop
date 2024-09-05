"use client"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"

type FormData = {
  name: string
  price: number
  clientTime: number
  bookingTime: number
  description: string
}

type PropType = {
  id: string
  name: string
  description: string | null
  clientDuration: number
  price: number
  totalDuration: number
}

export default function EditServiceForm(props: PropType) {
  const [formData, setFormData] = useState<FormData>({
    name: props.name,
    price: props.price,
    clientTime: props.clientDuration,
    bookingTime: props.totalDuration,
    description: props.description || "",
  })

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)

  useEffect(() => {
    if (success) {
      redirect("/admin/services")
    }
  }, [success])

  function handleChange(
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    })
    setError(null)
  }

  return (
    <form className="flex flex-col gap-4">
      {error && <p className="text-red-500">{error}</p>}
      <label className="flex flex-col gap-1" htmlFor="name">
        <p className="font-medium">Service Name</p>
        <input
          type="text"
          className="border p-1 rounded-lg bg-white shadow"
          id="name"
          name="name"
          onChange={handleChange}
          value={formData.name}
          required
        />
      </label>
      <label className="flex flex-col gap-1" htmlFor="price">
        <p className="font-medium">
          Price{" "}
          <span className="text-sm text-gray-500">
            {"("}dollars{")"}
          </span>
        </p>
        <input
          type="number"
          className="border py-1 px-2 rounded-lg bg-white shadow"
          id="price"
          name="price"
          min="0"
          onChange={handleChange}
          value={formData.price === 0 ? "" : formData.price}
          required
        />
      </label>
      <label className="flex flex-col gap-1" htmlFor="clientTime">
        <p className="font-medium">
          Client Time
          <span className="text-sm text-gray-500">
            {" ("}in minutes - the amount of time the client will receive for
            this service
            {")"}
          </span>
        </p>
        <input
          type="number"
          className="border py-1 px-2 rounded-lg bg-white shadow"
          id="clientTime"
          name="clientTime"
          min={0}
          step={1}
          onChange={handleChange}
          value={formData.clientTime === 0 ? "" : formData.clientTime}
          required
        />
      </label>
      <label className="flex flex-col gap-1" htmlFor="bookingTime">
        <p className="font-medium">
          Booking Time
          <span className="text-sm text-gray-500">
            {" ("}in minutes - the total time blocked on the calendar, including
            preparation and cleanup
            {")"}
          </span>
        </p>
        <input
          type="number"
          className="border py-1 px-2 rounded-lg bg-white shadow"
          id="bookingTime"
          name="bookingTime"
          min={0}
          step={1}
          onChange={handleChange}
          value={formData.bookingTime === 0 ? "" : formData.bookingTime}
          required
        />
      </label>
      <label className="flex flex-col gap-1" htmlFor="description">
        <p className="font-medium">
          Description{" "}
          <span className="text-sm text-gray-500">
            {"("}Optional{")"}
          </span>{" "}
        </p>
        <textarea
          className="border p-1 rounded-lg bg-white shadow"
          id="description"
          name="description"
          onChange={handleChange}
          value={formData.description}
        />
      </label>
      <button
        type="submit"
        className="mt-8 bg-blue-500 text-white py-2 rounded-lg hover:opacity-80"
      >
        Save
      </button>
    </form>
  )
}
