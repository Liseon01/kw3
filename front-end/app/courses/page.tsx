"use client"

import type React from "react"
import { useState } from "react"
import Header from "@/components/header"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

export default function CoursesPage() {
  const [searchParams, setSearchParams] = useState({
    year: "",
    semester: "",
    courseName: "",
    professorName: "",
    courseType: "all",
    commonCourse: "",
    department: "",
    major: "",
  })

  const [courses, setCourses] = useState<any[]>([])
  const [error, setError] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSearchParams((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setSearchParams((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (value: string) => {
    setSearchParams((prev) => ({ ...prev, courseType: value }))
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("http://localhost:7070/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchParams),
      })

      if (!res.ok) {
        const err = await res.json()
        setError(err.message || "강의 정보를 불러오지 못했습니다.")
        return
      }

      const data = await res.json()
      setCourses(data)
      setError("")
    } catch (err) {
      console.error(err)
      setError("서버 요청 중 오류가 발생했습니다.")
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-gray-700">▼</span> 강의 정보 조회 시스템
          </h1>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="space-y-6">
              {/* 필드 입력 영역 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="year">년도</Label>
                  <Select onValueChange={(value) => handleSelectChange("year", value)}>
                    <SelectTrigger id="year"><SelectValue placeholder="년도 선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="semester">학기</Label>
                  <Select onValueChange={(value) => handleSelectChange("semester", value)}>
                    <SelectTrigger id="semester"><SelectValue placeholder="학기 선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1학기</SelectItem>
                      <SelectItem value="2">2학기</SelectItem>
                      <SelectItem value="summer">여름학기</SelectItem>
                      <SelectItem value="winter">겨울학기</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="courseName">과목명</Label>
                <Input id="courseName" name="courseName" placeholder="과목명을 입력하세요" value={searchParams.courseName} onChange={handleInputChange} />
              </div>

              <div>
                <Label htmlFor="professorName">교수명</Label>
                <Input id="professorName" name="professorName" placeholder="교수명을 입력하세요" value={searchParams.professorName} onChange={handleInputChange} />
              </div>

              <div>
                <RadioGroup defaultValue="all" className="flex gap-4" onValueChange={handleRadioChange}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all" />
                    <Label htmlFor="all">전체</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="my" id="my" />
                    <Label htmlFor="my">내과목</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="commonCourse">공통 과목</Label>
                  <Select onValueChange={(value) => handleSelectChange("commonCourse", value)}>
                    <SelectTrigger id="commonCourse"><SelectValue placeholder="- 전체 -" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">- 전체 -</SelectItem>
                      <SelectItem value="required">필수 과목</SelectItem>
                      <SelectItem value="elective">선택 과목</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="department">학과</Label>
                  <Select onValueChange={(value) => handleSelectChange("department", value)}>
                    <SelectTrigger id="department"><SelectValue placeholder="- 전체 -" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">- 전체 -</SelectItem>
                      <SelectItem value="computer">컴퓨터공학과</SelectItem>
                      <SelectItem value="electrical">전자공학과</SelectItem>
                      <SelectItem value="software">소프트웨어학과</SelectItem>
                      <SelectItem value="robotics">로봇학과</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="major">전공</Label>
                <Select onValueChange={(value) => handleSelectChange("major", value)}>
                  <SelectTrigger id="major"><SelectValue placeholder="- 전체 -" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">- 전체 -</SelectItem>
                    <SelectItem value="ai">인공지능</SelectItem>
                    <SelectItem value="security">정보보안</SelectItem>
                    <SelectItem value="network">네트워크</SelectItem>
                    <SelectItem value="database">데이터베이스</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-center">
                <Button type="submit" className="bg-rose-600 hover:bg-rose-700 px-8">
                  조회
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* 검색 결과 출력 */}
        <div className="mt-8 border-t pt-4">
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {courses.length > 0 ? (
            <div className="grid gap-4">
              {courses.map((course, index) => (
                <Card key={index}>
                  <CardContent className="p-4 space-y-2">
                    <h3 className="text-lg font-bold">{course.name}</h3>
                    <p>교수: {course.professor}</p>
                    <p>과목코드: {course.code}</p>
                    <p>학점: {course.credits}</p>
                    <p>이수구분: {course.type}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">검색 결과가 없습니다.</p>
          )}
        </div>
      </main>
    </div>
  )
}
