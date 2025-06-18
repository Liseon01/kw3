"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { BookOpen, Loader2, LogOut, Download, FileText, Plus, Edit, Trash2, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import Header from "@/components/header"
import Timetable from "@/components/timetable"

// 참조 데이터 - 4개 학과로 제한
const departments = [
  { id: 1, name: "컴퓨터공학과" },
  { id: 2, name: "전자공학과" },
  { id: 3, name: "소프트웨어학과" },
  { id: 4, name: "로봇학과" },
]

const getDepartmentName = (departmentId: number | string) => {
  const deptId = typeof departmentId === "string" ? Number.parseInt(departmentId, 10) : departmentId
  const department = departments.find((dept) => dept.id === deptId)
  return department ? department.name : "알 수 없음"
}

export default function MaterialsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [courses, setCourses] = useState<any[]>([])
  const [materials, setMaterials] = useState<any[]>([])
  const [assignments, setAssignments] = useState<any[]>([])
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [grades, setGrades] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState("courses")
  const [isMockData, setIsMockData] = useState(false)
  const [tablesExist, setTablesExist] = useState({
    materials: true,
    assignments: true,
    announcements: true,
  })

  // 모달 상태
  const [showNewCourseModal, setShowNewCourseModal] = useState(false)
  const [showMaterialModal, setShowMaterialModal] = useState(false)
  const [showAssignmentModal, setShowAssignmentModal] = useState(false)
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false)
  const [showGradeModal, setShowGradeModal] = useState(false)

  // 과제 제출 모달 상태 추가
  const [showSubmissionModal, setShowSubmissionModal] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null)
  const [submissionData, setSubmissionData] = useState({
    content: "",
    file_url: "",
  })
  const [assignmentSubmissions, setAssignmentSubmissions] = useState<{ [key: number]: any }>({})

  const [editingItem, setEditingItem] = useState<any>(null)

  // 폼 데이터
  const [newCourseData, setNewCourseData] = useState({
    course_code: "",
    course_name: "",
    credits: "3",
    department_id: "1",
    course_type: "전공선택",
    day1: "월",
    day1_start_time: "09:00",
    day1_end_time: "10:50",
    day2: "",
    day2_start_time: "",
    day2_end_time: "",
    course_classroom: "",
    max_enrollments: "30",
    description: "",
    year: "2025",
    semester: "1학기",
  })

  const [uploadingFile, setUploadingFile] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const [materialData, setMaterialData] = useState({
    title: "",
    description: "",
    file_url: "",
  })

  const [assignmentData, setAssignmentData] = useState({
    title: "",
    assignmentDescription: "",
    due_date: "",
    max_score: "100",
    assignment_type: "homework",
  })

  const [announcementData, setAnnouncementData] = useState({
    title: "",
    content: "",
    is_important: false,
  })

  const [gradeData, setGradeData] = useState({
    student_id: "",
    midterm_score: "",
    final_score: "",
    assignment_score: "",
    attendance_score: "",
  })

  // 과제 제출 관리 상태 추가
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false)
  const [selectedAssignmentForReview, setSelectedAssignmentForReview] = useState<any>(null)
  const [assignmentSubmissionsList, setAssignmentSubmissionsList] = useState<any[]>([])
  const [selectedSubmissionForGrading, setSelectedSubmissionForGrading] = useState<any>(null)
  const [showGradingModal, setShowGradingModal] = useState(false)
  const [gradingData, setGradingData] = useState({
    score: "",
    feedback: "",
  })

  // 사용자 권한 확인
  useEffect(() => {
    const userData = sessionStorage.getItem("user")
    console.log("User data from session:", userData) // 디버깅 추가

    if (!userData) {
      console.log("No user data, redirecting to login") // 디버깅 추가
      router.push("/")
      return
    }

    const parsedUser = JSON.parse(userData)
    console.log("Parsed user:", parsedUser) // 디버깅 추가
    setUser(parsedUser)

    if (parsedUser.role === "student") {
      fetchEnrolledCourses(parsedUser.student_id)
    } else if (parsedUser.role === "professor") {
      console.log("Fetching courses for professor:", parsedUser.id) // 디버깅 추가
      fetchCourses(parsedUser.id)
    }
  }, [router])

  // 수강 중인 강의 목록 가져오기 (학생용)
  const fetchEnrolledCourses = async (studentId: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/enrollments?studentId=${studentId}`)
      const data = await response.json()

      if (data.success) {
        const enrolledCourses = data.enrollments.map((enrollment: any) => ({
          ...enrollment.courses,
          enrollment_id: enrollment.enrollment_id,
          enrollment_status: enrollment.enrollment_status,
        }))

        setCourses(enrolledCourses || [])
        setIsMockData(false)

        if (enrolledCourses.length === 0) {
          toast({
            title: "알림",
            description: "수강 중인 강의가 없습니다. 수강신청을 먼저 해주세요.",
          })
        }
      } else {
        toast({
          title: "오류",
          description: data.error || "수강 중인 강의 목록을 불러오는데 실패했습니다.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to fetch enrolled courses:", error)
      toast({
        title: "오류",
        description: "수강 중인 강의 목록을 불러오는데 실패했습니다.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // 교수 강의 목록 가져오기 (교수용)
  const fetchCourses = async (professorId: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/courses?professorId=${professorId}`)
      const data = await response.json()

      if (data.success) {
        setCourses(data.courses || [])
        setIsMockData(data.isMockData || false)

        if (data.isMockData) {
          toast({
            title: "알림",
            description: "현재 모의 데이터를 사용하고 있습니다. 데이터베이스 테이블을 생성해주세요.",
          })
        }
      } else {
        toast({
          title: "오류",
          description: data.error || "강의 목록을 불러오는데 실패했습니다.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error)
      toast({
        title: "오류",
        description: "강의 목록을 불러오는데 실패했습니다.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // 강의 자료 가져오기
  const fetchMaterials = async (courseId: number) => {
    try {
      const response = await fetch(`/api/course-materials?courseId=${courseId}`)
      const data = await response.json()

      if (data.success) {
        setMaterials(data.materials || [])
        setTablesExist((prev) => ({ ...prev, materials: true }))
      } else {
        console.error("Failed to fetch materials:", data.error)
        setMaterials([])

        // 테이블 존재 여부 확인
        if (data.tableExists === false) {
          setTablesExist((prev) => ({ ...prev, materials: false }))
          toast({
            title: "테이블 누락",
            description: "강의 자료 테이블이 생성되지 않았습니다. 데이터베이스 스크립트를 실행해주세요.",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Failed to fetch materials:", error)
      setMaterials([])
      setTablesExist((prev) => ({ ...prev, materials: false }))
    }
  }

  // 과제 가져오기
  const fetchAssignments = async (courseId: number) => {
    try {
      const response = await fetch(`/api/assignments?courseId=${courseId}`)
      const data = await response.json()

      if (data.success) {
        setAssignments(data.assignments || [])
        setTablesExist((prev) => ({ ...prev, assignments: true }))
      } else {
        console.error("Failed to fetch assignments:", data.error)
        setAssignments([])

        // 테이블 존재 여부 확인
        if (data.tableExists === false) {
          setTablesExist((prev) => ({ ...prev, assignments: false }))
          toast({
            title: "테이블 누락",
            description: "과제 테이블이 생성되지 않았습니다. 데이터베이스 스크립트를 실행해주세요.",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Failed to fetch assignments:", error)
      setAssignments([])
      setTablesExist((prev) => ({ ...prev, assignments: false }))
    }
  }

  // 공지사항 가져오기
  const fetchAnnouncements = async (courseId: number) => {
    try {
      const response = await fetch(`/api/course-announcements?courseId=${courseId}`)
      const data = await response.json()

      if (data.success) {
        setAnnouncements(data.announcements || [])
        setTablesExist((prev) => ({ ...prev, announcements: true }))
      } else {
        console.error("Failed to fetch announcements:", data.error)
        setAnnouncements([])

        // 테이블 존재 여부 확인
        if (data.tableExists === false) {
          setTablesExist((prev) => ({ ...prev, announcements: false }))
          toast({
            title: "테이블 누락",
            description: "공지사항 테이블이 생성되지 않았습니다. 데이터베이스 스크립트를 실행해주세요.",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Failed to fetch announcements:", error)
      setAnnouncements([])
      setTablesExist((prev) => ({ ...prev, announcements: false }))
    }
  }

  // 성적 가져오기
  const fetchGrades = async (courseId: number) => {
    try {
      const response = await fetch(`/api/grades?courseId=${courseId}`)
      const data = await response.json()

      if (data.success) {
        setGrades(data.grades || [])
      } else {
        console.error("Failed to fetch grades:", data.error)
        setGrades([])
      }
    } catch (error) {
      console.error("Failed to fetch grades:", error)
      setGrades([])
    }
  }

  // 과제 제출 상태 가져오기
  const fetchAssignmentSubmissions = async (courseId: number) => {
    if (user.role !== "student") return

    try {
      const submissions: { [key: number]: any } = {}

      for (const assignment of assignments) {
        const response = await fetch(
          `/api/assignment-submissions?assignmentId=${assignment.assignment_id}&studentId=${user.student_id}`,
        )
        const data = await response.json()

        if (data.success) {
          submissions[assignment.assignment_id] = data.submission
        }
      }

      setAssignmentSubmissions(submissions)
    } catch (error) {
      console.error("Failed to fetch assignment submissions:", error)
    }
  }

  // 과제 제출 내역 조회 (교수용)
  const fetchAssignmentSubmissionsList = async (assignmentId: number) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/assignment-submissions/${assignmentId}`)
      const data = await response.json()

      if (data.success) {
        setAssignmentSubmissionsList(data.submissions || [])
      } else {
        toast({
          title: "오류",
          description: data.error || "제출 내역을 불러오는데 실패했습니다.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to fetch assignment submissions:", error)
      toast({
        title: "오류",
        description: "제출 내역을 불러오는데 실패했습니다.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // 강의 선택 시 관련 데이터 로드
  const handleCourseSelect = (courseId: number) => {
    setSelectedCourse(courseId)
    fetchMaterials(courseId)
    fetchAssignments(courseId)
    fetchAnnouncements(courseId)
    if (user.role === "professor") {
      fetchGrades(courseId)
    } else if (user.role === "student") {
      // 과제 목록을 먼저 가져온 후 제출 상태 확인
      fetchAssignments(courseId).then(() => {
        fetchAssignmentSubmissions(courseId)
      })
    }
  }

  // 새 강의 등록
  const handleCreateCourse = async () => {
    try {
      setLoading(true)

      const response = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newCourseData,
          professor_id: user.id,
          professor_name: user.name,
          course_status: "개강",
          course_establish_date: new Date().toISOString().split("T")[0],
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "성공",
          description: "강의가 성공적으로 등록되었습니다.",
        })
        setShowNewCourseModal(false)
        fetchCourses(user.id)
        resetCourseForm()
      } else {
        toast({
          title: "오류",
          description: data.error || "강의 등록에 실패했습니다.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to create course:", error)
      toast({
        title: "오류",
        description: "강의 등록 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // 파일 업로드 함수 추가 (handleMaterialSubmit 함수 위에)
  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("파일 업로드에 실패했습니다.")
    }

    const data = await response.json()
    return data.fileUrl
  }

  // 파일 선택 핸들러 추가
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      // 파일 크기를 MB 단위로 표시
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2)
      console.log(`Selected file: ${file.name}, Size: ${fileSizeMB}MB`)
    }
  }

  // 강의 자료 등록/수정
  const handleMaterialSubmit = async () => {
    if (!selectedCourse) {
      console.log("No course selected")
      toast({
        title: "오류",
        description: "강의를 먼저 선택해주세요.",
        variant: "destructive",
      })
      return
    }

    if (!user) {
      console.log("No user found")
      return
    }

    if (!editingItem && !selectedFile) {
      toast({
        title: "오류",
        description: "파일을 선택해주세요.",
        variant: "destructive",
      })
      return
    }

    console.log("Submitting material:", { materialData, selectedCourse, user: user.id })

    try {
      setLoading(true)
      setUploadingFile(true)

      let fileUrl = materialData.file_url
      let fileName = ""
      let fileSize = ""

      // 새 파일이 선택된 경우 업로드
      if (selectedFile) {
        fileUrl = await uploadFile(selectedFile)
        fileName = selectedFile.name
        fileSize = `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
      }

      const url = editingItem ? `/api/course-materials/${editingItem.material_id}` : "/api/course-materials"
      const method = editingItem ? "PUT" : "POST"

      console.log("API call:", { url, method })

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...materialData,
          course_id: selectedCourse,
          created_by: user.id,
          file_url: fileUrl,
          file_name: fileName,
          file_size: fileSize,
        }),
      })

      console.log("Response status:", response.status)
      const data = await response.json()
      console.log("Response data:", data)

      if (data.success) {
        toast({
          title: "성공",
          description: `강의 자료가 성공적으로 ${editingItem ? "수정" : "등록"}되었습니다.`,
        })
        setShowMaterialModal(false)
        setEditingItem(null)
        fetchMaterials(selectedCourse)
        resetMaterialForm()
      } else {
        console.error("API error:", data.error)
        toast({
          title: "오류",
          description: data.error || `강의 자료 ${editingItem ? "수정" : "등록"}에 실패했습니다.`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to submit material:", error)
      toast({
        title: "오류",
        description: `강의 자료 ${editingItem ? "수정" : "등록"} 중 오류가 발생했습니다.`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setUploadingFile(false)
    }
  }

  // 과제 등록/수정
  const handleAssignmentSubmit = async () => {
    if (!selectedCourse) {
      console.log("No course selected for assignment") // 디버깅 추가
      toast({
        title: "오류",
        description: "강의를 먼저 선택해주세요.",
        variant: "destructive",
      })
      return
    }

    if (!user) {
      console.log("No user found for assignment") // 디버깅 추가
      return
    }

    console.log("Submitting assignment:", { assignmentData, selectedCourse, user: user.id }) // 디버깅 추가

    try {
      setLoading(true)
      const url = editingItem ? `/api/assignments/${editingItem.assignment_id}` : "/api/assignments"
      const method = editingItem ? "PUT" : "POST"

      console.log("Assignment API call:", { url, method }) // 디버깅 추가

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...assignmentData,
          course_id: selectedCourse,
          created_by: user.id,
          description: assignmentData.assignmentDescription,
        }),
      })

      console.log("Assignment response status:", response.status) // 디버깅 추가
      const data = await response.json()
      console.log("Assignment response data:", data) // 디버깅 추가

      if (data.success) {
        toast({
          title: "성공",
          description: `과제가 성공적으로 ${editingItem ? "수정" : "등록"}되었습니다.`,
        })
        setShowAssignmentModal(false)
        setEditingItem(null)
        fetchAssignments(selectedCourse)
        resetAssignmentForm()
      } else {
        console.error("Assignment API error:", data.error) // 디버깅 추가
        toast({
          title: "오류",
          description: data.error || `과제 ${editingItem ? "수정" : "등록"}에 실패했습니다.`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to submit assignment:", error)
      toast({
        title: "오류",
        description: `과제 ${editingItem ? "수정" : "등록"} 중 오류가 발생했습니다.`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // 공지사항 등록/수정
  const handleAnnouncementSubmit = async () => {
    if (!selectedCourse) {
      console.log("No course selected for announcement") // 디버깅 추가
      toast({
        title: "오류",
        description: "강의를 먼저 선택해주세요.",
        variant: "destructive",
      })
      return
    }

    if (!user) {
      console.log("No user found for announcement") // 디버깅 추가
      return
    }

    console.log("Submitting announcement:", { announcementData, selectedCourse, user: user.id }) // 디버깅 추가

    try {
      setLoading(true)
      const url = editingItem ? `/api/course-announcements/${editingItem.announcement_id}` : "/api/course-announcements"
      const method = editingItem ? "PUT" : "POST"

      console.log("Announcement API call:", { url, method }) // 디버깅 추가

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...announcementData,
          course_id: selectedCourse,
          created_by: user.id,
        }),
      })

      console.log("Announcement response status:", response.status) // 디버깅 추가
      const data = await response.json()
      console.log("Announcement response data:", data) // 디버깅 추가

      if (data.success) {
        toast({
          title: "성공",
          description: `공지사항이 성공적으로 ${editingItem ? "수정" : "등록"}되었습니다.`,
        })
        setShowAnnouncementModal(false)
        setEditingItem(null)
        fetchAnnouncements(selectedCourse)
        resetAnnouncementForm()
      } else {
        console.error("Announcement API error:", data.error) // 디버깅 추가
        toast({
          title: "오류",
          description: data.error || `공지사항 ${editingItem ? "수정" : "등록"}에 실패했습니다.`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to submit announcement:", error)
      toast({
        title: "오류",
        description: `공지사항 ${editingItem ? "수정" : "등록"} 중 오류가 발생했습니다.`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // 성적 등록/수정
  const handleGradeSubmit = async () => {
    if (!selectedCourse) return

    try {
      setLoading(true)

      const response = await fetch("/api/grades", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...gradeData,
          course_id: selectedCourse,
          midterm_score: Number.parseFloat(gradeData.midterm_score) || 0,
          final_score: Number.parseFloat(gradeData.final_score) || 0,
          assignment_score: Number.parseFloat(gradeData.assignment_score) || 0,
          attendance_score: Number.parseFloat(gradeData.attendance_score) || 0,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "성공",
          description: "성적이 성공적으로 저장되었습니다.",
        })
        setShowGradeModal(false)
        fetchGrades(selectedCourse)
        resetGradeForm()
      } else {
        toast({
          title: "오류",
          description: data.error || "성적 저장에 실패했습니다.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to submit grade:", error)
      toast({
        title: "오류",
        description: "성적 저장 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // 과제 제출
  const handleSubmitAssignment = (assignment: any) => {
    setSelectedAssignment(assignment)
    setSubmissionData({
      content: "",
      file_url: "",
    })
    setShowSubmissionModal(true)
  }

  // 과제 제출 처리
  const handleSubmissionSubmit = async () => {
    if (!selectedAssignment || !user) return

    try {
      setLoading(true)

      const response = await fetch("/api/assignment-submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assignment_id: selectedAssignment.assignment_id,
          student_id: user.student_id,
          submission_content: submissionData.content,
          file_url: submissionData.file_url,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "성공",
          description: "과제가 성공적으로 제출되었습니다.",
        })
        setShowSubmissionModal(false)
        // 제출 상태 업데이트
        if (selectedCourse) {
          fetchAssignmentSubmissions(selectedCourse)
        }
        resetSubmissionForm()
      } else {
        toast({
          title: "오류",
          description: data.error || "과제 제출에 실패했습니다.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to submit assignment:", error)
      toast({
        title: "오류",
        description: "과제 제출 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // 채점 처리
  const handleGradeSubmission = async () => {
    if (!selectedSubmissionForGrading) return

    try {
      setLoading(true)

      const response = await fetch(
        `/api/assignment-submissions/${selectedSubmissionForGrading.assignment_id}/${selectedSubmissionForGrading.submission_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            score: Number.parseInt(gradingData.score, 10),
            feedback: gradingData.feedback,
            graded_by: user.id,
          }),
        },
      )

      const data = await response.json()

      if (data.success) {
        toast({
          title: "성공",
          description: "채점이 완료되었습니다.",
        })
        setShowGradingModal(false)
        // 제출 내역 새로고침
        fetchAssignmentSubmissionsList(selectedSubmissionForGrading.assignment_id)
        resetGradingForm()
      } else {
        toast({
          title: "오류",
          description: data.error || "채점에 실패했습니다.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to grade submission:", error)
      toast({
        title: "오류",
        description: "채점 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // 과제 제출 내역 보기
  const handleViewSubmissions = (assignment: any) => {
    setSelectedAssignmentForReview(assignment)
    fetchAssignmentSubmissionsList(assignment.assignment_id)
    setShowSubmissionsModal(true)
  }

  // 채점 모달 열기
  const handleGradeSubmissionModal = (submission: any) => {
    setSelectedSubmissionForGrading(submission)
    setGradingData({
      score: submission.score?.toString() || "",
      feedback: submission.feedback || "",
    })
    setShowGradingModal(true)
  }

  // 삭제 함수들
  const handleDelete = async (type: string, id: number) => {
    if (!confirm(`정말로 이 ${type}을(를) 삭제하시겠습니까?`)) return

    try {
      setLoading(true)
      let url = ""

      switch (type) {
        case "자료":
          url = `/api/course-materials/${id}`
          break
        case "과제":
          url = `/api/assignments/${id}`
          break
        case "공지사항":
          url = `/api/course-announcements/${id}`
          break
        default:
          return
      }

      const response = await fetch(url, { method: "DELETE" })
      const data = await response.json()

      if (data.success) {
        toast({
          title: "성공",
          description: `${type}이(가) 성공적으로 삭제되었습니다.`,
        })

        // 해당 데이터 새로고침
        if (selectedCourse) {
          switch (type) {
            case "자료":
              fetchMaterials(selectedCourse)
              break
            case "과제":
              fetchAssignments(selectedCourse)
              break
            case "공지사항":
              fetchAnnouncements(selectedCourse)
              break
          }
        }
      } else {
        toast({
          title: "오류",
          description: data.error || `${type} 삭제에 실패했습니다.`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error(`Failed to delete ${type}:`, error)
      toast({
        title: "오류",
        description: `${type} 삭제 중 오류가 발생했습니다.`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // 편집 모드 설정
  const handleEdit = (type: string, item: any) => {
    setEditingItem(item)

    switch (type) {
      case "자료":
        setMaterialData({
          title: item.title,
          description: item.description || "",
          file_url: item.file_url || "",
        })
        setShowMaterialModal(true)
        break
      case "과제":
        setAssignmentData({
          title: item.title,
          assignmentDescription: item.description,
          due_date: item.due_date ? item.due_date.slice(0, 16) : "",
          max_score: item.max_score.toString(),
          assignment_type: item.assignment_type,
        })
        setShowAssignmentModal(true)
        break
      case "공지사항":
        setAnnouncementData({
          title: item.title,
          content: item.content,
          is_important: item.is_important,
        })
        setShowAnnouncementModal(true)
        break
    }
  }

  // 폼 리셋 함수들
  const resetCourseForm = () => {
    setNewCourseData({
      course_code: "",
      course_name: "",
      credits: "3",
      department_id: "1",
      course_type: "전공선택",
      day1: "월",
      day1_start_time: "09:00",
      day1_end_time: "10:50",
      day2: "",
      day2_start_time: "",
      day2_end_time: "",
      course_classroom: "",
      max_enrollments: "30",
      description: "",
      year: "2025",
      semester: "1학기",
    })
  }

  const resetMaterialForm = () => {
    setMaterialData({
      title: "",
      description: "",
      file_url: "",
    })
    setSelectedFile(null)
  }

  const resetAssignmentForm = () => {
    setAssignmentData({
      title: "",
      assignmentDescription: "",
      due_date: "",
      max_score: "100",
      assignment_type: "homework",
    })
  }

  const resetAnnouncementForm = () => {
    setAnnouncementData({
      title: "",
      content: "",
      is_important: false,
    })
  }

  const resetGradeForm = () => {
    setGradeData({
      student_id: "",
      midterm_score: "",
      final_score: "",
      assignment_score: "",
      attendance_score: "",
    })
  }

  const resetSubmissionForm = () => {
    setSubmissionData({
      content: "",
      file_url: "",
    })
  }

  // 채점 폼 리셋
  const resetGradingForm = () => {
    setGradingData({
      score: "",
      feedback: "",
    })
  }

  const handleDownload = async (material: any) => {
    try {
      if (material.file_url) {
        // 파일 다운로드 링크 생성
        const link = document.createElement("a")
        link.href = material.file_url
        link.download = material.file_name || material.title
        link.target = "_blank"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        toast({
          title: "다운로드 시작",
          description: `${material.file_name || material.title} 파일 다운로드를 시작합니다.`,
        })
      } else {
        toast({
          title: "오류",
          description: "다운로드할 파일이 없습니다.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Download error:", error)
      toast({
        title: "오류",
        description: "파일 다운로드 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </div>
      </div>
    )
  }

  const selectedCourseData = courses.find((c) => c.course_id === selectedCourse)
  const anyTableMissing = !tablesExist.materials || !tablesExist.assignments || !tablesExist.announcements

  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user} />

      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">강의 자료실</h1>
            <p className="text-gray-600 mt-1">
              {user.role === "student"
                ? "수강 중인 강의의 자료를 확인할 수 있습니다."
                : `${user.name} 교수님의 강의 관리`}
            </p>
            {isMockData && (
              <Badge variant="outline" className="mt-2 bg-yellow-100 text-yellow-800">
                모의 데이터 모드
              </Badge>
            )}
          </div>
          <Button
            onClick={() => {
              sessionStorage.removeItem("user")
              router.push("/")
            }}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            로그아웃
          </Button>
        </div>

        {/* 데이터베이스 테이블 생성 안내 - 실제로 테이블이 없을 때만 표시 */}
        {anyTableMissing && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-medium text-orange-800">데이터베이스 설정 필요</p>
                  <p className="text-sm text-orange-700">
                    일부 기능을 사용하려면 먼저 <code>scripts/create-course-content-tables-v2.sql</code> 스크립트를
                    실행해주세요.
                    <br />
                    누락된 테이블: {!tablesExist.materials && "강의자료"} {!tablesExist.assignments && "과제"}{" "}
                    {!tablesExist.announcements && "공지사항"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`grid w-full ${user.role === "professor" ? "grid-cols-6" : "grid-cols-5"}`}>
            <TabsTrigger value="timetable">시간표</TabsTrigger>
            <TabsTrigger value="courses">{user.role === "student" ? "수강 중인 강의" : "담당 강의"}</TabsTrigger>
            <TabsTrigger value="materials">강의 자료</TabsTrigger>
            <TabsTrigger value="assignments">{user.role === "student" ? "과제 제출" : "과제 관리"}</TabsTrigger>
            <TabsTrigger value="announcements">공지사항</TabsTrigger>
            {user.role === "professor" && <TabsTrigger value="grades">성적 관리</TabsTrigger>}
          </TabsList>

          {/* 시간표 탭 */}
          <TabsContent value="timetable" className="space-y-6">
            <Timetable courses={courses} />
          </TabsContent>

          {/* 강의 목록 탭 */}
          <TabsContent value="courses" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    {user.role === "student" ? "수강 중인 강의 목록" : "담당 강의 목록"}
                    <Badge variant="outline" className="ml-2">
                      {courses.length}개 강의
                    </Badge>
                  </CardTitle>
                  {user.role === "professor" && (
                    <Button
                      size="sm"
                      className="bg-rose-600 hover:bg-rose-700"
                      onClick={() => setShowNewCourseModal(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      강의 등록
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-rose-600" />
                  </div>
                ) : courses.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>강의 코드</TableHead>
                          <TableHead>강의명</TableHead>
                          <TableHead>교수명</TableHead>
                          <TableHead>학점</TableHead>
                          <TableHead>학과</TableHead>
                          <TableHead>강의 유형</TableHead>
                          <TableHead>시간</TableHead>
                          <TableHead>강의실</TableHead>
                          <TableHead>상태</TableHead>
                          <TableHead>관리</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {courses.map((course) => (
                          <TableRow key={course.course_id}>
                            <TableCell className="font-medium">{course.course_code}</TableCell>
                            <TableCell>{course.course_name}</TableCell>
                            <TableCell>{course.professors?.name || course.professor_name || "미정"}</TableCell>
                            <TableCell>{course.credits}학점</TableCell>
                            <TableCell>{getDepartmentName(course.department_id)}</TableCell>
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
                            <TableCell>
                              <div className="text-sm">
                                <div className="flex items-center gap-1">
                                  {course.day1} {course.day1_start_time?.slice(0, 5)}-
                                  {course.day1_end_time?.slice(0, 5)}
                                </div>
                                {course.day2 && (
                                  <div className="flex items-center gap-1 mt-1">
                                    {course.day2} {course.day2_start_time?.slice(0, 5)}-
                                    {course.day2_end_time?.slice(0, 5)}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{course.course_classroom}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  course.course_status === "개강"
                                    ? "default"
                                    : course.course_status === "폐강"
                                      ? "destructive"
                                      : "secondary"
                                }
                                className={
                                  course.course_status === "개강"
                                    ? "bg-green-600"
                                    : course.course_status === "폐강"
                                      ? "bg-red-600"
                                      : "bg-yellow-600"
                                }
                              >
                                {course.enrollment_status || course.course_status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  handleCourseSelect(course.course_id)
                                  setActiveTab("materials")
                                }}
                              >
                                관리
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>{user.role === "student" ? "수강 중인 강의가 없습니다." : "등록된 강의가 없습니다."}</p>
                    <p className="text-sm">
                      {user.role === "student" ? "수강신청을 먼저 해주세요." : "새 강의를 등록해보세요."}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 강의 자료 탭 */}
          <TabsContent value="materials" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>강의 자료</CardTitle>
                    {selectedCourseData && (
                      <p className="text-sm text-gray-600 mt-1">
                        {selectedCourseData.course_name} ({selectedCourseData.course_code})
                      </p>
                    )}
                  </div>
                  {user.role === "professor" && selectedCourse && tablesExist.materials && (
                    <Button
                      size="sm"
                      className="bg-rose-600 hover:bg-rose-700"
                      onClick={() => {
                        console.log("Material button clicked", { selectedCourse, tablesExist }) // 디버깅 추가
                        setEditingItem(null)
                        resetMaterialForm()
                        setShowMaterialModal(true)
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      자료 등록
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {!selectedCourse ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>강의를 선택해주세요.</p>
                    <p className="text-sm">강의 목록에서 "관리" 버튼을 클릭하세요.</p>
                  </div>
                ) : !tablesExist.materials ? (
                  <div className="text-center py-8 text-gray-500">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-300" />
                    <p>강의 자료 테이블이 생성되지 않았습니다.</p>
                    <p className="text-sm">scripts/create-course-content-tables-v2.sql 스크립트를 실행해주세요.</p>
                  </div>
                ) : materials.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>제목</TableHead>
                          <TableHead>설명</TableHead>
                          <TableHead>파일명</TableHead>
                          <TableHead>크기</TableHead>
                          <TableHead>업로드일</TableHead>
                          <TableHead>다운로드</TableHead>
                          <TableHead>작업</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {materials.map((material) => (
                          <TableRow key={material.material_id}>
                            <TableCell className="font-medium">{material.title}</TableCell>
                            <TableCell>{material.description}</TableCell>
                            <TableCell>{material.file_name}</TableCell>
                            <TableCell>{material.file_size}</TableCell>
                            <TableCell>{new Date(material.upload_date).toLocaleDateString()}</TableCell>
                            <TableCell>{material.download_count}회</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDownload(material)}
                                  className="flex items-center gap-1"
                                >
                                  <Download className="h-3 w-3" />
                                  다운로드
                                </Button>
                                {user.role === "professor" && (
                                  <>
                                    <Button size="sm" variant="outline" onClick={() => handleEdit("자료", material)}>
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleDelete("자료", material.material_id)}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>등록된 강의 자료가 없습니다.</p>
                    {user.role === "professor" && (
                      <Button
                        className="mt-4"
                        onClick={() => {
                          setEditingItem(null)
                          resetMaterialForm()
                          setShowMaterialModal(true)
                        }}
                      >
                        첫 번째 자료 등록하기
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 과제 관리 탭 */}
          <TabsContent value="assignments" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{user.role === "student" ? "과제 제출" : "과제 관리"}</CardTitle>
                    {selectedCourseData && (
                      <p className="text-sm text-gray-600 mt-1">
                        {selectedCourseData.course_name} ({selectedCourseData.course_code})
                      </p>
                    )}
                  </div>
                  {user.role === "professor" && selectedCourse && tablesExist.assignments && (
                    <Button
                      size="sm"
                      className="bg-rose-600 hover:bg-rose-700"
                      onClick={() => {
                        console.log("Assignment button clicked", { selectedCourse, tablesExist }) // 디버깅 추가
                        setEditingItem(null)
                        resetAssignmentForm()
                        setShowAssignmentModal(true)
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      과제 등록
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {!selectedCourse ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>강의를 선택해주세요.</p>
                    <p className="text-sm">강의 목록에서 "관리" 버튼을 클릭하세요.</p>
                  </div>
                ) : !tablesExist.assignments ? (
                  <div className="text-center py-8 text-gray-500">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-300" />
                    <p>과제 테이블이 생성되지 않았습니다.</p>
                    <p className="text-sm">scripts/create-course-content-tables-v2.sql 스크립트를 실행해주세요.</p>
                  </div>
                ) : assignments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>과제명</TableHead>
                          <TableHead>설명</TableHead>
                          <TableHead>마감일</TableHead>
                          <TableHead>만점</TableHead>
                          <TableHead>유형</TableHead>
                          {user.role === "student" && (
                            <>
                              <TableHead>상태</TableHead>
                              <TableHead>제출</TableHead>
                            </>
                          )}
                          {user.role === "professor" && <TableHead>작업</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {assignments.map((assignment) => (
                          <TableRow key={assignment.assignment_id}>
                            <TableCell className="font-medium">{assignment.title}</TableCell>
                            <TableCell className="max-w-xs truncate">{assignment.description}</TableCell>
                            <TableCell>{new Date(assignment.due_date).toLocaleString()}</TableCell>
                            <TableCell>{assignment.max_score}점</TableCell>
                            <TableCell>{assignment.assignment_type}</TableCell>
                            {user.role === "student" && (
                              <>
                                <TableCell>
                                  {assignmentSubmissions[assignment.assignment_id] ? (
                                    <Badge variant="default" className="bg-green-600">
                                      제출완료
                                    </Badge>
                                  ) : (
                                    <Badge variant="destructive">미제출</Badge>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {assignmentSubmissions[assignment.assignment_id] ? (
                                    <div className="text-sm text-gray-600">
                                      {new Date(
                                        assignmentSubmissions[assignment.assignment_id].submitted_at,
                                      ).toLocaleString()}
                                    </div>
                                  ) : (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleSubmitAssignment(assignment)}
                                    >
                                      제출하기
                                    </Button>
                                  )}
                                </TableCell>
                              </>
                            )}
                            {user.role === "professor" && (
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleViewSubmissions(assignment)}
                                    className="flex items-center gap-1"
                                  >
                                    <FileText className="h-3 w-3" />
                                    제출현황
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => handleEdit("과제", assignment)}>
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleDelete("과제", assignment.assignment_id)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>등록된 과제가 없습니다.</p>
                    {user.role === "professor" && (
                      <Button
                        className="mt-4"
                        onClick={() => {
                          setEditingItem(null)
                          resetAssignmentForm()
                          setShowAssignmentModal(true)
                        }}
                      >
                        첫 번째 과제 등록하기
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 공지사항 탭 */}
          <TabsContent value="announcements" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>공지사항</CardTitle>
                    {selectedCourseData && (
                      <p className="text-sm text-gray-600 mt-1">
                        {selectedCourseData.course_name} ({selectedCourseData.course_code})
                      </p>
                    )}
                  </div>
                  {user.role === "professor" && selectedCourse && tablesExist.announcements && (
                    <Button
                      size="sm"
                      className="bg-rose-600 hover:bg-rose-700"
                      onClick={() => {
                        console.log("Announcement button clicked", { selectedCourse, tablesExist }) // 디버깅 추가
                        setEditingItem(null)
                        resetAnnouncementForm()
                        setShowAnnouncementModal(true)
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      공지사항 등록
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {!selectedCourse ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>강의를 선택해주세요.</p>
                    <p className="text-sm">강의 목록에서 "관리" 버튼을 클릭하세요.</p>
                  </div>
                ) : !tablesExist.announcements ? (
                  <div className="text-center py-8 text-gray-500">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-300" />
                    <p>공지사항 테이블이 생성되지 않았습니다.</p>
                    <p className="text-sm">scripts/create-course-content-tables-v2.sql 스크립트를 실행해주세요.</p>
                  </div>
                ) : announcements.length > 0 ? (
                  <div className="space-y-4">
                    {announcements.map((announcement) => (
                      <Card
                        key={announcement.announcement_id}
                        className={announcement.is_important ? "border-red-200 bg-red-50" : ""}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold">{announcement.title}</h3>
                                {announcement.is_important && (
                                  <Badge variant="destructive" className="text-xs">
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    중요
                                  </Badge>
                                )}
                              </div>
                              <p className="text-gray-700 mb-2">{announcement.content}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(announcement.created_at).toLocaleString()}
                              </p>
                            </div>
                            {user.role === "professor" && (
                              <div className="flex items-center gap-2 ml-4">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEdit("공지사항", announcement)}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDelete("공지사항", announcement.announcement_id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>등록된 공지사항이 없습니다.</p>
                    {user.role === "professor" && (
                      <Button
                        className="mt-4"
                        onClick={() => {
                          setEditingItem(null)
                          resetAnnouncementForm()
                          setShowAnnouncementModal(true)
                        }}
                      >
                        첫 번째 공지사항 등록하기
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 성적 관리 탭 */}
          {user.role === "professor" && (
            <TabsContent value="grades" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{user.role === "student" ? "내 성적" : "성적 관리"}</CardTitle>
                      {selectedCourseData && (
                        <p className="text-sm text-gray-600 mt-1">
                          {selectedCourseData.course_name} ({selectedCourseData.course_code})
                        </p>
                      )}
                    </div>
                    {user.role === "professor" && selectedCourse && (
                      <Button
                        size="sm"
                        className="bg-rose-600 hover:bg-rose-700"
                        onClick={() => {
                          setEditingItem(null)
                          resetGradeForm()
                          setShowGradeModal(true)
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        성적 입력
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {!selectedCourse ? (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>강의를 선택해주세요.</p>
                      <p className="text-sm">강의 목록에서 "관리" 버튼을 클릭하세요.</p>
                    </div>
                  ) : user.role === "professor" && grades.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>학번</TableHead>
                            <TableHead>이름</TableHead>
                            <TableHead>중간고사</TableHead>
                            <TableHead>기말고사</TableHead>
                            <TableHead>과제</TableHead>
                            <TableHead>출석</TableHead>
                            <TableHead>총점</TableHead>
                            <TableHead>학점</TableHead>
                            <TableHead>작업</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {grades.map((grade) => (
                            <TableRow key={grade.grade_id}>
                              <TableCell>{grade.students?.student_id}</TableCell>
                              <TableCell className="font-medium">{grade.students?.name}</TableCell>
                              <TableCell>{grade.midterm_score}</TableCell>
                              <TableCell>{grade.final_score}</TableCell>
                              <TableCell>{grade.assignment_score}</TableCell>
                              <TableCell>{grade.attendance_score}</TableCell>
                              <TableCell className="font-bold">{grade.total_score}</TableCell>
                              <TableCell>
                                <Badge variant={grade.letter_grade === "F" ? "destructive" : "default"}>
                                  {grade.letter_grade}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setEditingItem(grade)
                                      setGradeData({
                                        student_id: grade.student_id,
                                        midterm_score: grade.midterm_score.toString(),
                                        final_score: grade.final_score.toString(),
                                        assignment_score: grade.assignment_score.toString(),
                                        attendance_score: grade.attendance_score.toString(),
                                      })
                                      setShowGradeModal(true)
                                    }}
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleDelete("성적", grade.grade_id)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : user.role === "professor" ? (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>등록된 성적이 없습니다.</p>
                      <Button
                        className="mt-4"
                        onClick={() => {
                          setEditingItem(null)
                          resetGradeForm()
                          setShowGradeModal(true)
                        }}
                      >
                        첫 번째 성적 입력하기
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>성적 정보가 없습니다.</p>
                      <p className="text-sm">교수님이 성적을 입력하면 여기에 표시됩니다.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>

      {/* 강의 등록 모달 */}
      {showNewCourseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">새 강의 등록</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowNewCourseModal(false)}>
                  ✕
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="course_code">강의 코드</Label>
                  <Input
                    id="course_code"
                    value={newCourseData.course_code}
                    onChange={(e) => setNewCourseData({ ...newCourseData, course_code: e.target.value })}
                    placeholder="예: CS101"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="course_name">강의명</Label>
                  <Input
                    id="course_name"
                    value={newCourseData.course_name}
                    onChange={(e) => setNewCourseData({ ...newCourseData, course_name: e.target.value })}
                    placeholder="예: 컴퓨터과학개론"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="credits">학점</Label>
                  <Input
                    id="credits"
                    type="number"
                    value={newCourseData.credits}
                    onChange={(e) => setNewCourseData({ ...newCourseData, credits: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="department_id">학과</Label>
                  <select
                    id="department_id"
                    value={newCourseData.department_id}
                    onChange={(e) => setNewCourseData({ ...newCourseData, department_id: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                  >
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="course_type">강의 유형</Label>
                  <select
                    id="course_type"
                    value={newCourseData.course_type}
                    onChange={(e) => setNewCourseData({ ...newCourseData, course_type: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                  >
                    <option value="전공필수">전공필수</option>
                    <option value="전공선택">전공선택</option>
                    <option value="교양필수">교양필수</option>
                    <option value="교양선택">교양선택</option>
                    <option value="일반선택">일반선택</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="day1">요일 1</Label>
                  <select
                    id="day1"
                    value={newCourseData.day1}
                    onChange={(e) => setNewCourseData({ ...newCourseData, day1: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                  >
                    <option value="월">월</option>
                    <option value="화">화</option>
                    <option value="수">수</option>
                    <option value="목">목</option>
                    <option value="금">금</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="day1_start_time">시작 시간</Label>
                    <Input
                      id="day1_start_time"
                      type="time"
                      value={newCourseData.day1_start_time}
                      onChange={(e) => setNewCourseData({ ...newCourseData, day1_start_time: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="day1_end_time">종료 시간</Label>
                    <Input
                      id="day1_end_time"
                      type="time"
                      value={newCourseData.day1_end_time}
                      onChange={(e) => setNewCourseData({ ...newCourseData, day1_end_time: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="day2">요일 2 (선택)</Label>
                  <select
                    id="day2"
                    value={newCourseData.day2}
                    onChange={(e) => setNewCourseData({ ...newCourseData, day2: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                  >
                    <option value="">없음</option>
                    <option value="월">월</option>
                    <option value="화">화</option>
                    <option value="수">수</option>
                    <option value="목">목</option>
                    <option value="금">금</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="day2_start_time">시작 시간 (선택)</Label>
                    <Input
                      id="day2_start_time"
                      type="time"
                      value={newCourseData.day2_start_time}
                      onChange={(e) => setNewCourseData({ ...newCourseData, day2_start_time: e.target.value })}
                      className="mt-1"
                      disabled={!newCourseData.day2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="day2_end_time">종료 시간 (선택)</Label>
                    <Input
                      id="day2_end_time"
                      type="time"
                      value={newCourseData.day2_end_time}
                      onChange={(e) => setNewCourseData({ ...newCourseData, day2_end_time: e.target.value })}
                      className="mt-1"
                      disabled={!newCourseData.day2}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="course_classroom">강의실</Label>
                  <Input
                    id="course_classroom"
                    value={newCourseData.course_classroom}
                    onChange={(e) => setNewCourseData({ ...newCourseData, course_classroom: e.target.value })}
                    placeholder="예: 새빛관 101"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="max_enrollments">최대 수강인원</Label>
                  <Input
                    id="max_enrollments"
                    type="number"
                    value={newCourseData.max_enrollments}
                    onChange={(e) => setNewCourseData({ ...newCourseData, max_enrollments: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="year">년도</Label>
                  <Input
                    id="year"
                    value={newCourseData.year}
                    onChange={(e) => setNewCourseData({ ...newCourseData, year: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="semester">학기</Label>
                  <select
                    id="semester"
                    value={newCourseData.semester}
                    onChange={(e) => setNewCourseData({ ...newCourseData, semester: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                  >
                    <option value="1학기">1학기</option>
                    <option value="2학기">2학기</option>
                    <option value="여름학기">여름학기</option>
                    <option value="겨울학기">겨울학기</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description">강의 설명</Label>
                  <Textarea
                    id="description"
                    value={newCourseData.description}
                    onChange={(e) => setNewCourseData({ ...newCourseData, description: e.target.value })}
                    placeholder="강의에 대한 설명을 입력하세요"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setShowNewCourseModal(false)}>
                  취소
                </Button>
                <Button
                  className="bg-rose-600 hover:bg-rose-700"
                  onClick={handleCreateCourse}
                  disabled={loading || !newCourseData.course_code || !newCourseData.course_name}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  강의 등록
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 자료 등록 모달 */}
      {showMaterialModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">{editingItem ? "강의 자료 수정" : "새 강의 자료 등록"}</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowMaterialModal(false)}>
                  ✕
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">제목</Label>
                  <Input
                    id="title"
                    value={materialData.title}
                    onChange={(e) => setMaterialData({ ...materialData, title: e.target.value })}
                    placeholder="자료 제목을 입력하세요"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description">설명</Label>
                  <Textarea
                    id="description"
                    value={materialData.description}
                    onChange={(e) => setMaterialData({ ...materialData, description: e.target.value })}
                    placeholder="자료에 대한 설명을 입력하세요"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="file">파일 선택</Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileSelect}
                    className="mt-1"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,.rar"
                  />
                  {selectedFile && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                      <p>
                        <strong>파일명:</strong> {selectedFile.name}
                      </p>
                      <p>
                        <strong>크기:</strong> {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                      <p>
                        <strong>타입:</strong> {selectedFile.type}
                      </p>
                    </div>
                  )}
                  {editingItem && !selectedFile && (
                    <p className="text-sm text-gray-500 mt-1">새 파일을 선택하지 않으면 기존 파일이 유지됩니다.</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setShowMaterialModal(false)}>
                  취소
                </Button>
                <Button
                  className="bg-rose-600 hover:bg-rose-700"
                  onClick={handleMaterialSubmit}
                  disabled={loading || !materialData.title || (!editingItem && !selectedFile)}
                >
                  {uploadingFile ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      업로드 중...
                    </>
                  ) : loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      처리 중...
                    </>
                  ) : editingItem ? (
                    "자료 수정"
                  ) : (
                    "자료 등록"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 과제 등록 모달 */}
      {showAssignmentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">{editingItem ? "과제 수정" : "새 과제 등록"}</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowAssignmentModal(false)}>
                  ✕
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">과제명</Label>
                  <Input
                    id="title"
                    value={assignmentData.title}
                    onChange={(e) => setAssignmentData({ ...assignmentData, title: e.target.value })}
                    placeholder="과제명을 입력하세요"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="assignmentDescription">설명</Label>
                  <Textarea
                    id="assignmentDescription"
                    value={assignmentData.assignmentDescription}
                    onChange={(e) => setAssignmentData({ ...assignmentData, assignmentDescription: e.target.value })}
                    placeholder="과제에 대한 설명을 입력하세요"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="due_date">마감일</Label>
                  <Input
                    id="due_date"
                    type="datetime-local"
                    value={assignmentData.due_date}
                    onChange={(e) => setAssignmentData({ ...assignmentData, due_date: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="max_score">만점</Label>
                  <Input
                    id="max_score"
                    type="number"
                    value={assignmentData.max_score}
                    onChange={(e) => setAssignmentData({ ...assignmentData, max_score: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="assignment_type">유형</Label>
                  <select
                    id="assignment_type"
                    value={assignmentData.assignment_type}
                    onChange={(e) => setAssignmentData({ ...assignmentData, assignment_type: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                  >
                    <option value="homework">Homework</option>
                    <option value="project">Project</option>
                    <option value="report">Report</option>
                    <option value="exam">Exam</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setShowAssignmentModal(false)}>
                  취소
                </Button>
                <Button
                  className="bg-rose-600 hover:bg-rose-700"
                  onClick={handleAssignmentSubmit}
                  disabled={loading || !assignmentData.title || !assignmentData.due_date}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {editingItem ? "과제 수정" : "과제 등록"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 공지사항 등록 모달 */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">{editingItem ? "공지사항 수정" : "새 공지사항 등록"}</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowAnnouncementModal(false)}>
                  ✕
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">제목</Label>
                  <Input
                    id="title"
                    value={announcementData.title}
                    onChange={(e) => setAnnouncementData({ ...announcementData, title: e.target.value })}
                    placeholder="공지사항 제목을 입력하세요"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="content">내용</Label>
                  <Textarea
                    id="content"
                    value={announcementData.content}
                    onChange={(e) => setAnnouncementData({ ...announcementData, content: e.target.value })}
                    placeholder="공지사항 내용을 입력하세요"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="is_important">중요 공지</Label>
                  <Input
                    id="is_important"
                    type="checkbox"
                    checked={announcementData.is_important}
                    onChange={(e) => setAnnouncementData({ ...announcementData, is_important: e.target.checked })}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setShowAnnouncementModal(false)}>
                  취소
                </Button>
                <Button
                  className="bg-rose-600 hover:bg-rose-700"
                  onClick={handleAnnouncementSubmit}
                  disabled={loading || !announcementData.title || !announcementData.content}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {editingItem ? "공지사항 수정" : "공지사항 등록"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 성적 입력 모달 */}
      {showGradeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">성적 입력</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowGradeModal(false)}>
                  ✕
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="student_id">학번</Label>
                  <Input
                    id="student_id"
                    value={gradeData.student_id}
                    onChange={(e) => setGradeData({ ...gradeData, student_id: e.target.value })}
                    placeholder="학번을 입력하세요"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="midterm_score">중간고사 점수</Label>
                  <Input
                    id="midterm_score"
                    type="number"
                    value={gradeData.midterm_score}
                    onChange={(e) => setGradeData({ ...gradeData, midterm_score: e.target.value })}
                    placeholder="중간고사 점수를 입력하세요"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="final_score">기말고사 점수</Label>
                  <Input
                    id="final_score"
                    type="number"
                    value={gradeData.final_score}
                    onChange={(e) => setGradeData({ ...gradeData, final_score: e.target.value })}
                    placeholder="기말고사 점수를 입력하세요"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="assignment_score">과제 점수</Label>
                  <Input
                    id="assignment_score"
                    type="number"
                    value={gradeData.assignment_score}
                    onChange={(e) => setGradeData({ ...gradeData, assignment_score: e.target.value })}
                    placeholder="과제 점수를 입력하세요"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="attendance_score">출석 점수</Label>
                  <Input
                    id="attendance_score"
                    type="number"
                    value={gradeData.attendance_score}
                    onChange={(e) => setGradeData({ ...gradeData, attendance_score: e.target.value })}
                    placeholder="출석 점수를 입력하세요"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setShowGradeModal(false)}>
                  취소
                </Button>
                <Button
                  className="bg-rose-600 hover:bg-rose-700"
                  onClick={handleGradeSubmit}
                  disabled={loading || !gradeData.student_id}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  성적 저장
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 과제 제출 모달 */}
      {showSubmissionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">과제 제출</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowSubmissionModal(false)}>
                  ✕
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="content">내용</Label>
                  <Textarea
                    id="content"
                    value={submissionData.content}
                    onChange={(e) => setSubmissionData({ ...submissionData, content: e.target.value })}
                    placeholder="제출 내용을 입력하세요"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="file_url">파일 URL</Label>
                  <Input
                    id="file_url"
                    value={submissionData.file_url}
                    onChange={(e) => setSubmissionData({ ...submissionData, file_url: e.target.value })}
                    placeholder="파일 URL을 입력하세요"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setShowSubmissionModal(false)}>
                  취소
                </Button>
                <Button className="bg-rose-600 hover:bg-rose-700" onClick={handleSubmissionSubmit} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  제출하기
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 과제 제출 내역 모달 (교수용) */}
      {showSubmissionsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">과제 제출 내역</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowSubmissionsModal(false)}>
                  ✕
                </Button>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-rose-600" />
                </div>
              ) : assignmentSubmissionsList.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>학번</TableHead>
                        <TableHead>이름</TableHead>
                        <TableHead>제출일</TableHead>
                        <TableHead>점수</TableHead>
                        <TableHead>피드백</TableHead>
                        <TableHead>작업</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assignmentSubmissionsList.map((submission) => (
                        <TableRow key={submission.submission_id}>
                          <TableCell>{submission.students?.student_id}</TableCell>
                          <TableCell className="font-medium">{submission.students?.name}</TableCell>
                          <TableCell>{new Date(submission.submitted_at).toLocaleString()}</TableCell>
                          <TableCell>{submission.score || "미채점"}</TableCell>
                          <TableCell>{submission.feedback || "-"}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline" onClick={() => handleGradeSubmissionModal(submission)}>
                              채점
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>제출된 과제가 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 채점 모달 */}
      {showGradingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">채점</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowGradingModal(false)}>
                  ✕
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="score">점수</Label>
                  <Input
                    id="score"
                    type="number"
                    value={gradingData.score}
                    onChange={(e) => setGradingData({ ...gradingData, score: e.target.value })}
                    placeholder="점수를 입력하세요"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="feedback">피드백</Label>
                  <Textarea
                    id="feedback"
                    value={gradingData.feedback}
                    onChange={(e) => setGradingData({ ...gradingData, feedback: e.target.value })}
                    placeholder="피드백을 입력하세요"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setShowGradingModal(false)}>
                  취소
                </Button>
                <Button className="bg-rose-600 hover:bg-rose-700" onClick={handleGradeSubmission} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  채점 완료
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
