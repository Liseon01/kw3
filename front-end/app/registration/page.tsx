"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/header"

export default function RegistrationPage() {
  const [searchParams, setSearchParams] = useState({
    year: "2025",
    semester: "1학기",
    college: "공과대학",
    major: "코메터공학",
    courseName: "",
    professorName: "",
  })

  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearched, setIsSearched] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSearchParams((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setSearchParams((prev) => ({ ...prev, [name]: value }))
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const query = new URLSearchParams({
        year: searchParams.year,
        semester: searchParams.semester,
        college: searchParams.college,
        major: searchParams.major,
        courseName: searchParams.courseName,
        professorName: searchParams.professorName,
      }).toString()

      const res = await fetch(`http://localhost:7070/courses/search?${query}`)

      if (!res.ok) {
        throw new Error("강의 목록 조회 실패")
      }

      const data = await res.json()
      setSearchResults(data)
      setIsSearched(true)
    } catch (err) {
      console.error("검색 중 오류:", err)
      setSearchResults([])
      setIsSearched(true)
    }
  }

  const handleRegister = async (courseId: string) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        alert("로그인이 필요합니다.")
        return
      }

      const res = await fetch("http://localhost:7070/registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseAssignmentId: courseId }),
      })

      if (!res.ok) {
        const err = await res.json()
        alert(err.message || "수강신청 실패")
        return
      }

      alert(`${courseId} 과목이 수강신청 되었습니다.`)
    } catch (err) {
      console.error("신청 중 오류:", err)
      alert("서버 오류가 발생했습니다.")
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 container px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="college" className="block mb-2 text-sm">대학</Label>
              <Select defaultValue={searchParams.college} onValueChange={(value) => handleSelectChange("college", value)}>
                <SelectTrigger id="college" className="w-full">
                  <SelectValue placeholder="대학 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="공과대학">공과대학</SelectItem>
                  <SelectItem value="인문대학">인문대학</SelectItem>
                  <SelectItem value="경영대학">경영대학</SelectItem>
                  <SelectItem value="자연과학대학">자연과학대학</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="major" className="block mb-2 text-sm">전공</Label>
              <Select defaultValue={searchParams.major} onValueChange={(value) => handleSelectChange("major", value)}>
                <SelectTrigger id="major" className="w-full">
                  <SelectValue placeholder="전공 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="코메터공학">코메터공학</SelectItem>
                  <SelectItem value="전자공학">전자공학</SelectItem>
                  <SelectItem value="소프트웨어학">소프트웨어학</SelectItem>
                  <SelectItem value="정보육합학">정보육합학</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="courseName" className="block mb-2 text-sm">과목명</Label>
              <Input id="courseName" name="courseName" placeholder="과목명을 입력하세요" value={searchParams.courseName} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="professorName" className="block mb-2 text-sm">교수명</Label>
              <Input id="professorName" name="professorName" placeholder="교수명을 입력하세요" value={searchParams.professorName} onChange={handleInputChange} />
            </div>
            <div className="md:col-span-2 flex justify-center mt-2">
              <Button type="submit" className="bg-rose-600 hover:bg-rose-700 px-8">조회</Button>
            </div>
          </form>
        </div>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="border-b">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="w-full justify-start h-12 bg-gray-50 rounded-none p-0">
                <TabsTrigger value="all" className="flex-1 data-[state=active]:bg-white rounded-none h-full">학수번호</TabsTrigger>
                <TabsTrigger value="course" className="flex-1 data-[state=active]:bg-white rounded-none h-full">과목명</TabsTrigger>
                <TabsTrigger value="professor" className="flex-1 data-[state=active]:bg-white rounded-none h-full">강의명</TabsTrigger>
                <TabsTrigger value="department" className="flex-1 data-[state=active]:bg-white rounded-none h-full">대학명</TabsTrigger>
                <TabsTrigger value="major" className="flex-1 data-[state=active]:bg-white rounded-none h-full">전공</TabsTrigger>
                <TabsTrigger value="credit" className="flex-1 data-[state=active]:bg-white rounded-none h-full">학점</TabsTrigger>
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
                  {searchResults.map((course) => (
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
                        <Button size="sm" className="bg-rose-600 hover:bg-rose-700" onClick={() => handleRegister(course.id)}>
                          신청
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p>* 조회된 강자가 없습니다. 조건을 변경해서 다시 조회해 주세요.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
