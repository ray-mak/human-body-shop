import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/Navbar"
import { ClerkProvider } from "@clerk/nextjs"
import { Providers } from "@/providers"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "The Human Body Shop",
  description:
    "Optimizing the human body through addressing pain, posture, and performance.",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`min-h-screen transition-colors duration-300 ${poppins.className}`}
        >
          <Providers>
            <Navbar />
            <main>{children}</main>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}
