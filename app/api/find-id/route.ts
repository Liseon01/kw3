import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, studentId, method } = body

    const supabase = createServerSupabaseClient()

    // 이름은 필수
    if (!name) {
      return NextResponse.json({ error: "이름을 입력해주세요." }, { status: 400 })
    }

    let query = supabase.from("users").select("username, email").eq("name", name)

    // 인증 방법에 따라 쿼리 추가
    if (method === "email" && email) {
      query = query.eq("email", email)
    } else if (method === "studentId" && studentId) {
      query = query.eq("student_id", studentId)
    } else {
      return NextResponse.json({ error: "인증 정보가 부족합니다." }, { status: 400 })
    }

    const { data, error } = await query.single()

    if (error || !data) {
      return NextResponse.json({ error: "일치하는 사용자 정보를 찾을 수 없습니다." }, { status: 404 })
    }

    // 실제 서비스에서는 이메일로 아이디를 전송하는 로직이 필요합니다
    // 여기서는 바로 아이디를 반환합니다 (데모용)
    return NextResponse.json({
      success: true,
      message: "아이디를 찾았습니다.",
      username: data.username,
    })
  } catch (error) {
    console.error("Find ID error:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
