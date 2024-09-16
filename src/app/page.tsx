import ContactForm from "@/components/ContactForm"
import FeaturesSection from "@/components/FeaturesSection"
import FeaturesSection2 from "@/components/FeaturesSection2"
import FeaturesSection3 from "@/components/FeaturesSection3"
import Footer from "@/components/Footer"
import ReviewsSection from "@/components/ReviewsSection"
import SectionImageBG from "@/components/SectionImageBG"
import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <div>
      <div className="flex flex-col">
        <div
          id="main"
          className="hero-section mt-20 flex items-center justify-center"
        >
          <div className="w-full md:w-5/6 lg:w-3/4 lg:max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-16 p-4 md:p-0 mt-6 md:mt-0">
            <div className="flex flex-col justify-center">
              <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold">
                Headline addressing the clients's needs and problems
              </h1>
              <p className="md:text-lg mt-8">
                Subheadline that explains the services and benefits of the
                service and how it can help the client. Lorem ipsum dolor sit
                amet, consectetur adipiscing elit.
              </p>
              <div className="mt-12 self-start">
                <Link
                  href="book-now"
                  className="px-6 py-3 rounded-lg bg-mutedTeal dark:bg-darkTeal text-white hover:opacity-80 transition-colors duration-300"
                >
                  Book an Appointment
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Image
                src="/images/heroimg.webp"
                width={500}
                height={500}
                alt="picture of someone getting a massage"
                className="rounded-2xl w-3/4 min-[480px]:w-1/2 md:w-full"
              />
            </div>
          </div>
        </div>
        <FeaturesSection />
        <FeaturesSection2 />
        <FeaturesSection3 />
        <SectionImageBG />
        <ReviewsSection />
        <div className="mt-6 py-12 bg-gray-100 dark:bg-gray-800">
          <h2 className="text-2xl font-semibold text-center mb-2">
            Have a Question?
          </h2>
          <ContactForm />
        </div>
        <Footer />
      </div>
    </div>
  )
}
