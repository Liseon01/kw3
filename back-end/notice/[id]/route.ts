import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

// 공지사항 수정
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { title, content, is_important } = body
    const announcementId = params.id

    if (!title || !content) {
      return NextResponse.json({ error: "제목과 내용은 필수입니다." }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    const { data: announcement, error } = await supabase
      .from("course_announcements")
      .update({
        title,
        content,
        is_important: Boolean(is_important),
        updated_at: new Date().toISOString(),
      })
      .eq("announcement_id", announcementId)
      .select()
      .single()

    if (error) {
      console.error("Error updating announcement:", error)
      return NextResponse.json({ error: "공지사항 수정 중 오류가 발생했습니다." }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "공지사항이 성공적으로 수정되었습니다.",
      announcement,
    })
  } catch (error) {
    console.error("Unexpected error in course-announcements PUT:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}

// 공지사항 삭제
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const announcementId = params.id
    const supabase = createServerSupabaseClient()

    const { error } = await supabase.from("course_announcements").delete().eq("announcement_id", announcementId)

    if (error) {
      console.error("Error deleting announcement:", error)
      return NextResponse.json({ error: "공지사항 삭제 중 오류가 발생했습니다." }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "공지사항이 성공적으로 삭제되었습니다.",
    })
  } catch (error) {
    console.error("Unexpected error in course-announcements DELETE:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
