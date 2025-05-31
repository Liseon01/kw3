"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginForm() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  console.log("로그인 시도 중..."); 

  if (!username || !password) {
    setError("아이디와 비밀번호를 입력해주세요.");
    return;
<<<<<<< HEAD
=======
  }

  try {
    console.log("fetch 요청 보냄..."); 

    const res = await fetch("http://localhost:7070/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_num: username,
        password: password,
      }),
    });

    console.log("응답 받음");

    if (!res.ok) {
      const err = await res.json();
      setError(err.message || "로그인에 실패했습니다.");
      return;
    }

    const data = await res.json();
    console.log("로그인 성공:", data);

    localStorage.setItem("token", data.token);
    router.push("/dashboard");
  } catch (err) {
    console.error("Login error:", err);
    setError("서버 오류가 발생했습니다.");
>>>>>>> 2deb37c4f1b5125b4fe874b6afd9a5fc4ab7df58
  }
};


  try {
    console.log("fetch 요청 보냄..."); 

    const res = await fetch("http://localhost:7070/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_num: username,
        password: password,
      }),
    });

    console.log("응답 받음");

    if (!res.ok) {
      const err = await res.json();
      setError(err.message || "로그인에 실패했습니다.");
      return;
    }

    const data = await res.json();
    console.log("로그인 성공:", data);

    localStorage.setItem("token", data.token);
    router.push("/dashboard");
  } catch (err) {
    console.error("Login error:", err);
    setError("서버 오류가 발생했습니다.");
  }
};
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
              <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700">
                로그인
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 items-center">
          <div className="flex items-center gap-1">
            <p className="text-sm text-gray-500">계정이 없으신가요?</p>
            <button
              type="button"
              onClick={() => router.push("/register")}
              className="text-sm font-medium text-rose-600 hover:underline"
            >
              회원가입
            </button>
          </div>
          <p className="text-sm text-gray-500">© 2025 Kwangwoon University. All rights reserved.</p>
        </CardFooter>
      </Card>
    </div>
  )
}
