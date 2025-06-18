"use client"

import { User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface UserData {
  id: string
  username: string
  name: string
  email: string
  student_id: string
  department?: string
  academicStatus?: string
}

export default function UserInfo() {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 세션 스토리지에서 사용자 ID 가져오기
    const getUserData = async () => {
      try {
        const storedUser = sessionStorage.getItem("user")
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          setIsLoading(true)

          // API에서 최신 사용자 정보 가져오기
          try {
            const response = await fetch(`/api/user-profile?userId=${parsedUser.id}`)

            if (response.ok) {
              const data = await response.json()
              if (data.success && data.profile) {
                // API에서 가져온 최신 정보로 업데이트
                const enhancedUser = {
                  id: data.profile.id,
                  username: data.profile.username || parsedUser.username,
                  name: data.profile.name,
                  email: data.profile.email,
                  student_id: data.profile.student_id,
                  department: data.profile.department || "컴퓨터공학과",
                  academicStatus: data.profile.academic_status || "재학",
                }
                setUserData(enhancedUser)
              } else {
                // 기본 정보 사용
                setUserData({
                  ...parsedUser,
                  department: "컴퓨터공학과",
                  academicStatus: "재학",
                })
              }
            } else {
              console.error("API response not ok:", response.status)
              // API 호출 실패 시 기존 정보 사용
              setUserData({
                ...parsedUser,
                department: "컴퓨터공학과",
                academicStatus: "재학",
              })
            }
          } catch (apiError) {
            console.error("API call failed:", apiError)
            // API 호출 실패 시 기존 정보 사용
            setUserData({
              ...parsedUser,
              department: "컴퓨터공학과",
              academicStatus: "재학",
            })
          }
        }
      } catch (error) {
        console.error("Failed to get user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getUserData()
  }, [])

  const handleLogout = () => {
    // 세션 스토리지에서 사용자 정보 삭제
    sessionStorage.removeItem("user")
    // 로그인 페이지로 이동
    router.push("/")
  }

  // 로딩 중이거나 사용자 정보가 없는 경우
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-rose-600"></div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-2 p-4">
          <p className="text-gray-500">로그인이 필요합니다</p>
        </div>
        <div className="flex gap-2 pt-2">
          <Link href="/" className="w-full py-1 text-sm bg-rose-600 text-white rounded hover:bg-rose-700 text-center">
            로그인
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <User className="w-5 h-5" />
        <p className="font-medium">{userData.name}님, 환영합니다.</p>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="text-gray-500">이메일</div>
        <div>{userData.email}</div>
        <div className="text-gray-500">소속</div>
        <div>{userData.department}</div>
        <div className="text-gray-500">학적상태</div>
        <div>{userData.academicStatus}</div>
      </div>
      <div className="flex gap-2 pt-2">
        <Link href="/my" className="w-full py-1 text-sm bg-rose-600 text-white rounded hover:bg-rose-700 text-center">
          마이페이지
        </Link>
        <button onClick={handleLogout} className="w-full py-1 text-sm bg-rose-600 text-white rounded hover:bg-rose-700">
          로그아웃
        </button>
      </div>
    </div>
  )
}
