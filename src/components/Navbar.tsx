import Link from "next/link"
import HamburgerMenu from "./HamburgerMenu"
import { checkUser } from "../lib/checkUser"
import ThemeSwitch from "./ThemeSwitch"

export async function Navbar() {
  const user = await checkUser()

  return (
    <nav className="navbar fixed z-20 flex w-full h-20 p-4 md:p-0 flex items-center justify-center bg-white dark:bg-deepGray shadow-xl">
      <div className="w-full md:w-5/6 lg:w-3/4 lg:max-w-6xl flex items-center justify-center">
        <Link href="/" className={`text-4xl font-bold `}>
          LOGO
        </Link>
        <HamburgerMenu />
        <ThemeSwitch />
      </div>
    </nav>
  )
}
