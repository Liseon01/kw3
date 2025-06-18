import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

// 회원가입 요청 목록 조회
export async function GET() {
  try {
    const supabase = createServerSupabaseClient()
    console.log("Supabase client created successfully")

    const { data: requests, error } = await supabase
      .from("signup_requests")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase error fetching signup requests:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      requests: requests || [],
    })
  } catch (error) {
    console.error("Unexpected error in signup requests GET:", error)
    return NextResponse.json(
      {
        error: "서버 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

// 회원가입 요청 생성
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password, socialSecurityNumber, gender, phoneNumber, role } = body

    if (!name || !email || !password || !socialSecurityNumber || !gender || !phoneNumber || !role) {
      return NextResponse.json({ error: "모든 필드를 입력해주세요." }, { status: 400 })
    }

    try {
      const supabase = createServerSupabaseClient()
      console.log("Supabase client created successfully for POST")

      // 이미 존재하는 이메일인지 확인
      const { data: existingRequest, error: checkError } = await supabase
        .from("signup_requests")
        .select("id")
        .eq("email", email)
        .maybeSingle()

      if (checkError) {
        console.error("Error checking existing request:", checkError)
        return NextResponse.json({ error: checkError.message }, { status: 500 })
      }

      if (existingRequest) {
        return NextResponse.json({ error: "이미 가입 요청이 존재합니다." }, { status: 400 })
      }

      // 회원가입 요청 저장
      const { error: insertError } = await supabase.from("signup_requests").insert({
        name,
        email,
        password, // 실제 구현에서는 해시화 필요
        social_security_number: socialSecurityNumber,
        gender,
        phone_number: phoneNumber,
        role,
        status: "pending",
        created_at: new Date().toISOString(),
      })

      if (insertError) {
        console.error("Error inserting signup request:", insertError)
        return NextResponse.json({ error: insertError.message }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: "회원가입 요청이 성공적으로 제출되었습니다.",
      })
    } catch (supabaseError) {
      console.error("Supabase error in POST:", supabaseError)
      return NextResponse.json(
        {
          error: "데이터베이스 오류가 발생했습니다.",
          details: supabaseError instanceof Error ? supabaseError.message : String(supabaseError),
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Unexpected error in signup requests POST:", error)
    return NextResponse.json(
      {
        error: "서버 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
