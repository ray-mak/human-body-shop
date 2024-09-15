import Link from "next/link"
import React from "react"

const SectionImageBG = () => {
  return (
    <div className="image-section flex flex-col items-center justify-center py-20 gap-4">
      <div className="flex flex-col w-full md:w-5/6 lg:w-3/4 lg:max-w-6xl gap-4 p-4 md:p-0">
        <p className="text-white text-2xl font-semibold">Another heading</p>
        <p className="text-white text-lg font-medium">
          Another short description and call to action
        </p>
        <div className="mt-6">
          <Link
            href="/book-now"
            className="px-6 py-3 rounded-lg bg-mutedTeal text-white hover:bg-darkTeal transition-colors duration-300"
          >
            Book an Appointment
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SectionImageBG
