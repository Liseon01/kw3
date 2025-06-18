import Image from "next/image"
import Announcements from "@/components/announcements"
import UserInfo from "@/components/user-info"
import Header from "@/components/header"

export default function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <div className="container px-4 py-6">
          {/* Main Banner - Changeable School Image */}
          <div className="relative w-full h-80 mb-6 overflow-hidden rounded-lg">
            <Image src="/campus.jpg" alt="University Campus" fill className="object-cover" priority />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            {/* Left Column - Announcements */}
            <div className="md:col-span-8 space-y-6">
              {/* Announcements Section */}
              <div>
                <h2 className="mb-4 text-xl font-bold">공지사항</h2>
                <Announcements />
              </div>
            </div>

            {/* Right Column - User Info */}
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
