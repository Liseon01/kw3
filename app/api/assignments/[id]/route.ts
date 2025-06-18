import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

// 과제 수정
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { title, description, due_date, max_score, assignment_type } = body
    const assignmentId = params.id

    if (!title || !description || !due_date) {
      return NextResponse.json({ error: "필수 정보가 누락되었습니다." }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    const { data: assignment, error } = await supabase
      .from("assignments")
      .update({
        title,
        description,
        due_date,
        max_score: Number(max_score) || 100,
        assignment_type: assignment_type || "homework",
        updated_at: new Date().toISOString(),
      })
      .eq("assignment_id", assignmentId)
      .select()
      .single()

    if (error) {
      console.error("Error updating assignment:", error)
      return NextResponse.json({ error: "과제 수정 중 오류가 발생했습니다." }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "과제가 성공적으로 수정되었습니다.",
      assignment,
    })
  } catch (error) {
    console.error("Unexpected error in assignments PUT:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}

// 과제 삭제
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const assignmentId = params.id
    const supabase = createServerSupabaseClient()

    const { error } = await supabase.from("assignments").delete().eq("assignment_id", assignmentId)

    if (error) {
      console.error("Error deleting assignment:", error)
      return NextResponse.json({ error: "과제 삭제 중 오류가 발생했습니다." }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "과제가 성공적으로 삭제되었습니다.",
    })
  } catch (error) {
    console.error("Unexpected error in assignments DELETE:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
