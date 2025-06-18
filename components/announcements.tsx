"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface Announcement {
  id: number
  title: string
  content: string
  is_important: boolean
  created_at: string
  course_id: number
  courses: {
    course_name: string
    professor_id: string
    users: {
      name: string
    }
  }
}

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      setLoading(true)

      // 세션에서 현재 사용자 정보 가져오기 (올바른 키 사용)
      const userSession = sessionStorage.getItem("user")
      if (!userSession) {
        setMessage("로그인이 필요합니다.")
        setAnnouncements([])
        setLoading(false)
        return
      }

      const userData = JSON.parse(userSession)
      const currentUser = userData.username || userData.student_id || userData.id

      if (!currentUser) {
        setMessage("사용자 정보를 찾을 수 없습니다.")
        setAnnouncements([])
        setLoading(false)
        return
      }

      console.log("Current user:", currentUser) // 디버깅용

      const response = await fetch(`/api/dashboard-announcements?user=${encodeURIComponent(currentUser)}`)
      const data = await response.json()

      console.log("API Response:", data) // 디버깅용 추가

      if (data.success) {
        setAnnouncements(data.announcements || [])
        setMessage(data.message || null)
        setError(null)
      } else {
        setError(data.error || "공지사항을 불러올 수 없습니다.")
        setMessage(data.message || null)
        setAnnouncements([])
      }
    } catch (error) {
      console.error("Error fetching announcements:", error)
      setError("공지사항을 불러오는 중 오류가 발생했습니다.")
      setAnnouncements([])
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="border rounded-lg overflow-hidden">
        <div className="p-8 text-center text-gray-500">공지사항을 불러오는 중...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="border rounded-lg overflow-hidden">
        <div className="p-8 text-center">
          <p className="text-gray-500 mb-2">{error}</p>
          {error.includes("테이블이 존재하지 않습니다") && (
            <p className="text-sm text-orange-600">데이터베이스 스크립트를 실행해주세요.</p>
          )}
        </div>
      </div>
    )
  }

  if (message || announcements.length === 0) {
    return (
      <div className="border rounded-lg overflow-hidden">
        <div className="p-8 text-center text-gray-500">{message || "수강신청한 과목에 공지사항이 없습니다."}</div>
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableBody>
          {announcements.map((announcement) => (
            <TableRow key={announcement.id} className="hover:text-rose-600">
              <TableCell className="font-medium">
                <div className="flex items-center gap-2 mb-1">
                  {announcement.is_important && (
                    <Badge variant="destructive" className="text-xs">
                      중요
                    </Badge>
                  )}
                  <span className="text-gray-600 text-sm">[{announcement.courses.course_name}]</span>
                </div>
                <div className="font-medium">{announcement.title}</div>
                <div className="text-sm text-gray-500 mt-1">{announcement.courses.users.name} 교수</div>
              </TableCell>
              <TableCell className="text-right text-gray-500">{formatDate(announcement.created_at)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
