"use client"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

export default function HamburgerMenu() {
  const pathname = usePathname()
  const [hamburgerMenu, setHamburgerMenu] = useState(false)
  function toggleHamburger() {
    setHamburgerMenu((prevState) => !prevState)
  }

  function closeHamburger() {
    setHamburgerMenu(false)
  }
  return (
    <>
      <div
        onClick={toggleHamburger}
        className={`hamburger ${hamburgerMenu ? "opened" : ""}`}
      >
        <span className="bar bg-darkIndigo dark:bg-lightGray"></span>
        <span className="bar bg-darkIndigo dark:bg-lightGray"></span>
        <span className="bar bg-darkIndigo dark:bg-lightGray"></span>
      </div>
      <div className={`dimmer ${hamburgerMenu ? "opened" : ""}`}></div>
      <div
        className={`navmenu bg-lightGray dark:bg-deepGray md:bg-inherit flex gap-6 ml-auto items-center justify-center md:text-sm lg:text-base ${
          hamburgerMenu ? "opened" : ""
        } `}
      >
        <Link
          href="/"
          className={` font-semibold text-darkIndigo dark:text-lightGray transition-colors duration-300 ${
            pathname === "/" ? "underline" : ""
          }`}
          onClick={closeHamburger}
        >
          Home
        </Link>
        <Link
          href="/about"
          className={` font-semibold text-darkIndigo dark:text-lightGray transition-colors duration-300  ${
            pathname === "/about" ? "underline" : ""
          }`}
          onClick={closeHamburger}
        >
          About
        </Link>
        <Link
          href="/contact"
          className={` font-semibold text-darkIndigo dark:text-lightGray transition-colors duration-300 ${
            pathname === "/contact" ? "underline" : ""
          }`}
          onClick={closeHamburger}
        >
          Contact
        </Link>
        <SignedOut>
          <SignInButton forceRedirectUrl="/admin">
            <button className=" font-semibold text-gray-700 dark:text-gray-200 transition-colors duration-300">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <Link
          href="/book-now"
          className="px-4 py-1 rounded-lg bg-mutedTeal dark:bg-darkTeal text-white hover:opacity-80 transition-colors duration-300"
        >
          Book an Appointment
        </Link>
      </div>
    </>
  )
}
