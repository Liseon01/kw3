import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    // URL에서 사용자 ID 가져오기
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "사용자 ID가 필요합니다." }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // 사용자 정보 가져오기
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*") // departments 조인 제거
      .eq("id", userId)
      .single()

    if (userError || !userData) {
      console.error("Database error:", userError)
      return NextResponse.json({ error: "사용자 정보를 찾을 수 없습니다." }, { status: 404 })
    }

    // 기본 학과 정보와 함께 반환
    return NextResponse.json({
      success: true,
      profile: {
        ...userData,
        department: "컴퓨터공학과", // 기본값으로 설정
        academic_status: "재학", // 기본값으로 설정
      },
    })
  } catch (error) {
    console.error("User profile fetch error:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { userId, profileData } = body

    if (!userId || !profileData) {
      return NextResponse.json({ error: "사용자 ID와 프로필 데이터가 필요합니다." }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // 사용자 정보 업데이트
    const { error: updateError } = await supabase
      .from("users")
      .update({
        name: profileData.koreanName,
        english_name: profileData.englishName,
        birthday: profileData.birthday || null,
        phone_number: profileData.phoneNumber,
        mobile_phone: profileData.mobilePhone,
        email: profileData.email,
        bank_account: profileData.bankAccount,
        postal_code: profileData.postalCode,
        address1: profileData.address1,
        address2: profileData.address2,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (updateError) {
      console.error("Update error:", updateError)
      return NextResponse.json({ error: "프로필 업데이트에 실패했습니다." }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "프로필이 성공적으로 업데이트되었습니다.",
    })
  } catch (error) {
    console.error("User profile update error:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
