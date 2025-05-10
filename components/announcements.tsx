import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"

// Sample announcement data
const announcements = [
  { id: 1, type: "[공지]", title: "예비1", date: "2025-05-10" },
  { id: 2, type: "[알림]", title: "예비2", date: "2025-05-10" },
  { id: 3, type: "[알림]", title: "예비3", date: "2025-05-10" },
  { id: 4, type: "[알림]", title: "예비4", date: "2025-05-10" },
  { id: 5, type: "[공지]", title: "예비5", date: "2025-05-10" },
]

export default function Announcements() {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableBody>
          {announcements.map((announcement) => (
            <TableRow key={announcement.id} className="hover:text-rose-600">
              <TableCell className="font-medium">
                <span className="text-gray-600">{announcement.type}</span> {announcement.title}
              </TableCell>
              <TableCell className="text-right text-gray-500">{announcement.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
