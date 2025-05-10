import Header from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function AcademicInfoPage() {
  // 학생 정보
  const studentInfo = {
    category: "학부",
    department: "컴퓨터정보공학부",
    studentId: "2020202070",
    name: "OOO",
    academicStatus: "재학",
    advisor: "OOO",
  }

  // 복수/부/심화전공 신청 내역
  const majorApplications = [
    {
      type: "복수전공",
      applicationDate: "2022-03-15",
      college: "경영대학",
      department: "경영학과",
      majorName: "경영학",
      status: "승인",
    },
    {
      type: "부전공",
      applicationDate: "2021-09-10",
      college: "인문대학",
      department: "영어영문학과",
      majorName: "영어영문학",
      status: "승인",
    },
  ]

  // 학적 변동 내역
  const academicChanges = [
    {
      type: "휴학",
      applicationDate: "2021-02-20",
      startDate: "2021-03-01",
      endDate: "2021-08-31",
      reason: "개인사유",
      status: "승인",
    },
    {
      type: "복학",
      applicationDate: "2021-08-15",
      startDate: "2021-09-01",
      endDate: "-",
      reason: "-",
      status: "승인",
    },
  ]

  // 장학금 수혜 내역
  const scholarships = [
    {
      semester: "2020학년도 1학기",
      name: "성적우수 장학금",
      amount: "1,000,000원",
      date: "2020-03-10",
    },
    {
      semester: "2020학년도 2학기",
      name: "성적우수 장학금",
      amount: "1,000,000원",
      date: "2020-09-05",
    },
    {
      semester: "2021학년도 2학기",
      name: "교내근로 장학금",
      amount: "800,000원",
      date: "2021-09-15",
    },
    {
      semester: "2022학년도 1학기",
      name: "성적우수 장학금",
      amount: "1,200,000원",
      date: "2022-03-08",
    },
  ]

  // 졸업 요건
  const graduationRequirements = {
    totalCredits: {
      required: 130,
      completed: 98,
      remaining: 32,
    },
    majorCredits: {
      required: 60,
      completed: 45,
      remaining: 15,
    },
    generalCredits: {
      required: 30,
      completed: 25,
      remaining: 5,
    },
    requiredCourses: [
      {
        code: "CS4001",
        name: "졸업프로젝트",
        completed: false,
      },
      {
        code: "CS3005",
        name: "소프트웨어공학",
        completed: true,
      },
      {
        code: "CS2001",
        name: "자료구조",
        completed: true,
      },
      {
        code: "CS2002",
        name: "알고리즘",
        completed: true,
      },
    ],
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-1 container px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">학사정보조회</h1>

        <Tabs defaultValue="academic-status" className="mb-6">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="academic-status">학적사항</TabsTrigger>
            <TabsTrigger value="major-applications">복수/부/심화전공</TabsTrigger>
            <TabsTrigger value="academic-changes">학적변동내역</TabsTrigger>
            <TabsTrigger value="graduation">졸업요건</TabsTrigger>
          </TabsList>

          {/* 학적사항 탭 */}
          <TabsContent value="academic-status">
            <h2 className="text-xl font-bold mb-4">학적사항</h2>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="border text-center">구분</TableHead>
                      <TableHead className="border text-center">학과/학부</TableHead>
                      <TableHead className="border text-center">학번</TableHead>
                      <TableHead className="border text-center">이름</TableHead>
                      <TableHead className="border text-center">학적상태</TableHead>
                      <TableHead className="border text-center">지도교수</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="border text-center">{studentInfo.category}</TableCell>
                      <TableCell className="border text-center">{studentInfo.department}</TableCell>
                      <TableCell className="border text-center">{studentInfo.studentId}</TableCell>
                      <TableCell className="border text-center">{studentInfo.name}</TableCell>
                      <TableCell className="border text-center">{studentInfo.academicStatus}</TableCell>
                      <TableCell className="border text-center">{studentInfo.advisor}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <h2 className="text-xl font-bold mt-8 mb-4">장학금 수혜내역</h2>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="border text-center">학기</TableHead>
                      <TableHead className="border text-center">장학금명</TableHead>
                      <TableHead className="border text-center">장학금액</TableHead>
                      <TableHead className="border text-center">지급일자</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scholarships.map((scholarship, index) => (
                      <TableRow key={index}>
                        <TableCell className="border text-center">{scholarship.semester}</TableCell>
                        <TableCell className="border text-center">{scholarship.name}</TableCell>
                        <TableCell className="border text-center">{scholarship.amount}</TableCell>
                        <TableCell className="border text-center">{scholarship.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 복수/부/심화전공 탭 */}
          <TabsContent value="major-applications">
            <h2 className="text-xl font-bold mb-4">복수/부/심화전공 신청내역</h2>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="border text-center">전공구분</TableHead>
                      <TableHead className="border text-center">신청일자</TableHead>
                      <TableHead className="border text-center">대학</TableHead>
                      <TableHead className="border text-center">학과</TableHead>
                      <TableHead className="border text-center">전공명</TableHead>
                      <TableHead className="border text-center">상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {majorApplications.map((application, index) => (
                      <TableRow key={index}>
                        <TableCell className="border text-center">{application.type}</TableCell>
                        <TableCell className="border text-center">{application.applicationDate}</TableCell>
                        <TableCell className="border text-center">{application.college}</TableCell>
                        <TableCell className="border text-center">{application.department}</TableCell>
                        <TableCell className="border text-center">{application.majorName}</TableCell>
                        <TableCell className="border text-center">{application.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 학적변동내역 탭 */}
          <TabsContent value="academic-changes">
            <h2 className="text-xl font-bold mb-4">학적변동내역</h2>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="border text-center">변동구분</TableHead>
                      <TableHead className="border text-center">신청일자</TableHead>
                      <TableHead className="border text-center">시작일</TableHead>
                      <TableHead className="border text-center">종료일</TableHead>
                      <TableHead className="border text-center">사유</TableHead>
                      <TableHead className="border text-center">상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {academicChanges.map((change, index) => (
                      <TableRow key={index}>
                        <TableCell className="border text-center">{change.type}</TableCell>
                        <TableCell className="border text-center">{change.applicationDate}</TableCell>
                        <TableCell className="border text-center">{change.startDate}</TableCell>
                        <TableCell className="border text-center">{change.endDate}</TableCell>
                        <TableCell className="border text-center">{change.reason}</TableCell>
                        <TableCell className="border text-center">{change.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 졸업요건 탭 */}
          <TabsContent value="graduation">
            <h2 className="text-xl font-bold mb-4">졸업요건</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-2 text-center">총 이수학점</h3>
                  <div className="flex justify-between items-center">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">필요</p>
                      <p className="text-xl font-bold">{graduationRequirements.totalCredits.required}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">이수</p>
                      <p className="text-xl font-bold text-blue-500">{graduationRequirements.totalCredits.completed}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">잔여</p>
                      <p className="text-xl font-bold text-red-500">{graduationRequirements.totalCredits.remaining}</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                    <div
                      className="bg-blue-500 h-2.5 rounded-full"
                      style={{
                        width: `${(graduationRequirements.totalCredits.completed / graduationRequirements.totalCredits.required) * 100}%`,
                      }}
                    ></div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-2 text-center">전공 이수학점</h3>
                  <div className="flex justify-between items-center">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">필요</p>
                      <p className="text-xl font-bold">{graduationRequirements.majorCredits.required}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">이수</p>
                      <p className="text-xl font-bold text-blue-500">{graduationRequirements.majorCredits.completed}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">잔여</p>
                      <p className="text-xl font-bold text-red-500">{graduationRequirements.majorCredits.remaining}</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                    <div
                      className="bg-blue-500 h-2.5 rounded-full"
                      style={{
                        width: `${(graduationRequirements.majorCredits.completed / graduationRequirements.majorCredits.required) * 100}%`,
                      }}
                    ></div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-2 text-center">교양 이수학점</h3>
                  <div className="flex justify-between items-center">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">필요</p>
                      <p className="text-xl font-bold">{graduationRequirements.generalCredits.required}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">이수</p>
                      <p className="text-xl font-bold text-blue-500">
                        {graduationRequirements.generalCredits.completed}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">잔여</p>
                      <p className="text-xl font-bold text-red-500">
                        {graduationRequirements.generalCredits.remaining}
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                    <div
                      className="bg-blue-500 h-2.5 rounded-full"
                      style={{
                        width: `${(graduationRequirements.generalCredits.completed / graduationRequirements.generalCredits.required) * 100}%`,
                      }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <h3 className="text-lg font-semibold mb-4">필수 이수 과목</h3>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="border text-center">과목코드</TableHead>
                      <TableHead className="border text-center">과목명</TableHead>
                      <TableHead className="border text-center">이수여부</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {graduationRequirements.requiredCourses.map((course, index) => (
                      <TableRow key={index}>
                        <TableCell className="border text-center">{course.code}</TableCell>
                        <TableCell className="border text-center">{course.name}</TableCell>
                        <TableCell className="border text-center">
                          {course.completed ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              이수완료
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              미이수
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
