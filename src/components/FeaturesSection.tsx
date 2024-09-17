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
          <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-200 text-center">
            Alignment
          </h2>
          <p className="text-center text-gray-600 text-sm dark:text-gray-200">
            Restore your body{"'"}s natural alignment that target pain, improve
            posture, and correct imbalances.
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
          <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-200 text-center">
            Mobility
          </h2>
          <p className="text-center text-gray-600 text-sm dark:text-gray-200">
            Boost your flexibility and performance with expert-guided stretching
            and mobilization protocols.
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
          <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-200 text-center">
            Therapy
          </h2>
          <p className="text-center text-gray-600 text-sm dark:text-gray-200">
            Relieve muscle tension and enhance circulation with unique
            therapeutic techniques like cupping.
          </p>
        </div>
      </div>
    </div>
  )
}

export default FeaturesSection
