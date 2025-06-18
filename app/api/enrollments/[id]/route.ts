import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

// 수강신청 취소
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const enrollmentId = params.id
    const supabase = createServerSupabaseClient()

    // 수강신청 정보 조회
    const { data: enrollment, error: enrollmentError } = await supabase
      .from("enrollments")
      .select("*, courses(*)")
      .eq("enrollment_id", enrollmentId)
      .eq("enrollment_status", "수강중")
      .single()

    if (enrollmentError || !enrollment) {
      return NextResponse.json({ error: "수강신청 정보를 찾을 수 없습니다." }, { status: 404 })
    }

    // 수강신청 상태를 '취소'로 변경
    const { error: updateError } = await supabase
      .from("enrollments")
      .update({
        enrollment_status: "취소",
        cancellation_date: new Date().toISOString(),
      })
      .eq("enrollment_id", enrollmentId)

    if (updateError) {
      console.error("Error cancelling enrollment:", updateError)
      return NextResponse.json({ error: "수강신청 취소 중 오류가 발생했습니다." }, { status: 500 })
    }

    // 강의의 현재 수강인원 감소
    const course = enrollment.courses
    if (course && course.current_enrollments > 0) {
      const { error: courseUpdateError } = await supabase
        .from("courses")
        .update({
          current_enrollments: course.current_enrollments - 1,
        })
        .eq("course_id", course.course_id)

      if (courseUpdateError) {
        console.error("Error updating course enrollment count:", courseUpdateError)
        // 취소는 성공했지만 카운트 업데이트 실패
      }
    }

    return NextResponse.json({
      success: true,
      message: "수강신청이 성공적으로 취소되었습니다.",
    })
  } catch (error) {
    console.error("Unexpected error in enrollment DELETE:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
