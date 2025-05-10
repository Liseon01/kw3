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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Password validation
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

    // 벡엔드 연결지점?
    setPasswordError("")

    // 페스워드 리셋 필드
    setUserInfo((prev) => ({
      ...prev,
      previousPassword: "",
      newPassword: "",
      confirmPassword: "",
    }))

    alert("정보가 성공적으로 업데이트되었습니다.")
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
                <div className="grid grid-cols-5 items-center border-b pb-2">
                  <Label htmlFor="koreanName" className="font-medium">
                    한글이름
                  </Label>
                  <div className="col-span-4">
                    <Input id="koreanName" name="koreanName" value={userInfo.koreanName} onChange={handleChange} />
                  </div>
                </div>

                <div className="grid grid-cols-5 items-center border-b pb-2">
                  <Label htmlFor="englishName" className="font-medium">
                    영문이름
                  </Label>
                  <div className="col-span-4">
                    <Input id="englishName" name="englishName" value={userInfo.englishName} onChange={handleChange} />
                  </div>
                </div>

                <div className="grid grid-cols-5 items-center border-b pb-2">
                  <Label htmlFor="birthday" className="font-medium">
                    생일
                  </Label>
                  <div className="col-span-4">
                    <Input
                      id="birthday"
                      name="birthday"
                      type="date"
                      value={userInfo.birthday}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-5 items-center border-b pb-2">
                  <Label htmlFor="phoneNumber" className="font-medium">
                    전화번호
                  </Label>
                  <div className="col-span-4">
                    <Input id="phoneNumber" name="phoneNumber" value={userInfo.phoneNumber} onChange={handleChange} />
                  </div>
                </div>

                <div className="grid grid-cols-5 items-center border-b pb-2">
                  <Label htmlFor="mobilePhone" className="font-medium">
                    휴대폰
                  </Label>
                  <div className="col-span-4">
                    <Input id="mobilePhone" name="mobilePhone" value={userInfo.mobilePhone} onChange={handleChange} />
                  </div>
                </div>

                <div className="grid grid-cols-5 items-center border-b pb-2">
                  <Label htmlFor="email" className="font-medium">
                    e-mail
                  </Label>
                  <div className="col-span-4">
                    <Input id="email" name="email" type="email" value={userInfo.email} onChange={handleChange} />
                  </div>
                </div>

                <div className="grid grid-cols-5 items-center border-b pb-2">
                  <Label htmlFor="bankAccount" className="font-medium">
                    은행/계좌번호
                  </Label>
                  <div className="col-span-4">
                    <Input id="bankAccount" name="bankAccount" value={userInfo.bankAccount} onChange={handleChange} />
                  </div>
                </div>

                <div className="grid grid-cols-5 items-center border-b pb-2">
                  <Label htmlFor="postalCode" className="font-medium">
                    우편번호
                  </Label>
                  <div className="col-span-4">
                    <div className="flex gap-2">
                      <Input
                        id="postalCode"
                        name="postalCode"
                        value={userInfo.postalCode}
                        onChange={handleChange}
                        className="max-w-[200px]"
                      />
                      <Button type="button" variant="outline">
                        우편번호 검색
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-5 items-center border-b pb-2">
                  <Label htmlFor="address1" className="font-medium">
                    주소1(도/구/시/본부대)
                  </Label>
                  <div className="col-span-4">
                    <Input id="address1" name="address1" value={userInfo.address1} onChange={handleChange} />
                  </div>
                </div>

                <div className="grid grid-cols-5 items-center border-b pb-2">
                  <Label htmlFor="address2" className="font-medium">
                    주소2(동/아파트)
                  </Label>
                  <div className="col-span-4">
                    <Input id="address2" name="address2" value={userInfo.address2} onChange={handleChange} />
                  </div>
                </div>

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
                    <div className="space-y-4">
                      <div>
                        <Input
                          id="previousPassword"
                          name="previousPassword"
                          type="password"
                          placeholder="현재 비밀번호 입력"
                          value={userInfo.previousPassword}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-4">비밀번호 확인</h3>
                    <div className="space-y-4">
                      <div>
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          placeholder="새 비밀번호 입력"
                          value={userInfo.newPassword}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          placeholder="비밀번호 확인 입력"
                          value={userInfo.confirmPassword}
                          onChange={handleChange}
                        />
                      </div>
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
