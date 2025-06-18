"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Header from "@/components/header"
import { Loader2 } from "lucide-react"

interface UserProfile {
  id: string
  name: string
  english_name: string
  email: string
  student_id: string
  birthday: string | null
  phone_number: string | null
  mobile_phone: string | null
  bank_account: string | null
  postal_code: string | null
  address1: string | null
  address2: string | null
}

export default function MyPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  const [userInfo, setUserInfo] = useState({
    koreanName: "",
    englishName: "",
    birthday: "",
    phoneNumber: "",
    mobilePhone: "",
    email: "",
    bankAccount: "",
    postalCode: "",
    address1: "",
    address2: "",
    previousPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [passwordError, setPasswordError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    // 로그인 상태 확인
    const checkAuth = () => {
      try {
        const userStr = sessionStorage.getItem("user")
        if (!userStr) {
          // 로그인되지 않은 경우 로그인 페이지로 리디렉션
          router.push("/")
          return
        }

        const user = JSON.parse(userStr)
        setIsAuthenticated(true)
        setUserId(user.id)

        // 사용자 프로필 정보 가져오기
        fetchUserProfile(user.id)
      } catch (error) {
        console.error("Authentication check failed:", error)
        router.push("/")
      }
    }

    checkAuth()
  }, [router])

  const fetchUserProfile = async (userId: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/user-profile?userId=${userId}`)

      if (!response.ok) {
        console.error("API response error:", response.status, response.statusText)
        return // 에러 발생 시 함수 종료
      }

      const data = await response.json()

      if (data.success && data.profile) {
        const profile = data.profile as UserProfile

        setUserInfo({
          koreanName: profile.name || "",
          englishName: profile.english_name || "",
          birthday: profile.birthday || "",
          phoneNumber: profile.phone_number || "",
          mobilePhone: profile.mobile_phone || "",
          email: profile.email || "",
          bankAccount: profile.bank_account || "",
          postalCode: profile.postal_code || "",
          address1: profile.address1 || "",
          address2: profile.address2 || "",
          previousPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error)
      // 에러가 발생해도 페이지는 계속 표시되도록 함
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserInfo((prev) => ({ ...prev, [name]: value }))

    // 성공 메시지 초기화
    if (successMessage) {
      setSuccessMessage("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError("")
    setSuccessMessage("")

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

      // 비밀번호 복잡성 검사 (8자 이상, 특수문자 포함)
      const passwordRegex = /^(?=.*[@#$^+=-]).{8,}$/
      if (!passwordRegex.test(userInfo.newPassword)) {
        setPasswordError("비밀번호는 8자 이상이며 특수문자(@#$^+=-)를 포함해야 합니다.")
        return
      }
    }

    try {
      setIsSaving(true)

      // 프로필 정보 업데이트
      const response = await fetch("/api/user-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          profileData: {
            koreanName: userInfo.koreanName,
            englishName: userInfo.englishName,
            birthday: userInfo.birthday,
            phoneNumber: userInfo.phoneNumber,
            mobilePhone: userInfo.mobilePhone,
            email: userInfo.email,
            bankAccount: userInfo.bankAccount,
            postalCode: userInfo.postalCode,
            address1: userInfo.address1,
            address2: userInfo.address2,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("프로필 업데이트에 실패했습니다.")
      }

      // 비밀번호 변경 처리
      if (userInfo.newPassword) {
        const passwordResponse = await fetch("/api/change-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            currentPassword: userInfo.previousPassword,
            newPassword: userInfo.newPassword,
          }),
        })

        const passwordData = await passwordResponse.json()

        if (!passwordResponse.ok) {
          setPasswordError(passwordData.error || "비밀번호 변경에 실패했습니다.")
          setIsSaving(false)
          return
        }
      }

      // 비밀번호 필드 초기화
      setUserInfo((prev) => ({
        ...prev,
        previousPassword: "",
        newPassword: "",
        confirmPassword: "",
      }))

      setSuccessMessage("정보가 성공적으로 업데이트되었습니다.")
    } catch (error) {
      console.error("Failed to update profile:", error)
      setSuccessMessage("")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // 리디렉션 중이므로 아무것도 렌더링하지 않음
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
            {successMessage && <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-md">{successMessage}</div>}

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
                  <Button type="submit" className="bg-rose-600 hover:bg-rose-700" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        저장 중...
                      </>
                    ) : (
                      "확인"
                    )}
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
