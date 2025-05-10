import Image from "next/image"
import Announcements from "@/components/announcements"
import AcademicCalendar from "@/components/academic-calendar"
import UserInfo from "@/components/user-info"
import Header from "@/components/header"

export default function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <div className="container px-4 py-6">
          {/* 메인 베너 - Changeable School Image */}
          <div className="relative w-full h-80 mb-6 overflow-hidden rounded-lg">
            <Image src="/campus.jpg" alt="University Campus" fill className="object-cover" priority />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            {/* 왼쪽 - 공지사항 및 학사일정정 */}
            <div className="md:col-span-8 space-y-6">
              {/* 공지사항항 */}
              <div>
                <h2 className="mb-4 text-xl font-bold">공지사항</h2>
                <Announcements />
              </div>

              {/* 학사일정 */}
              <div>
                <h2 className="mb-4 text-xl font-bold">학사일정</h2>
                <AcademicCalendar />
              </div>
            </div>

            {/* 오른쪽 - 사용자 정보 출력력*/}
            <div className="md:col-span-4">
              <div className="p-4 border rounded-lg">
                <UserInfo />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
