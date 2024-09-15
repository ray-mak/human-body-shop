import Image from "next/image"
import Link from "next/link"

const FeaturesSection2 = () => {
  return (
    <div className="flex items-center justify-center bg-sky-50 dark:bg-darkIndigo relative">
      <div className="w-full md:w-5/6 lg:w-3/4 lg:max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 p-4 py-8 lg:p-0">
        <div className="relative lg:-ml-[16rem] 2xl:-ml-[24rem] lg:w-[calc(100%+16rem)] 2xl:w-[calc(100%+20rem)]">
          <Image
            src="/images/benefitimg.webp"
            width={500}
            height={500}
            alt="picture of someone getting a massage"
            className="object-cover h-full w-full"
          />
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-xl 2xl:text-3xl">
            <span className="text-darkTeal dark:text-gray-300 font-medium">
              Positive Effects
            </span>{" "}
            of
          </p>
          <p className="text-3xl 2xl:text-5xl font-semibold text-gray-800 dark:text-gray-200">
            Trigger Point Massage Therapy
          </p>

          <p className="text-gray-600 mt-4 text-sm 2xl:text-base dark:text-gray-300">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
            voluptatem, quos, quas dolorum, voluptatibus quidem.
          </p>
          <p className="text-gray-600 mt-2 text-sm 2xl:text-base dark:text-gray-300">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
            voluptatem, quos, quas dolorum, voluptatibus quidem. Lorem ipsum
            dolor sit amet consectetur adipisicing elit. Quisquam voluptatem,
            quos, quas dolorum, voluptatibus quidem.
          </p>
          <div className="flex flex-col md:flex-row gap-6 mt-8 items-center">
            <Link
              href="/about"
              className="text-darkTeal underline font-medium dark:text-gray-300"
            >
              Learn More
            </Link>
            <Link
              href="/book-now"
              className="px-6 py-3 rounded-lg bg-mutedTeal  text-white hover:opacity-80 transition-colors duration-300"
            >
              Book an Appointment
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeaturesSection2
