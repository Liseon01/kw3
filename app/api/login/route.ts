import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json({ error: "아이디와 비밀번호를 모두 입력해주세요." }, { status: 400 })
    }

    // 데이터베이스에서 사용자 조회를 먼저 시도 (학번 또는 사용자명으로 로그인 가능)
    try {
      const supabase = createServerSupabaseClient()

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .or(`username.eq.${username},student_id.eq.${username}`)
        .eq("password", password)
        .single()

      if (!error && data) {
        return NextResponse.json({
          success: true,
          user: {
            id: data.id,
            username: data.username,
            name: data.name,
            email: data.email,
            student_id: data.student_id,
            role: data.role || "student",
          },
        })
      }
    } catch (dbError) {
      console.error("Database error:", dbError)
    }

    // 데이터베이스에서 찾지 못한 경우에만 하드코딩된 테스트 계정 확인
    // 테스트 계정 하드코딩 (임시)
    if (username === "admin" && password === "admin123") {
      return NextResponse.json({
        success: true,
        user: {
          id: "admin-id",
          username: "admin",
          name: "관리자",
          email: "admin@kwangwoon.ac.kr",
          student_id: "ADMIN001",
          role: "admin",
        },
      })
    }

    // 교수 테스트 계정 추가
    if (username === "professor1" && password === "prof123") {
      return NextResponse.json({
        success: true,
        user: {
          id: "professor-id-1",
          username: "professor1",
          name: "김교수",
          email: "professor1@kwangwoon.ac.kr",
          student_id: "PROF001",
          role: "professor",
        },
      })
    }

    // 학생 테스트 계정 하드코딩 (임시)
    if (username === "student1" && password === "password123") {
      return NextResponse.json({
        success: true,
        user: {
          id: "student-id-1",
          username: "student1",
          name: "김광운",
          email: "student1@kwangwoon.ac.kr",
          student_id: "2023101001",
          role: "student",
        },
      })
    }

    // 로그인 실패
    return NextResponse.json({ error: "아이디 또는 비밀번호가 일치하지 않습니다." }, { status: 401 })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "로그인 중 오류가 발생했습니다." }, { status: 500 })
  }
}
