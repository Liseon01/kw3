import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// 과제 채점 (점수 및 피드백 입력)
export async function PUT(
  request: NextRequest,
  { params }: { params: { assignmentId: string; submissionId: string } },
) {
  try {
    const submissionId = params.submissionId
    const body = await request.json()
    const { score, feedback, graded_by } = body

    const { data, error } = await supabase
      .from("assignment_submissions")
      .update({
        score,
        feedback,
        graded_by,
        graded_at: new Date().toISOString(),
      })
      .eq("submission_id", submissionId)
      .select()
      .single()

    if (error) {
      console.error("Grade submission error:", error)
      return NextResponse.json(
        {
          success: false,
          error: "채점 중 오류가 발생했습니다.",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      submission: data,
      message: "채점이 완료되었습니다.",
    })
  } catch (error) {
    console.error("Grade submission error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "채점 중 오류가 발생했습니다.",
      },
      { status: 500 },
    )
  }
}
