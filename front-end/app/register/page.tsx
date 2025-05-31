"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    studentId: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
  })
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDepartmentChange = (value: string) => {
    setFormData((prev) => ({ ...prev, department: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.studentId || !formData.email || !formData.password || !formData.department) {
      setError("모든 필드를 입력해주세요.")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.")
      return
    }

    setError("")

    try {
      const res = await fetch("http://localhost:7070/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          studentId: formData.studentId,
          email: formData.email,
          password: formData.password,
          department: formData.department,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        setError(err.message || "회원가입에 실패했습니다.")
        return
      }

      alert("회원가입이 완료되었습니다.")
      router.push("/") // 로그인 페이지로 이동
    } catch (err) {
      console.error("Register error:", err)
      setError("서버 오류가 발생했습니다.")
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
          <CardDescription>학사관리시스템 회원가입</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="이름을 입력하세요"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentId">학번</Label>
                <Input
                  id="studentId"
                  name="studentId"
                  placeholder="학번을 입력하세요"
                  value={formData.studentId}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="이메일을 입력하세요"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">학과</Label>
                <Select onValueChange={handleDepartmentChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="학과를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="computer_science">컴퓨터공학과</SelectItem>
                    <SelectItem value="electrical_engineering">전자공학과</SelectItem>
                    <SelectItem value="software">소프트웨어학과</SelectItem>
                    <SelectItem value="robotics">로봇학과</SelectItem>
                    <SelectItem value="business">경영학과</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="비밀번호를 다시 입력하세요"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700">
                회원가입
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 items-center">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="text-sm font-medium text-rose-600 hover:underline"
          >
            로그인 페이지로 돌아가기
          </button>
          <p className="text-sm text-gray-500">© 2025 Kwangwoon University. All rights reserved.</p>
        </CardFooter>
      </Card>
    </div>
  )
}
