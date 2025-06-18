import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, email, studentId, method } = body

    const supabase = createServerSupabaseClient()

    // 아이디는 필수
    if (!username) {
      return NextResponse.json({ error: "아이디를 입력해주세요." }, { status: 400 })
    }

    let query = supabase.from("users").select("email").eq("username", username)

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

    // 실제 서비스에서는 이메일로 비밀번호 재설정 링크를 전송하는 로직이 필요합니다
    // 여기서는 데모용으로 성공 메시지만 반환합니다

    // 데모용: 비밀번호를 'newpassword123'으로 재설정
    const { error: updateError } = await supabase
      .from("users")
      .update({ password: "newpassword123" })
      .eq("username", username)

    if (updateError) {
      return NextResponse.json({ error: "비밀번호 재설정에 실패했습니다." }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "비밀번호가 재설정되었습니다. 새 비밀번호는 newpassword123 입니다.",
    })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
