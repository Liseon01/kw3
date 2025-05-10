import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"

// Sample calendar data
const calendarEvents = [
  { id: 1, dateRange: "01-27 - 02-01", event: "2025-1학기 예비수강신청" },
  { id: 2, dateRange: "02-13 - 02-17", event: "2025-1학기 수강신청" },
  { id: 3, dateRange: "02-17 - 02-23", event: "2025-1학기 등록" },
  { id: 4, dateRange: "02-22 - 02-22", event: "복학 접수 마감" },
  { id: 5, dateRange: "02-26 - 02-26", event: "졸업예배" },
  { id: 6, dateRange: "02-27 - 02-27", event: "학위수여식" },
]

export default function AcademicCalendar() {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableBody>
          {calendarEvents.map((event) => (
            <TableRow key={event.id}>
              <TableCell className="font-medium w-1/3">{event.dateRange}</TableCell>
              <TableCell>{event.event}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
