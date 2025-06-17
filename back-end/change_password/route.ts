import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, currentPassword, newPassword } = body

    if (!userId || !currentPassword || !newPassword) {
      return NextResponse.json({ error: "모든 필드를 입력해주세요." }, { status: 400 })
    }

    // 비밀번호 복잡성 검사
    const passwordRegex = /^(?=.*[@#$^+=-]).{8,}$/
    if (!passwordRegex.test(newPassword)) {
      return NextResponse.json(
        {
          error: "비밀번호는 8자 이상이며 특수문자(@#$^+=-)를 포함해야 합니다.",
        },
        { status: 400 },
      )
    }

    const supabase = createServerSupabaseClient()

    // 현재 비밀번호 확인
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("password")
      .eq("id", userId)
      .single()

    if (userError || !userData) {
      return NextResponse.json({ error: "사용자 정보를 찾을 수 없습니다." }, { status: 404 })
    }

    // 현재 비밀번호가 일치하는지 확인
    if (userData.password !== currentPassword) {
      return NextResponse.json({ error: "현재 비밀번호가 일치하지 않습니다." }, { status: 400 })
    }

    // 새 비밀번호로 업데이트
    const { error: updateError } = await supabase
      .from("users")
      .update({
        password: newPassword,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (updateError) {
      console.error("Password update error:", updateError)
      return NextResponse.json({ error: "비밀번호 변경에 실패했습니다." }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "비밀번호가 성공적으로 변경되었습니다.",
    })
  } catch (error) {
    console.error("Change password error:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
