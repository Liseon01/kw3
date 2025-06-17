import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

// 대시보드용 - 현재 사용자가 수강신청한 과목의 최신 공지사항 5개 조회
export async function GET(request: Request) {
  try {
    const supabase = createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    const currentUser = searchParams.get("user")

    if (!currentUser) {
      return NextResponse.json({
        success: true,
        announcements: [],
        message: "로그인이 필요합니다.",
      })
    }

    // 현재 사용자가 수강신청한 과목들 조회
    const { data: enrollments, error: enrollmentError } = await supabase
      .from("enrollments")
      .select("course_id")
      .eq("student_id", currentUser)

    if (enrollmentError) {
      console.error("Error fetching enrollments:", enrollmentError)
      return NextResponse.json({
        success: true,
        announcements: [],
        message: "수강신청 정보를 불러올 수 없습니다.",
      })
    }

    if (!enrollments || enrollments.length === 0) {
      return NextResponse.json({
        success: true,
        announcements: [],
        message: "수강신청한 과목이 없습니다.",
      })
    }

    const enrolledCourseIds = enrollments.map((e) => e.course_id)

    // 수강신청한 과목들의 공지사항만 조회 (테이블 존재 여부 확인 포함)
    const { data: announcements, error: announcementsError } = await supabase
      .from("course_announcements")
      .select("*")
      .in("course_id", enrolledCourseIds)
      .order("created_at", { ascending: false })
      .limit(5)

    if (announcementsError) {
      console.error("Error fetching announcements:", announcementsError)

      // 테이블이 존재하지 않는 경우
      if (announcementsError.message?.includes("does not exist") || announcementsError.code === "42P01") {
        return NextResponse.json({
          success: true,
          announcements: [],
          message: "공지사항 테이블이 아직 생성되지 않았습니다.",
          tableExists: false,
        })
      }

      return NextResponse.json({
        success: true,
        announcements: [],
        message: "공지사항을 불러올 수 없습니다.",
      })
    }

    if (!announcements || announcements.length === 0) {
      return NextResponse.json({
        success: true,
        announcements: [],
        message: "수강신청한 과목에 공지사항이 없습니다.",
      })
    }

    // 강의 정보 가져오기
    const courseIds = [...new Set(announcements.map((a: any) => a.course_id))]
    const { data: courses, error: coursesError } = await supabase
      .from("courses")
      .select("course_id, course_name, professor_id")
      .in("course_id", courseIds)

    if (coursesError) {
      console.error("Error fetching courses:", coursesError)
      // 강의 정보를 가져올 수 없어도 공지사항은 반환
      const basicAnnouncements = announcements.map((announcement: any) => ({
        ...announcement,
        id: announcement.announcement_id,
        courses: {
          course_name: "알 수 없는 강의",
          professor_id: "",
          users: {
            name: "알 수 없는 교수",
          },
        },
      }))

      return NextResponse.json({
        success: true,
        announcements: basicAnnouncements,
        tableExists: true,
      })
    }

    // 교수 정보 가져오기
    const professorIds = courses ? [...new Set(courses.map((c: any) => c.professor_id))] : []
    let professors: any[] = []

    if (professorIds.length > 0) {
      // users 테이블에서 교수 정보 조회 - username과 id 둘 다 확인
      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("username, id, name, role")
        .or(`username.in.(${professorIds.join(",")}),id.in.(${professorIds.join(",")})`)
        .eq("role", "professor")

      if (!usersError && usersData) {
        professors = usersData.map((u: any) => ({
          professor_id: u.username || u.id,
          name: u.name,
          username: u.username,
          id: u.id,
        }))
      }

      console.log("Professor IDs:", professorIds)
      console.log("Found professors:", professors)
    }

    // 데이터 조합
    const enrichedAnnouncements = announcements.map((announcement: any) => {
      const course = courses?.find((c: any) => c.course_id === announcement.course_id)
      const professor = professors?.find(
        (p: any) =>
          p.professor_id === course?.professor_id ||
          p.username === course?.professor_id ||
          p.id === course?.professor_id,
      )

      console.log(`Course ${course?.course_name}: professor_id=${course?.professor_id}, found professor:`, professor)

      return {
        ...announcement,
        id: announcement.announcement_id,
        courses: {
          course_name: course?.course_name || "알 수 없는 강의",
          professor_id: course?.professor_id || "",
          users: {
            name: professor?.name || `교수 정보 없음 (ID: ${course?.professor_id})`,
          },
        },
      }
    })

    return NextResponse.json({
      success: true,
      announcements: enrichedAnnouncements,
      tableExists: true,
    })
  } catch (error) {
    console.error("Unexpected error in dashboard-announcements GET:", error)
    return NextResponse.json(
      {
        success: false,
        error: "서버 오류가 발생했습니다.",
        announcements: [],
        message: "서버 오류가 발생했습니다.",
      },
      { status: 500 },
    )
  }
}
