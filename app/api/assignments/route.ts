import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

// 과제 목록 조회
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get("courseId")

    if (!courseId) {
      return NextResponse.json({ error: "강의 ID가 필요합니다." }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    const { data: assignments, error } = await supabase
      .from("assignments")
      .select("*")
      .eq("course_id", courseId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching assignments:", error)

      // 테이블이 존재하지 않는 경우
      if (error.message.includes("does not exist") || error.code === "42P01") {
        return NextResponse.json(
          {
            error: "assignments 테이블이 존재하지 않습니다. 데이터베이스 스크립트를 실행해주세요.",
            tableExists: false,
          },
          { status: 500 },
        )
      }

      return NextResponse.json(
        {
          error: "과제 조회 중 오류가 발생했습니다.",
          details: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      assignments: assignments || [],
      tableExists: true,
    })
  } catch (error) {
    console.error("Unexpected error in assignments GET:", error)
    return NextResponse.json(
      {
        error: "서버 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// 과제 등록
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { course_id, title, description, due_date, max_score, assignment_type, created_by } = body

    if (!course_id || !title || !description || !due_date || !created_by) {
      return NextResponse.json({ error: "필수 정보가 누락되었습니다." }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    const { data: assignment, error } = await supabase
      .from("assignments")
      .insert({
        course_id: Number(course_id),
        title,
        description,
        due_date,
        max_score: Number(max_score) || 100,
        assignment_type: assignment_type || "homework",
        created_by,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating assignment:", error)

      // 테이블이 존재하지 않는 경우
      if (error.message.includes("does not exist") || error.code === "42P01") {
        return NextResponse.json(
          {
            error: "assignments 테이블이 존재하지 않습니다. 데이터베이스 스크립트를 실행해주세요.",
            tableExists: false,
          },
          { status: 500 },
        )
      }

      return NextResponse.json(
        {
          error: "과제 등록 중 오류가 발생했습니다.",
          details: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "과제가 성공적으로 등록되었습니다.",
      assignment,
    })
  } catch (error) {
    console.error("Unexpected error in assignments POST:", error)
    return NextResponse.json(
      {
        error: "서버 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
