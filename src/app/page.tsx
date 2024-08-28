import CalendarComponent from "@/components/Calendar"
import "../components/Calendar.css"

export default function Home() {
  return (
    <div>
      <div className="flex">
        <div className="mt-20 w-full flex items-center justify-center"></div>
      </div>
      <CalendarComponent />
    </div>
  )
}
