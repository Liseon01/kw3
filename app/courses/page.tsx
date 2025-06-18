"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Header from "@/components/header"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface Course {
  course_id: number
  course_code: string
  course_name: string
  credits: number
  professor_id: string
  day1?: string
  day1_start_time?: string
  day1_end_time?: string
  day2?: string
  day2_start_time?: string
  day2_end_time?: string
  course_classroom?: string
  max_enrollments: number
  current_enrollments: number
  course_status: string
  year: number | string
  semester: string
  professors?: {
    professor_id: string
    name: string
    email: string
  }
  departments?: {
    department_id: number
    name: string
  }
  course_type?: string
}

export default function CoursesPage() {
  const { toast } = useToast()
  const [searchParams, setSearchParams] = useState({
    year: "all", // 초기에는 모든 년도 조회
    semester: "all", // 초기에는 모든 학기 조회
    courseName: "",
    professorName: "",
    department: "all",
  })
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 페이지 로드 시 모든 강의 조회
  useEffect(() => {
    // 초기에는 모든 강의를 조회하도록 설정
    const initialParams = {
      year: "all", // 모든 년도
      semester: "all", // 모든 학기
      courseName: "",
      professorName: "",
      department: "all",
    }

    setSearchParams(initialParams)

    // 페이지 로드 시 자동으로 모든 데이터 조회
    fetchCourses(initialParams)
  }, [])

  const fetchCourses = async (params = searchParams) => {
    setLoading(true)
    setHasSearched(true)
    setError(null)

    try {
      const queryParams = new URLSearchParams()

      // 빈 값이나 "all"이 아닐 때만 파라미터 추가
      if (params.year && params.year !== "" && params.year !== "all") queryParams.append("year", params.year)
      if (params.semester && params.semester !== "" && params.semester !== "all")
        queryParams.append("semester", params.semester)
      if (params.courseName && params.courseName !== "") queryParams.append("courseName", params.courseName)
      if (params.professorName && params.professorName !== "") queryParams.append("professorName", params.professorName)
      if (params.department && params.department !== "all" && params.department !== "") {
        queryParams.append("department", params.department)
      }

      const url = `/api/courses?${queryParams.toString()}`

      const response = await fetch(url)
      const data = await response.json()

      if (data.success) {
        setCourses(data.courses || [])

        if (data.courses?.length === 0) {
          // 결과가 없을 때 안내 메시지
          setError("해당 조건에 맞는 강의가 없습니다. 검색 조건을 변경해보세요.")
        }

        if (data.isMockData) {
          toast({
            title: "알림",
            description: data.message || "테스트 데이터를 표시하고 있습니다.",
            variant: "destructive",
          })
        }
      } else {
        throw new Error(data.error || "강의 목록을 불러오는데 실패했습니다.")
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "강의 목록을 불러오는데 실패했습니다.")
      toast({
        title: "오류",
        description: error instanceof Error ? error.message : "강의 목록을 불러오는데 실패했습니다.",
        variant: "destructive",
      })
      setCourses([])
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSearchParams((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setSearchParams((prev) => ({ ...prev, [name]: value }))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchCourses()
  }

  const handleReset = () => {
    // 모든 조건 초기화하여 전체 강의 조회
    const resetParams = {
      year: "all",
      semester: "all",
      courseName: "",
      professorName: "",
      department: "all",
    }

    setSearchParams(resetParams)
    // 초기화 후 자동 조회
    fetchCourses(resetParams)
  }

  const handleShowAll = () => {
    // 전체 강의 조회 버튼
    const allParams = {
      year: "all",
      semester: "all",
      courseName: "",
      professorName: "",
      department: "all",
    }

    setSearchParams(allParams)
    fetchCourses(allParams)
  }

  const formatTime = (time?: string) => {
    if (!time) return ""
    return time.substring(0, 5) // HH:mm 형식으로 변환
  }

  const formatSchedule = (course: Course) => {
    const schedules = []

    if (course.day1 && course.day1_start_time && course.day1_end_time) {
      schedules.push(`${course.day1} ${formatTime(course.day1_start_time)}-${formatTime(course.day1_end_time)}`)
    }

    if (course.day2 && course.day2_start_time && course.day2_end_time) {
      schedules.push(`${course.day2} ${formatTime(course.day2_start_time)}-${formatTime(course.day2_end_time)}`)
    }

    return schedules.join(", ") || "시간 미정"
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
      case "개강":
        return <Badge className="bg-green-100 text-green-800">개설</Badge>
      case "closed":
      case "폐강":
        return <Badge className="bg-red-100 text-red-800">폐강</Badge>
      case "pending":
      case "대기":
        return <Badge className="bg-yellow-100 text-yellow-800">대기</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 container px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-gray-700">📚</span> 강의 정보 조회 시스템
          </h1>
          <Button onClick={handleShowAll} variant="outline" className="bg-blue-50 hover:bg-blue-100">
            전체 강의 보기
          </Button>
        </div>

        {/* 안내 메시지 */}
        <div className="mb-4 p-4 bg-blue-50 rounded-md border border-blue-200">
          <p className="text-blue-800">
            <strong>안내:</strong> 교수님이 강의 자료실에서 등록한 강의와 테스트 데이터가 모두 표시됩니다. "전체 강의
            보기" 버튼을 클릭하면 모든 강의를 확인할 수 있습니다.
          </p>
        </div>

        {/* 검색 폼 */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="year" className="block mb-2">
                    년도
                  </Label>
                  <Select value={searchParams.year} onValueChange={(value) => handleSelectChange("year", value)}>
                    <SelectTrigger id="year" className="w-full">
                      <SelectValue placeholder="- 전체 -" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">- 전체 -</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="semester" className="block mb-2">
                    학기
                  </Label>
                  <Select
                    value={searchParams.semester}
                    onValueChange={(value) => handleSelectChange("semester", value)}
                  >
                    <SelectTrigger id="semester" className="w-full">
                      <SelectValue placeholder="- 전체 -" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">- 전체 -</SelectItem>
                      <SelectItem value="1학기">1학기</SelectItem>
                      <SelectItem value="2학기">2학기</SelectItem>
                      <SelectItem value="one">1학기</SelectItem>
                      <SelectItem value="two">2학기</SelectItem>
                      <SelectItem value="summer">여름학기</SelectItem>
                      <SelectItem value="winter">겨울학기</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="courseName" className="block mb-2">
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
                <Label htmlFor="professorName" className="block mb-2">
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
                <Label htmlFor="department" className="block mb-2">
                  학과
                </Label>
                <Select
                  value={searchParams.department}
                  onValueChange={(value) => handleSelectChange("department", value)}
                >
                  <SelectTrigger id="department" className="w-full">
                    <SelectValue placeholder="- 전체 -" />
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

              <div className="flex justify-center gap-4">
                <Button type="submit" className="bg-rose-600 hover:bg-rose-700 px-8" disabled={loading}>
                  {loading ? "조회 중..." : "조회"}
                </Button>
                <Button type="button" variant="outline" onClick={handleReset} disabled={loading}>
                  초기화
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* 강의 목록 */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">강의 목록 ({courses.length}개)</h2>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
                <p className="mt-2 text-gray-600">강의 목록을 불러오는 중...</p>
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>조회된 강의가 없습니다.</p>
                <p className="text-sm mt-1">검색 조건을 변경하거나 "전체 강의 보기" 버튼을 클릭해보세요.</p>
                {error && <p className="text-red-500 mt-2">{error}</p>}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>학정번호</TableHead>
                      <TableHead>과목명</TableHead>
                      <TableHead>학점</TableHead>
                      <TableHead>교수명</TableHead>
                      <TableHead>강의시간</TableHead>
                      <TableHead>강의실</TableHead>
                      <TableHead>수강인원</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>년도/학기</TableHead>
                      <TableHead>강의 유형</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.map((course) => (
                      <TableRow key={course.course_id}>
                        <TableCell className="font-medium">{course.course_code}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{course.course_name}</div>
                            {course.departments && (
                              <div className="text-sm text-gray-500">{course.departments.name}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{course.credits}</TableCell>
                        <TableCell>{course.professors ? course.professors.name : course.professor_id}</TableCell>
                        <TableCell className="text-sm">{formatSchedule(course)}</TableCell>
                        <TableCell>{course.course_classroom || "미정"}</TableCell>
                        <TableCell>
                          <span
                            className={`${
                              course.current_enrollments >= course.max_enrollments
                                ? "text-red-600 font-medium"
                                : "text-gray-600"
                            }`}
                          >
                            {course.current_enrollments}/{course.max_enrollments}
                          </span>
                        </TableCell>
                        <TableCell>{getStatusBadge(course.course_status)}</TableCell>
                        <TableCell className="text-sm">
                          {course.year}/{course.semester}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              course.course_type?.includes("전공")
                                ? "default"
                                : course.course_type?.includes("교양")
                                  ? "secondary"
                                  : "outline"
                            }
                            className={
                              course.course_type?.includes("전공")
                                ? "bg-blue-100 text-blue-800"
                                : course.course_type?.includes("교양")
                                  ? "bg-green-100 text-green-800"
                                  : ""
                            }
                          >
                            {course.course_type || "미분류"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
