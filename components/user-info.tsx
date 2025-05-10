"use client"

import { User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function UserInfo() {
  const router = useRouter()

  const handleLogout = () => {
    // In a real application, you would clear authentication tokens/cookies here
    router.push("/")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <User className="w-5 h-5" />
        <p className="font-medium">OOO님, 환영합니다.</p>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="text-gray-500">이메일</div>
        <div>OOO@gmail.com</div>
        <div className="text-gray-500">소속</div>
        <div>컴퓨터공학과</div>
        <div className="text-gray-500">학기</div>
        <div>4학년 1학기</div>
        <div className="text-gray-500">학적상태</div>
        <div>재학</div>
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
