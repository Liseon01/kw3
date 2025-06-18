"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Course {
  course_id: number
  course_code: string
  course_name: string
  professor_name?: string
  professors?: { name: string }
  day1?: string
  day1_start_time?: string
  day1_end_time?: string
  day2?: string
  day2_start_time?: string
  day2_end_time?: string
  course_classroom?: string
  credits: number
}

interface TimetableProps {
  courses: Course[]
}

const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"]

const days = ["월", "화", "수", "목", "금"]

const colors = [
  "bg-blue-100 border-blue-300 text-blue-800",
  "bg-green-100 border-green-300 text-green-800",
  "bg-purple-100 border-purple-300 text-purple-800",
  "bg-orange-100 border-orange-300 text-orange-800",
  "bg-pink-100 border-pink-300 text-pink-800",
  "bg-indigo-100 border-indigo-300 text-indigo-800",
  "bg-yellow-100 border-yellow-300 text-yellow-800",
  "bg-red-100 border-red-300 text-red-800",
]

export default function Timetable({ courses }: TimetableProps) {
  // 시간을 분으로 변환하는 함수
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number)
    return hours * 60 + minutes
  }

  // 분을 시간으로 변환하는 함수
  const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`
  }

  // 강의 시간 블록 생성
  const createCourseBlocks = () => {
    const blocks: any[] = []
    // 시간 슬롯 높이 (픽셀)
    const SLOT_HEIGHT = 61
    // 미세 조정을 위한 오프셋 (픽셀)
    const FINE_TUNING_OFFSET = 5
    // 9시 기준 분 (9:00 = 540분)
    const BASE_MINUTES = 540

    courses.forEach((course, index) => {
      const color = colors[index % colors.length]
      const professorName = course.professors?.name || course.professor_name || "미정"

      // 첫 번째 수업 시간
      if (course.day1 && course.day1_start_time && course.day1_end_time) {
        const startTime = course.day1_start_time.slice(0, 5) // "13:30"
        const endTime = course.day1_end_time.slice(0, 5) // "14:45"

        const startMinutes = timeToMinutes(startTime)
        const endMinutes = timeToMinutes(endTime)
        const duration = endMinutes - startMinutes

        // 정확한 위치 계산 - 분 단위로 정밀 계산
        const minutesSince9AM = startMinutes - BASE_MINUTES
        const topPosition = (minutesSince9AM / 60) * SLOT_HEIGHT + FINE_TUNING_OFFSET

        // 높이도 분 단위로 정확히 계산
        const height = (duration / 60) * SLOT_HEIGHT - FINE_TUNING_OFFSET

        blocks.push({
          id: `${course.course_id}-1`,
          course,
          day: course.day1,
          startTime,
          endTime,
          professorName,
          color,
          style: {
            top: `${topPosition}px`,
            height: `${height}px`,
          },
        })
      }

      // 두 번째 수업 시간
      if (course.day2 && course.day2_start_time && course.day2_end_time) {
        const startTime = course.day2_start_time.slice(0, 5)
        const endTime = course.day2_end_time.slice(0, 5)

        const startMinutes = timeToMinutes(startTime)
        const endMinutes = timeToMinutes(endTime)
        const duration = endMinutes - startMinutes

        const minutesSince9AM = startMinutes - BASE_MINUTES
        const topPosition = (minutesSince9AM / 60) * SLOT_HEIGHT + FINE_TUNING_OFFSET

        const height = (duration / 60) * SLOT_HEIGHT - FINE_TUNING_OFFSET

        blocks.push({
          id: `${course.course_id}-2`,
          course,
          day: course.day2,
          startTime,
          endTime,
          professorName,
          color,
          style: {
            top: `${topPosition}px`,
            height: `${height}px`,
          },
        })
      }
    })

    return blocks
  }

  const courseBlocks = createCourseBlocks()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>주간 시간표</span>
          <Badge variant="outline">{courses.length}개 강의</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* 헤더 */}
            <div className="grid grid-cols-6 gap-1 mb-2">
              <div className="h-12 flex items-center justify-center font-semibold bg-gray-50 rounded">시간</div>
              {days.map((day) => (
                <div key={day} className="h-12 flex items-center justify-center font-semibold bg-gray-50 rounded">
                  {day}요일
                </div>
              ))}
            </div>

            {/* 시간표 그리드 */}
            <div className="relative">
              <div className="grid grid-cols-6 gap-1">
                {/* 시간 열 */}
                <div className="space-y-1">
                  {timeSlots.map((time, index) => (
                    <div
                      key={time}
                      className="h-[61px] flex items-center justify-center text-sm font-medium bg-gray-50 rounded border"
                    >
                      {time}
                    </div>
                  ))}
                </div>

                {/* 요일별 열 */}
                {days.map((day) => (
                  <div key={day} className="relative">
                    {/* 시간 슬롯 배경 */}
                    {timeSlots.map((time, index) => (
                      <div key={time} className="h-[61px] border border-gray-200 rounded mb-1 bg-white"></div>
                    ))}

                    {/* 강의 블록 */}
                    <div className="absolute inset-0">
                      {courseBlocks
                        .filter((block) => block.day === day)
                        .map((block) => (
                          <div
                            key={block.id}
                            className={`absolute left-0 right-0 mx-1 p-2 rounded border-2 ${block.color} cursor-pointer hover:shadow-md transition-shadow`}
                            style={block.style}
                            title={`${block.course.course_name} (${block.professorName})`}
                          >
                            <div className="text-xs font-semibold truncate">{block.course.course_code}</div>
                            <div className="text-xs truncate">{block.course.course_name}</div>
                            <div className="text-xs truncate text-gray-600">{block.professorName}</div>
                            <div className="text-xs">
                              {block.startTime}-{block.endTime}
                            </div>
                            {block.course.course_classroom && (
                              <div className="text-xs truncate">{block.course.course_classroom}</div>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 강의 목록 (범례) */}
        {courses.length > 0 && (
          <div className="mt-6">
            <h4 className="font-semibold mb-3">수강 중인 강의</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {courses.map((course, index) => {
                const color = colors[index % colors.length]
                const professorName = course.professors?.name || course.professor_name || "미정"

                return (
                  <div key={course.course_id} className={`p-3 rounded border ${color}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-sm">{course.course_code}</div>
                        <div className="text-sm">{course.course_name}</div>
                        <div className="text-xs text-gray-600">{professorName}</div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {course.credits}학점
                      </Badge>
                    </div>
                    <div className="mt-2 text-xs">
                      {course.day1 && course.day1_start_time && course.day1_end_time && (
                        <div>
                          {course.day1} {course.day1_start_time.slice(0, 5)}-{course.day1_end_time.slice(0, 5)}
                          {course.course_classroom && ` (${course.course_classroom})`}
                        </div>
                      )}
                      {course.day2 && course.day2_start_time && course.day2_end_time && (
                        <div>
                          {course.day2} {course.day2_start_time.slice(0, 5)}-{course.day2_end_time.slice(0, 5)}
                          {course.course_classroom && ` (${course.course_classroom})`}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {courses.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>수강 중인 강의가 없습니다.</p>
            <p className="text-sm">수강신청을 먼저 해주세요.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
