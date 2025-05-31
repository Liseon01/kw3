"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"

interface CalendarEvent {
  id: number
  dateRange: string
  event: string
}

export default function AcademicCalendar() {
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("http://localhost:7070/calendar")
      .then((res) => {
        if (!res.ok) throw new Error("일정 데이터를 불러올 수 없습니다.")
        return res.json()
      })
      .then((data: CalendarEvent[]) => {
        setCalendarEvents(data)
      })
      .catch((err) => {
        console.error(err)
        setError("일정 데이터를 불러오는 데 실패했습니다.")
      })
  }, [])

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableBody>
          {calendarEvents.length > 0 ? (
            calendarEvents.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium w-1/3">{event.dateRange}</TableCell>
                <TableCell>{event.event}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2} className="text-center py-4 text-gray-500">
                {error || "일정을 불러오는 중입니다..."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
