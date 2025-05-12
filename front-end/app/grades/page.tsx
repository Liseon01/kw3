"use client"

import { useState } from "react"
import Header from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function GradesPage() {
  // 선택된 학기 상태 추가
  const [selectedSemester, setSelectedSemester] = useState("2023학년도 1학기")

  // 학생 정보
  const studentInfo = {
    category: "학부",
    studentId: "2020202070",
    name: "OOO",
    academicStatus: "재학",
    advisor: "OOO",
    department: "컴퓨터정보공학부",
    year: "4학년 1학기",
    email: "OOO@gmail.com",
  }

  // 학기별 성적 데이터
  const semesterGrades = [
    {
      semester: "2020학년도 1학기",
      credits: 18,
      majorGPA: 3.8,
      nonMajorGPA: 4.0,
      averageGPA: 3.9,
    },
    {
      semester: "2020학년도 2학기",
      credits: 19,
      majorGPA: 3.7,
      nonMajorGPA: 3.9,
      averageGPA: 3.8,
    },
    {
      semester: "2021학년도 1학기",
      credits: 21,
      majorGPA: 4.0,
      nonMajorGPA: 3.8,
      averageGPA: 3.9,
    },
    {
      semester: "2021학년도 2학기",
      credits: 18,
      majorGPA: 3.9,
      nonMajorGPA: 4.0,
      averageGPA: 3.95,
    },
    {
      semester: "2022학년도 1학기",
      credits: 15,
      majorGPA: 4.1,
      nonMajorGPA: 4.2,
      averageGPA: 4.15,
    },
    {
      semester: "2022학년도 2학기",
      credits: 18,
      majorGPA: 4.0,
      nonMajorGPA: 3.9,
      averageGPA: 3.95,
    },
    {
      semester: "2023학년도 1학기",
      credits: 15,
      majorGPA: 4.2,
      nonMajorGPA: 4.0,
      averageGPA: 4.1,
    },
  ]

  // 학기별 과목 성적 데이터
  const semesterCourseGrades = {
    "2020학년도 1학기": [
      { code: "CS1001", name: "컴퓨터 개론", type: "전공필수", credits: 3, grade: "A" },
      { code: "CS1002", name: "프로그래밍 기초", type: "전공필수", credits: 3, grade: "A+" },
      { code: "GE1001", name: "대학영어", type: "교양필수", credits: 2, grade: "B+" },
      { code: "GE1002", name: "수학의 이해", type: "교양필수", credits: 3, grade: "A" },
      { code: "GE1003", name: "역사와 문화", type: "교양선택", credits: 3, grade: "A+" },
      { code: "GE1004", name: "체육", type: "교양선택", credits: 1, grade: "A+" },
      { code: "GE1005", name: "글쓰기의 기초", type: "교양필수", credits: 3, grade: "A" },
    ],
    "2020학년도 2학기": [
      { code: "CS1003", name: "자료구조", type: "전공필수", credits: 3, grade: "A" },
      { code: "CS1004", name: "객체지향 프로그래밍", type: "전공필수", credits: 3, grade: "A+" },
      { code: "CS1005", name: "이산수학", type: "전공필수", credits: 3, grade: "B+" },
      { code: "GE1006", name: "영어회화", type: "교양필수", credits: 2, grade: "A" },
      { code: "GE1007", name: "철학의 이해", type: "교양선택", credits: 3, grade: "A" },
      { code: "GE1008", name: "경제학 원론", type: "교양선택", credits: 3, grade: "A-" },
      { code: "GE1009", name: "음악의 이해", type: "교양선택", credits: 2, grade: "A+" },
    ],
    "2021학년도 1학기": [
      { code: "CS2001", name: "알고리즘", type: "전공필수", credits: 3, grade: "A+" },
      { code: "CS2002", name: "컴퓨터구조", type: "전공필수", credits: 3, grade: "A" },
      { code: "CS2003", name: "운영체제", type: "전공필수", credits: 3, grade: "A+" },
      { code: "CS2004", name: "데이터베이스", type: "전공필수", credits: 3, grade: "A" },
      { code: "CS2005", name: "웹프로그래밍", type: "전공선택", credits: 3, grade: "A+" },
      { code: "GE2001", name: "창의적 사고", type: "교양선택", credits: 3, grade: "A" },
      { code: "GE2002", name: "과학과 기술", type: "교양선택", credits: 3, grade: "B+" },
    ],
    "2021학년도 2학기": [
      { code: "CS2006", name: "소프트웨어공학", type: "전공필수", credits: 3, grade: "A" },
      { code: "CS2007", name: "컴퓨터네트워크", type: "전공필수", credits: 3, grade: "A+" },
      { code: "CS2008", name: "인공지능", type: "전공선택", credits: 3, grade: "A" },
      { code: "CS2009", name: "모바일프로그래밍", type: "전공선택", credits: 3, grade: "A+" },
      { code: "GE2003", name: "리더십", type: "교양선택", credits: 3, grade: "A" },
      { code: "GE2004", name: "현대사회와 윤리", type: "교양선택", credits: 3, grade: "A-" },
    ],
    "2022학년도 1학기": [
      { code: "CS3001", name: "머신러닝", type: "전공선택", credits: 3, grade: "A+" },
      { code: "CS3002", name: "빅데이터분석", type: "전공선택", credits: 3, grade: "A" },
      { code: "CS3003", name: "클라우드컴퓨팅", type: "전공선택", credits: 3, grade: "A+" },
      { code: "CS3004", name: "정보보안", type: "전공선택", credits: 3, grade: "A" },
      { code: "GE3001", name: "취업과 진로", type: "교양선택", credits: 3, grade: "A+" },
    ],
    "2022학년도 2학기": [
      { code: "CS3005", name: "딥러닝", type: "전공선택", credits: 3, grade: "A" },
      { code: "CS3006", name: "블록체인", type: "전공선택", credits: 3, grade: "A+" },
      { code: "CS3007", name: "IoT 시스템", type: "전공선택", credits: 3, grade: "A" },
      { code: "CS3008", name: "컴퓨터비전", type: "전공선택", credits: 3, grade: "A-" },
      { code: "CS3009", name: "자연어처리", type: "전공선택", credits: 3, grade: "A+" },
      { code: "GE3002", name: "창업의 이해", type: "교양선택", credits: 3, grade: "A" },
    ],
    "2023학년도 1학기": [
      { code: "CS4001", name: "알고리즘", type: "전공필수", credits: 3, grade: "A+" },
      { code: "CS4002", name: "데이터베이스", type: "전공필수", credits: 3, grade: "A+" },
      { code: "CS4003", name: "컴퓨터네트워크", type: "전공선택", credits: 3, grade: "A" },
      { code: "GE1001", name: "영어회화", type: "교양필수", credits: 2, grade: "A" },
      { code: "GE1002", name: "글쓰기와 의사소통", type: "교양필수", credits: 2, grade: "A+" },
      { code: "GE2001", name: "경영학원론", type: "교양선택", credits: 2, grade: "A" },
    ],
  }

  // 총 성적 계산
  const totalCredits = semesterGrades.reduce((sum, semester) => sum + semester.credits, 0)
  const totalAverageGPA = (
    semesterGrades.reduce((sum, semester) => sum + semester.averageGPA * semester.credits, 0) / totalCredits
  ).toFixed(2)
  const totalMajorGPA = (
    semesterGrades.reduce((sum, semester) => sum + semester.majorGPA * semester.credits, 0) / totalCredits
  ).toFixed(2)
  const totalNonMajorGPA = (
    semesterGrades.reduce((sum, semester) => sum + semester.nonMajorGPA * semester.credits, 0) / totalCredits
  ).toFixed(2)

  // 학기 클릭 핸들러
  const handleSemesterClick = (semester: string) => {
    setSelectedSemester(semester)
  }

  // 졸업 요건 데이터 (예시)
  const graduationRequirements = {
    totalCredits: { required: 130, completed: 120 },
    majorCredits: { required: 60, completed: 55 },
    generalCredits: { required: 30, completed: 28 },
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
                <div className="text-sm text-gray-500">학적/학번</div>
                <div>{studentInfo.studentId}</div>
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
                <div className="text-sm text-gray-500">{studentInfo.studentId}</div>
                <div>{studentInfo.year}</div>
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
                      width: `${(graduationRequirements.totalCredits.completed / graduationRequirements.totalCredits.required) * 100}%`,
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
                      width: `${(graduationRequirements.majorCredits.completed / graduationRequirements.majorCredits.required) * 100}%`,
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
                      width: `${(graduationRequirements.generalCredits.completed / graduationRequirements.generalCredits.required) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
                      전공 평점
                    </TableHead>
                    <TableHead rowSpan={2} className="border text-center">
                      전공 외 평점
                    </TableHead>
                    <TableHead rowSpan={2} className="border text-center">
                      평균 평점
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {semesterGrades.map((semester, index) => (
                    <TableRow
                      key={index}
                      className={`hover:bg-gray-50 cursor-pointer ${selectedSemester === semester.semester ? "bg-rose-50" : ""}`}
                      onClick={() => handleSemesterClick(semester.semester)}
                    >
                      <TableCell className="border font-medium">{semester.semester}</TableCell>
                      <TableCell className="border text-center">{semester.credits}</TableCell>
                      <TableCell className="border text-center">{semester.majorGPA.toFixed(2)}</TableCell>
                      <TableCell className="border text-center">{semester.nonMajorGPA.toFixed(2)}</TableCell>
                      <TableCell className="border text-center">{semester.averageGPA.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-gray-100 font-bold">
                    <TableCell className="border">총계</TableCell>
                    <TableCell className="border text-center">{totalCredits}</TableCell>
                    <TableCell className="border text-center">{totalMajorGPA}</TableCell>
                    <TableCell className="border text-center">{totalNonMajorGPA}</TableCell>
                    <TableCell className="border text-center">{totalAverageGPA}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* 선택된 학기 과목별 성적 */}
        <h2 className="text-xl font-bold mt-8 mb-4">{selectedSemester} 과목별 성적</h2>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="border text-center">과목코드</TableHead>
                    <TableHead className="border text-center">과목명</TableHead>
                    <TableHead className="border text-center">이수구분</TableHead>
                    <TableHead className="border text-center">학점</TableHead>
                    <TableHead className="border text-center">성적</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {semesterCourseGrades[selectedSemester as keyof typeof semesterCourseGrades]?.map((course, index) => (
                    <TableRow key={index} className="hover:bg-gray-50">
                      <TableCell className="border text-center">{course.code}</TableCell>
                      <TableCell className="border">{course.name}</TableCell>
                      <TableCell className="border text-center">{course.type}</TableCell>
                      <TableCell className="border text-center">{course.credits}</TableCell>
                      <TableCell className="border text-center font-bold">{course.grade}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
