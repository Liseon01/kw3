import Link from "next/link"
import Image from "next/image"

export default function Header() {
  return (
    <header className="border-b">
      <div className="container flex items-center justify-between h-16 px-4">
        <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Image src="/logo.png" alt="Kwangwoon University Logo" width={50} height={50} className="object-contain" />
          <div>
            <h1 className="text-xl font-bold text-rose-600">KWANGWOON UNIVERSITY</h1>
            <p className="text-xs text-gray-500">광운대학교</p>
          </div>
        </Link>
        <nav className="hidden md:flex">
          <ul className="flex items-center space-x-8">
            <li className="font-medium hover:text-rose-600 cursor-pointer">
              <Link href="/dashboard">홈</Link>
            </li>
            <li className="font-medium hover:text-rose-600 cursor-pointer">
              <Link href="/my">MY</Link>
            </li>
            <li className="font-medium hover:text-rose-600 cursor-pointer">
              <Link href="/courses">강의 정보</Link>
            </li>
            <li className="font-medium hover:text-rose-600 cursor-pointer">
              <Link href="/registration">수강신청</Link>
            </li>
            <li className="font-medium hover:text-rose-600 cursor-pointer">
              <Link href="/grades">성적</Link>
            </li>
            <li className="font-medium hover:text-rose-600 cursor-pointer">
              <Link href="/academic-info">학사정보</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
