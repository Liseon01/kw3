"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/header"
import { useToast } from "@/hooks/use-toast"

export default function RegistrationPage() {
  const { toast } = useToast()
  const [searchParams, setSearchParams] = useState({
    year: "2025",
    semester: "1학기",
    courseName: "",
    professorName: "",
    department: "all",
  })

  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearched, setIsSearched] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)

  // 사용자 정보 로드
  useEffect(() => {
    const userStr = sessionStorage.getItem("user")
    if (userStr) {
      setUser(JSON.parse(userStr))
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSearchParams((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setSearchParams((prev) => ({ ...prev, [name]: value }))
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      setIsSearched(false)

      // API 호출을 통해 실제 강의 정보 가져오기
      const queryParams = new URLSearchParams()

      if (searchParams.year) queryParams.append("year", searchParams.year)
      if (searchParams.semester) queryParams.append("semester", searchParams.semester)
      if (searchParams.courseName) queryParams.append("courseName", searchParams.courseName)
      if (searchParams.professorName) queryParams.append("professorName", searchParams.professorName)
      if (searchParams.department && searchParams.department !== "all") {
        queryParams.append("department", searchParams.department)
      }

      const response = await fetch(`/api/courses?${queryParams.toString()}`)
      const data = await response.json()

      if (data.success) {
        // 강의 데이터를 수강신청 형식으로 변환
        const formattedResults = data.courses.map((course: any) => ({
          id: course.course_code,
          name: course.course_name,
          professor: course.professors?.name || "미정",
          credit: course.credits,
          time: formatCourseTime(course),
          room: course.course_classroom || "미정",
          capacity: course.max_enrollments,
          registered: course.current_enrollments,
          course_id: course.course_id,
          status: course.course_status,
        }))

        setSearchResults(formattedResults)
        setIsSearched(true)
      } else {
        console.error("강의 조회 실패:", data.error)
        setSearchResults([])
        setIsSearched(true)
        toast({
          title: "오류",
          description: data.error || "강의 조회에 실패했습니다.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("강의 조회 중 오류:", error)
      setSearchResults([])
      setIsSearched(true)
      toast({
        title: "오류",
        description: "강의 조회 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (courseId: string) => {
    try {
      // 현재 로그인한 사용자 정보 가져오기
      const userStr = sessionStorage.getItem("user")
      if (!userStr) {
        toast({
          title: "오류",
          description: "로그인이 필요합니다.",
          variant: "destructive",
        })
        return
      }

      const user = JSON.parse(userStr)

      // 학생 정보 추가
      const response = await fetch("/api/enrollments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_id: user.student_id,
          course_id: courseId,
          student_name: user.name,
          student_email: user.email,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "성공",
          description: "수강신청이 완료되었습니다.",
        })
        // 검색 결과 새로고침
        handleSearch(new Event("submit") as any)
      } else {
        toast({
          title: "오류",
          description: data.error || "수강신청에 실패했습니다.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("수강신청 오류:", error)
      toast({
        title: "오류",
        description: "수강신청 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  // 강의 시간 포맷팅 함수 추가
  const formatCourseTime = (course: any) => {
    let timeStr = ""

    if (course.day1 && course.day1_start_time && course.day1_end_time) {
      timeStr += `${course.day1} ${course.day1_start_time.slice(0, 5)}-${course.day1_end_time.slice(0, 5)}`
    }

    if (course.day2 && course.day2_start_time && course.day2_end_time) {
      if (timeStr) timeStr += ", "
      timeStr += `${course.day2} ${course.day2_start_time.slice(0, 5)}-${course.day2_end_time.slice(0, 5)}`
    }

    return timeStr || "시간 미정"
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-1 container px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 mb-4">
              <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                📅 <strong>2025학년도</strong> 수강신청입니다.
              </p>
            </div>

            <div>
              <Label htmlFor="semester" className="block mb-2 text-sm">
                학기
              </Label>
              <Select
                defaultValue={searchParams.semester}
                onValueChange={(value) => handleSelectChange("semester", value)}
              >
                <SelectTrigger id="semester" className="w-full">
                  <SelectValue placeholder="학기 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1학기">1학기</SelectItem>
                  <SelectItem value="2학기">2학기</SelectItem>
                  <SelectItem value="여름학기">여름학기</SelectItem>
                  <SelectItem value="겨울학기">겨울학기</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="courseName" className="block mb-2 text-sm">
                과목명
              </Label>
              <Input
                id="courseName"
                name="courseName"
                placeholder="과목명을 입력하세요"
                value={searchParams.courseName}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="professorName" className="block mb-2 text-sm">
                교수명
              </Label>
              <Input
                id="professorName"
                name="professorName"
                placeholder="교수명을 입력하세요"
                value={searchParams.professorName}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="department" className="block mb-2 text-sm">
                학과
              </Label>
              <Select
                defaultValue={searchParams.department}
                onValueChange={(value) => handleSelectChange("department", value)}
              >
                <SelectTrigger id="department" className="w-full">
                  <SelectValue placeholder="학과 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">- 전체 -</SelectItem>
                  <SelectItem value="1">컴퓨터공학과</SelectItem>
                  <SelectItem value="2">전자공학과</SelectItem>
                  <SelectItem value="3">소프트웨어학과</SelectItem>
                  <SelectItem value="4">로봇학과</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2 flex justify-center mt-2">
              <Button type="submit" className="bg-rose-600 hover:bg-rose-700 px-8" disabled={isLoading}>
                {isLoading ? "조회 중..." : "조회"}
              </Button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="border-b">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="w-full justify-start h-12 bg-gray-50 rounded-none p-0">
                <TabsTrigger value="all" className="flex-1 data-[state=active]:bg-white rounded-none h-full">
                  학수번호
                </TabsTrigger>
                <TabsTrigger value="course" className="flex-1 data-[state=active]:bg-white rounded-none h-full">
                  과목명
                </TabsTrigger>
                <TabsTrigger value="professor" className="flex-1 data-[state=active]:bg-white rounded-none h-full">
                  강의명
                </TabsTrigger>
                <TabsTrigger value="department" className="flex-1 data-[state=active]:bg-white rounded-none h-full">
                  대학명
                </TabsTrigger>
                <TabsTrigger value="major" className="flex-1 data-[state=active]:bg-white rounded-none h-full">
                  전공
                </TabsTrigger>
                <TabsTrigger value="credit" className="flex-1 data-[state=active]:bg-white rounded-none h-full">
                  학점
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {isSearched ? (
            <div className="p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">학수번호</TableHead>
                    <TableHead>과목명</TableHead>
                    <TableHead>교수명</TableHead>
                    <TableHead>학점</TableHead>
                    <TableHead>강의시간/강의실</TableHead>
                    <TableHead className="text-center">수강인원</TableHead>
                    <TableHead className="text-center">신청</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchResults.length > 0 ? (
                    searchResults.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell className="font-medium">{course.id}</TableCell>
                        <TableCell>{course.name}</TableCell>
                        <TableCell>{course.professor}</TableCell>
                        <TableCell>{course.credit}</TableCell>
                        <TableCell>
                          <div>{course.time}</div>
                          <div className="text-gray-500 text-sm">{course.room}</div>
                        </TableCell>
                        <TableCell className="text-center">
                          {course.registered}/{course.capacity}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            size="sm"
                            className="bg-rose-600 hover:bg-rose-700"
                            onClick={() => handleRegister(course.course_id)}
                            disabled={!user}
                          >
                            신청
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                        조회된 강좌가 없습니다. 조건을 변경하여 다시 조회해 주세요.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p>* 조회된 강좌가 없습니다. 조건을 변경하여 다시 조회해 주세요.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
