"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Header from "@/components/header"

export default function MyPage() {
  const [userInfo, setUserInfo] = useState({
    koreanName: "OOO",
    englishName: "OOO",
    birthday: "2000-01-01",
    phoneNumber: "02-1234-5678",
    mobilePhone: "010-1234-5678",
    email: "OOO@gmail.com",
    bankAccount: "국민은행 ",
    postalCode: "01897",
    address1: "서울특별시 노원구",
    address2: "광운대학교 새빛관 123호",
    previousPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [passwordError, setPasswordError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 비밀번호 유효성 검사
    if (userInfo.newPassword) {
      if (userInfo.newPassword !== userInfo.confirmPassword) {
        setPasswordError("비밀번호가 일치하지 않습니다.")
        return
      }
      if (!userInfo.previousPassword) {
        setPasswordError("현재 비밀번호를 입력해주세요.")
        return
      }
    }

    setPasswordError("")

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        alert("로그인이 필요합니다.")
        return
      }

      const res = await fetch("http://localhost:7070/user/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...userInfo,
          passwordUpdate: userInfo.newPassword
            ? {
                previousPassword: userInfo.previousPassword,
                newPassword: userInfo.newPassword,
              }
            : null,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        alert(err.message || "정보 업데이트에 실패했습니다.")
        return
      }

      alert("정보가 성공적으로 업데이트되었습니다.")
      setUserInfo((prev) => ({
        ...prev,
        previousPassword: "",
        newPassword: "",
        confirmPassword: "",
      }))
    } catch (err) {
      console.error("업데이트 중 오류 발생:", err)
      alert("서버 오류가 발생했습니다.")
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">MY(내 정보 관리)</h1>
        </div>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">내정보수정</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {[
                  ["koreanName", "한글이름"],
                  ["englishName", "영문이름"],
                  ["birthday", "생일", "date"],
                  ["phoneNumber", "전화번호"],
                  ["mobilePhone", "휴대폰"],
                  ["email", "e-mail", "email"],
                  ["bankAccount", "은행/계좌번호"],
                  ["postalCode", "우편번호"],
                  ["address1", "주소1(도/구/시/본부대)"],
                  ["address2", "주소2(동/아파트)"],
                ].map(([field, label, type = "text"]) => (
                  <div key={field} className="grid grid-cols-5 items-center border-b pb-2">
                    <Label htmlFor={field} className="font-medium">{label}</Label>
                    <div className="col-span-4">
                      <Input
                        id={field}
                        name={field}
                        type={type}
                        value={(userInfo as any)[field]}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                ))}

                <div className="grid grid-cols-5 items-center border-b pb-2">
                  <Label className="font-medium">스마트 인증 관리</Label>
                  <div className="col-span-4">
                    <div className="py-2 text-amber-600">본인등록 iOS, 본인등록시간: 2023-03-12 13:58:48</div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-4">현재 비밀번호</h3>
                    <Input
                      id="previousPassword"
                      name="previousPassword"
                      type="password"
                      placeholder="현재 비밀번호 입력"
                      value={userInfo.previousPassword}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <h3 className="font-medium mb-4">비밀번호 확인</h3>
                    <div className="space-y-4">
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        placeholder="새 비밀번호 입력"
                        value={userInfo.newPassword}
                        onChange={handleChange}
                      />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="비밀번호 확인 입력"
                        value={userInfo.confirmPassword}
                        onChange={handleChange}
                      />
                      <div className="text-sm text-gray-500">
                        ※ 안전거래를 위해 8자 이상 특수문자(@#$^+=-)를 포함하세요
                      </div>
                      {passwordError && <div className="text-sm text-red-500">{passwordError}</div>}
                    </div>
                  </div>
                </div>

                <div className="flex justify-center pt-4">
                  <Button type="submit" className="bg-rose-600 hover:bg-rose-700">
                    확인
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
