import ContactForm from "@/components/ContactForm"
import Footer from "@/components/Footer"
import { faEnvelope } from "@fortawesome/free-regular-svg-icons"
import {
  faMapLocationDot,
  faPhoneVolume,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"

const contactPage = () => {
  return (
    <div>
      <div className="flex flex-col items-center">
        <div className="w-full mt-20 flex flex-col items-center justify-center">
          <div className="about-header flex items-center justify-center">
            <h1 className="text-white text-2xl md:text-4xl lg:text-5xl font-bold">
              Contact Us
            </h1>
          </div>
        </div>
        <div className="w-full flex flex-col items-center justify-center gap-6 md:w-5/6 lg:w-3/4 lg:max-w-6xl p-4 md:p-0 my-8 md:my-16">
          <div className="flex gap-4 items-center">
            <div className="w-12 sm:w-20 h-[2px] bg-mutedTeal"></div>
            <h2 className="text-xl sm:text-2xl font-medium">Get in Touch</h2>
            <div className="w-12 sm:w-20 h-[2px] bg-mutedTeal"></div>
          </div>
          <p className="text-gray-700 dark:text-gray-200 text-center">
            Reach out today to schedule your session or ask any questions—your
            path to better health begins here!
          </p>
        </div>
        <div className="w-full md:w-5/6 lg:w-3/4 lg:max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-10 p-4 md:p-0">
          <div className="flex flex-col items-center justify-center gap-6 hover:bg-gray-50 dark:hover:bg-gray-900 transition duration-300 hover:shadow-xl py-4 rounded-md">
            <FontAwesomeIcon
              icon={faMapLocationDot}
              style={{ color: "#5D98A6" }}
              size="4x"
            />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-200 mt-2">
              Address
            </h3>
            <div className="flex flex-col gap-1 text-center text-gray-600 dark:text-gray-200">
              <p>319 Pinnacle St. Ste A</p>
              <p>Perris, CA 92570</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-6 hover:bg-gray-50 dark:hover:bg-gray-900 transition duration-300 hover:shadow-xl py-4 rounded-md">
            <FontAwesomeIcon
              icon={faPhoneVolume}
              style={{ color: "#5D98A6" }}
              size="4x"
            />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-200 mt-2">
              Phone
            </h3>
            <div className="flex flex-col gap-1 text-center text-gray-600 dark:text-gray-200">
              <p>951-990-3185</p>
              <br />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-6 hover:bg-gray-50 dark:hover:bg-gray-900 transition duration-300 hover:shadow-xl py-4 rounded-md">
            <FontAwesomeIcon
              icon={faEnvelope}
              style={{ color: "#5D98A6" }}
              size="4x"
            />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-200 mt-2">
              Email
            </h3>
            <div className="flex flex-col gap-1 text-center text-gray-600 dark:text-gray-200">
              <p>thehumanbodyshopllc@gmail.com</p>
              <br />
            </div>
          </div>
        </div>
        <div className="my-16">
          <ContactForm />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default contactPage
