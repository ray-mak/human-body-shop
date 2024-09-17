"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const AdminNav = () => {
  const pathname = usePathname()
  return (
    <div className="flex">
      <div className="fixed top-20 w-full flex items-center justify-center gap-4 md:gap-8 bg-gray-200 dark:bg-gray-800 py-4 z-[2]">
        <Link
          href="/admin"
          className={`font-semibold text-darkIndigo dark:text-lightGray transition-colors duration-300 ${
            pathname === "/admin" ? "underline" : ""
          }`}
        >
          Schedule
        </Link>
        <Link
          href="/admin/availability"
          className={`font-semibold text-darkIndigo dark:text-lightGray transition-colors duration-300 ${
            pathname === "/admin/availability" ? "underline" : ""
          }`}
        >
          Availability
        </Link>
        <Link
          href="/admin/services"
          className={`font-semibold text-darkIndigo dark:text-lightGray transition-colors duration-300 ${
            pathname === "/admin/services" ? "underline" : ""
          }`}
        >
          Services
        </Link>
      </div>
    </div>
  )
}

export default AdminNav
