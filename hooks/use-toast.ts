"use client"

// 간단한 토스트 훅 구현
export function useToast() {
  const toast = ({
    title,
    description,
    variant = "default",
  }: { title: string; description: string; variant?: string }) => {
    // 실제 구현에서는 UI 컴포넌트를 사용하지만, 여기서는 간단히 alert로 대체
    alert(`${title}: ${description}`)
  }

  return { toast }
}
