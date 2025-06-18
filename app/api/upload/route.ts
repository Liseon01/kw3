import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "파일이 선택되지 않았습니다." }, { status: 400 })
    }

    // 파일 크기 제한 (10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "파일 크기는 10MB를 초과할 수 없습니다." }, { status: 400 })
    }

    // 허용된 파일 타입 확인
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain",
      "application/zip",
      "application/x-rar-compressed",
      "image/jpeg",
      "image/png",
      "image/gif",
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "지원되지 않는 파일 형식입니다." }, { status: 400 })
    }

    // 파일명 생성 (타임스탬프 + 원본 파일명)
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_") // 특수문자 제거
    const fileName = `${timestamp}_${originalName}`

    // 업로드 디렉토리 생성
    const uploadDir = join(process.cwd(), "public", "uploads", "materials")
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // 파일 저장
    const filePath = join(uploadDir, fileName)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // 파일 URL 생성
    const fileUrl = `/uploads/materials/${fileName}`

    return NextResponse.json({
      success: true,
      fileUrl,
      fileName: file.name,
      fileSize: file.size,
      message: "파일이 성공적으로 업로드되었습니다.",
    })
  } catch (error) {
    console.error("File upload error:", error)
    return NextResponse.json({ error: "파일 업로드 중 오류가 발생했습니다." }, { status: 500 })
  }
}

// 파일 삭제 API (선택사항)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fileUrl = searchParams.get("fileUrl")

    if (!fileUrl) {
      return NextResponse.json({ error: "파일 URL이 필요합니다." }, { status: 400 })
    }

    // 파일 경로 생성
    const filePath = join(process.cwd(), "public", fileUrl)

    // 파일 존재 확인 및 삭제
    if (existsSync(filePath)) {
      const fs = require("fs").promises
      await fs.unlink(filePath)
      return NextResponse.json({ success: true, message: "파일이 삭제되었습니다." })
    } else {
      return NextResponse.json({ error: "파일을 찾을 수 없습니다." }, { status: 404 })
    }
  } catch (error) {
    console.error("File deletion error:", error)
    return NextResponse.json({ error: "파일 삭제 중 오류가 발생했습니다." }, { status: 500 })
  }
}
