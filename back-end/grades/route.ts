import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

// 성적 조회
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get("studentId")
    const courseId = searchParams.get("courseId")

    const supabase = createServerSupabaseClient()

    if (studentId) {
      // 학생의 모든 성적 조회 - 관계를 명확히 분리
      const { data: grades, error } = await supabase
        .from("grades")
        .select(`
          grade_id,
          student_id,
          course_id,
          midterm_score,
          final_score,
          assignment_score,
          attendance_score,
          total_score,
          letter_grade,
          gpa_score,
          created_at
        `)
        .eq("student_id", studentId)

      if (error) {
        console.error("Error fetching student grades:", error)
        return NextResponse.json({ error: "성적 조회 중 오류가 발생했습니다." }, { status: 500 })
      }

      // 각 성적에 대해 강의 정보를 별도로 조회
      const gradesWithCourses = await Promise.all(
        (grades || []).map(async (grade) => {
          const { data: course, error: courseError } = await supabase
            .from("courses")
            .select(`
              course_id,
              course_code,
              course_name,
              credits,
              course_type,
              year,
              semester,
              professor_id
            `)
            .eq("course_id", grade.course_id)
            .single()

          if (courseError) {
            console.error("Error fetching course:", courseError)
            return { ...grade, courses: null }
          }

          // 교수 정보 별도 조회
          let professor = null
          if (course.professor_id) {
            const { data: professorData, error: professorError } = await supabase
              .from("professors")
              .select("professor_id, name")
              .eq("professor_id", course.professor_id)
              .single()

            if (!professorError && professorData) {
              professor = professorData
            }
          }

          return {
            ...grade,
            courses: {
              ...course,
              professors: professor,
            },
          }
        }),
      )

      // 년도와 학기별로 정렬
      const sortedGrades = gradesWithCourses.sort((a, b) => {
        if (!a.courses || !b.courses) return 0

        // 년도 내림차순
        if (a.courses.year !== b.courses.year) {
          return Number.parseInt(b.courses.year) - Number.parseInt(a.courses.year)
        }

        // 같은 년도면 학기 내림차순 (2학기 > 1학기)
        const semesterA = a.courses.semester === "2학기" ? 2 : 1
        const semesterB = b.courses.semester === "2학기" ? 2 : 1
        return semesterB - semesterA
      })

      return NextResponse.json({
        success: true,
        grades: sortedGrades,
      })
    } else if (courseId) {
      // 특정 강의의 모든 학생 성적 조회
      const { data: grades, error } = await supabase
        .from("grades")
        .select(`
          grade_id,
          student_id,
          course_id,
          midterm_score,
          final_score,
          assignment_score,
          attendance_score,
          total_score,
          letter_grade,
          gpa_score
        `)
        .eq("course_id", courseId)

      if (error) {
        console.error("Error fetching course grades:", error)
        return NextResponse.json({ error: "성적 조회 중 오류가 발생했습니다." }, { status: 500 })
      }

      // 각 성적에 대해 학생 정보를 별도로 조회
      const gradesWithStudents = await Promise.all(
        (grades || []).map(async (grade) => {
          const { data: student, error: studentError } = await supabase
            .from("students")
            .select("student_id, name, email")
            .eq("student_id", grade.student_id)
            .single()

          if (studentError) {
            console.error("Error fetching student:", studentError)
            return { ...grade, students: null }
          }

          return {
            ...grade,
            students: student,
          }
        }),
      )

      // 학생 이름으로 정렬
      const sortedGrades = gradesWithStudents.sort((a, b) => {
        if (!a.students || !b.students) return 0
        return a.students.name.localeCompare(b.students.name)
      })

      return NextResponse.json({
        success: true,
        grades: sortedGrades,
      })
    } else {
      return NextResponse.json({ error: "학생 ID 또는 강의 ID가 필요합니다." }, { status: 400 })
    }
  } catch (error) {
    console.error("Unexpected error in grades GET:", error)
    return NextResponse.json(
      {
        success: false,
        error: "서버 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// 성적 등록/수정
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      student_id,
      course_id,
      midterm_score = 0,
      final_score = 0,
      assignment_score = 0,
      attendance_score = 0,
    } = body

    if (!student_id || !course_id) {
      return NextResponse.json({ error: "학생 ID와 강의 ID가 필요합니다." }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // 성적 계산 (함수 대신 직접 계산)
    const totalScore = Math.round(
      midterm_score * 0.3 + final_score * 0.4 + assignment_score * 0.2 + attendance_score * 0.1,
    )

    // 학점 계산
    let letterGrade = "F"
    let gpaScore = 0.0

    if (totalScore >= 95) {
      letterGrade = "A+"
      gpaScore = 4.5
    } else if (totalScore >= 90) {
      letterGrade = "A"
      gpaScore = 4.0
    } else if (totalScore >= 85) {
      letterGrade = "B+"
      gpaScore = 3.5
    } else if (totalScore >= 80) {
      letterGrade = "B"
      gpaScore = 3.0
    } else if (totalScore >= 75) {
      letterGrade = "C+"
      gpaScore = 2.5
    } else if (totalScore >= 70) {
      letterGrade = "C"
      gpaScore = 2.0
    } else if (totalScore >= 65) {
      letterGrade = "D+"
      gpaScore = 1.5
    } else if (totalScore >= 60) {
      letterGrade = "D"
      gpaScore = 1.0
    }

    // 기존 성적이 있는지 확인
    const { data: existingGrade, error: checkError } = await supabase
      .from("grades")
      .select("grade_id")
      .eq("student_id", student_id)
      .eq("course_id", course_id)
      .maybeSingle()

    if (checkError) {
      console.error("Error checking existing grade:", checkError)
      return NextResponse.json({ error: "기존 성적 확인 중 오류가 발생했습니다." }, { status: 500 })
    }

    let result
    if (existingGrade) {
      // 기존 성적 업데이트
      const { data, error } = await supabase
        .from("grades")
        .update({
          midterm_score,
          final_score,
          assignment_score,
          attendance_score,
          total_score: totalScore,
          letter_grade: letterGrade,
          gpa_score: gpaScore,
        })
        .eq("grade_id", existingGrade.grade_id)
        .select()
        .single()

      if (error) {
        console.error("Error updating grade:", error)
        return NextResponse.json({ error: "성적 수정 중 오류가 발생했습니다." }, { status: 500 })
      }
      result = data
    } else {
      // 새 성적 등록
      const { data, error } = await supabase
        .from("grades")
        .insert({
          student_id,
          course_id,
          midterm_score,
          final_score,
          assignment_score,
          attendance_score,
          total_score: totalScore,
          letter_grade: letterGrade,
          gpa_score: gpaScore,
        })
        .select()
        .single()

      if (error) {
        console.error("Error creating grade:", error)
        return NextResponse.json({ error: "성적 등록 중 오류가 발생했습니다." }, { status: 500 })
      }
      result = data
    }

    return NextResponse.json({
      success: true,
      message: "성적이 성공적으로 저장되었습니다.",
      grade: result,
    })
  } catch (error) {
    console.error("Unexpected error in grades POST:", error)
    return NextResponse.json(
      {
        success: false,
        error: "서버 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
