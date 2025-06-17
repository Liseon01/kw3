import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

// 특정 성적 조회
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const gradeId = Number.parseInt(params.id)
    if (isNaN(gradeId)) {
      return NextResponse.json({ error: "유효하지 않은 성적 ID입니다." }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    const { data: grade, error } = await supabase
      .from("grades")
      .select(`
        *,
        students (
          student_id,
          name,
          email
        ),
        courses (
          course_id,
          course_code,
          course_name,
          credits
        )
      `)
      .eq("grade_id", gradeId)
      .single()

    if (error) {
      console.error("Error fetching grade:", error)
      return NextResponse.json({ error: "성적을 찾을 수 없습니다." }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      grade,
    })
  } catch (error) {
    console.error("Unexpected error in grade GET:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}

// 성적 수정
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const gradeId = Number.parseInt(params.id)
    if (isNaN(gradeId)) {
      return NextResponse.json({ error: "유효하지 않은 성적 ID입니다." }, { status: 400 })
    }

    const body = await request.json()
    const { midterm_score = 0, final_score = 0, assignment_score = 0, attendance_score = 0 } = body

    const supabase = createServerSupabaseClient()

    // 성적 계산
    const { data: calculatedGrade, error: calcError } = await supabase.rpc("calculate_grade", {
      p_midterm: midterm_score,
      p_final: final_score,
      p_assignment: assignment_score,
      p_attendance: attendance_score,
    })

    if (calcError) {
      console.error("Error calculating grade:", calcError)
      return NextResponse.json({ error: "성적 계산 중 오류가 발생했습니다." }, { status: 500 })
    }

    const gradeResult = calculatedGrade[0]

    // 성적 업데이트
    const { data: updatedGrade, error: updateError } = await supabase
      .from("grades")
      .update({
        midterm_score,
        final_score,
        assignment_score,
        attendance_score,
        total_score: gradeResult.total_score,
        letter_grade: gradeResult.letter_grade,
        gpa_score: gradeResult.gpa_score,
      })
      .eq("grade_id", gradeId)
      .select()
      .single()

    if (updateError) {
      console.error("Error updating grade:", updateError)
      return NextResponse.json({ error: "성적 수정 중 오류가 발생했습니다." }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "성적이 성공적으로 수정되었습니다.",
      grade: updatedGrade,
    })
  } catch (error) {
    console.error("Unexpected error in grade PUT:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}

// 성적 삭제
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const gradeId = Number.parseInt(params.id)
    if (isNaN(gradeId)) {
      return NextResponse.json({ error: "유효하지 않은 성적 ID입니다." }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    const { error } = await supabase.from("grades").delete().eq("grade_id", gradeId)

    if (error) {
      console.error("Error deleting grade:", error)
      return NextResponse.json({ error: "성적 삭제 중 오류가 발생했습니다." }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "성적이 성공적으로 삭제되었습니다.",
    })
  } catch (error) {
    console.error("Unexpected error in grade DELETE:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
