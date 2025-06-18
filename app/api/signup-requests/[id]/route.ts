import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

// 회원가입 요청 승인/거부
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const {
      action,
      studentId,
      department,
      address,
      postalCode,
      admissionType,
      tuitionStatus,
      position,
      major,
      reason,
    } = body
    const requestId = params.id

    if (!action || (action !== "approve" && action !== "reject")) {
      return NextResponse.json({ error: "올바른 액션을 지정해주세요." }, { status: 400 })
    }

    try {
      const supabase = createServerSupabaseClient()
      console.log("Supabase client created successfully for PUT")

      if (action === "approve") {
        // 승인 처리
        if (!studentId) {
          return NextResponse.json({ error: "학번을 입력해주세요." }, { status: 400 })
        }

        // 회원가입 요청 정보 가져오기
        const { data: signupRequest, error: fetchError } = await supabase
          .from("signup_requests")
          .select("*")
          .eq("id", requestId)
          .single()

        if (fetchError) {
          console.error("Error fetching signup request:", fetchError)
          return NextResponse.json({ error: fetchError.message }, { status: 500 })
        }

        if (!signupRequest) {
          return NextResponse.json({ error: "회원가입 요청을 찾을 수 없습니다." }, { status: 404 })
        }

        // 이미 승인된 요청인지 확인
        if (signupRequest.status === "approved") {
          return NextResponse.json({ error: "이미 승인된 요청입니다." }, { status: 400 })
        }

        // 이메일로 기존 사용자 확인
        const { data: existingUser, error: userCheckError } = await supabase
          .from("users")
          .select("id, email, student_id")
          .eq("email", signupRequest.email)
          .single()

        if (userCheckError && userCheckError.code !== "PGRST116") {
          // PGRST116은 "no rows returned" 에러 코드
          console.error("Error checking existing user:", userCheckError)
          return NextResponse.json({ error: "사용자 확인 중 오류가 발생했습니다." }, { status: 500 })
        }

        // 학번으로 기존 사용자 확인
        const { data: existingStudentId, error: studentIdCheckError } = await supabase
          .from("users")
          .select("id, student_id")
          .eq("student_id", studentId)
          .single()

        if (studentIdCheckError && studentIdCheckError.code !== "PGRST116") {
          console.error("Error checking existing student ID:", studentIdCheckError)
          return NextResponse.json({ error: "학번 확인 중 오류가 발생했습니다." }, { status: 500 })
        }

        if (existingUser) {
          return NextResponse.json({ error: "이미 등록된 이메일입니다." }, { status: 400 })
        }

        if (existingStudentId) {
          return NextResponse.json({ error: "이미 사용 중인 학번입니다." }, { status: 400 })
        }

        // 사용자 계정 생성 - 역할 정보 포함
        const userData = {
          username: studentId,
          password: signupRequest.password, // 실제 구현에서는 해시화된 비밀번호 사용
          name: signupRequest.name,
          email: signupRequest.email,
          role: signupRequest.role, // 회원가입 시 선택한 역할 저장 (student 또는 professor)
          student_id: studentId,
          phone_number: signupRequest.phone_number,
          mobile_phone: signupRequest.phone_number,
          address1: address || null,
          postal_code: postalCode || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        const { error: userInsertError } = await supabase.from("users").insert(userData)

        if (userInsertError) {
          console.error("Error inserting user:", userInsertError)
          if (userInsertError.code === "23505") {
            // 중복 키 오류
            if (userInsertError.message.includes("email")) {
              return NextResponse.json({ error: "이미 등록된 이메일입니다." }, { status: 400 })
            } else if (userInsertError.message.includes("student_id")) {
              return NextResponse.json({ error: "이미 사용 중인 학번입니다." }, { status: 400 })
            } else if (userInsertError.message.includes("username")) {
              return NextResponse.json({ error: "이미 사용 중인 사용자명입니다." }, { status: 400 })
            }
          }
          return NextResponse.json({ error: userInsertError.message }, { status: 500 })
        }

        // 요청 상태 업데이트
        const { error: updateError } = await supabase
          .from("signup_requests")
          .update({
            status: "approved",
            student_id: studentId,
            approved_at: new Date().toISOString(),
          })
          .eq("id", requestId)

        if (updateError) {
          console.error("Error updating signup request:", updateError)
          // 사용자는 생성되었지만 요청 상태 업데이트 실패 - 로그만 남기고 성공으로 처리
          console.warn("User created but failed to update signup request status")
        }

        return NextResponse.json({
          success: true,
          message: "회원가입 요청이 승인되었습니다.",
          studentId: studentId,
          role: signupRequest.role,
        })
      } else {
        // 거부 처리
        const { error: updateError } = await supabase
          .from("signup_requests")
          .update({
            status: "rejected",
            rejected_at: new Date().toISOString(),
          })
          .eq("id", requestId)

        if (updateError) {
          console.error("Error rejecting signup request:", updateError)
          return NextResponse.json({ error: updateError.message }, { status: 500 })
        }

        return NextResponse.json({
          success: true,
          message: "회원가입 요청이 거부되었습니다.",
        })
      }
    } catch (supabaseError) {
      console.error("Supabase error in PUT:", supabaseError)
      return NextResponse.json(
        {
          error: "데이터베이스 오류가 발생했습니다.",
          details: supabaseError instanceof Error ? supabaseError.message : String(supabaseError),
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Unexpected error in signup request PUT:", error)
    return NextResponse.json(
      {
        error: "서버 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
