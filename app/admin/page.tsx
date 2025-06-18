"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, XCircle, Loader2, LogOut } from "lucide-react"

interface SignupRequest {
  id: string
  name: string
  email: string
  phone_number: string
  role: string
  status: string
  created_at: string
  gender: string
  social_security_number: string
}

export default function AdminPage() {
  const [requests, setRequests] = useState<SignupRequest[]>([])
  const [selectedRequest, setSelectedRequest] = useState<SignupRequest | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [additionalInfo, setAdditionalInfo] = useState({
    studentId: "",
    department: "",
    address: "",
    postalCode: "",
    admissionType: "",
    tuitionStatus: "",
    position: "",
    majorField: "",
    reason: "",
  })

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/signup-requests")
      const data = await response.json()

      if (data.success) {
        setRequests(data.requests)
      }
    } catch (error) {
      console.error("Failed to fetch requests:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async () => {
    if (!selectedRequest) return

    if (!additionalInfo.studentId) {
      alert("학번을 입력해주세요.")
      return
    }

    setIsProcessing(true)
    try {
      const response = await fetch(`/api/signup-requests/${selectedRequest.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "approve",
          studentId: additionalInfo.studentId,
          department: additionalInfo.department,
          address: additionalInfo.address,
          postalCode: additionalInfo.postalCode,
          admissionType: additionalInfo.admissionType,
          tuitionStatus: additionalInfo.tuitionStatus,
          position: additionalInfo.position,
          major: additionalInfo.majorField,
        }),
      })

      const data = await response.json()

      if (data.success) {
        alert("회원가입 요청이 승인되었습니다.")
        fetchRequests()
        setSelectedRequest(null)
        setAdditionalInfo({
          studentId: "",
          department: "",
          address: "",
          postalCode: "",
          admissionType: "",
          tuitionStatus: "",
          position: "",
          majorField: "",
          reason: "",
        })
      } else {
        alert(data.error || "승인 처리 중 오류가 발생했습니다.")
      }
    } catch (error) {
      console.error("Approval error:", error)
      alert("승인 처리 중 오류가 발생했습니다.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async () => {
    if (!selectedRequest) return

    setIsProcessing(true)
    try {
      const response = await fetch(`/api/signup-requests/${selectedRequest.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "reject",
          reason: additionalInfo.reason,
        }),
      })

      const data = await response.json()

      if (data.success) {
        alert("회원가입 요청이 거부되었습니다.")
        fetchRequests()
        setSelectedRequest(null)
        setAdditionalInfo({
          studentId: "",
          department: "",
          address: "",
          postalCode: "",
          admissionType: "",
          tuitionStatus: "",
          position: "",
          majorField: "",
          reason: "",
        })
      } else {
        alert(data.error || "거부 처리 중 오류가 발생했습니다.")
      }
    } catch (error) {
      console.error("Rejection error:", error)
      alert("거부 처리 중 오류가 발생했습니다.")
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            대기중
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            승인됨
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            거부됨
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case "student":
        return "학생"
      case "professor":
        return "교수"
      case "admin":
        return "관리자"
      default:
        return role
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem("user")
    window.location.href = "/"
  }

  // 학번 자동 생성 함수
  const generateStudentId = () => {
    const currentYear = new Date().getFullYear()
    const departmentCodes = {
      computer: "101",
      electronics: "102",
      business: "103",
    }

    const deptCode = departmentCodes[additionalInfo.department as keyof typeof departmentCodes] || "999"
    const randomNum = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")

    if (selectedRequest?.role === "professor") {
      // 교수는 P로 시작
      const professorId = `P${currentYear}${deptCode}${randomNum}`
      setAdditionalInfo((prev) => ({ ...prev, studentId: professorId }))
    } else {
      // 학생은 년도로 시작
      const studentId = `${currentYear}${deptCode}${randomNum}`
      setAdditionalInfo((prev) => ({ ...prev, studentId: studentId }))
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      {/* 관리자 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-rose-600">광운대학교 관리자 시스템</h1>
          <p className="text-gray-600">회원가입 요청을 관리하고 승인할 수 있습니다.</p>
        </div>
        <Button onClick={handleLogout} variant="outline" size="sm">
          <LogOut className="w-4 h-4 mr-2" />
          로그아웃
        </Button>
      </div>

      <div className="flex gap-6">
        {/* 요청 목록 */}
        <div className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>회원가입 요청 관리</CardTitle>
              <CardDescription>역할 선택 후 필요한 정보를 입력하고 승인하세요.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>이름</TableHead>
                    <TableHead>이메일</TableHead>
                    <TableHead>전화번호</TableHead>
                    <TableHead>신청일</TableHead>
                    <TableHead>역할</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.name}</TableCell>
                      <TableCell>{request.email}</TableCell>
                      <TableCell>{request.phone_number}</TableCell>
                      <TableCell>{new Date(request.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>{getRoleText(request.role)}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>
                        {request.status === "pending" && (
                          <Button variant="outline" size="sm" onClick={() => setSelectedRequest(request)}>
                            처리
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* 상세 정보 패널 */}
        {selectedRequest && (
          <div className="w-80">
            <Card>
              <CardHeader>
                <CardTitle>{selectedRequest.role === "professor" ? "교직원 번호 입력" : "학번 입력"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="studentId">{selectedRequest.role === "professor" ? "교직원 번호" : "학번"}</Label>
                  <div className="flex gap-2">
                    <Input
                      id="studentId"
                      value={additionalInfo.studentId}
                      onChange={(e) => setAdditionalInfo((prev) => ({ ...prev, studentId: e.target.value }))}
                      placeholder={
                        selectedRequest.role === "professor" ? "교직원 번호를 입력하세요" : "학번을 입력하세요"
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={generateStudentId}
                      disabled={!additionalInfo.department}
                    >
                      자동생성
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    {selectedRequest.role === "professor"
                      ? "교수: P년도학과코드순번 (예: P2025101001)"
                      : "학생: 년도학과코드순번 (예: 2025101001)"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">학과</Label>
                  <Select onValueChange={(value) => setAdditionalInfo((prev) => ({ ...prev, department: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="학과 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="computer">컴퓨터공학과</SelectItem>
                      <SelectItem value="electronics">전자공학과</SelectItem>
                      <SelectItem value="business">경영학과</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">주소</Label>
                  <Input
                    id="address"
                    value={additionalInfo.address}
                    onChange={(e) => setAdditionalInfo((prev) => ({ ...prev, address: e.target.value }))}
                    placeholder="주소를 입력하세요"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode">우편번호</Label>
                  <Input
                    id="postalCode"
                    value={additionalInfo.postalCode}
                    onChange={(e) => setAdditionalInfo((prev) => ({ ...prev, postalCode: e.target.value }))}
                    placeholder="우편번호를 입력하세요"
                  />
                </div>

                {selectedRequest.role === "student" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="admissionType">입학 유형</Label>
                      <Input
                        id="admissionType"
                        value={additionalInfo.admissionType}
                        onChange={(e) => setAdditionalInfo((prev) => ({ ...prev, admissionType: e.target.value }))}
                        placeholder="입학 유형을 입력하세요"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tuitionStatus">등록금 납부 상태</Label>
                      <Input
                        id="tuitionStatus"
                        value={additionalInfo.tuitionStatus}
                        onChange={(e) => setAdditionalInfo((prev) => ({ ...prev, tuitionStatus: e.target.value }))}
                        placeholder="등록금 납부 상태"
                      />
                    </div>
                  </>
                )}

                {selectedRequest.role === "professor" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="position">직책 (예: 조교수)</Label>
                      <Input
                        id="position"
                        value={additionalInfo.position}
                        onChange={(e) => setAdditionalInfo((prev) => ({ ...prev, position: e.target.value }))}
                        placeholder="직책을 입력하세요"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="majorField">전공 분야</Label>
                      <Input
                        id="majorField"
                        value={additionalInfo.majorField}
                        onChange={(e) => setAdditionalInfo((prev) => ({ ...prev, majorField: e.target.value }))}
                        placeholder="전공 분야를 입력하세요"
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="reason">메모</Label>
                  <Textarea
                    id="reason"
                    value={additionalInfo.reason}
                    onChange={(e) => setAdditionalInfo((prev) => ({ ...prev, reason: e.target.value }))}
                    placeholder="거부 사유 또는 메모"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleApprove}
                    disabled={isProcessing || !additionalInfo.studentId}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        승인
                      </>
                    )}
                  </Button>
                  <Button onClick={handleReject} disabled={isProcessing} variant="destructive" className="flex-1">
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 mr-2" />
                        거부
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
