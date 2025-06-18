import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

// 공지사항 목록 조회
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get("courseId")

    if (!courseId) {
      return NextResponse.json({ error: "강의 ID가 필요합니다." }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    const { data: announcements, error } = await supabase
      .from("course_announcements")
      .select("*")
      .eq("course_id", courseId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching announcements:", error)

      // 테이블이 존재하지 않는 경우
      if (error.message.includes("does not exist") || error.code === "42P01") {
        return NextResponse.json(
          {
            error: "course_announcements 테이블이 존재하지 않습니다. 데이터베이스 스크립트를 실행해주세요.",
            tableExists: false,
          },
          { status: 500 },
        )
      }

      return NextResponse.json(
        {
          error: "공지사항 조회 중 오류가 발생했습니다.",
          details: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      announcements: announcements || [],
      tableExists: true,
    })
  } catch (error) {
    console.error("Unexpected error in course-announcements GET:", error)
    return NextResponse.json(
      {
        error: "서버 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// 공지사항 등록
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { course_id, title, content, is_important, created_by } = body

    if (!course_id || !title || !content || !created_by) {
      return NextResponse.json({ error: "필수 정보가 누락되었습니다." }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    const { data: announcement, error } = await supabase
      .from("course_announcements")
      .insert({
        course_id: Number(course_id),
        title,
        content,
        is_important: is_important || false,
        created_by,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating announcement:", error)

      // 테이블이 존재하지 않는 경우
      if (error.message.includes("does not exist") || error.code === "42P01") {
        return NextResponse.json(
          {
            error: "course_announcements 테이블이 존재하지 않습니다. 데이터베이스 스크립트를 실행해주세요.",
            tableExists: false,
          },
          { status: 500 },
        )
      }

      return NextResponse.json(
        {
          error: "공지사항 등록 중 오류가 발생했습니다.",
          details: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "공지사항이 성공적으로 등록되었습니다.",
      announcement,
    })
  } catch (error) {
    console.error("Unexpected error in course-announcements POST:", error)
    return NextResponse.json(
      {
        error: "서버 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
