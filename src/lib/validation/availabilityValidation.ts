type Day = { day: string; availibility: Availibility[] }
type Availibility = { start: string; end: string }

function isStartBeforeEnd(start: string, end: string): boolean {
  if (start === "" || end === "") {
    return true
  }
  return start < end
}

function doTimesNotOverlap(a: Availibility, b: Availibility): boolean {
  return (
    (a.start < b.start && a.end < b.start) ||
    (b.start < a.start && b.end < a.start)
  )
}

function findOverlaps(days: Day[]): { dayIndex: number }[] {
  const overlaps: { dayIndex: number }[] = []
  days.forEach((day, dayIndex) => {
    const availibility = day.availibility
    for (let i = 0; i < availibility.length; i++) {
      for (let j = i + 1; j < availibility.length; j++) {
        if (!doTimesNotOverlap(availibility[i], availibility[j])) {
          overlaps.push({ dayIndex })
        }
      }
    }
  })
  return overlaps
}

export { isStartBeforeEnd, doTimesNotOverlap, findOverlaps }
