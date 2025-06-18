import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

// 특정 강의 조회
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const courseId = Number.parseInt(params.id)
    if (isNaN(courseId)) {
      return NextResponse.json({ error: "유효하지 않은 강의 ID입니다." }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    const { data: course, error } = await supabase
      .from("courses")
      .select(`
        *,
        departments (
          department_id,
          name
        ),
        professors (
          professor_id,
          name
        )
      `)
      .eq("course_id", courseId)
      .single()

    if (error) {
      console.error("Error fetching course:", error)
      return NextResponse.json({ error: "강의를 찾을 수 없습니다." }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      course,
      isMockData: false,
    })
  } catch (error) {
    console.error("Unexpected error in course GET:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}

// 강의 수정
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const courseId = Number.parseInt(params.id)
    if (isNaN(courseId)) {
      return NextResponse.json({ error: "유효하지 않은 강의 ID입니다." }, { status: 400 })
    }

    const body = await request.json()
    const {
      course_code,
      course_name,
      credits,
      department_id,
      professor_id,
      day1,
      day1_start_time,
      day1_end_time,
      day2,
      day2_start_time,
      day2_end_time,
      course_classroom,
      max_enrollments,
      course_status,
      course_establish_date,
      description,
      year,
      semester,
    } = body

    // 필수 필드 검증
    if (!course_code || !course_name || !credits || !department_id || !professor_id) {
      return NextResponse.json({ error: "필수 정보가 누락되었습니다." }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // 강의 존재 확인 - 수정된 버전
    const { data: existingCourses, error: checkError } = await supabase
      .from("courses")
      .select("course_id")
      .eq("course_id", courseId)

    if (checkError) {
      console.error("Error checking existing course:", checkError)
      return NextResponse.json({ error: "강의 확인 중 오류가 발생했습니다." }, { status: 500 })
    }

    if (!existingCourses || existingCourses.length === 0) {
      return NextResponse.json({ error: "해당 강의를 찾을 수 없습니다." }, { status: 404 })
    }

    // 강의 정보 업데이트
    const { data: updatedCourse, error: updateError } = await supabase
      .from("courses")
      .update({
        course_code,
        course_name,
        credits,
        department_id,
        professor_id,
        day1,
        day1_start_time,
        day1_end_time,
        day2: day2 === "none" || !day2 ? null : day2,
        day2_start_time: day2_start_time === "none" || !day2_start_time ? null : day2_start_time,
        day2_end_time: day2_end_time === "none" || !day2_end_time ? null : day2_end_time,
        course_classroom,
        max_enrollments,
        course_status,
        course_establish_date,
        description: description || null,
        year,
        semester,
        course_type: body.course_type || null, // 강의 유형 추가
      })
      .eq("course_id", courseId)
      .select()
      .single()

    if (updateError) {
      console.error("Error updating course:", updateError)
      return NextResponse.json({ error: "강의 수정 중 오류가 발생했습니다." }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "강의가 성공적으로 수정되었습니다.",
      course: updatedCourse,
      isMockData: false,
    })
  } catch (error) {
    console.error("Unexpected error in course PUT:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}

// 강의 삭제 (폐강 처리)
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const courseId = Number.parseInt(params.id)
    if (isNaN(courseId)) {
      return NextResponse.json({ error: "유효하지 않은 강의 ID입니다." }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // 강의 존재 확인 - 수정된 버전
    const { data: existingCourses, error: checkError } = await supabase
      .from("courses")
      .select("course_id")
      .eq("course_id", courseId)

    if (checkError) {
      console.error("Error checking existing course:", checkError)
      return NextResponse.json({ error: "강의 확인 중 오류가 발생했습니다." }, { status: 500 })
    }

    if (!existingCourses || existingCourses.length === 0) {
      return NextResponse.json({ error: "해당 강의를 찾을 수 없습니다." }, { status: 404 })
    }

    // 강의 상태를 폐강으로 변경
    const { error: updateError } = await supabase
      .from("courses")
      .update({
        course_status: "폐강",
        course_cancel_date: new Date().toISOString().split("T")[0],
      })
      .eq("course_id", courseId)

    if (updateError) {
      console.error("Error cancelling course:", updateError)
      return NextResponse.json({ error: "강의 폐강 처리 중 오류가 발생했습니다." }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "강의가 폐강 처리되었습니다.",
      isMockData: false,
    })
  } catch (error) {
    console.error("Unexpected error in course DELETE:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
