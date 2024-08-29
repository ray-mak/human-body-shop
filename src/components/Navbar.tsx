import Link from "next/link"
import HamburgerMenu from "./HamburgerMenu"
import { checkUser } from "../lib/checkUser"

export async function Navbar() {
  const user = await checkUser()

  return (
    <nav className="navbar fixed z-20 flex w-full h-16 p-4 md:p-0 flex items-center justify-center bg-white dark:bg-bgRetroDarkMode shadow-xl">
      <div className="w-full md:w-5/6 lg:w-2/3 flex">
        <Link
          href="/"
          className={`text-4xl font-bold text-darkBlue dark:text-retroBlueDarkMode `}
        >
          LOGO
        </Link>
        <HamburgerMenu />
      </div>
    </nav>
  )
}
