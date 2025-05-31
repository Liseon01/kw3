"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"

interface Announcement {
  id: number
  type: string
  title: string
  date: string
}

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("http://localhost:7070/announcements")
      .then((res) => {
        if (!res.ok) throw new Error("공지사항을 불러오지 못했습니다.")
        return res.json()
      })
      .then((data: Announcement[]) => setAnnouncements(data))
      .catch((err) => {
        console.error(err)
        setError("공지사항을 불러오는 데 실패했습니다.")
      })
  }, [])

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableBody>
          {announcements.length > 0 ? (
            announcements.map((announcement) => (
              <TableRow key={announcement.id} className="hover:text-rose-600">
                <TableCell className="font-medium">
                  <span className="text-gray-600">{announcement.type}</span> {announcement.title}
                </TableCell>
                <TableCell className="text-right text-gray-500">{announcement.date}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2} className="text-center py-4 text-gray-500">
                {error || "공지사항을 불러오는 중입니다..."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
