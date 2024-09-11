import ScheduleComponent from "./_components/ScheduleComponent"

export default function AdminSchedulePage() {
  return (
    <div className="flex">
      <div className="mt-20 w-full flex flex-col gap-4 items-center justify-center">
        <h1>My Schedule</h1>
        <ScheduleComponent />
      </div>
    </div>
  )
}
