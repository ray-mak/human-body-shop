import Link from "next/link"
import HamburgerMenu from "./HamburgerMenu"
import { checkUser } from "../lib/checkUser"
import ThemeSwitch from "./ThemeSwitch"
import { checkRole } from "@/utils/roles"
import { auth } from "@clerk/nextjs/server"
import Image from "next/image"

export async function Navbar() {
  const user = await checkUser()
  const isAdmin = checkRole("admin")
  const { userId } = auth()

  return (
    <nav className="navbar fixed top-0 z-20 flex w-full h-20 p-4 md:p-0 flex items-center justify-center bg-white dark:bg-deepGray shadow-xl">
      <div className="w-full md:w-5/6 lg:w-3/4 lg:max-w-6xl flex items-center justify-center">
        <Link href="/" className={`text-4xl font-bold `}>
          <Image
            src="/images/hbslogo.svg"
            width={180}
            height={60}
            alt="human body shop logo"
          />
        </Link>
        <HamburgerMenu isAdmin={isAdmin} userId={userId} />
        <ThemeSwitch />
      </div>
    </nav>
  )
}
