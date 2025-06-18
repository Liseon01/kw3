import { createClient } from "@supabase/supabase-js"

// Supabase 클라이언트 설정
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// 클라이언트 사이드에서 사용할 Supabase 클라이언트
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 서버 사이드에서 사용할 Supabase 클라이언트 (서버 액션용)
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ""

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing Supabase credentials:", {
      hasUrl: Boolean(supabaseUrl),
      hasKey: Boolean(supabaseServiceKey),
    })
    throw new Error("Supabase credentials are not properly configured")
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
