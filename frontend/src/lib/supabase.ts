import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error("Missing VITE_SUPABASE_URL in .env file")
}

if (!supabaseAnonKey) {
  throw new Error("Missing VITE_SUPABASE_ANON_KEY in .env file")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
  },
})

// Debug helper — remove in production
export const debugAuth = async () => {
  console.log("=== SUPABASE AUTH DEBUG ===")
  console.log("Supabase URL:", supabaseUrl)
  console.log("Anon Key exists:", !!supabaseAnonKey)
  
  const { data: { session }, error } = await supabase.auth.getSession()
  console.log("Current Session:", session)
  console.log("Session Error:", error)
  console.log("User:", session?.user)
  console.log("=== END DEBUG ===")
  
  return { session, error }
}
