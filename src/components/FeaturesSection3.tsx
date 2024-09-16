import Image from "next/image"

const FeaturesSection3 = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-8">
      <div className="flex gap-4 items-center">
        <div className="w-20 h-[2px] bg-mutedTeal"></div>
        <h2 className="text-4xl font-medium text-center">Our Process</h2>
        <div className="w-20 h-[2px] bg-mutedTeal"></div>
      </div>
      <p className="text-center text-gray-600 text-sm dark:text-gray-200">
        This is our process. Lorem ipsum dolor sit amet consectetur adipisicing
        elit.{" "}
      </p>
      <div className="mt-12 w-full md:w-5/6 lg:w-3/4 lg:max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-10 p-4 md:p-0">
        <div className="flex flex-col items-center justify-center gap-4">
          <div>
            <Image
              src="/images/process1.svg"
              width={70}
              height={70}
              alt="icon of massage"
            />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-200">
            Step One
          </h3>
          <p className="text-center text-gray-600 text-sm dark:text-gray-200">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
            voluptatem, quos, quas dolorum, voluptatibus quidem.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-4">
          <div>
            <Image
              src="/images/process2.svg"
              width={70}
              height={70}
              alt="icon of massage"
            />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-200">
            Step Two
          </h3>
          <p className="text-center text-gray-600 text-sm dark:text-gray-200">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
            voluptatem, quos, quas dolorum, voluptatibus quidem.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-4">
          <div>
            <Image
              src="/images/process3.svg"
              width={70}
              height={70}
              alt="icon of massage"
            />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-200">
            Step Three
          </h3>
          <p className="text-center text-gray-600 text-sm dark:text-gray-200">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
            voluptatem, quos, quas dolorum, voluptatibus quidem.
          </p>
        </div>
      </div>
    </div>
  )
}

export default FeaturesSection3
