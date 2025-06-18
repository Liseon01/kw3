"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function GradesPage() {
  const router = useRouter()
  const [grades, setGrades] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [selectedSemester, setSelectedSemester] = useState("")
  const [error, setError] = useState<string>("")

  // 사용자 정보 확인
  useEffect(() => {
    const userData = sessionStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)

    if (parsedUser.role === "student") {
      fetchGrades(parsedUser.student_id || parsedUser.id)
    }
  }, [router])

  // 성적 데이터 가져오기
  const fetchGrades = async (studentId: string) => {
    try {
      setLoading(true)
      setError("")

      const response = await fetch(`/api/grades?studentId=${studentId}`)

      // 응답이 JSON인지 확인
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        console.error("Non-JSON response:", text)
        setError("서버에서 올바르지 않은 응답을 받았습니다.")
        return
      }

      const data = await response.json()

      if (data.success) {
        setGrades(data.grades || [])
        // 가장 최근 학기를 기본 선택
        if (data.grades && data.grades.length > 0) {
          const latestGrade = data.grades[0]
          if (latestGrade.courses) {
            setSelectedSemester(`${latestGrade.courses.year}학년도 ${latestGrade.courses.semester}`)
          }
        }
      } else {
        console.error("Failed to fetch grades:", data.error)
        setError(data.error || "성적 조회에 실패했습니다.")
        setGrades([])
      }
    } catch (error) {
      console.error("Failed to fetch grades:", error)
      setError("성적 조회 중 오류가 발생했습니다.")
      setGrades([])
    } finally {
      setLoading(false)
    }
  }

  // 학기별 성적 그룹화
  const groupedGrades = grades.reduce(
    (acc, grade) => {
      if (!grade.courses) return acc
      const semesterKey = `${grade.courses.year}학년도 ${grade.courses.semester}`
      if (!acc[semesterKey]) {
        acc[semesterKey] = []
      }
      acc[semesterKey].push(grade)
      return acc
    },
    {} as Record<string, any[]>,
  )

  // 학기별 통계 계산
  const semesterStats = Object.keys(groupedGrades).map((semester) => {
    const semesterGrades = groupedGrades[semester]
    const totalCredits = semesterGrades.reduce((sum, grade) => sum + (grade.courses?.credits || 0), 0)
    const totalGpaPoints = semesterGrades.reduce(
      (sum, grade) => sum + (grade.gpa_score || 0) * (grade.courses?.credits || 0),
      0,
    )
    const averageGPA = totalCredits > 0 ? (totalGpaPoints / totalCredits).toFixed(2) : "0.00"

    return {
      semester,
      credits: totalCredits,
      averageGPA: Number.parseFloat(averageGPA),
      grades: semesterGrades,
    }
  })

  // 전체 통계 계산
  const totalCredits = grades.reduce((sum, grade) => sum + (grade.courses?.credits || 0), 0)
  const totalGpaPoints = grades.reduce((sum, grade) => sum + (grade.gpa_score || 0) * (grade.courses?.credits || 0), 0)
  const overallGPA = totalCredits > 0 ? (totalGpaPoints / totalCredits).toFixed(2) : "0.00"

  // 학생 정보 (기본값)
  const studentInfo = {
    category: "학부",
    studentId: user?.student_id || user?.id || "",
    name: user?.name || "",
    academicStatus: "재학",
    advisor: "김교수",
    department: "컴퓨터공학부",
    email: user?.email || "",
  }

  // 실제 강의 유형별 학점 계산
  const majorCredits = grades
    .filter((grade) => {
      const courseType = grade.courses?.course_type
      const isMajor = courseType === "전공필수" || courseType === "전공선택"
      console.log(`과목: ${grade.courses?.course_name}, 유형: ${courseType}, 전공여부: ${isMajor}`)
      return isMajor
    })
    .reduce((sum, grade) => sum + (grade.courses?.credits || 0), 0)

  const generalCredits = grades
    .filter((grade) => {
      const courseType = grade.courses?.course_type
      const isGeneral = courseType === "교양필수" || courseType === "교양선택"
      console.log(`과목: ${grade.courses?.course_name}, 유형: ${courseType}, 교양여부: ${isGeneral}`)
      return isGeneral
    })
    .reduce((sum, grade) => sum + (grade.courses?.credits || 0), 0)

  const graduationRequirements = {
    totalCredits: { required: 130, completed: totalCredits },
    majorCredits: { required: 60, completed: majorCredits },
    generalCredits: { required: 30, completed: generalCredits },
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-1 container px-4 py-6">
        <h1 className="text-2xl font-bold mb-2">수강 / 성적조회</h1>
        <p className="text-gray-500 mb-6">학생의 학적, 취득학점, 성적 정보를 확인할 수 있습니다.</p>

        {/* 학생 정보 */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-b pb-2">
                <div className="text-sm text-gray-500">구분</div>
                <div>{studentInfo.category}</div>
              </div>
              <div className="border-b pb-2">
                <div className="text-sm text-gray-500">학번</div>
                <div>{studentInfo.studentId}</div>
              </div>
              <div className="border-b pb-2">
                <div className="text-sm text-gray-500">이름</div>
                <div>{studentInfo.name}</div>
              </div>
              <div className="border-b pb-2">
                <div className="text-sm text-gray-500">학적상태</div>
                <div>{studentInfo.academicStatus}</div>
              </div>
              <div className="border-b pb-2">
                <div className="text-sm text-gray-500">기준교수</div>
                <div>{studentInfo.advisor}</div>
              </div>
              <div className="border-b pb-2">
                <div className="text-sm text-gray-500">학부</div>
                <div>{studentInfo.department}</div>
              </div>
              <div className="border-b pb-2">
                <div className="text-sm text-gray-500">이메일</div>
                <div>{studentInfo.email}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 졸업 요건 현황 */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">졸업 요건 현황</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">총 학점</div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xl font-bold text-rose-600">{graduationRequirements.totalCredits.completed}</p>
                  <p className="text-gray-500">/ {graduationRequirements.totalCredits.required} 학점</p>
                </div>
                <div className="bg-gray-200 rounded-full h-2.5 mb-4">
                  <div
                    className="bg-rose-600 h-2.5 rounded-full"
                    style={{
                      width: `${Math.min((graduationRequirements.totalCredits.completed / graduationRequirements.totalCredits.required) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">전공 학점</div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xl font-bold text-rose-600">{graduationRequirements.majorCredits.completed}</p>
                  <p className="text-gray-500">/ {graduationRequirements.majorCredits.required} 학점</p>
                </div>
                <div className="bg-gray-200 rounded-full h-2.5 mb-4">
                  <div
                    className="bg-rose-600 h-2.5 rounded-full"
                    style={{
                      width: `${Math.min((graduationRequirements.majorCredits.completed / graduationRequirements.majorCredits.required) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">교양 학점</div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xl font-bold text-rose-600">{graduationRequirements.generalCredits.completed}</p>
                  <p className="text-gray-500">/ {graduationRequirements.generalCredits.required} 학점</p>
                </div>
                <div className="bg-gray-200 rounded-full h-2.5 mb-4">
                  <div
                    className="bg-rose-600 h-2.5 rounded-full"
                    style={{
                      width: `${Math.min((graduationRequirements.generalCredits.completed / graduationRequirements.generalCredits.required) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-rose-600" />
                <span className="ml-2">성적 정보를 불러오는 중...</span>
              </div>
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8 text-red-500">
                <p>{error}</p>
                <button
                  onClick={() => fetchGrades(user?.student_id || user?.id)}
                  className="mt-4 px-4 py-2 bg-rose-600 text-white rounded hover:bg-rose-700"
                >
                  다시 시도
                </button>
              </div>
            </CardContent>
          </Card>
        ) : grades.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8 text-gray-500">
                <p>등록된 성적이 없습니다.</p>
                <p className="text-sm">수강 중인 강의의 성적이 입력되면 여기에 표시됩니다.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* 성적 테이블 */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead rowSpan={2} className="border text-center">
                          학기
                        </TableHead>
                        <TableHead rowSpan={2} className="border text-center">
                          취득 학점
                        </TableHead>
                        <TableHead rowSpan={2} className="border text-center">
                          평균 평점
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {semesterStats.map((semester, index) => (
                        <TableRow
                          key={index}
                          className={`hover:bg-gray-50 cursor-pointer ${selectedSemester === semester.semester ? "bg-rose-50" : ""}`}
                          onClick={() => setSelectedSemester(semester.semester)}
                        >
                          <TableCell className="border font-medium">{semester.semester}</TableCell>
                          <TableCell className="border text-center">{semester.credits}</TableCell>
                          <TableCell className="border text-center">{semester.averageGPA.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-gray-100 font-bold">
                        <TableCell className="border">총계</TableCell>
                        <TableCell className="border text-center">{totalCredits}</TableCell>
                        <TableCell className="border text-center">{overallGPA}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* 선택된 학기 과목별 성적 */}
            {selectedSemester && groupedGrades[selectedSemester] && (
              <>
                <h2 className="text-xl font-bold mt-8 mb-4">{selectedSemester} 과목별 성적</h2>
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="border text-center">과목코드</TableHead>
                            <TableHead className="border text-center">과목명</TableHead>
                            <TableHead className="border text-center">교수명</TableHead>
                            <TableHead className="border text-center">학점</TableHead>
                            <TableHead className="border text-center">중간고사</TableHead>
                            <TableHead className="border text-center">기말고사</TableHead>
                            <TableHead className="border text-center">과제</TableHead>
                            <TableHead className="border text-center">출석</TableHead>
                            <TableHead className="border text-center">총점</TableHead>
                            <TableHead className="border text-center">성적</TableHead>
                            <TableHead className="border text-center">강의 유형</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {groupedGrades[selectedSemester].map((grade, index) => (
                            <TableRow key={index} className="hover:bg-gray-50">
                              <TableCell className="border text-center">
                                {grade.courses?.course_code || "N/A"}
                              </TableCell>
                              <TableCell className="border">{grade.courses?.course_name || "N/A"}</TableCell>
                              <TableCell className="border text-center">
                                {grade.courses?.professors?.name || "미정"}
                              </TableCell>
                              <TableCell className="border text-center">{grade.courses?.credits || 0}</TableCell>
                              <TableCell className="border text-center">{grade.midterm_score || 0}</TableCell>
                              <TableCell className="border text-center">{grade.final_score || 0}</TableCell>
                              <TableCell className="border text-center">{grade.assignment_score || 0}</TableCell>
                              <TableCell className="border text-center">{grade.attendance_score || 0}</TableCell>
                              <TableCell className="border text-center font-bold">{grade.total_score || 0}</TableCell>
                              <TableCell className="border text-center">
                                <Badge variant={grade.letter_grade === "F" ? "destructive" : "default"}>
                                  {grade.letter_grade || "N/A"}
                                </Badge>
                              </TableCell>
                              <TableCell className="border text-center">
                                <Badge
                                  variant={
                                    grade.courses?.course_type?.includes("전공")
                                      ? "default"
                                      : grade.courses?.course_type?.includes("교양")
                                        ? "secondary"
                                        : "outline"
                                  }
                                  className={
                                    grade.courses?.course_type?.includes("전공")
                                      ? "bg-blue-100 text-blue-800"
                                      : grade.courses?.course_type?.includes("교양")
                                        ? "bg-green-100 text-green-800"
                                        : ""
                                  }
                                >
                                  {grade.courses?.course_type || "미분류"}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </>
        )}
      </main>
    </div>
  )
}
