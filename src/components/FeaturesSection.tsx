import Image from "next/image"

const FeaturesSection = () => {
  return (
    <div className="flex items-center justify-center py-32">
      <div className="w-full md:w-5/6 lg:w-3/4 lg:max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-10 p-4 md:p-0">
        <div className="flex flex-col items-center justify-center gap-4">
          <div>
            <Image
              src="/images/feature1.svg"
              width={70}
              height={70}
              alt="icon of massage"
            />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-200">
            Massage Service
          </h3>
          <p className="text-center text-gray-600 text-sm dark:text-gray-200">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
            voluptatem, quos, quas dolorum, voluptatibus quidem.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-4">
          <div>
            <Image
              src="/images/feature2.svg"
              width={70}
              height={70}
              alt="icon of massage"
            />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-200">
            Massage Benefit Two
          </h3>
          <p className="text-center text-gray-600 text-sm dark:text-gray-200">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
            voluptatem, quos, quas dolorum, voluptatibus quidem.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-4">
          <div>
            <Image
              src="/images/feature3.svg"
              width={70}
              height={70}
              alt="icon of massage"
            />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-200">
            Massage Benefit
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

export default FeaturesSection
