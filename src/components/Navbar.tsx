import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import HamburgerMenu from "./HamburgerMenu"
import { checkUser } from "../lib/checkUser"

export async function Navbar() {
  const user = await checkUser()
  //   const pathname = usePathname()
  //   const [hamburgerMenu, setHamburgerMenu] = useState(false)
  //   function toggleHamburger() {
  //     setHamburgerMenu((prevState) => !prevState)
  //   }

  //   function closeHamburger() {
  //     setHamburgerMenu(false)
  //   }
  return (
    <nav className="navbar fixed z-20 flex w-full h-16 p-4 md:p-0 flex items-center justify-center bg-bgRetroDark dark:bg-bgRetroDarkMode shadow-xl">
      <div className="w-full md:w-5/6 lg:w-2/3 flex">
        <Link
          href="/"
          className={`text-4xl font-bold text-darkBlue dark:text-retroBlueDarkMode `}
        >
          LOGO
        </Link>
        <HamburgerMenu />
        {/* <div
          onClick={toggleHamburger}
          className={`hamburger ${hamburgerMenu ? "opened" : ""}`}
        >
          <span className="bar bg-darkBlue dark:bg-retroBlueDarkMode"></span>
          <span className="bar bg-darkBlue dark:bg-retroBlueDarkMode"></span>
          <span className="bar bg-darkBlue dark:bg-retroBlueDarkMode"></span>
        </div>
        <div className={`dimmer ${hamburgerMenu ? "opened" : ""}`}></div>
        <div
          className={`navmenu flex gap-6 ml-auto items-center justify-center ${
            hamburgerMenu ? "opened" : ""
          } `}
        >
          <Link
            href="/#profile"
            className={`text-3xl font-bold text-darkBlue dark:text-retroBlueDarkMode  ${
              pathname === "/"
                ? "underline text-retroRed dark:text-retroRedDarkMode"
                : ""
            }`}
            onClick={closeHamburger}
          >
            Home
          </Link>
          <Link
            href="/#projects"
            className={`text-3xl font-bold text-darkBlue dark:text-retroBlueDarkMode `}
            onClick={closeHamburger}
          >
            Projects
          </Link>
          <Link
            href="/#contact"
            className={`text-3xl font-bold text-darkBlue dark:text-retroBlueDarkMode  `}
            onClick={closeHamburger}
          >
            Contact
          </Link>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div> */}
      </div>
    </nav>
  )
}
