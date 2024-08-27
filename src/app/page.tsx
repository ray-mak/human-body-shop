import CalendarComponent from "@/components/Calendar"
import "../components/Calendar.css"

export default function Home() {
  return (
    <main>
      <div className="flex">
        <div className="mt-16 w-full flex items-center justify-center"></div>
      </div>
      <CalendarComponent />
    </main>
  )
}
