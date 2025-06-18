import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

// 학생의 수강신청 목록 조회
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get("studentId")

    if (!studentId) {
      return NextResponse.json({ error: "학생 ID가 필요합니다." }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("enrollments")
      .select(`
        *,
        courses (*)
      `)
      .eq("student_id", studentId)
      .eq("enrollment_status", "수강중")

    if (error) {
      console.error("Error fetching enrollments:", error)
      return NextResponse.json({ error: "수강신청 목록 조회 중 오류가 발생했습니다." }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      enrollments: data || [],
    })
  } catch (error) {
    console.error("Unexpected error in enrollments GET:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}

// 수강신청
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { student_id, course_id, student_name, student_email } = body

    // course_id가 문자열인 경우 숫자로 변환
    const courseIdNum = typeof course_id === "string" ? Number.parseInt(course_id) : course_id

    if (!student_id || !course_id) {
      return NextResponse.json({ error: "학생 ID와 강의 ID가 필요합니다." }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // 학생 존재 여부 확인
    const { data: existingStudent, error: studentCheckError } = await supabase
      .from("students")
      .select("student_id")
      .eq("student_id", student_id)
      .maybeSingle()

    if (studentCheckError && studentCheckError.code !== "PGRST116") {
      console.error("Error checking student:", studentCheckError)
      return NextResponse.json({ error: "학생 정보 확인 중 오류가 발생했습니다." }, { status: 500 })
    }

    // 학생이 존재하지 않으면 자동으로 생성
    if (!existingStudent) {
      console.log(`Student ${student_id} not found, creating automatically`)

      const studentName = student_name || "자동 생성 학생"
      const studentEmail = student_email || `${student_id}@kwangwoon.ac.kr`

      const { error: createStudentError } = await supabase.from("students").insert({
        student_id: student_id,
        name: studentName,
        email: studentEmail,
        department_id: 1, // 기본값으로 컴퓨터공학과(1) 설정
      })

      if (createStudentError) {
        console.error("Error creating student:", createStudentError)
        return NextResponse.json({ error: "학생 정보 생성 중 오류가 발생했습니다." }, { status: 500 })
      }

      console.log(`Student ${student_id} created successfully`)
    }

    // 강의 정보 조회
    const { data: course, error: courseError } = await supabase
      .from("courses")
      .select("*")
      .eq("course_id", courseIdNum)
      .single()

    if (courseError || !course) {
      return NextResponse.json({ error: "강의를 찾을 수 없습니다." }, { status: 404 })
    }

    // 수강 정원 확인
    if (course.current_enrollments >= course.max_enrollments) {
      return NextResponse.json({ error: "수강 정원이 초과되었습니다." }, { status: 400 })
    }

    // 이미 수강신청했는지 확인
    const { data: existingEnrollment, error: checkError } = await supabase
      .from("enrollments")
      .select("enrollment_id")
      .eq("student_id", student_id)
      .eq("course_id", courseIdNum)
      .eq("enrollment_status", "수강중")
      .maybeSingle()

    if (checkError) {
      console.error("Error checking existing enrollment:", checkError)
      return NextResponse.json({ error: "수강신청 확인 중 오류가 발생했습니다." }, { status: 500 })
    }

    if (existingEnrollment) {
      return NextResponse.json({ error: "이미 수강신청한 강의입니다." }, { status: 400 })
    }

    // 시간표 중복 확인 (같은 시간에 다른 강의가 있는지)
    const { data: conflictingCourses, error: conflictError } = await supabase
      .from("enrollments")
      .select(`
        courses (day1, day1_start_time, day1_end_time, day2, day2_start_time, day2_end_time)
      `)
      .eq("student_id", student_id)
      .eq("enrollment_status", "수강중")

    if (conflictError) {
      console.error("Error checking time conflicts:", conflictError)
      return NextResponse.json({ error: "시간표 중복 확인 중 오류가 발생했습니다." }, { status: 500 })
    }

    // 시간 중복 체크 로직 (간단한 버전)
    const hasTimeConflict = conflictingCourses?.some((enrollment: any) => {
      const enrolledCourse = enrollment.courses
      if (!enrolledCourse) return false

      // 첫 번째 수업 시간 체크
      if (course.day1 === enrolledCourse.day1) {
        const newStart = course.day1_start_time
        const newEnd = course.day1_end_time
        const existingStart = enrolledCourse.day1_start_time
        const existingEnd = enrolledCourse.day1_end_time

        if (newStart < existingEnd && newEnd > existingStart) {
          return true
        }
      }

      // 두 번째 수업 시간 체크
      if (course.day2 && enrolledCourse.day2 && course.day2 === enrolledCourse.day2) {
        const newStart = course.day2_start_time
        const newEnd = course.day2_end_time
        const existingStart = enrolledCourse.day2_start_time
        const existingEnd = enrolledCourse.day2_end_time

        if (newStart < existingEnd && newEnd > existingStart) {
          return true
        }
      }

      return false
    })

    if (hasTimeConflict) {
      return NextResponse.json({ error: "시간표가 중복됩니다." }, { status: 400 })
    }

    // 수강신청 등록
    const { data: enrollment, error: enrollmentError } = await supabase
      .from("enrollments")
      .insert({
        student_id,
        course_id: courseIdNum,
        enrollment_status: "수강중",
        enrollment_date: new Date().toISOString(),
      })
      .select()
      .single()

    if (enrollmentError) {
      console.error("Error creating enrollment:", enrollmentError)
      return NextResponse.json({ error: "수강신청 중 오류가 발생했습니다." }, { status: 500 })
    }

    // 강의의 현재 수강인원 증가
    const { error: updateError } = await supabase
      .from("courses")
      .update({
        current_enrollments: course.current_enrollments + 1,
      })
      .eq("course_id", courseIdNum)

    if (updateError) {
      console.error("Error updating course enrollment count:", updateError)
      // 수강신청은 성공했지만 카운트 업데이트 실패
    }

    return NextResponse.json({
      success: true,
      message: "수강신청이 성공적으로 완료되었습니다.",
      enrollment,
    })
  } catch (error) {
    console.error("Unexpected error in enrollments POST:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
