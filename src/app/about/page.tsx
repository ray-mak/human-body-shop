import Footer from "@/components/Footer"
import { faPhoneVolume } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Image from "next/image"
import React from "react"

const aboutPage = () => {
  return (
    <div>
      <div className="flex flex-col">
        <div className="mt-20 flex flex-col items-center justify-center">
          <div className="about-header flex items-center justify-center">
            <h1 className="text-white text-2xl md:text-4xl lg:text-5xl font-bold">
              About Us
            </h1>
          </div>
          <div className=" w-full md:w-5/6 lg:w-3/4 lg:max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-16 p-4 md:p-0 my-16">
            <div className="col-span-2 flex flex-col gap-4 justify-center">
              <h2 className="text-2xl font-bold">Our Mission</h2>
              <p className="text-gray-700 dark:text-gray-200">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem
                ipsum dolor sit amet consectetur adipisicing elit. Quisquam
                voluptatem, quos, quas dolorum, voluptatibus quidem.
              </p>
              <p className="text-gray-700 dark:text-gray-200">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Quisquam voluptatem, quos, quas dolorum, voluptatibus quidem.
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Quisquam voluptatem, quos, quas dolorum, voluptatibus quidem.
                Quisquam voluptatem, quos, quas dolorum, voluptatibus quidem.
              </p>
              <div className="mt-4 flex gap-4 text-darkIndigo dark:text-lightGray">
                <FontAwesomeIcon icon={faPhoneVolume} size="2x" />
                <p className="text-2xl font-semibold">555-555-5555 </p>
              </div>
            </div>
            <div className="flex items-center justify-center overflow-hidden">
              <Image
                src="/images/heroimg.webp"
                width={500}
                height={500}
                alt="picture of someone getting a massage"
                className="w-3/4 min-[480px]:w-1/2 md:w-full  border-8 border-slate-400 z-[2]"
              />
              <div className="absolute md:right-0 2xl:right-40 overflow-hidden">
                <Image
                  src="/images/gray-watercolor.webp"
                  width={500}
                  height={500}
                  alt="grey watercolor background"
                  className="md:w-[280px] lg:w-[340px] xl:w-[400px] hidden md:block dark:hidden"
                />
              </div>
            </div>
          </div>
          <div className="w-full flex items-center justify-center py-12 bg-mutedTeal dark:bg-darkTeal">
            <p className="text-white text-2xl font-semibold">
              Motivational quote like It's time to be pain free or something
            </p>
          </div>
          <div className="w-full flex flex-col items-center gap-6 md:w-5/6 lg:w-3/4 lg:max-w-6xl p-4 md:p-0 my-16">
            <div className="flex gap-4 items-center">
              <div className="w-20 h-[2px] bg-mutedTeal"></div>
              <h2 className="text-2xl font-medium">My Philosophy</h2>
              <div className="w-20 h-[2px] bg-mutedTeal"></div>
            </div>
            <p className="text-gray-700 dark:text-gray-200">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem
              ipsum dolor sit amet consectetur adipisicing elit. Quisquam
              voluptatem, quos, quas dolorum, voluptatibus quidem. Lorem ipsum
              dolor sit amet consectetur adipisicing elit. Quisquam voluptatem,
              quos, quas dolorum, voluptatibus quidem. Lorem ipsum dolor sit
              amet consectetur adipisicing elit. Quisquam voluptatem, quos, quas
              dolorum, voluptatibus quidem. Quisquam voluptatem, quos, quas
              dolorum, voluptatibus quidem.
            </p>
            <p className="text-gray-700 dark:text-gray-200">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem
              ipsum dolor sit amet consectetur adipisicing elit. Quisquam
              voluptatem, quos, quas dolorum, voluptatibus quidem. Lorem ipsum
              dolor sit amet consectetur adipisicing elit. Quisquam voluptatem,
              quos, quas dolorum, voluptatibus quidem. Lorem ipsum dolor sit
              amet consectetur adipisicing elit. Quisquam voluptatem, quos, quas
              dolorum, voluptatibus quidem. Quisquam voluptatem, quos, quas
              dolorum, voluptatibus quidem.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default aboutPage
