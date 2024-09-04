"use client"
import { useState } from "react"

export default function AddServiceForm() {
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    clientTime: 0,
    bookingTime: 0,
    description: "",
  })

  function handleChange(
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    })
  }

  console.log(formData)

  return (
    <form className="flex flex-col gap-4">
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
          value={formData.price}
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
          value={formData.clientTime}
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
          value={formData.bookingTime}
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
      <button className="mt-8 bg-blue-500 text-white py-2 rounded-lg hover:opacity-80">
        Save
      </button>
    </form>
  )
}
