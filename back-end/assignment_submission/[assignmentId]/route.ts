import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// 특정 과제의 모든 제출 내역 조회 (교수용)
export async function GET(request: NextRequest, { params }: { params: { assignmentId: string } }) {
  try {
    const assignmentId = params.assignmentId

    // 과제 제출 내역 조회
    const { data: submissions, error } = await supabase
      .from("assignment_submissions")
      .select("*")
      .eq("assignment_id", assignmentId)
      .order("submitted_at", { ascending: false })

    if (error) {
      console.error("Get submissions error:", error)
      return NextResponse.json(
        {
          success: false,
          error: "제출 내역을 불러오는 중 오류가 발생했습니다.",
        },
        { status: 500 },
      )
    }

    // 학생 정보 별도로 조회하여 병합
    if (submissions && submissions.length > 0) {
      // 모든 학생 ID 수집
      const studentIds = submissions.map((submission) => submission.student_id)

      // 학생 정보 조회
      const { data: students, error: studentsError } = await supabase
        .from("students")
        .select("student_id, name, email")
        .in("student_id", studentIds)

      if (studentsError) {
        console.error("Get students error:", studentsError)
      }

      // 학생 정보를 제출 내역에 병합
      const submissionsWithStudentInfo = submissions.map((submission) => {
        const student = students?.find((s) => s.student_id === submission.student_id)
        return {
          ...submission,
          students: student || null,
        }
      })

      return NextResponse.json({
        success: true,
        submissions: submissionsWithStudentInfo || [],
      })
    }

    return NextResponse.json({
      success: true,
      submissions: submissions || [],
    })
  } catch (error) {
    console.error("Get submissions error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "제출 내역을 불러오는 중 오류가 발생했습니다.",
      },
      { status: 500 },
    )
  }
}
