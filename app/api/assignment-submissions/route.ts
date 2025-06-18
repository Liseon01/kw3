import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { assignment_id, student_id, submission_content, file_url } = body

    // 이미 제출했는지 확인
    const { data: existingSubmission, error: checkError } = await supabase
      .from("assignment_submissions")
      .select("submission_id")
      .eq("assignment_id", assignment_id)
      .eq("student_id", student_id)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Check submission error:", checkError)
      return NextResponse.json(
        {
          success: false,
          error: "제출 상태 확인 중 오류가 발생했습니다.",
        },
        { status: 500 },
      )
    }

    if (existingSubmission) {
      return NextResponse.json({
        success: false,
        error: "이미 제출한 과제입니다.",
      })
    }

    // 새 제출 등록
    const { data, error } = await supabase
      .from("assignment_submissions")
      .insert({
        assignment_id,
        student_id,
        submission_text: submission_content,
        file_url: file_url || null,
        submitted_at: new Date().toISOString(),
      })
      .select("submission_id")
      .single()

    if (error) {
      console.error("Insert submission error:", error)
      return NextResponse.json(
        {
          success: false,
          error: "과제 제출 중 오류가 발생했습니다.",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      submission_id: data.submission_id,
      message: "과제가 성공적으로 제출되었습니다.",
    })
  } catch (error) {
    console.error("Assignment submission error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "과제 제출 중 오류가 발생했습니다.",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const assignmentId = searchParams.get("assignmentId")
    const studentId = searchParams.get("studentId")

    if (assignmentId && studentId) {
      // 특정 학생의 특정 과제 제출 상태 확인
      const { data: submission, error } = await supabase
        .from("assignment_submissions")
        .select("*")
        .eq("assignment_id", assignmentId)
        .eq("student_id", studentId)
        .single()

      if (error && error.code !== "PGRST116") {
        console.error("Get submission error:", error)
        return NextResponse.json(
          {
            success: false,
            error: "제출 상태 확인 중 오류가 발생했습니다.",
          },
          { status: 500 },
        )
      }

      return NextResponse.json({
        success: true,
        submission: submission || null,
        isSubmitted: !!submission,
      })
    }

    return NextResponse.json({
      success: false,
      error: "필수 매개변수가 누락되었습니다.",
    })
  } catch (error) {
    console.error("Get submission error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "제출 상태 확인 중 오류가 발생했습니다.",
      },
      { status: 500 },
    )
  }
}
