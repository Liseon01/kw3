"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function LoginForm() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // 이미 로그인되어 있는지 확인
  useEffect(() => {
    const checkLoggedIn = () => {
      const user = sessionStorage.getItem("user")
      if (user) {
        const userData = JSON.parse(user)
        if (userData.role === "admin") {
          router.push("/admin")
        } else if (userData.role === "professor") {
          router.push("/materials")
        } else {
          router.push("/dashboard")
        }
      }
    }

    checkLoggedIn()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simple validation
    if (!username || !password) {
      setError("아이디와 비밀번호를 입력해주세요.")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "로그인에 실패했습니다.")
      }

      // 로그인 성공 시 사용자 정보를 세션 스토리지에 저장
      // 실제 서비스에서는 쿠키나 토큰 기반 인증을 사용해야 합니다
      sessionStorage.setItem("user", JSON.stringify(data.user))
      console.log("로그인 성공:", data.user)

      // 역할에 따라 다른 페이지로 이동
      if (data.user.role === "admin") {
        router.push("/admin")
      } else if (data.user.role === "professor") {
        router.push("/materials")
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "로그인에 실패했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  // 테스트 계정으로 자동 로그인
  const loginWithTestAccount = async (account: string) => {
    let credentials = { username: "", password: "" }

    if (account === "admin") {
      credentials = { username: "admin", password: "admin123" }
    } else if (account === "student") {
      credentials = { username: "student1", password: "password123" }
    } else if (account === "professor") {
      credentials = { username: "professor1", password: "prof123" }
    }

    setUsername(credentials.username)
    setPassword(credentials.password)

    // 자동으로 폼 제출
    try {
      setIsLoading(true)
      setError("")

      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "로그인에 실패했습니다.")
      }

      // 로그인 성공 시 사용자 정보를 세션 스토리지에 저장
      sessionStorage.setItem("user", JSON.stringify(data.user))
      console.log("자동 로그인 성공:", data.user)

      // 역할에 따라 다른 페이지로 이동
      if (data.user.role === "admin") {
        router.push("/admin")
      } else if (data.user.role === "professor") {
        router.push("/materials")
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "로그인에 실패했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Image src="/logo.png" alt="Kwangwoon University Logo" width={80} height={80} className="object-contain" />
          </div>
          <CardTitle className="text-2xl font-bold text-rose-600">KWANGWOON UNIVERSITY</CardTitle>
          <CardDescription>학사관리시스템에 로그인하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">아이디</Label>
                <Input
                  id="username"
                  placeholder="아이디를 입력하세요"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    로그인 중...
                  </>
                ) : (
                  "로그인"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 items-center">
          <div className="flex items-center gap-1">
            <p className="text-sm text-gray-500">아이디/비밀번호를 잊으셨나요?</p>
            <button
              type="button"
              onClick={() => router.push("/register")}
              className="text-sm font-medium text-rose-600 hover:underline"
            >
              찾기
            </button>
          </div>
          <div className="flex items-center gap-1">
            <p className="text-sm text-gray-500">계정이 없으신가요?</p>
            <button
              type="button"
              onClick={() => router.push("/signup")}
              className="text-sm font-medium text-rose-600 hover:underline"
            >
              회원가입
            </button>
          </div>
          <p className="text-sm text-gray-500">© 2025 Kwangwoon University. All rights reserved.</p>
          <div className="text-xs text-gray-400 mt-2">
            <p>테스트 계정:</p>
            <div className="flex justify-center mt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => loginWithTestAccount("admin")}
                className="text-xs h-7 px-2"
              >
                관리자
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
