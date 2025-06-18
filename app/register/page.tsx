"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2 } from "lucide-react"

export default function FindAccountPage() {
  const router = useRouter()
  const [findIdData, setFindIdData] = useState({
    name: "",
    email: "",
    studentId: "",
  })

  const [findPwData, setFindPwData] = useState({
    userId: "",
    email: "",
    studentId: "",
  })

  const [verificationMethod, setVerificationMethod] = useState("email")
  const [message, setMessage] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [foundUsername, setFoundUsername] = useState("")

  const handleFindIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFindIdData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFindPwChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFindPwData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFindId = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")
    setFoundUsername("")

    try {
      // 필수 필드 검증
      if (
        !findIdData.name ||
        (verificationMethod === "email" && !findIdData.email) ||
        (verificationMethod === "studentId" && !findIdData.studentId)
      ) {
        setMessage("모든 필수 정보를 입력해주세요.")
        setIsSuccess(false)
        return
      }

      const response = await fetch("/api/find-id", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: findIdData.name,
          email: verificationMethod === "email" ? findIdData.email : undefined,
          studentId: verificationMethod === "studentId" ? findIdData.studentId : undefined,
          method: verificationMethod,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "아이디를 찾는 중 오류가 발생했습니다.")
      }

      setIsSuccess(true)
      setMessage(data.message)
      setFoundUsername(data.username)
    } catch (error) {
      setIsSuccess(false)
      setMessage(error instanceof Error ? error.message : "아이디를 찾는 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFindPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    try {
      // 필수 필드 검증
      if (
        !findPwData.userId ||
        (verificationMethod === "email" && !findPwData.email) ||
        (verificationMethod === "studentId" && !findPwData.studentId)
      ) {
        setMessage("모든 필수 정보를 입력해주세요.")
        setIsSuccess(false)
        return
      }

      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: findPwData.userId,
          email: verificationMethod === "email" ? findPwData.email : undefined,
          studentId: verificationMethod === "studentId" ? findPwData.studentId : undefined,
          method: verificationMethod,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "비밀번호 재설정 중 오류가 발생했습니다.")
      }

      setIsSuccess(true)
      setMessage(data.message)
    } catch (error) {
      setIsSuccess(false)
      setMessage(error instanceof Error ? error.message : "비밀번호 재설정 중 오류가 발생했습니다.")
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
          <CardDescription>아이디/비밀번호 찾기</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="findId" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="findId">아이디 찾기</TabsTrigger>
              <TabsTrigger value="findPassword">비밀번호 찾기</TabsTrigger>
            </TabsList>

            <TabsContent value="findId">
              <form onSubmit={handleFindId}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">이름</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="이름을 입력하세요"
                      value={findIdData.name}
                      onChange={handleFindIdChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>인증 방법</Label>
                    <RadioGroup
                      defaultValue="email"
                      className="flex flex-col space-y-2"
                      onValueChange={setVerificationMethod}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="email" id="email" />
                        <Label htmlFor="email" className="cursor-pointer">
                          이메일로 찾기
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="studentId" id="studentId" />
                        <Label htmlFor="studentId" className="cursor-pointer">
                          학번으로 찾기
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {verificationMethod === "email" ? (
                    <div className="space-y-2">
                      <Label htmlFor="findIdEmail">이메일</Label>
                      <Input
                        id="findIdEmail"
                        name="email"
                        type="email"
                        placeholder="가입 시 등록한 이메일을 입력하세요"
                        value={findIdData.email}
                        onChange={handleFindIdChange}
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="findIdStudentId">학번</Label>
                      <Input
                        id="findIdStudentId"
                        name="studentId"
                        placeholder="학번을 입력하세요"
                        value={findIdData.studentId}
                        onChange={handleFindIdChange}
                      />
                    </div>
                  )}

                  {message && (
                    <div
                      className={`p-3 rounded-md ${isSuccess ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                    >
                      {message}
                      {foundUsername && <div className="mt-2 font-semibold">찾은 아이디: {foundUsername}</div>}
                    </div>
                  )}

                  <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        처리 중...
                      </>
                    ) : (
                      "아이디 찾기"
                    )}
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="findPassword">
              <form onSubmit={handleFindPassword}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="userId">아이디</Label>
                    <Input
                      id="userId"
                      name="userId"
                      placeholder="아이디를 입력하세요"
                      value={findPwData.userId}
                      onChange={handleFindPwChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>인증 방법</Label>
                    <RadioGroup
                      defaultValue="email"
                      className="flex flex-col space-y-2"
                      onValueChange={setVerificationMethod}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="email" id="pwEmail" />
                        <Label htmlFor="pwEmail" className="cursor-pointer">
                          이메일로 찾기
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="studentId" id="pwStudentId" />
                        <Label htmlFor="pwStudentId" className="cursor-pointer">
                          학번으로 찾기
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {verificationMethod === "email" ? (
                    <div className="space-y-2">
                      <Label htmlFor="findPwEmail">이메일</Label>
                      <Input
                        id="findPwEmail"
                        name="email"
                        type="email"
                        placeholder="가입 시 등록한 이메일을 입력하세요"
                        value={findPwData.email}
                        onChange={handleFindPwChange}
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="findPwStudentId">학번</Label>
                      <Input
                        id="findPwStudentId"
                        name="studentId"
                        placeholder="학번을 입력하세요"
                        value={findPwData.studentId}
                        onChange={handleFindPwChange}
                      />
                    </div>
                  )}

                  {message && (
                    <div
                      className={`p-3 rounded-md ${isSuccess ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                    >
                      {message}
                    </div>
                  )}

                  <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        처리 중...
                      </>
                    ) : (
                      "비밀번호 찾기"
                    )}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
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
