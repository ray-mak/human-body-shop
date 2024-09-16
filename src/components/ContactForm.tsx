"use client"

import React from "react"

const ContactForm = () => {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  console.log(formData)

  return (
    <form className="p-4">
      <div className="flex flex-col items-center justify-center gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label
            htmlFor="name"
            className="w-80 flex flex-col text-gray-600 dark:text-gray-200"
          >
            Name{"*"}
            <input
              type="text"
              id="name"
              name="name"
              className="p-2 border border-gray-300 dark:border-gray-700"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>
          <label
            htmlFor="email"
            className="flex flex-col text-gray-600 dark:text-gray-200"
          >
            Email
            <input
              type="email"
              id="email"
              name="email"
              className="p-2 border border-gray-300 dark:border-gray-700"
              value={formData.email}
              onChange={handleChange}
            />
          </label>
          <label
            htmlFor="phone"
            className="flex flex-col text-gray-600 dark:text-gray-200"
          >
            Phone{"*"}
            <input
              type="tel"
              id="phone"
              name="phone"
              className="p-2 border border-gray-300 dark:border-gray-700"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </label>
          <label
            htmlFor="subject"
            className="flex flex-col text-gray-600 dark:text-gray-200"
          >
            Subject
            <input
              type="text"
              id="subject"
              name="subject"
              className="p-2 border border-gray-300 dark:border-gray-700"
              value={formData.subject}
              onChange={handleChange}
            />
          </label>
          <label
            htmlFor="message"
            className="md:col-span-2 flex flex-col text-gray-600 dark:text-gray-200"
          >
            Message{"*"}
            <textarea
              id="message"
              name="message"
              className="p-2 border border-gray-300 dark:border-gray-700"
              rows={4}
              required
              value={formData.message}
              onChange={handleChange}
            />
          </label>
        </div>
        <button
          type="submit"
          className="px-6 py-2 rounded bg-mutedTeal dark:bg-darkTeal text-white hover:opacity-80 transition-colors duration-300"
        >
          Send Message
        </button>
      </div>
    </form>
  )
}

export default ContactForm
