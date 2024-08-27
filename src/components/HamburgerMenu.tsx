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
      </div>
    </>
  )
}
