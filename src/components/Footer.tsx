import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faInstagram,
  faSquareFacebook,
} from "@fortawesome/free-brands-svg-icons"
import Link from "next/link"
import { faArrowUp } from "@fortawesome/free-solid-svg-icons"
import Image from "next/image"

const Footer = () => {
  return (
    <div className="flex items-center justify-center bg-indigo-950">
      <div className="relative  md:w-5/6 lg:w-3/4 lg:max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 px-4 md:px-0 py-20 text-gray-200 gap-8">
        <div>
          <Image
            src="/images/hbslogo.svg"
            width={180}
            height={60}
            alt="human body shop logo"
          />
        </div>
        <div className="text-sm">
          <h3 className="text-lg font-semibold">Contact Us</h3>
          <table className="border-separate border-spacing-y-2">
            <tbody>
              <tr>
                <td className="align-top">Address:</td>
                <td className="pl-4">
                  <div>
                    319 Pinnacle St. Ste A
                    <br />
                    Perris, CA 92570
                  </div>
                </td>
              </tr>
              <tr>
                <td>Phone:</td>
                <td className="pl-4">951-990-3185</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="text-sm flex flex-col gap-2">
          <h3 className="font-semibold text-lg">Get Started</h3>
          <div>
            <Link href="/book-now" className="hover:underline">
              Book Now
            </Link>
          </div>
          <div>
            <Link href="/about" className="hover:underline">
              About Us
            </Link>
          </div>
          <div className="mt-2 flex gap-4">
            <Link
              href="https://www.facebook.com/TheHumanBodyShopLLC/"
              target="_blank"
            >
              <FontAwesomeIcon icon={faSquareFacebook} size="xl" />
            </Link>
            <Link
              href="https://www.instagram.com/thehumanbodyshop_/?hl=en"
              target="_blank"
            >
              <FontAwesomeIcon icon={faInstagram} size="xl" />
            </Link>
          </div>
        </div>
        <div className="absolute text-xs flex flex-col items-center top-[70%] md:top-1/3 right-0 md:right-0">
          Back to Top
          <div className="mt-4">
            <Link href={"#main"} className="p-2 bg-white rounded-lg">
              <FontAwesomeIcon
                icon={faArrowUp}
                size="lg"
                className="text-darkIndigo"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
