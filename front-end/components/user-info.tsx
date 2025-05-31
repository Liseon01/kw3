"use client"

import { useEffect, useState } from "react"
import { User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface UserData {
  name: string
  email: string
  department: string
  semester: string
  status: string
}

export default function UserInfo() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)

  useEffect(() => {
    fetch("http://localhost:7070/user")
      .then((res) => {
        if (!res.ok) throw new Error("사용자 정보를 불러오지 못했습니다.")
        return res.json()
      })
      .then((data: UserData) => setUser(data))
      .catch((err) => {
        console.error(err)
        // 기본 fallback 설정 가능
        setUser({
          name: "알 수 없음",
          email: "-",
          department: "-",
          semester: "-",
          status: "-"
        })
      })
  }, [])

  const handleLogout = () => {
    // 실제 로그아웃 처리는 여기서 세션이나 토큰 삭제 후 처리
    router.push("/")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <User className="w-5 h-5" />
        <p className="font-medium">
          {user ? `${user.name}님, 환영합니다.` : "로딩 중..."}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="text-gray-500">이메일</div>
        <div>{user?.email || "-"}</div>
        <div className="text-gray-500">소속</div>
        <div>{user?.department || "-"}</div>
        <div className="text-gray-500">학기</div>
        <div>{user?.semester || "-"}</div>
        <div className="text-gray-500">학적상태</div>
        <div>{user?.status || "-"}</div>
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
