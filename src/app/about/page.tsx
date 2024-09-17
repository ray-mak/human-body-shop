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
                At The Human Body Shop, our mission is to help you live a
                pain-free, active life by optimizing the way your body moves and
                functions.
              </p>
              <p className="text-gray-700 dark:text-gray-200">
                We are dedicated to providing personalized, effective treatments
                that address the root cause of your discomfort, whether it{"'"}s
                through relieving pain, improving posture, or enhancing
                performance.
              </p>
              <p className="text-gray-700 dark:text-gray-200">
                By combining expert bodywork, corrective exercises, and tailored
                wellness strategies, we empower you to take control of your
                health and achieve long-term results. Our goal is to not only
                help you feel better today, but to ensure you stay healthy and
                active for the future.
              </p>
              <div className="mt-4 flex gap-4 text-darkIndigo dark:text-lightGray">
                <FontAwesomeIcon icon={faPhoneVolume} size="2x" />
                <p className="text-2xl font-semibold">951-990-3185</p>
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
              Optimize your body's potential
            </p>
          </div>
          <div className="w-full flex flex-col items-center gap-6 md:w-5/6 lg:w-3/4 lg:max-w-6xl p-4 md:p-0 my-16">
            <div className="flex gap-4 items-center">
              <div className="w-20 h-[2px] bg-mutedTeal"></div>
              <h2 className="text-2xl font-medium">My Philosophy</h2>
              <div className="w-20 h-[2px] bg-mutedTeal"></div>
            </div>
            <p className="text-gray-700 dark:text-gray-200">
              Kevin Mai is a certified Personal Trainer and Massage therapist
              who{"'"}s obsessed with human optimization. His passion for this
              field was first ignited when he began his journey in bodybuilding.
              Mesmerized by the aesthetics of professional bodybuilders, he too
              was inspired by the idea of artfully sculpting his body for
              symmetry and proportion and reaching his genetic potential.
            </p>
            <p className="text-gray-700 dark:text-gray-200">
              However, as he advanced in his profession, he started to notice
              physical imbalances within his body and those of his clients and
              was eventually led down the path of posture, functional training,
              corrective exercise, holistic health, and spirituality.
            </p>
            <p className="text-gray-700 dark:text-gray-200">
              After relentlessly trying to figure out musculoskeletal issues for
              himself and others and working with many different practitioners
              with limited results, he decided to take matters into his own
              hands and become a practitioner himself. His goal is to provide
              the most effective and powerful mind-body alignment service in the
              world. The result? The Human Body Shop
            </p>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default aboutPage
