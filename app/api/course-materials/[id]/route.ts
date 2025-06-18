import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

// 강의 자료 수정
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const materialId = params.id
    const body = await request.json()
    const { title, description, file_url, file_name, file_size } = body

    if (!title) {
      return NextResponse.json({ error: "제목은 필수입니다." }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    const updateData: any = {
      title,
      description: description || "",
    }

    // 새 파일이 업로드된 경우에만 파일 정보 업데이트
    if (file_url) {
      updateData.file_url = file_url
      updateData.file_name = file_name || ""
      updateData.file_size = file_size || ""
    }

    const { data: material, error } = await supabase
      .from("course_materials")
      .update(updateData)
      .eq("material_id", materialId)
      .select()
      .single()

    if (error) {
      console.error("Error updating material:", error)
      return NextResponse.json(
        {
          error: "강의 자료 수정 중 오류가 발생했습니다.",
          details: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "강의 자료가 성공적으로 수정되었습니다.",
      material,
    })
  } catch (error) {
    console.error("Unexpected error in course-materials PUT:", error)
    return NextResponse.json(
      {
        error: "서버 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// 강의 자료 삭제
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const materialId = params.id
    const supabase = createServerSupabaseClient()

    // 먼저 파일 정보 조회
    const { data: material, error: fetchError } = await supabase
      .from("course_materials")
      .select("file_url")
      .eq("material_id", materialId)
      .single()

    if (fetchError) {
      console.error("Error fetching material:", fetchError)
      return NextResponse.json(
        {
          error: "강의 자료를 찾을 수 없습니다.",
          details: fetchError.message,
        },
        { status: 404 },
      )
    }

    // 데이터베이스에서 삭제
    const { error: deleteError } = await supabase.from("course_materials").delete().eq("material_id", materialId)

    if (deleteError) {
      console.error("Error deleting material:", deleteError)
      return NextResponse.json(
        {
          error: "강의 자료 삭제 중 오류가 발생했습니다.",
          details: deleteError.message,
        },
        { status: 500 },
      )
    }

    // 파일도 삭제 (선택사항)
    if (material.file_url) {
      try {
        await fetch(`/api/upload?fileUrl=${encodeURIComponent(material.file_url)}`, {
          method: "DELETE",
        })
      } catch (fileDeleteError) {
        console.error("Error deleting file:", fileDeleteError)
        // 파일 삭제 실패해도 데이터베이스 삭제는 성공으로 처리
      }
    }

    return NextResponse.json({
      success: true,
      message: "강의 자료가 성공적으로 삭제되었습니다.",
    })
  } catch (error) {
    console.error("Unexpected error in course-materials DELETE:", error)
    return NextResponse.json(
      {
        error: "서버 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
