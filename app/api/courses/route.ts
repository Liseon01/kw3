import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

// 모든 강의 조회 또는 필터링된 강의 조회
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const professorId = searchParams.get("professorId")
    const year = searchParams.get("year")
    const semester = searchParams.get("semester")
    const courseName = searchParams.get("courseName")
    const department = searchParams.get("department")
    const professorName = searchParams.get("professorName")

    try {
      const supabase = createServerSupabaseClient()

      // 먼저 기본 강의 정보를 가져옵니다
      let query = supabase.from("courses").select("*")

      // 필터 적용
      if (professorId) {
        query = query.eq("professor_id", professorId)
      }

      if (year) {
        query = query.eq("year", year)
      }

      if (semester) {
        query = query.eq("semester", semester)
      }

      if (courseName) {
        query = query.ilike("course_name", `%${courseName}%`)
      }

      // 학과 필터링 - 문자열 값을 정수 ID로 매핑
      if (department && department !== "all") {
        const departmentMap: { [key: string]: number } = {
          one: 1, // 컴퓨터공학과
          two: 2, // 전자공학과
          three: 3, // 소프트웨어학과
          four: 4, // 로봇학과
        }

        const departmentId = departmentMap[department]
        if (departmentId) {
          query = query.eq("department_id", departmentId)
        } else {
          // 숫자 문자열인 경우 직접 파싱
          const numericDept = Number.parseInt(department)
          if (!isNaN(numericDept)) {
            query = query.eq("department_id", numericDept)
          }
        }
      }

      // 교수 이름으로 검색할 때는 별도 처리
      if (professorName) {
        // 먼저 교수 정보를 조회
        const { data: professorData } = await supabase
          .from("professors")
          .select("professor_id")
          .ilike("name", `%${professorName}%`)

        if (professorData && professorData.length > 0) {
          const professorIds = professorData.map((p) => p.professor_id)
          query = query.in("professor_id", professorIds)
        } else {
          // 해당 이름의 교수가 없으면 빈 결과 반환
          return NextResponse.json({
            success: true,
            courses: [],
            isMockData: false,
          })
        }
      }

      // 최신 순으로 정렬
      query = query.order("created_at", { ascending: false })

      const { data: courses, error } = await query

      if (error) {
        console.error("Error fetching courses:", error)

        // 테이블이 없는 경우 모의 데이터 반환
        if (error.code === "42P01") {
          return NextResponse.json({
            success: true,
            courses: [],
            isMockData: true,
            message: "데이터베이스 테이블이 없습니다. 스크립트를 실행해주세요.",
          })
        }

        return NextResponse.json({ error: "강의 목록을 불러오는데 실패했습니다." }, { status: 500 })
      }

      if (!courses || courses.length === 0) {
        return NextResponse.json({
          success: true,
          courses: [],
          isMockData: false,
        })
      }

      // 각 강의에 대해 추가 정보를 가져옵니다
      const enrichedCourses = await Promise.all(
        courses.map(async (course) => {
          let professorInfo = null
          let departmentInfo = null

          // 교수 정보 조회
          try {
            const { data: professor } = await supabase
              .from("professors")
              .select("professor_id, name, email")
              .eq("professor_id", course.professor_id)
              .maybeSingle()

            if (professor) {
              professorInfo = professor
            } else {
              // professors 테이블에 없으면 users 테이블에서 조회
              const { data: user } = await supabase
                .from("users")
                .select("id, name, email")
                .eq("id", course.professor_id)
                .maybeSingle()

              if (user) {
                professorInfo = {
                  professor_id: user.id,
                  name: user.name,
                  email: user.email,
                }
              }
            }
          } catch (profError) {
            console.error("Error fetching professor:", profError)
          }

          // 학과 정보 조회
          try {
            const { data: dept } = await supabase
              .from("departments")
              .select("department_id, name")
              .eq("department_id", course.department_id)
              .maybeSingle()

            departmentInfo = dept
          } catch (deptError) {
            console.error("Error fetching department:", deptError)
          }

          return {
            ...course,
            professors: professorInfo,
            departments: departmentInfo,
          }
        }),
      )

      return NextResponse.json({
        success: true,
        courses: enrichedCourses,
        isMockData: false,
      })
    } catch (dbError) {
      console.error("Database connection error:", dbError)

      // 데이터베이스 연결 실패 시 모의 데이터 반환
      return NextResponse.json({
        success: true,
        courses: [],
        isMockData: true,
        message: "데이터베이스에 연결할 수 없습니다.",
      })
    }
  } catch (error) {
    console.error("Unexpected error in courses GET:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}

// 새 강의 등록
export async function POST(request: Request) {
  try {
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
      professor_name, // 교수 이름 추가
      course_type,
    } = body

    console.log("Received course data:", body)
    console.log("Professor ID:", professor_id)

    // 필수 필드 검증
    if (!course_code || !course_name || !credits || !department_id || !professor_id) {
      return NextResponse.json({ error: "필수 정보가 누락되었습니다." }, { status: 400 })
    }

    try {
      const supabase = createServerSupabaseClient()

      // 중복 강의 코드 확인
      const { data: existingCourses, error: checkError } = await supabase
        .from("courses")
        .select("course_id")
        .eq("course_code", course_code)
        .eq("year", year)
        .eq("semester", semester)

      if (checkError) {
        console.error("Error checking existing course:", checkError)

        // 테이블이 없는 경우
        if (checkError.code === "42P01") {
          return NextResponse.json(
            {
              error: "데이터베이스 테이블이 없습니다. 먼저 테이블을 생성해주세요.",
              isMockData: true,
            },
            { status: 500 },
          )
        }

        return NextResponse.json({ error: "강의 코드 중복 확인 중 오류가 발생했습니다." }, { status: 500 })
      }

      if (existingCourses && existingCourses.length > 0) {
        return NextResponse.json({ error: "이미 존재하는 강의 코드입니다." }, { status: 400 })
      }

      // 교수 존재 확인
      const { data: professorData, error: professorCheckError } = await supabase
        .from("professors")
        .select("professor_id, name")
        .eq("professor_id", professor_id)
        .maybeSingle()

      if (!professorData) {
        console.log("Professor not found, creating a new one")

        // 교수 이름을 세션에서 가져오거나 기본값 사용
        const professorNameToUse = professor_name || "자동 생성 교수"

        const { error: insertProfError } = await supabase.from("professors").insert({
          professor_id: professor_id,
          name: professorNameToUse,
          email: `${professor_id}@kwangwoon.ac.kr`,
          department_id: Number(department_id),
        })

        if (insertProfError) {
          console.error("Failed to create professor:", insertProfError)
          return NextResponse.json(
            {
              error: "교수 정보를 생성하는데 실패했습니다.",
              details: insertProfError,
            },
            { status: 400 },
          )
        }
        console.log(`Professor created successfully with name: ${professorNameToUse}`)
      } else {
        console.log("Professor found:", professorData)
      }

      // 시간 형식 변환 (HH:mm:ss 형식으로)
      const formatTime = (time: string) => {
        if (!time) return null
        if (time.includes(":00")) return time
        return time + ":00"
      }

      // 새 강의 등록
      const courseData = {
        course_code,
        course_name,
        credits: Number(credits),
        department_id: Number(department_id),
        professor_id,
        day1: day1 || null,
        day1_start_time: formatTime(day1_start_time),
        day1_end_time: formatTime(day1_end_time),
        day2: day2 === "none" || !day2 ? null : day2,
        day2_start_time: day2_start_time === "none" || !day2_start_time ? null : formatTime(day2_start_time),
        day2_end_time: day2_end_time === "none" || !day2_end_time ? null : formatTime(day2_end_time),
        course_classroom,
        max_enrollments: Number(max_enrollments),
        current_enrollments: 0,
        course_status,
        course_establish_date,
        description: description || null,
        year,
        semester,
        course_type: body.course_type || "전공선택", // 강의 유형 추가
      }

      console.log("Inserting course data:", courseData)

      const { data: newCourse, error: insertError } = await supabase
        .from("courses")
        .insert(courseData)
        .select("*")
        .single()

      if (insertError) {
        console.error("Error inserting course:", insertError)
        return NextResponse.json(
          {
            error: `강의 등록 중 오류가 발생했습니다: ${insertError.message}`,
            details: insertError,
          },
          { status: 500 },
        )
      }

      // 생성된 강의에 교수 정보 추가
      let professorInfo = null
      try {
        const { data: professor } = await supabase
          .from("professors")
          .select("professor_id, name, email")
          .eq("professor_id", newCourse.professor_id)
          .maybeSingle()

        professorInfo = professor
      } catch (profError) {
        console.error("Error fetching professor for new course:", profError)
      }

      const enrichedCourse = {
        ...newCourse,
        professors: professorInfo,
      }

      console.log("Course created successfully:", enrichedCourse)

      return NextResponse.json({
        success: true,
        message: "강의가 성공적으로 등록되었습니다.",
        course: enrichedCourse,
        isMockData: false,
      })
    } catch (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json(
        {
          error: "데이터베이스 연결 오류가 발생했습니다.",
          isMockData: true,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Unexpected error in courses POST:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
